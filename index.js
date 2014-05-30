var fs = require("fs");
var npm = require("npm");
var async = require("async");

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
  // Package.json.
  var pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

  if (pkg) {
    console.log("Found package.json.");
  }

  // Store all callbacks.
  var callbacks = [];
  var addCallbacks = callbacks.push.apply.bind(callbacks.push, callbacks);

  // Check all the dependencies.
  addCallbacks(dependenciesLookup(pkg, "dependencies"));

  // Check all the devDependencies.
  addCallbacks(dependenciesLookup(pkg, "devDependencies"));

  // Wait for all of them to resolve.
  async.parallel(callbacks, function() {
    // Write back the package.json.
    fs.writeFile("package.json", JSON.stringify(pkg, null, 2), callback);
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
  if (pkg[type] && !Object.keys(pkg[type]).length) {
    return [];
  }

  // Loop through and map the callbacks to the lookup latest.
  return Object.keys(pkg[type]).map(function(name) {
    return function(callback) {
      lookupLatest(name, function(version) {
        var existing = pkg[type][name];
        pkg[type][name] = "~" + version;

        console.log("Changed: ", name, "from", existing, "to", version);
        callback();
      });
    };
  })
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
    callback(Object.keys(desc)[0]);
  });
}

module.exports = salita;
