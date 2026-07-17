'use strict';

const forEach = require('for-each');
const yargs = require('yargs');

const { version } = require('../package.json');

/*
 * Boxed on purpose: as `yargs` defaults, these are identity-distinguishable from
 * an explicitly passed `--update`/`--no-update`, which `checkContradictions` needs.
 * Unboxing them to `false`/`true` would silently break that.
 */
const FALSE = Object(false);
const TRUE = Object(true);

/** @type {(value: unknown) => unknown} */
const boolishToBool = function boolishToBool(value) {
  if (value === FALSE) { return false; }
  if (value === TRUE) { return true; }
  return value;
};

/** @type {(argv: Record<string, unknown>) => true} */
const checkContradictions = function checkContradictions(argv) {
  /* eslint no-throw-literal: 0 */
  if (argv.update === true && argv.check === true) {
    throw 'Error: --update and --check are mutually exclusive';
  }
  if (argv.check !== true && argv.update === false && argv['dry-run'] === false) {
    throw 'Error: --no-update and --no-dry-run are mutually exclusive';
  }
  if (argv.check === true && argv.update !== true && argv['dry-run'] === false) {
    throw 'Error: --check and --no-dry-run are mutually exclusive';
  }
  if (argv.update === true && argv['dry-run'] === true) {
    throw 'Error: --update and --dry-run are mutually exclusive';
  }
  return true;
};

/* eslint newline-per-chained-call: 0 */
/** @type {(args: string[]) => Record<string, any>} */
module.exports = function parseOptions(args) {
  // eslint-disable-next-line no-extra-parens
  const options = /** @type {Record<string, any>} */ (/** @type {unknown} */ (yargs(args)
    .boolean('color').default('color', TRUE).describe('color', 'colorizes output')
    .describe('no-color', 'prevents colorized output')
    .boolean('json').describe('json', 'provides parseable JSON output (implies --no-color)')
    .default('json', FALSE)
    .boolean('dry-run').describe('dry-run', 'prevents changes to package.json')
    .default('dry-run', TRUE).alias('dry-run', 'n')
    .boolean('update').describe('update', 'applies changes to package.json')
    .default('update', FALSE).alias('update', 'u')
    .boolean('ignore-stars').describe('ignore-stars', 'ignore updates to packages that are set to "*"')
    .boolean('ignore-pegged').describe('ignore-pegged', 'ignore updates to packages that are pegged to a single version, rather than a range')
    .boolean('only-changed').describe('only-changed', 'only show packages that have (or would have) changed')
    .default('only-changed', FALSE).alias('only-changed', 'o')
    .boolean('check').describe('check', 'implies --dry-run and --no-update, and returns with an exit code matching the number of updated dependencies')
    .default('check', FALSE).alias('check', 'c')
    .help().alias('help', 'h')
    .version(version).alias('version', 'v')
    .strict()
    .wrap(null)
    .check(checkContradictions)
    .argv));

  const persists = options.check !== true && (options.update === true || options['dry-run'] === false);

  forEach(options, (value, key) => {
    options[key] = boolishToBool(value);
  });

  options['dry-run'] = !persists;
  options.update = persists;

  if (options.json) { options.color = false; }

  return options;
};
