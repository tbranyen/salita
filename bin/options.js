'use strict';

const { parseArgs } = require('util');

const helpText = [
  'Usage: salita [options]',
  '',
  'Options:',
  '      --color          colorizes output  [boolean] [default: true]',
  '      --no-color       prevents colorized output',
  '      --json           provides parseable JSON output (implies --no-color)  [boolean] [default: false]',
  '  -n, --dry-run        prevents changes to package.json  [boolean] [default: true]',
  '  -u, --update         applies changes to package.json  [boolean] [default: false]',
  '      --ignore-stars   ignore updates to packages that are set to "*"  [boolean]',
  '      --ignore-pegged  ignore updates to packages that are pegged to a single version, rather than a range  [boolean]',
  '  -o, --only-changed   only show packages that have (or would have) changed  [boolean] [default: false]',
  '  -c, --check          implies --dry-run and --no-update, and returns with an exit code matching the number of updated dependencies  [boolean] [default: false]',
  '  -h, --help           Show help  [boolean]',
  '  -v, --version        Show version number  [boolean]',
].join('\n');

/*
 * `update` and `dry-run` deliberately have no `default`: `undefined` is what
 * distinguishes "not passed" from an explicit `--no-update`/`--no-dry-run`,
 * which `checkContradictions` depends on.
 */
/** @type {NonNullable<import('util').ParseArgsConfig['options']>} */
const config = {
  color: { type: 'boolean', default: true },
  json: { type: 'boolean', default: false },
  'dry-run': { type: 'boolean', short: 'n' },
  update: { type: 'boolean', short: 'u' },
  'ignore-stars': { type: 'boolean' },
  'ignore-pegged': { type: 'boolean' },
  'only-changed': {
    type: 'boolean',
    short: 'o',
    default: false,
  },
  check: {
    type: 'boolean',
    short: 'c',
    default: false,
  },
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'v' },
};

/** @type {(values: Record<string, boolean | undefined>) => void} */
const checkContradictions = function checkContradictions(values) {
  if (values.update === true && values.check === true) {
    throw new RangeError('Error: --update and --check are mutually exclusive');
  }
  if (values.check !== true && values.update === false && values['dry-run'] === false) {
    throw new RangeError('Error: --no-update and --no-dry-run are mutually exclusive');
  }
  if (values.check === true && values.update !== true && values['dry-run'] === false) {
    throw new RangeError('Error: --check and --no-dry-run are mutually exclusive');
  }
  if (values.update === true && values['dry-run'] === true) {
    throw new RangeError('Error: --update and --dry-run are mutually exclusive');
  }
};

/** @type {(args: string[]) => Record<string, boolean>} */
function parseOptions(args) {
  // eslint-disable-next-line no-extra-parens
  const { values } = /** @type {{ values: Record<string, boolean | undefined> }} */ (/** @type {unknown} */ (parseArgs({
    allowNegative: true,
    args,
    options: config,
    strict: true,
  })));

  checkContradictions(values);

  const persists = values.check !== true && (values.update === true || values['dry-run'] === false);

  // eslint-disable-next-line no-extra-parens
  const options = /** @type {Record<string, boolean>} */ (/** @type {unknown} */ ({
    ...values,
    'dry-run': !persists,
    update: persists,
  }));

  if (options.json) { options.color = false; }

  return options;
}

module.exports = { helpText, parseOptions };
