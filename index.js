var fs = require("fs");
var path = require("path");
var npm = require("npm");
var jsonFile = require("json-file-plus");
var Table = require("cli-table");
var chalk = require("chalk");
var Promise = require('promise');

var getTable = function () {
  return new Table({
    chars: {
      "top": "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      "bottom": "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      "left": "",
      "left-mid": "",
      "mid": "",
      "mid-mid": "",
      "right": "",
      "right-mid": "",
      "middle": ""
    }
  });
};

var createResultTable = function (caption) {
  return function (results) {
    var table = getTable();
    if (results.length > 0) {
      table.push.apply(table, results);
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
 * Determine if NPM has been loaded or not.
 *
 * @private
 * @type {boolean}
 */
var isLoaded = false;

/**
 * The main entry point.
 */
function salita(dir, options, callback) {
  // Package.json.
  var filename = path.join(dir, 'package.json');
  jsonFile(filename, function (err, pkg) {
    if (err) { throw err; }

    if (pkg) {
      console.log("Found package.json.");
    }

    // Check all the dependencies.
    var deps = Promise.all(dependenciesLookup(pkg.data, "dependencies"))
      .then(createResultTable('Dependencies'));

    // Check all the devDependencies.
    var devDeps = Promise.all(dependenciesLookup(pkg.data, "devDependencies"))
      .then(createResultTable('Development Dependencies'));

    // Wait for all of them to resolve.
    Promise.all([deps, devDeps]).then(function (depResults) {
      depResults.forEach(function (results) {
        results.map(String).forEach(function (result) {
          console.log(result);
        });
      });

      // Write back the package.json.
      pkg.save(callback);
    });
  });
}

/**
 * createDependenciesLookup
 *
 * @param type
 * @return
 */
function dependenciesLookup(pkg, type) {
  // See if any dependencies of this type exist.
  if (pkg[type] && !Object.keys(pkg[type] || []).length) {
    return [];
  }

  // Loop through and map the "lookup latest" to promises.
  return Object.keys(pkg[type] || []).map(function(name) {
    return new Promise(function (resolve, reject) {
      lookupLatest(name, function(prefix, version) {
        var existing = pkg[type][name];
        var updated = prefix + version;
        var result;

        // If there is no version or the version is the latest.
        if (version === null || existing === updated) {
          result = [
            chalk.blue("Kept: "), name, "at", 
            chalk.yellow(existing)
          ];
        } else {
          // Actually write to the package descriptor.
          pkg[type][name] = updated;

          result = [
            chalk.green("Changed: "), name, "from", 
            chalk.yellow(existing), "to", chalk.yellow(updated)
          ];
        }

        resolve(result);
      });
    });
  });
}

/**
 * Given a package name, lookup the latest valid semantic tag.
 *
 * @param {string} name - The module name.
 * @param {Function} callback - A function to call with the version.
 */
function lookupLatest(name, callback) {
  if (!isLoaded) {
    // Wait for NPM to be loaded and then ensure it's never loaded again, ever.
    return npm.load({}, function() {
      isLoaded = true;
      lookupLatest(name, callback);
    });
  }

  // Need to require here, because NPM does all sorts of funky global
  // attaching.
  var view = require("npm/lib/view");
  var prefix = npm.config.get('save-prefix');

  // Call View directly to ensure the arguments actually work.
  view([name, "dist-tags"], true, function(err, desc) {
    callback(prefix, desc ? Object.keys(desc)[0] : null);
  });
}

module.exports = salita;
