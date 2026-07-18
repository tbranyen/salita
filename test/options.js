'use strict';

const test = require('tape');

const { contradictions, normalize } = require('../bin/options.mjs');

test('no flags', (t) => {
  const options = normalize({ check: false, color: true, json: false });

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.equal(options.check, false, 'does not check');
  t.end();
});

test('--update', (t) => {
  const options = normalize({ check: false, update: true });

  t.equal(options.update, true, 'updates');
  t.equal(options['dry-run'], false, 'is not a dry run');
  t.end();
});

test('--dry-run', (t) => {
  const options = normalize({ check: false, 'dry-run': true });

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--no-dry-run', (t) => {
  const options = normalize({ check: false, 'dry-run': false });

  t.equal(options.update, true, 'updates');
  t.equal(options['dry-run'], false, 'is not a dry run');
  t.end();
});

test('--no-update', (t) => {
  const options = normalize({ check: false, update: false });

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--update --no-dry-run agree, and persist', (t) => {
  const options = normalize({ check: false, 'dry-run': false, update: true });

  t.equal(options.update, true, 'updates');
  t.equal(options['dry-run'], false, 'is not a dry run');
  t.end();
});

test('--no-update --dry-run agree, and do not persist', (t) => {
  const options = normalize({ check: false, 'dry-run': true, update: false });

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--check never persists', (t) => {
  const options = normalize({ check: true });

  t.equal(options.check, true, 'checks');
  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--json implies --no-color', (t) => {
  const options = normalize({ check: false, color: true, json: true });

  t.equal(options.json, true, 'is json');
  t.equal(options.color, false, 'is not colorized');
  t.end();
});

test('agreeable flags are not contradictions', (t) => {
  t.deepEqual(contradictions({ check: false }), [], 'no flags');
  t.deepEqual(contradictions({ check: false, update: true }), [], '--update');
  t.deepEqual(contradictions({ check: false, 'dry-run': false }), [], '--no-dry-run');
  t.deepEqual(contradictions({ check: false, 'dry-run': false, update: true }), [], '--update --no-dry-run');
  t.deepEqual(contradictions({ check: false, 'dry-run': true, update: false }), [], '--no-update --dry-run');
  t.deepEqual(contradictions({ check: true }), [], '--check');
  t.end();
});

test('contradictory flags are reported', (t) => {
  t.deepEqual(
    contradictions({ check: false, 'dry-run': true, update: true }),
    ['Error: --update and --dry-run are mutually exclusive'],
    '--update and --dry-run',
  );
  t.deepEqual(
    contradictions({ check: false, 'dry-run': false, update: false }),
    ['Error: --no-update and --no-dry-run are mutually exclusive'],
    '--no-update and --no-dry-run',
  );
  t.deepEqual(
    contradictions({ check: true, 'dry-run': false }),
    ['Error: --check and --no-dry-run are mutually exclusive'],
    '--check and --no-dry-run',
  );
  t.deepEqual(
    contradictions({ check: true, update: true }),
    ['Error: --update and --check are mutually exclusive'],
    '--update and --check',
  );
  t.end();
});
