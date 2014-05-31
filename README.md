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

You can prevent colors by running:

``` bash
salita --no-color
```

### Example ###

You can see in the example below that dependencies are always resolved to
their latest stable, instead of just the latest version tagged:

![Terminal](http://tbranyen.com/u/7bc20890.png)
