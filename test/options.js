'use strict';

const test = require('tape');

const parseOptions = require('../bin/options');

test('no flags', (t) => {
  const options = parseOptions([]);

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.equal(options.check, false, 'does not check');
  t.end();
});

test('--update', (t) => {
  const options = parseOptions(['--update']);

  t.equal(options.update, true, 'updates');
  t.equal(options['dry-run'], false, 'is not a dry run');
  t.end();
});

test('-u', (t) => {
  const options = parseOptions(['-u']);

  t.equal(options.update, true, 'updates');
  t.equal(options['dry-run'], false, 'is not a dry run');
  t.end();
});

test('--dry-run', (t) => {
  const options = parseOptions(['--dry-run']);

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--no-dry-run', (t) => {
  const options = parseOptions(['--no-dry-run']);

  t.equal(options.update, true, 'updates');
  t.equal(options['dry-run'], false, 'is not a dry run');
  t.end();
});

test('--no-update', (t) => {
  const options = parseOptions(['--no-update']);

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--update --no-dry-run agree, and persist', (t) => {
  const options = parseOptions(['--update', '--no-dry-run']);

  t.equal(options.update, true, 'updates');
  t.equal(options['dry-run'], false, 'is not a dry run');
  t.end();
});

test('--no-update --dry-run agree, and do not persist', (t) => {
  const options = parseOptions(['--no-update', '--dry-run']);

  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--check', (t) => {
  const options = parseOptions(['--check']);

  t.equal(options.check, true, 'checks');
  t.equal(options.update, false, 'does not update');
  t.equal(options['dry-run'], true, 'is a dry run');
  t.end();
});

test('--json implies --no-color', (t) => {
  const options = parseOptions(['--json']);

  t.equal(options.json, true, 'is json');
  t.equal(options.color, false, 'is not colorized');
  t.end();
});

test('booleans are unboxed', (t) => {
  const options = parseOptions([]);

  t.equal(typeof options.update, 'boolean', 'update is a primitive boolean');
  t.equal(typeof options['dry-run'], 'boolean', 'dry-run is a primitive boolean');
  t.equal(typeof options.check, 'boolean', 'check is a primitive boolean');
  t.equal(typeof options.color, 'boolean', 'color is a primitive boolean');
  t.end();
});
