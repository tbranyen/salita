#!/usr/bin/env node

import pargs from 'pargs';

import salita from '../index.mjs';
import { config, contradictions, normalize } from './options.mjs';

const {
  errors,
  help,
  values,
} = await pargs(import.meta.filename, config);

errors.push(...contradictions(values));

/*
 * `pargs` derives an exit code from the *number* of errors (2 errors exits 3),
 * but salita's exit code already means something: `--check` exits with the
 * count of updatable dependencies. Pin failures to 1 so the two can't be
 * confused; `pargs` only assigns when it is still unset.
 */
if (errors.length > 0) { process.exitCode = 1; }

await help();

const options = normalize(values);

if (!options.update) {
  console.warn('Running in dry-run mode. Use --update to persist changes to package.json.');
}

const counts = await salita(process.cwd(), options);

const sums = counts.reduce((acc, category) => [acc[0] + category[0], acc[1] + category[1]], [0, 0]);
const total = sums[0];
const changed = sums[1];
if (!options.json) {
  console.error(`\n${changed} updated out of ${total} total dependencies.`);
}
if (options.check) { process.exit(changed); }
