'use strict';

const test = require('tape');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BIN = path.join(__dirname, '..', 'bin', 'salita.mjs');

const ANSI = /\[\d+m/;

/*
 * `salita` shells out to `npm show` and `npm config get save-prefix`; a stub
 * earlier on `PATH` keeps these tests offline and deterministic.
 */
/** @type {(deps: Record<string, string>, latest: Record<string, string>) => string} */
function createFixture(deps, latest) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'salita-'));

  fs.writeFileSync(
    path.join(dir, 'package.json'),
    `${JSON.stringify({ name: 'fixture', version: '1.0.0', dependencies: deps }, null, 2)}\n`,
  );

  const stubDir = path.join(dir, 'stub');
  fs.mkdirSync(stubDir);
  const npm = path.join(stubDir, 'npm');
  fs.writeFileSync(npm, [
    '#!/usr/bin/env node',
    "'use strict';",
    `const latest = ${JSON.stringify(latest)};`,
    'const args = process.argv.slice(2);',
    "if (args[0] === 'config') { console.log('^'); }",
    "if (args[0] === 'show') { console.log(JSON.stringify({ latest: latest[args[2]] })); }",
    '',
  ].join('\n'));
  fs.chmodSync(npm, 0o755);

  return dir;
}

/** @type {(dir: string, args: string[], env?: Record<string, string>) => { status: number | null, stdout: string, stderr: string }} */
function runSalita(dir, args, env) {
  return spawnSync(process.execPath, [BIN].concat(args), {
    cwd: dir,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
      PATH: `${path.join(dir, 'stub')}${path.delimiter}${process.env.PATH || ''}`,
    },
  });
}

/** @type {(dir: string) => Record<string, string>} */
function readDeps(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).dependencies;
}

/** @type {(t: import('tape').Test) => string} */
function fixture(t) {
  const dir = createFixture({ 'fake-pkg': '^1.0.0' }, { 'fake-pkg': '2.0.0' });
  t.teardown(() => { fs.rmSync(dir, { force: true, recursive: true }); });
  return dir;
}

test('--update persists changes to package.json', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--update']);

  t.equal(result.status, 0, 'exits with a zero status');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^2.0.0' }, 'the dependency is updated on disk');
  t.doesNotMatch(result.stderr, /dry-run mode/, 'does not claim to be running in dry-run mode');
  t.end();
});

test('-u persists changes to package.json', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['-u']);

  t.equal(result.status, 0, 'exits with a zero status');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^2.0.0' }, 'the dependency is updated on disk');
  t.end();
});

test('--no-dry-run persists changes to package.json', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--no-dry-run']);

  t.equal(result.status, 0, 'exits with a zero status');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^2.0.0' }, 'the dependency is updated on disk');
  t.end();
});

test('without --update, changes are not persisted', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, []);

  t.equal(result.status, 0, 'exits with a zero status');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^1.0.0' }, 'the dependency is left alone');
  t.match(result.stderr, /dry-run mode/, 'warns that it is running in dry-run mode');
  t.end();
});

test('--dry-run does not persist changes', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--dry-run']);

  t.equal(result.status, 0, 'exits with a zero status');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^1.0.0' }, 'the dependency is left alone');
  t.end();
});

test('a summary of the changes is reported', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--update']);

  t.match(result.stderr, /1 updated out of 1 total dependencies/, 'reports how many changed');
  t.end();
});

test('--check exits with the number of updatable dependencies', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--check']);

  t.equal(result.status, 1, 'exits with a status matching the updatable count');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^1.0.0' }, 'the dependency is left alone');
  t.end();
});

test('--no-color suppresses colors', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--no-color'], { FORCE_COLOR: '1' });

  t.equal(result.status, 0, 'exits with a zero status');
  t.doesNotMatch(result.stdout, ANSI, 'emits no ANSI escapes');
  t.end();
});

test('colors are emitted by default', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, [], { FORCE_COLOR: '1' });

  t.match(result.stdout, ANSI, 'emits ANSI escapes');
  t.end();
});

test('--json output is uncolored and parseable', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--json'], { FORCE_COLOR: '1' });

  t.doesNotMatch(result.stdout, ANSI, 'emits no ANSI escapes');
  t.doesNotThrow(() => { JSON.parse(result.stdout); }, 'stdout is valid JSON');
  t.end();
});

test('--update and --dry-run are mutually exclusive', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--update', '--dry-run']);

  t.notEqual(result.status, 0, 'exits with a nonzero status');
  t.match(result.stderr, /mutually exclusive/, 'explains the contradiction');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^1.0.0' }, 'the dependency is left alone');
  t.end();
});

test('multiple contradictions still exit 1', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--update', '--check', '--dry-run']);

  t.equal(result.status, 1, 'exits 1, not a count of the errors');
  t.match(result.stderr, /--update and --check are mutually exclusive/, 'reports a contradiction');
  t.end();
});

test('--help describes the options, without updating anything', (t) => {
  const dir = fixture(t);

  const result = runSalita(dir, ['--help']);

  t.equal(result.status, 0, 'exits with a zero status');
  t.match(result.stdout, /-u, --\[no-\]update/, 'documents --update and its short flag');
  t.deepEqual(readDeps(dir), { 'fake-pkg': '^1.0.0' }, 'the dependency is left alone');
  t.end();
});
