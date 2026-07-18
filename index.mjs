import { join } from 'path';
import { exec } from 'child_process';
import jsonFile from 'json-file-plus';
import Table from 'cli-table';
import semver from 'semver';
import forEach from 'for-each';
import { styleText } from 'util';

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

/** @import { DepKey, LookupDistTags, Result } from './index.d.mts' */

/** @type {(key: string, onlyChanged: boolean) => (results: Result[]) => Record<string, Result[]>} */
const createResultJSON = function (key, onlyChanged) {
  return function (results) {
    return { [key]: results.filter((result) => !onlyChanged || result.isChanged) };
  };
};

/** @type {(caption: string, onlyChanged: boolean, color: boolean) => (results: Result[]) => (string | Table)[]} */
function createResultTable(caption, onlyChanged, color) {
  /** @type {typeof styleText} */
  const style = color ? styleText : (format, text) => text;
  return function (results) {
    const table = getTable();
    if (results.length > 0) {
      const tableRows = results.map((result) => {
        if (result.isChanged) {
          return [
            style('green', 'Changed: '),
            result.name,
            'from',
            style('yellow', result.before),
            'to',
            style('yellow', result.after),
          ];
        }
        if (result.error) {
          return [
            style('red', 'Package not found: '),
            result.name,
            'at',
            style('yellow', result.before),
            style('bold', style('red', '?')),
          ];
        }
        if (!result.isUpdateable && !result.isStar && !result.isPegged) {
          return [
            style('red', 'Requested range not satisfied by: '),
            result.name,
            'from',
            style('yellow', result.before),
            'to',
            style('yellow', result.after),
          ];
        }
        if (onlyChanged) {
          return null;
        }
        return [
          style('blue', 'Kept: '),
          result.name,
          'at',
          style('yellow', result.before),
        ];
      }).filter((x) => !!x);
      table.push(...tableRows);
      table.sort((a, b) => a[1].localeCompare(b[1]));
    } else {
      table.push([style('gray', 'None found')]);
    }
    return [
      style('green', style('underline', `${caption}:`)),
      table,
    ];
  };
}

/** @type {import('.')} */
export default async function salita(dir, options) {
  // Package.json.
  const filename = join(dir, 'package.json');
  const pkg = await jsonFile(filename);
  if (pkg && !options.json) {
    console.log('Found package.json.');
  }

  const onlyChanged = !!options['only-changed'];

  /** @type {Record<DepKey, string>} */
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

  /** @type {Promise<Result[]>[]} */
  const depLookups = [];
  /** @type {Promise<DepResult>[]} */
  const depPromises = [];
  forEach(deps, (title, key) => {
    const depLookup = Promise.all(dependenciesLookup(
      // eslint-disable-next-line no-extra-parens
      pkg.data,
      key,
      !!options['ignore-stars'],
      !!options['ignore-pegged'],
    ));
    depLookups.push(depLookup);
    const create = options.json
      ? createResultJSON(key, onlyChanged)
      : createResultTable(title, onlyChanged, options.color !== false);
    depPromises.push(depLookup.then((y) => create(y)));
  });

  // Wait for all of them to resolve.
  const depResults = await Promise.all(depPromises);
  if (options.json) {
    /** @type {ReturnType<ResultJSON>[]} */
    // eslint-disable-next-line no-extra-parens
    const jsonResults = depResults;
    /** @type {ReturnType<ResultJSON>} */
    const smooshed = { ...jsonResults };
    console.log(JSON.stringify(smooshed, null, 2));
  } else {
    depResults.forEach((results) => {
      results.map(String).forEach((result) => {
        console.log(result);
      });
    });
  }

  /** @type {(results: Result[]) => [number, number]} */
  function getDepCounts(results) {
    const totalDeps = results.length;
    const changedDeps = results.filter((result) => result.isChanged).length;
    return [totalDeps, changedDeps];
  }
  const counts = Promise.all(depLookups.map((x) => x.then(getDepCounts)));

  // Write back the package.json.
  if (!options['dry-run']) {
    await pkg.save();
  }
  return counts;
}

export { salita as 'module.exports' };

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
 *   pkg: Record<DepKey, Record<string, string>>,
 *   type: DepKey,
 *   ignoreStars: boolean,
 *   ignorePegged: boolean,
 * ) => Promise<Result>[]}
 * @return
 */
function dependenciesLookup(pkg, type, ignoreStars, ignorePegged) {
  // See if any dependencies of this type exist.
  if (pkg[type] && Object.keys(pkg[type] || []).length === 0) {
    return [];
  }

  // Loop through and map the "lookup latest" to promises.
  let names = Object.keys(pkg[type] || []);
  /** @type {Promise<Result>[]} */
  const untouched = [];
  /** @type {(name: string, version: string, flags: { isStar?: true, isPegged?: true }) => void} */
  function addUntouched(name, version, flags) {
    untouched.push(Promise.resolve({
      after: version,
      before: version,
      isChanged: false,
      isUpdateable: false,
      name,
      ...flags,
    }));
  }
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
  /** @type {(name: string) => Promise<Result>} */
  async function mapNameToLatest(name) {
    const existing = pkg[type][name];
    try {
      const [prefix, distTags] = await lookupDistTags(name);

      // eslint-disable-next-line no-extra-parens
      const { latest: version } = /** @type {NonNullable<typeof distTags>} */ (distTags);
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

      return result;
    } catch (error) {
      return {
        after: existing,
        before: existing,
        // @ts-expect-error TODO FIXME
        error,
        isChanged: false,
        isUpdateable: false,
        name,
      };
    }
  }
  return names.map(mapNameToLatest).concat(untouched);
}

/** @type {LookupDistTags} */
async function lookupDistTags(name) {
  const pPrefix = new Promise((resolve, reject) => {
    exec('npm config get save-prefix --no-workspaces', (err, prefix) => {
      if (err) {
        reject(err);
      } else {
        resolve(prefix.trim());
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

  return Promise.all([pPrefix, pTags]);
}
