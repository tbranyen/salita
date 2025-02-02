'use strict';

const path = require('path');
const exec = require('child_process').exec;
const trim = require('string.prototype.trim');
const jsonFile = require('json-file-plus');
const Table = require('cli-table');
const colors = require('colors');
const Promise = require('promise');
const assign = require('object.assign');
const semver = require('semver');
const forEach = require('for-each');

/** @template Type @typedef {Type extends Table<infer X> ? X : never} extractGeneric<Type> */

/** @typedef {extractGeneric<Table>} TableRow */
/** @typedef {Extract<string[], TableRow>} HorizontalTableRow */

/** @return {Table<HorizontalTableRow>} */
function getTable() {
  return new Table({
    chars: {
      bottom: '',
      'bottom-left': '',
      'bottom-mid': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      middle: '',
      right: '',
      'right-mid': '',
      top: '',
      'top-left': '',
      'top-mid': '',
      'top-right': '',
    },
  });
}

/** @type {(key: string, onlyChanged: boolean) => (results: import('.').Result[]) => Record<string, import('.').Result[]>} */
const createResultJSON = function (key, onlyChanged) {
  return function (results) {
    /** @type {Record<string, import('.').Result[]>} */
    const obj = {};
    obj[key] = results.filter((result) => !onlyChanged || result.isChanged);
    return obj;
  };
};

/** @type {(caption: string, onlyChanged: boolean) => (results: import('.').Result[]) => (string | Table)[]} */
const createResultTable = function (caption, onlyChanged) {
  return function (results) {
    const table = getTable();
    if (results.length > 0) {
      const tableRows = results.map((result) => {
        if (result.isChanged) {
          return [
            colors.green('Changed: '),
            result.name,
            'from',
            colors.yellow(result.before),
            'to',
            colors.yellow(result.after),
          ];
        }
        if (result.error) {
          return [
            colors.red('Package not found: '),
            result.name,
            'at',
            colors.yellow(result.before),
            colors.bold.red('?'),
          ];
        }
        if (!result.isUpdateable && !result.isStar && !result.isPegged) {
          return [
            colors.red('Requested range not satisfied by: '),
            result.name,
            'from',
            colors.yellow(result.before),
            'to',
            colors.yellow(result.after),
          ];
        }
        if (onlyChanged) {
          return null;
        }
        return [
          colors.blue('Kept: '),
          result.name,
          'at',
          colors.yellow(result.before),
        ];
      }).filter((x) => !!x);
      table.push.apply(table, tableRows);
      table.sort(/** @type {(a: string[], b: string[]) => number} */ (a, b) => a[1].localeCompare(b[1]));
    } else {
      table.push([colors.gray('None found')]);
    }
    return [
      colors.green.underline(`${caption}:`),
      table,
    ];
  };
};

/**
 * @type {import('.')}
 * The main entry point.
 */
const salita = function salita(dir, options, callback) {
  // Package.json.
  const filename = path.join(dir, 'package.json');
  jsonFile(filename).then((pkg) => {
    if (pkg && !options.json) {
      console.log('Found package.json.');
    }

    const onlyChanged = !!options['only-changed'];

    /** @type {Record<import('.').DepKey, string>} */
    const deps = {
      dependencies: 'Dependencies',
      devDependencies: 'Development Dependencies',
      peerDependencies: 'Peer Dependencies',
      bundledDependencies: 'Bundled Dependencies',
      optionalDependencies: 'Optional Dependencies',
    };

    /** @typedef {ReturnType<createResultJSON>} ResultJSON */
    /** @typedef {ReturnType<createResultTable>} ResultTable */
    /** @typedef {ResultJSON | ResultTable} CreateResult */
    /** @typedef {ReturnType<CreateResult>} DepResult */

    /** @type {Promise<import('.').Result[]>[]} */
    const depLookups = [];
    /** @type {Promise<DepResult>[]} */
    const depPromises = [];
    forEach(deps, (title, key) => {
      const depLookup = Promise.all(dependenciesLookup(
        // eslint-disable-next-line no-extra-parens
        /** @type {Parameters<typeof dependenciesLookup>[0]} */ (pkg.data),
        key,
        !!options['ignore-stars'],
        !!options['ignore-pegged']
      ));
      depLookups.push(depLookup);
      const create = options.json
        ? createResultJSON(key, onlyChanged)
        : createResultTable(title, onlyChanged);
      depPromises.push(depLookup.then((y) => create(y)));
    });

    // Wait for all of them to resolve.
    Promise.all(depPromises).then((depResults) => {
      if (options.json) {
        // eslint-disable-next-line no-extra-parens
        const jsonResults = /** @type {ReturnType<ResultJSON>[]} */ (depResults);
        /** @type {ReturnType<ResultJSON>} */
        const smooshed = assign.apply(
          null,
          // @ts-expect-error TS sucks with concat
          // eslint-disable-next-line no-extra-parens
          /** @type {typeof jsonResults} */ (/** @type {unknown} */ ([])).concat(
            {},
            jsonResults
          )
        );
        console.log(JSON.stringify(smooshed, null, 2));
      } else {
        // eslint-disable-next-line no-extra-parens
        const tableResults = /** @type {ReturnType<ResultTable>[]} */ (/** @type {unknown} */ (depResults));
        tableResults.forEach((results) => {
          results.map(String).forEach((result) => {
            console.log(result);
          });
        });
      }

      /** @type {(results: import('.').Result[]) => [number, number]} */
      const getDepCounts = function (results) {
        const totalDeps = results.length;
        const changedDeps = results.filter((result) => result.isChanged).length;
        return [totalDeps, changedDeps];
      };
      const counts = Promise.all(depLookups.map((x) => x.then(getDepCounts)));

      // Write back the package.json.
      if (options['dry-run']) {
        return callback(counts);
      }
      return pkg.save(() => callback(counts));
    });
  });
};

