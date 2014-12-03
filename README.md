Salita
======

Automatically upgrade all dependencies and devDependencies to their latest
stable semver.

### Install ###

``` bash
npm install salita -g
```

### Usage ###

``` bash
# Change into directory with package.json.
cd my_project

# Upgrade all dependencies.
salita
```

### Options ###
 - `--no-color`: prevents colorized output
 - `--json`: provides parseable JSON output (also disables colors)
 - `--dry-run` / `-n`: prevents changes to `package.json`
 - `--ignore-stars`: ignore updates to packages that are set to "*"
 - `--ignore-pegged`: ignore updates to packages that are pegged to a single version, rather than a range
 - `--check`: implies "dry-run"; and returns with an exit code matching the number of updated dependencies.

### Example ###

You can see in the example below that dependencies are always resolved to
their latest stable, instead of just the latest version tagged:

![Terminal](http://tbranyen.com/u/7bc20890.png)
