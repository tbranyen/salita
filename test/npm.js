'use strict';

const test = require('tape');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BIN = path.join(__dirname, '..', 'bin', 'salita.mjs');

/*
 * `cli.js` stubs `npm` so it can stay offline. These are the exception: they
 * drive salita with the real thing, because what broke - the shape of
 * `npm show --json <name> dist-tags` - is npm's to change and not ours to
 * assume. npm 12 started wrapping it in an array and, until it was unwrapped,
 * every dependency silently resolved to `^undefined`. Asserting the shape we
 * *think* each npm emits would just re-encode the same assumption, so ask
 * each npm instead. These need the network.
 */
const SUPPORTED_NPM = ['10', '11', '12', 'latest'];

/*
 * `npm run` exports the running npm's config as `npm_config_*`, and a nested
 * npm picks those back up - `npm_config_prefix` and `npm_config_local_prefix`
 * in particular fight with the `--prefix` install below. Hand each child a
 * plain environment instead of the test runner's.
 */
/** @type {(extra?: Record<string, string>) => NodeJS.ProcessEnv} */
function env(extra) {
  /** @type {NodeJS.ProcessEnv} */
  const clean = { ...process.env, ...extra };
  Object.keys(clean).forEach((key) => {
    if (key.startsWith('npm_')) { delete clean[key]; }
  });
  return clean;
}

/** installs an npm and returns the directory to put at the front of `PATH` */
/** @type {(version: string, t: import('tape').Test) => string} */
function installNpm(version, t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `salita-npm-${version}-`));
  t.teardown(() => { fs.rmSync(dir, { force: true, recursive: true }); });

  const install = spawnSync(
    'npm',
    ['install', '--prefix', dir, '--no-save', '--no-audit', '--no-fund', `npm@${version}`],
    { encoding: 'utf8', env: env() },
  );
  if (install.status !== 0) {
    throw new Error(`could not install npm@${version}: ${install.stderr || install.stdout}`);
  }

  return path.join(dir, 'node_modules', '.bin');
}

SUPPORTED_NPM.forEach((version) => {
  test(`npm@${version} resolves a real \`latest\``, (t) => {
    const npmBin = installNpm(version, t);

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'salita-fixture-'));
    t.teardown(() => { fs.rmSync(dir, { force: true, recursive: true }); });

    fs.writeFileSync(
      path.join(dir, 'package.json'),
      `${JSON.stringify({
        name: 'fixture', version: '1.0.0', dependencies: { semver: '^1.0.0' },
      }, null, 2)}\n`,
    );

    const PATH = `${npmBin}${path.delimiter}${process.env.PATH || ''}`;

    const installed = spawnSync('npm', ['--version'], { encoding: 'utf8', env: env({ PATH }) });
    const major = installed.stdout.trim().split('.')[0];
    if (version === 'latest') {
      t.comment(`npm@latest is currently ${installed.stdout.trim()}`);
    } else {
      t.equal(major, version, `salita ran against npm ${installed.stdout.trim()}`);
    }

    const result = spawnSync(process.execPath, [BIN, '--json'], {
      cwd: dir,
      encoding: 'utf8',
      env: env({ PATH }),
    });

    t.equal(result.status, 0, 'exits with a zero status');

    const [dependency] = JSON.parse(result.stdout)['0'].dependencies;

    t.notOk(dependency.isInvalid, 'resolves a version it considers valid');
    t.ok(dependency.isUpdateable, 'sees that `^1.0.0` is out of date');
    t.doesNotMatch(dependency.after, /undefined/, 'does not paste `undefined` onto the prefix');
    t.end();
  });
});
