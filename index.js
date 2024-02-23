'use strict';

const path = require('path');
const exec = require('child_process').exec;
const trim = require('string.prototype.trim');
const jsonFile = require('json-file-plus');
const Table = require('cli-table');
const chalk = require('chalk');
const Promise = require('promise');
const assign = require('object.assign');
const semver = require('semver');
const forEach = require('for-each');

const getTable = function () {
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
};

const createResultJSON = function (key, onlyChanged) {
  return function (results) {
    const obj = {};
    obj[key] = results.filter((result) => !onlyChanged || result.isChanged);
    return obj;
  };
};

const createResultTable = function (caption, onlyChanged) {
  return function (results) {
    const table = getTable();
    if (results.length > 0) {
      const tableRows = results.map((result) => {
        if (result.isChanged) {
          return [
            chalk.green('Changed: '),
            result.name,
            'from',
            chalk.yellow(result.before),
            'to',
            chalk.yellow(result.after),
          ];
        }
        if (result.error) {
          return [
            chalk.red('Package not found: '),
            result.name,
            'at',
            chalk.yellow(result.before),
            chalk.bold.red('?'),
          ];
        }
        if (!result.isUpdateable && !result.isStar && !result.isPegged) {
          return [
            chalk.red('Requested range not satisfied by: '),
            result.name,
            'from',
            chalk.yellow(result.before),
            'to',
            chalk.yellow(result.after),
          ];
        }
        if (onlyChanged) {
          return null;
        }
        return [
          chalk.blue('Kept: '),
          result.name,
          'at',
          chalk.yellow(result.before),
        ];
      }).filter(Boolean);
      table.push.apply(table, tableRows);
      const sortByName = function (a, b) {
        return a[1].localeCompare(b[1]);
      };
      table.sort(sortByName);
    } else {
      table.push([chalk.gray('None found')]);
    }
    return [
      chalk.green.underline(`${caption}:`),
      table,
    ];
  };
};

/**
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

    const deps = {
      dependencies: 'Dependencies',
      devDependencies: 'Development Dependencies',
      peerDependencies: 'Peer Dependencies',
      bundledDependencies: 'Bundled Dependencies',
      optionalDependencies: 'Optional Dependencies',
    };

    const depLookups = [];
    const depPromises = [];
    forEach(deps, (title, key) => {
      const depLookup = Promise.all(dependenciesLookup(pkg.data, key, options['ignore-stars'], options['ignore-pegged']));
      depLookups.push(depLookup);
      const create = options.json
        ? createResultJSON(key, onlyChanged)
        : createResultTable(title, onlyChanged);
      depPromises.push(depLookup.then(create));
    });

    // Wait for all of them to resolve.
    Promise.all(depPromises).then((depResults) => {
      if (options.json) {
        console.log(JSON.stringify(assign.apply(null, [{}].concat(depResults)), null, 2));
      } else {
        depResults.forEach((results) => {
          results.map(String).forEach((result) => {
            console.log(result);
          });
        });
      }

      const getDepCounts = function (results) {
        const totalDeps = results.length;
        const changedDeps = results.filter((result) => result.isChanged).length;
        return [totalDeps, changedDeps];
      };
      const mapThen = function (a, b) {
        return function (promise) { return promise.then(a, b); };
      };
      const counts = Promise.all(depLookups.map(mapThen(getDepCounts)));

      // Write back the package.json.
      if (options['dry-run']) {
        return callback(counts);
      }
      return pkg.save(callback.bind(null, counts));
    });
  });
};

function isVersionPegged(version) {
  try {
    const range = semver.Range(version);
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
 * @param type
 * @return
 */
function dependenciesLookup(pkg, type, ignoreStars, ignorePegged) {
  // See if any dependencies of this type exist.
  if (pkg[type] && !Object.keys(pkg[type] || []).length) {
    return [];
  }

  // Loop through and map the "lookup latest" to promises.
  let names = Object.keys(pkg[type] || []);
  const untouched = [];
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
        const version = distTags.latest;
        let isUpdateable = false;
        try {
          const range = semver.Range(existing);
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

/**
 * Given a package name, lookup the semantic tags.
 *
 * @param {string} name - The module name.
 * @param {Function} callback - A function to call with the dist tags.
 */
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
