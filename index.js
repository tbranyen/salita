var fs = require('fs');
var path = require('path');
var npm = require('npm');
var jsonFile = require('json-file-plus');
var Table = require('cli-table');
var chalk = require('chalk');
var Promise = require('promise');
var assign = require('object.assign');
var semver = require('semver');

var getTable = function () {
  return new Table({
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: ''
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
function salita(dir, options, callback) {
  chalk.enabled = !options['no-color'] && !options.json;
  // Package.json.
  var filename = path.join(dir, 'package.json');
  jsonFile(filename).then(function (pkg) {
    return loadNPM().then(function () { return pkg; });
  }).then(function (pkg) {
    if (pkg && !options.json) {
      console.log('Found package.json.');
    }

    // Check all the dependencies.
    var depLookups = Promise.all(dependenciesLookup(pkg.data, 'dependencies', options['ignore-stars'], options['ignore-pegged']))
    var deps = depLookups.then(options.json ? createResultJSON('dependencies') : createResultTable('Dependencies'));

    // Check all the devDependencies.
    var devDepLookups = Promise.all(dependenciesLookup(pkg.data, 'devDependencies', options['ignore-stars'], options['ignore-pegged']))
    var devDeps = devDepLookups.then(options.json ? createResultJSON('devDependencies') : createResultTable('Development Dependencies'));

    // Wait for all of them to resolve.
    Promise.all([deps, devDeps]).then(function (depResults) {
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
      var mapThen = function (a, b) { return function (promise) { return promise.then(a, b); }; };
      var counts = Promise.all([depLookups, devDepLookups].map(mapThen(getDepCounts)));

      // Write back the package.json.
      if (options['dry-run']) {
        callback(counts);
      } else {
        pkg.save(callback.bind(null, counts));
      }
    });
  }).done();
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

  var names = Object.keys(pkg[type] || []);
  // Loop through and map the "lookup latest" to promises.
  var names = Object.keys(pkg[type] || []);
  var untouched = [];
  var addUntouched = function (name, version) {
    untouched.push(Promise.resolve({
	  name: name,
      before: version,
      after: version,
      isChanged: false
    }));
  };
  if (ignoreStars || ignorePegged) {
    names = names.filter(function (name) {
      var version = pkg[type][name];

      var isStar = version === '*';
      if (ignoreStars && isStar) {
        return addUntouched(name, version);
      }

      var range = semver.Range(version);
      var isPegged = range.set.every(function (comparators) {
        return comparators.length === 1 && String(comparators[0].operator || '') === '';
      });
      if (ignorePegged && isPegged) {
        return addUntouched(name, version);
      }
      return true;
    });
  }
  var mapNameToLatest = function (name) {
    return new Promise(function (resolve, reject) {
      lookupDistTags(name, function (prefix, distTags) {
        var version = distTags.latest;
        var existing = pkg[type][name];
        var updated = prefix + version;
        var result;

        // If there is no version or the version is the latest.
        result = {
          name: name,
          before: existing,
          after: updated,
          isChanged: version !== null && existing !== updated
        };
        if (result.isChanged) {
          // Actually write to the package descriptor.
          pkg[type][name] = updated;
        }

        resolve(result);
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
    if (err) { throw new Error(err); }
    var latest = Object.keys(desc);
    if (latest.length !== 1) {
      throw new Error('expected 1 version key, got: ' + latest);
    }
    var tags = desc[latest]['dist-tags'];
    callback(prefix, tags);
  });
}

module.exports = salita;