/** @type {(version: string) => boolean} */
function isVersionPegged(version) {
  try {
    const range = new semver.Range(version);
    return range.set.every((comparators) => comparators.length === 1 && String(comparators[0].operator || '') === '');
  } catch (err) {
    /*
     * semver.Range doesn't support all version specifications (like git
     * references), so if it raises an error, assume the dep can be left
     * untouched:
     */
    return true;
  }
}

/**
 * createDependenciesLookup
 *
 * @type {(
 *   pkg: Record<import('.').DepKey, Record<string, string>>,
 *   type: import('.').DepKey,
 *   ignoreStars: boolean,
 *   ignorePegged: boolean,
 * ) => Promise<import('.').Result>[]}
 * @return
 */
function dependenciesLookup(pkg, type, ignoreStars, ignorePegged) {
  // See if any dependencies of this type exist.
  if (pkg[type] && !Object.keys(pkg[type] || []).length) {
    return [];
  }

  // Loop through and map the "lookup latest" to promises.
  let names = Object.keys(pkg[type] || []);
  /** @type {Promise<import('.').Result>[]} */
  const untouched = [];
  /** @type {(name: string, version: string, flags: { isStar?: true, isPegged?: true }) => void} */
  const addUntouched = function (name, version, flags) {
    untouched.push(Promise.resolve(assign({
      after: version,
      before: version,
      isChanged: false,
      isUpdateable: false,
      name,
    }, flags)));
  };
  if (ignoreStars || ignorePegged) {
    names = names.filter((name) => {
      const version = pkg[type][name];

      const isStar = version === '*' || version === 'latest';
      if (ignoreStars && isStar) {
        return addUntouched(name, version, { isStar: true });
      }

      if (ignorePegged && isVersionPegged(version)) {
        return addUntouched(name, version, { isPegged: true });
      }
      return true;
    });
  }
  /** @type {(name: string) => Promise<import('.').Result>} */
  const mapNameToLatest = function (name) {
    return new Promise((resolve) => {
      lookupDistTags(name, (error, prefix, distTags) => {
        const existing = pkg[type][name];
        if (error) {
          return resolve({
            after: existing,
            before: existing,
            error,
            isChanged: false,
            isUpdateable: false,
            name,
          });
        }
        // eslint-disable-next-line no-extra-parens
        const version = /** @type {NonNullable<typeof distTags>} */ (distTags).latest;
        let isUpdateable = false;
        try {
          const range = new semver.Range(existing);
          isUpdateable = !semver.ltr(version, range);
        } catch (e) { /**/ }
        const updated = prefix + version;

        // If there is no version or the version is the latest.
        const result = {
          after: updated,
          before: existing,
          isChanged: version !== null && isUpdateable && existing !== updated,
          isUpdateable,
          name,
        };
        if (result.isChanged) {
          // Actually write to the package descriptor.
          pkg[type][name] = updated; // eslint-disable-line no-param-reassign
        }

        return resolve(result);
      });
    });
  };
  return names.map(mapNameToLatest).concat(untouched);
}

/** @type {import('.').LookupDistTags} */
function lookupDistTags(name, callback) {
  const pPrefix = new Promise((resolve, reject) => {
    exec('npm config get save-prefix --no-workspaces', (err, prefix) => {
      if (err) {
        reject(err);
      } else {
        resolve(trim(prefix));
      }
    });
  });
  const pTags = new Promise((resolve, reject) => {
    exec(`npm show --json ${JSON.stringify(name)} dist-tags`, (err, tags) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(tags));
      }
    });
  });
  Promise.all([pPrefix, pTags]).then(
    (results) => {
      callback(null, results[0], results[1]);
    },
    (err) => {
      callback(err);
    }
  );
}

module.exports = salita;
