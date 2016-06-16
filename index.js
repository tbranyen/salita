'use strict';

var path = require('path');
var npm = require('npm');
var jsonFile = require('json-file-plus');
var Table = require('cli-table');
var chalk = require('chalk');
var Promise = require('promise');
var assign = require('object.assign');
var semver = require('semver');
var forEach = require('for-each');

var getTable = function () {
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
      'top-right': ''
    }
  });
};

var createResultJSON = function (key) {
  return function (results) {
    var obj = {};
    obj[key] = results;
    return obj;
  };
};

var createResultTable = function (caption) {
  return function (results) {
    var table = getTable();
    if (results.length > 0) {
      var tableRows = results.map(function (result) {
        if (result.isChanged) {
          return [
            chalk.green('Changed: '),
            result.name,
            'from',
            chalk.yellow(result.before),
            'to',
            chalk.yellow(result.after)
          ];
        } else if (result.error) {
          return [
            chalk.red('Package not found: '),
            result.name,
            'at',
            chalk.yellow(result.before),
            chalk.bold.red('?')
          ];
        } else if (!result.isUpdateable && !result.isStar && !result.isPegged) {
          return [
            chalk.red('Requested range not satisfied by: '),
            result.name,
            'from',
            chalk.yellow(result.before),
            'to',
            chalk.yellow(result.after)
          ];
        } else {
          return [
            chalk.blue('Kept: '),
            result.name,
            'at',
            chalk.yellow(result.before)
          ];
        }
      });
      table.push.apply(table, tableRows);
      var sortByName = function (a, b) {
        return a[1].localeCompare(b[1]);
      };
      table.sort(sortByName);
    } else {
      table.push([chalk.gray('None found')]);
    }
    return [
      chalk.green.underline(caption + ':'),
      table
    ];
  };
};

/**
 * The main entry point.
 */
var salita = function salita(dir, options, callback) {
  // Package.json.
  var filename = path.join(dir, 'package.json');
  jsonFile(filename).then(function (pkg) {
    return loadNPM().then(function () { return pkg; });
  }).then(function (pkg) {
    if (pkg && !options.json) {
      console.log('Found package.json.');
    }

    var deps = {
      dependencies: 'Dependencies',
      devDependencies: 'Development Dependencies',
      peerDependencies: 'Peer Dependencies'
    };

    var depLookups = [];
    var depPromises = [];
    forEach(deps, function (title, key) {
      var depLookup = Promise.all(dependenciesLookup(pkg.data, key, options['ignore-stars'], options['ignore-pegged']));
      depLookups.push(depLookup);
      depPromises.push(depLookup.then(options.json ? createResultJSON(key) : createResultTable(title)));
    });

    // Wait for all of them to resolve.
    Promise.all(depPromises).then(function (depResults) {
      if (options.json) {
        console.log(JSON.stringify(assign.apply(null, [{}].concat(depResults)), null, 2));
      } else {
        depResults.forEach(function (results) {
          results.map(String).forEach(function (result) {
            console.log(result);
          });
        });
      }

      var getDepCounts = function (results) {
        var totalDeps = results.length;
        var changedDeps = results.filter(function (result) { return result.isChanged; }).length;
        return [totalDeps, changedDeps];
      };
      var mapThen = function (a, b) {
        return function (promise) { return promise.then(a, b); };
      };
      var counts = Promise.all(depLookups.map(mapThen(getDepCounts)));

      // Write back the package.json.
      if (options['dry-run']) {
        return callback(counts);
      }
      return pkg.save(callback.bind(null, counts));
    });
  }).done();
};

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
  var names = Object.keys(pkg[type] || []);
  var untouched = [];
  var addUntouched = function (name, version, flags) {
    untouched.push(Promise.resolve(assign({
      after: version,
      before: version,
      isChanged: false,
      isUpdateable: false,
      name: name
    }, flags)));
  };
  if (ignoreStars || ignorePegged) {
    names = names.filter(function (name) {
      var version = pkg[type][name];

      var isStar = version === '*';
      if (ignoreStars && isStar) {
        return addUntouched(name, version, { isStar: true });
      }

      var range = semver.Range(version);
      var isPegged = range.set.every(function (comparators) {
        return comparators.length === 1 && String(comparators[0].operator || '') === '';
      });
      if (ignorePegged && isPegged) {
        return addUntouched(name, version, { isPegged: true });
      }
      return true;
    });
  }
  var mapNameToLatest = function (name) {
    return new Promise(function (resolve) {
      lookupDistTags(name, function (error, prefix, distTags) {
        var existing = pkg[type][name];
        if (error) {
          return resolve({
            after: existing,
            before: existing,
            error: error,
            isChanged: false,
            isUpdateable: false,
            name: name
          });
        }
        var version = distTags.latest;
        var isUpdateable = false;
        try {
          var range = semver.Range(existing);
          isUpdateable = !semver.ltr(version, range);
        } catch (e) { /**/ }
        var updated = prefix + version;
        var result;

        // If there is no version or the version is the latest.
        result = {
          after: updated,
          before: existing,
          isChanged: version !== null && isUpdateable && existing !== updated,
          isUpdateable: isUpdateable,
          name: name
        };
        if (result.isChanged) {
          // Actually write to the package descriptor.
          pkg[type][name] = updated;
        }

        return resolve(result);
      });
    });
  };
  return names.map(mapNameToLatest).concat(untouched);
}

function loadNPM() {
  return new Promise(function (resolve, reject) {
    npm.load({}, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Given a package name, lookup the semantic tags.
 *
 * @param {string} name - The module name.
 * @param {Function} callback - A function to call with the dist tags.
 */
function lookupDistTags(name, callback) {
  // Need to require here, because NPM does all sorts of funky global
  // attaching.
  var view = require('npm/lib/view');
  var prefix = npm.config.get('save-prefix');

  // Call View directly to ensure the arguments actually work.
  view([name, 'dist-tags'], true, function (err, desc) {
    if (err) { return callback(err); }
    var latest = Object.keys(desc);
    if (latest.length !== 1) {
      throw new Error('expected 1 version key, got: ' + latest);
    }
    var tags = desc[latest]['dist-tags'];
    return callback(null, prefix, tags);
  });
}

module.exports = salita;
