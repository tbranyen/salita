Salita
======

Automatically upgrade all dependencies and devDependencies.

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

### Example ###

You can see in the example below that dependencies are always resolved to
their latest stable, instead of just the latest version tagged:

``` bash
tim in ~/git/webapp/framework on master 
λ salita
Found package.json.
Changed:  grunt-contrib-mincss from ~0.4.0rc7 to ~0.3.2
Changed:  grunt-contrib-uglify from ~0.2.0 to ~0.4.0
Changed:  grunt-contrib-concat from ~0.2.0 to ~0.4.0
Changed:  grunt-contrib-copy from ~0.4.1 to ~0.5.0
Changed:  bower from ~1.3.3 to ~1.3.3
Changed:  karma-mocha from ~0.1.3 to ~0.1.3
Changed:  grunt-contrib-jst from ~0.5.0 to ~0.6.0
Changed:  grunt-karma from ~0.8.3 to ~0.8.3
Changed:  grunt from ~0.4.5 to ~0.4.5
Changed:  grunt-contrib-clean from ~0.4.1 to ~0.5.0
Changed:  grunt-contrib-jshint from ~0.4.3 to ~0.10.0
Completed upgrade.
```
