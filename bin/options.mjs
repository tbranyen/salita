/** @import { PargsRootConfig } from 'pargs' */

/*
 * `update` and `dry-run` deliberately have no `default`: `undefined` is what
 * distinguishes "not passed" from an explicit `--no-update`/`--no-dry-run`,
 * which `contradictions` depends on.
 */
/** @type {PargsRootConfig} */
export const config = {
  options: {
    color: {
      type: 'boolean',
      default: true,
      description: 'colorizes output',
    },
    json: {
      type: 'boolean',
      default: false,
      description: 'provides parseable JSON output (implies --no-color)',
    },
    'dry-run': {
      type: 'boolean',
      short: 'n',
      description: 'prevents changes to package.json',
    },
    update: {
      type: 'boolean',
      short: 'u',
      description: 'applies changes to package.json',
    },
    'ignore-stars': {
      type: 'boolean',
      description: 'ignore updates to packages that are set to "*"',
    },
    'ignore-pegged': {
      type: 'boolean',
      default: false,
      description: 'ignore updates to packages that are pegged to a single version, rather than a range',
    },
    'only-changed': {
      type: 'boolean',
      short: 'o',
      default: false,
      description: 'only show packages that have (or would have) changed',
    },
    check: {
      type: 'boolean',
      short: 'c',
      default: false,
      description: 'implies --dry-run and --no-update, and returns with an exit code matching the number of updated dependencies',
    },
  },
};

/** @typedef {Record<string, string | number | boolean | undefined>} Values */

/** @type {(values: Values) => string[]} */
export function contradictions(values) {
  const errors = [];
  if (values.update === true && values.check === true) {
    errors.push('Error: --update and --check are mutually exclusive');
  }
  if (values.check !== true && values.update === false && values['dry-run'] === false) {
    errors.push('Error: --no-update and --no-dry-run are mutually exclusive');
  }
  if (values.check === true && values.update !== true && values['dry-run'] === false) {
    errors.push('Error: --check and --no-dry-run are mutually exclusive');
  }
  if (values.update === true && values['dry-run'] === true) {
    errors.push('Error: --update and --dry-run are mutually exclusive');
  }
  return errors;
}

/** @type {(values: Values) => Record<string, boolean>} */
export function normalize(values) {
  const persists = values.check !== true && (values.update === true || values['dry-run'] === false);

  const options = /** @type {Record<string, boolean>} */ (/** @type {unknown} */ ({
    ...values,
    'dry-run': !persists,
    update: persists,
  }));

  if (options.json) { options.color = false; }

  return options;
}
