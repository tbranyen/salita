var fs = require("fs");
var path = require("path");
var npm = require("npm");
var jsonFile = require("json-file-plus");
var async = require("async");
var Table = require("cli-table");
var chalk = require("chalk");

var table = new Table({
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
function salita(callback) {
  var filename = path.join(process.cwd(), 'package.json');
  // Package.json.
  jsonFile(filename, function (err, pkg) {
    if (err) { throw err; }

    if (pkg) {
      console.log("Found package.json.");
    }

    // Store all callbacks.
    var callbacks = [];
    var addCallbacks = callbacks.push.apply.bind(callbacks.push, callbacks);

    // Check all the dependencies.
    addCallbacks(dependenciesLookup(pkg.data, "dependencies"));

    // Check all the devDependencies.
    addCallbacks(dependenciesLookup(pkg.data, "devDependencies"));

    // Wait for all of them to resolve.
    async.parallel(callbacks, function() {
      console.log(table.toString());

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

  // Loop through and map the callbacks to the lookup latest.
  return Object.keys(pkg[type] || []).map(function(name) {
    return function(callback) {
      lookupLatest(name, function(version) {
        var existing = pkg[type][name];
        var updated = "~" + version;

        // If there is no version or the version is the latest.
        if (version === null || existing === updated) {
          table.push([
            chalk.blue("Kept: "), name, "at", 
            chalk.yellow(existing)]);
        }
        else {
          // Actually write to the package descriptor.
          pkg[type][name] = updated;

          table.push([
            chalk.green("Changed: "), name, "from", 
            chalk.yellow(existing), "to", chalk.yellow(updated)]);
        }

        callback();
      });
    };
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

  // Call View directly to ensure the arguments actually work.
  view([name, "dist-tags"], true, function(err, desc) {
    callback(desc ? Object.keys(desc)[0] : null);
  });
}

module.exports = salita;
