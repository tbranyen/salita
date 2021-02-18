# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.12.2](https://github.com/ljharb/salita/compare/v0.12.1...v0.12.2) - 2021-02-18

### Commits

- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `auto-changelog` [`39fed9d`](https://github.com/ljharb/salita/commit/39fed9dd55f4907f1e1cbda74ef283bdd33f02ba)
- [Deps] update `object.assign`, `promise`, `string.prototype.trim` [`cecf99d`](https://github.com/ljharb/salita/commit/cecf99deb48330079a6e4632eccae4b8ea8dfdea)
- [Fix] peg `cli-table` to v0.3.1, since v0.3.2+ has a breaking change [`383aea3`](https://github.com/ljharb/salita/commit/383aea33de5995c276751cfa7c429fbd38ad5c8b)
- [Fix] peg `string-width` to v2.0, due to a breaking change in v2.1 [`4c6108f`](https://github.com/ljharb/salita/commit/4c6108fb8530022a8ab41a8a90bab3a6cfccdf00)

## [v0.12.1](https://github.com/ljharb/salita/compare/v0.12.0...v0.12.1) - 2020-03-26

### Commits

- [Fix] promises do not have a `.done` [`6eacaca`](https://github.com/ljharb/salita/commit/6eacacab85103f4ba2cea77526dc6e14c3c11c25)

## [v0.12.0](https://github.com/ljharb/salita/compare/v0.11.2...v0.12.0) - 2020-03-22

### Commits

- [meta] add `auto-changelog` [`35de006`](https://github.com/ljharb/salita/commit/35de006bf4addab0f7d1cea1d1874ebf1d2dd057)
- [Refactor] shell out to `npm` rather than using an unsupported, insecure, and outdated npm JS API [`25e550a`](https://github.com/ljharb/salita/commit/25e550aad12bf25a93afffa42cfa662e5ca6230e)

## [v0.11.2](https://github.com/ljharb/salita/compare/v0.11.1...v0.11.2) - 2019-10-23

### Commits

- [Tests] remove `jscs` [`7f50f76`](https://github.com/ljharb/salita/commit/7f50f76df044498af2aac2d19c47253c22d16b22)
- [Deps] update `chalk`, `npm`, `promise`, `semver` [`8496820`](https://github.com/ljharb/salita/commit/8496820c7b5641233955997f4a9a731b97582311)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`54aedb3`](https://github.com/ljharb/salita/commit/54aedb3ce80de1af793bde7ac2c6b5ff7aa8cad7)
- [New] support updating bundled and optional dependencies [`2a08ce8`](https://github.com/ljharb/salita/commit/2a08ce8d37f88231f6db0db2cee3b6b8b66f873d)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`0281a6f`](https://github.com/ljharb/salita/commit/0281a6f00c5592257a241f00f5ed606f2d8c7188)
- [Deps] update `semver` [`3c1159e`](https://github.com/ljharb/salita/commit/3c1159e9cbd5a70c6163b50ca8fe14940fa2db92)
- [Docs] add `--update` option [`f4eb28a`](https://github.com/ljharb/salita/commit/f4eb28a4d338c8bb31d0b51266e11f17a093dcc5)

## [v0.11.1](https://github.com/ljharb/salita/compare/v0.11.0...v0.11.1) - 2018-11-09

### Fixed

- [New] add `--only-changed` [`#20`](https://github.com/ljharb/salita/issues/20)

### Commits

- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`9fb29a9`](https://github.com/ljharb/salita/commit/9fb29a9e3a91f6d67eac9c42a858ace7d01925d5)
- [Deps] update `chalk`, `for-each`, `json-file-plus`, `object.assign`, `promise`, `semver`, `yargs` [`d31975b`](https://github.com/ljharb/salita/commit/d31975b59b01987c3e91249880e5167ad28f47c2)

## [v0.11.0](https://github.com/ljharb/salita/compare/v0.10.1...v0.11.0) - 2018-01-28

### Merged

- Allow --ignorePegged to support gitish versions [`#19`](https://github.com/ljharb/salita/pull/19)

### Commits

- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`d313d04`](https://github.com/ljharb/salita/commit/d313d04d3a352d8a789b6a6b926f444e54422ef6)
- [Deps] [Breaking] update `chalk`, `npm`, `promise`, `semver`, `args` [`654272b`](https://github.com/ljharb/salita/commit/654272b941158ffe387f5d7e4b5af737f6a6256f)
- Only apps should have lockfiles [`388efeb`](https://github.com/ljharb/salita/commit/388efeb6e84e2fe8877b873ffcd236d67ccdf86b)

## [v0.10.1](https://github.com/ljharb/salita/compare/v0.10.0...v0.10.1) - 2016-11-18

### Commits

- [Fix] make `update` trump `dry-run`. [`003929b`](https://github.com/ljharb/salita/commit/003929bac5d3dc954519fafd7100a32fb50dd62f)

## [v0.10.0](https://github.com/ljharb/salita/compare/v0.9.4...v0.10.0) - 2016-11-16

### Commits

- [Breaking] swap defaults of `--update` and `--dry-run` [`c761842`](https://github.com/ljharb/salita/commit/c761842d0645b431fa622f8e8ffabc48c6b06326)

## [v0.9.4](https://github.com/ljharb/salita/compare/v0.9.3...v0.9.4) - 2016-11-16

### Fixed

- [Breaking] treat “latest” the same as “*” [`#13`](https://github.com/ljharb/salita/issues/13)
- [Breaking] swap defaults of `--update` and `--dry-run` [`#11`](https://github.com/ljharb/salita/issues/11)

### Commits

- [Fix] use `Boolean` objects as defaults, to distinguish when they’re passed or defaulted. [`14dd661`](https://github.com/ljharb/salita/commit/14dd66112f46499dfc77b6c314fe69ab8b73fb07)
- Revert "[Breaking] swap defaults of `--update` and `--dry-run`" [`1a44500`](https://github.com/ljharb/salita/commit/1a44500e78d4d6f33424b38b9896c6c7f2f918bb)
- Merge tag 'v0.9.3' [`2fbb819`](https://github.com/ljharb/salita/commit/2fbb819821cafcc963aa6043950c842447d5f9ab)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`a2c588d`](https://github.com/ljharb/salita/commit/a2c588d704ade05a384d38c6142ac8952559efe1)
- [Deps] update `npm`, `args` [`ab0b2e7`](https://github.com/ljharb/salita/commit/ab0b2e719b22048b740730826ee58e39d4168f00)
- Merge tag 'v0.9.2' [`2bf8d53`](https://github.com/ljharb/salita/commit/2bf8d536ca9869e4a233b30016941cf081d9818c)
- [New] when changes won’t be persisted, advise the user. [`d135201`](https://github.com/ljharb/salita/commit/d1352013f039e9c0a71d9ea5e93c3190135c0931)
- [New] add `c` alias for `--check`; explicitly default it to `false`. [`aeae019`](https://github.com/ljharb/salita/commit/aeae0199f34153c3725b67a87e329dd483332fd1)

## [v0.9.3](https://github.com/ljharb/salita/compare/v0.9.2...v0.9.3) - 2016-11-08

### Fixed

- [Fix] ensure `—check` works. [`#14`](https://github.com/ljharb/salita/issues/14)

## [v0.9.2](https://github.com/ljharb/salita/compare/v0.9.1...v0.9.2) - 2016-07-16

### Fixed

- [Fix] `yargs` has no way to indicate that two commands conflict. [`#12`](https://github.com/ljharb/salita/issues/12)

### Commits

- [Deps] update `npm`, `yargs`, `semver` [`4f9764b`](https://github.com/ljharb/salita/commit/4f9764b9729d70c404fcdf23d98f60d6e5e165c2)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`0c27bd7`](https://github.com/ljharb/salita/commit/0c27bd72ccdfb06f87825c94934d6e4a514f9cbc)

## [v0.9.1](https://github.com/ljharb/salita/compare/v0.9.0...v0.9.1) - 2016-06-27

### Commits

- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`9eec1cb`](https://github.com/ljharb/salita/commit/9eec1cbd2f6451561abb4b646479e795079b54b0)
- [New] add `update` option, which currently defaults to `true`. [`83a8b16`](https://github.com/ljharb/salita/commit/83a8b16763db32a0267e93a958ad84170c2ab9b1)
- [Deps] update `npm`, `semver` [`e3592e1`](https://github.com/ljharb/salita/commit/e3592e11e8e169e2449afd288ae38a4a2e10cf6b)
- [Dev Deps] update `jscs`, `eslint` [`4acb1fe`](https://github.com/ljharb/salita/commit/4acb1fe61eb572dbf5e8b919c97b9618f0b3d484)
- [Deps] update `npm`, `args` [`d6f48ce`](https://github.com/ljharb/salita/commit/d6f48ce75931bf8088d92b3f6feedfbddb5b0c77)

## [v0.9.0](https://github.com/ljharb/salita/compare/v0.8.5...v0.9.0) - 2016-04-06

### Commits

- [New] add support for peer dependencies. [`86be5bd`](https://github.com/ljharb/salita/commit/86be5bdcf9088bed0fd442fad5a70a9b3713e0a9)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`bd75cfd`](https://github.com/ljharb/salita/commit/bd75cfd2864e03b301e738db062b8a12312ac175)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`6392a62`](https://github.com/ljharb/salita/commit/6392a62d2a6a7ae464df7725c30169057dc0bcfa)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`8aecf2f`](https://github.com/ljharb/salita/commit/8aecf2fb9619bb556ce61b92d08d710e78119e41)
- [Deps] update `chalk`, `json-file-plus`, `npm`, `yargs` [`4c03196`](https://github.com/ljharb/salita/commit/4c03196dd745582f532b1a12811af98d64e7304f)
- [Deps] update `yargs` [`0370c6f`](https://github.com/ljharb/salita/commit/0370c6fb450d03f493fdf16328ba5f792fa50161)
- [Deps] update `npm`, `yargs` [`7a4f3dc`](https://github.com/ljharb/salita/commit/7a4f3dce4e5f3e62ab0b46aaf6439233edf6fff8)

## [v0.8.5](https://github.com/ljharb/salita/compare/v0.8.4...v0.8.5) - 2016-01-03

### Fixed

- [Fix] avoid trumping `—no-color` option. [`#8`](https://github.com/ljharb/salita/issues/8)

### Commits

- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`e6535e4`](https://github.com/ljharb/salita/commit/e6535e4452f1b8a2416f0d6763a1443654b16a68)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`a6e1269`](https://github.com/ljharb/salita/commit/a6e1269eb4d697988eff59f869fa80444ba42dd7)
- [Deps] update `json-file-plus`, `yargs`, `object.assign`, `semver` [`fde2e2e`](https://github.com/ljharb/salita/commit/fde2e2ef989454110904964d05ce36756e91f369)
- [Deps] update `npm`, `yargs`, `promise` [`ed58c99`](https://github.com/ljharb/salita/commit/ed58c99ecc1ff9ca68812007547c9472146102ca)

## [v0.8.4](https://github.com/ljharb/salita/compare/v0.8.3...v0.8.4) - 2015-10-19

### Fixed

- Revert "[Fix] "bin" will now work on Windows, since Windows doesn't work with shebangs" [`#7`](https://github.com/ljharb/salita/issues/7)

### Commits

- [Dev Deps] update `jscs`, `eslint` [`c4485fb`](https://github.com/ljharb/salita/commit/c4485fb93ea290e3e2634cce59f9f68531a946d2)
- [Deps] update `npm` [`50d7f8d`](https://github.com/ljharb/salita/commit/50d7f8d92e13a6b8d7f824c7ecba26059b6cbe73)

## [v0.8.3](https://github.com/ljharb/salita/compare/v0.8.2...v0.8.3) - 2015-10-14

### Commits

- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`cf27c69`](https://github.com/ljharb/salita/commit/cf27c69b4ff382c6ca646fa7e6cbf5181f8299fc)
- [Fix] "bin" will now work on Windows, since Windows doesn't work with shebangs [`de0d1d0`](https://github.com/ljharb/salita/commit/de0d1d02d441046a980d71c5fd47e769ff0a5151)
- [Deps] update `yargs` [`6f6b76c`](https://github.com/ljharb/salita/commit/6f6b76cc75ab22ef7d31662dbb17af18983990b8)

## [v0.8.2](https://github.com/ljharb/salita/compare/v0.8.1...v0.8.2) - 2015-09-21

### Commits

- [Dev Deps] update `jscs` [`466fc5a`](https://github.com/ljharb/salita/commit/466fc5ab41fa59160721944544319153cabd29d9)
- [Deps] update `npm`, `chalk`, `json-file-plus`, `yargs`, `object.assign`, `semver` [`86c474d`](https://github.com/ljharb/salita/commit/86c474dd620af334bc20df81d49df9d632292ded)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`1cd2263`](https://github.com/ljharb/salita/commit/1cd22637ff345b16565af445bbf20ec9a1832431)
- [Deps] Update `yargs` [`2520b72`](https://github.com/ljharb/salita/commit/2520b723e063c88c6caa8729bef15b4832842b5f)

## [v0.8.1](https://github.com/ljharb/salita/compare/v0.8.0...v0.8.1) - 2015-08-07

### Commits

- Add `npm run eslint` [`3b9d213`](https://github.com/ljharb/salita/commit/3b9d213addb17f49b8956fbaf64bc0494c1176c8)
- Handle the case where a package is not found. [`428aab2`](https://github.com/ljharb/salita/commit/428aab269088a7afe341fdc41d6a85ed928d8729)
- Update `yargs`, `semver`, `jscs` [`16e2177`](https://github.com/ljharb/salita/commit/16e217747c6add8a1c9a186b260e9ba139f82416)
- Update `chalk`, `npm`, `yargs`, `object.assign` [`757bc14`](https://github.com/ljharb/salita/commit/757bc14b8910adf38df87c0602d2b6e32b1e2216)
- Update `yargs`, `promise` [`aae96fa`](https://github.com/ljharb/salita/commit/aae96faf93866053cd99fa57a942e918ed4703d8)

## [v0.8.0](https://github.com/ljharb/salita/compare/v0.7.1...v0.8.0) - 2015-06-26

### Commits

- Switch from `minimist` to `yargs` [`b6eef92`](https://github.com/ljharb/salita/commit/b6eef922c099b8ec2de025b1d5259bcf6082d190)
- Make sure `salita` doesn't break on specific tags. [`6410079`](https://github.com/ljharb/salita/commit/641007991f591a8d90c1954e9824f69063047d4f)
- Update `npm`, `promise` [`058f8a9`](https://github.com/ljharb/salita/commit/058f8a92ff0e57bd7f1b98c651b4fe7586925c39)
- Update `npm`, `semver` [`b468d48`](https://github.com/ljharb/salita/commit/b468d48d737666b0db4557938c3b9c9cfa7a7393)
- Update `object.assign` [`6f8c3f5`](https://github.com/ljharb/salita/commit/6f8c3f59f7edc7c267b37a6b46afc428111dd297)

## [v0.7.1](https://github.com/ljharb/salita/compare/v0.7.0...v0.7.1) - 2015-05-19

### Commits

- Update `jscs` [`972cb8c`](https://github.com/ljharb/salita/commit/972cb8c437e2506ce30a4e17407bf729ddf1c713)
- Update `chalk`, `json-file-plus`, `npm`, `minimist`, `object.assign`, `promise`, `semver`. [`8c00816`](https://github.com/ljharb/salita/commit/8c00816540e311479e8390e50c9c18eab4608de3)
- Update `npm`, `jscs` [`fa9613e`](https://github.com/ljharb/salita/commit/fa9613e748095d9e2383483084914380f453c0ab)
- Update `promise`, `jscs` [`32717fd`](https://github.com/ljharb/salita/commit/32717fdc703583d383e915e80718b7065c70bfcc)
- Update `npm` [`700998d`](https://github.com/ljharb/salita/commit/700998da65076a85bc096663e33c69334a30194a)

## [v0.7.0](https://github.com/ljharb/salita/compare/v0.6.0...v0.7.0) - 2015-01-07

### Commits

- Ensure that a dependency is only updated when the new version is newer than the existing version. [`9f82244`](https://github.com/ljharb/salita/commit/9f822446f9138ad248a02e5a120e9ea2ccda502a)
- Convert lookupLatest to the more useful lookupDistTags. [`f329ca8`](https://github.com/ljharb/salita/commit/f329ca849ac4c3026ce3cbdf17d356d1a7146e92)
- Update `jscs` [`d35400b`](https://github.com/ljharb/salita/commit/d35400bf13283057cb4d4782a6c5a99421096e74)
- Update `semver`, `npm` [`8471983`](https://github.com/ljharb/salita/commit/84719833063024da7d8895f05cfadca2d71f83c6)
- Update `npm` [`cd876bf`](https://github.com/ljharb/salita/commit/cd876bf04051c127020bbb9835926dfb9cad502c)
- Update `semver` [`bb0411a`](https://github.com/ljharb/salita/commit/bb0411ad0146820a0db042891cff077c614b8d70)
- Update `npm` [`7c982b1`](https://github.com/ljharb/salita/commit/7c982b144e955a69a09161e4e7135f32ccc6548d)

## [v0.6.0](https://github.com/ljharb/salita/compare/v0.5.0...v0.6.0) - 2014-12-14

### Commits

- Add a summary report of how many dependencies were changed. [`553ea0a`](https://github.com/ljharb/salita/commit/553ea0ae859641f424cf0519e1fe5be89e02f1d7)
- Add `--check` option. [`dc651ab`](https://github.com/ljharb/salita/commit/dc651ab0cbb47fbb110131f2c5d6f2bd1f39820c)
- Update `npm`, `object.assign`, `jscs` [`9586c49`](https://github.com/ljharb/salita/commit/9586c492d6be89f58ba6b856490e22ef78e6ddf8)
- Remove "Completed upgrade" text; output summary to stderr. [`b24b564`](https://github.com/ljharb/salita/commit/b24b56439ac21c9db18a0caacf46756836db5046)
- Pretty-print the JSON output. [`0c6bad3`](https://github.com/ljharb/salita/commit/0c6bad3d3cba679ebc868f9dffabe88ddf143763)

## [v0.5.0](https://github.com/ljharb/salita/compare/v0.4.4...v0.5.0) - 2014-11-02

### Commits

- Adding `ignore-pegged` option. [`80901ef`](https://github.com/ljharb/salita/commit/80901ef7d60e6581cd0f01282fb8c3cdb9ead7fe)
- Refactor "star" filtering a bit. [`8b571d1`](https://github.com/ljharb/salita/commit/8b571d1ec1043ac7d36b72db0de54759384ca43f)

## [v0.4.4](https://github.com/ljharb/salita/compare/v0.4.3...v0.4.4) - 2014-10-22

### Commits

- Adding `jscs` [`7c4dc10`](https://github.com/ljharb/salita/commit/7c4dc1032f88edc8d915c60f21a0743196852f6b)
- Using consistent quotes. [`95b6d9d`](https://github.com/ljharb/salita/commit/95b6d9de55ba2b972a4c96487ca5772a1ed36ce8)
- Use a promise producer to load npm, rather than a flag and polling. [`8c92f9c`](https://github.com/ljharb/salita/commit/8c92f9c513dd069face13e1a4e1f4fc78259e96f)
- Unquoting object keys that are valid identifiers. [`08b1d37`](https://github.com/ljharb/salita/commit/08b1d37e39647d5eae770378a7f4beaca187ea7d)
- Update `jscs`, `promise`, `npm`, `cli-table` [`64701c5`](https://github.com/ljharb/salita/commit/64701c504b505e1df5de99ba0ccd2b809ebfeffb)
- Using proper spacing after the "function" keyword. [`fa3b9ed`](https://github.com/ljharb/salita/commit/fa3b9ed79a6792b6b1abe3e8dfe4c235f841532e)
- Adding `npm run lint` [`26d5903`](https://github.com/ljharb/salita/commit/26d590372844643cb5328377cae430d19dc99565)
- Update npm [`e9cdec6`](https://github.com/ljharb/salita/commit/e9cdec684be2dfba052e0774b9e155082128ba6a)
- Updating npm [`1cbb8f0`](https://github.com/ljharb/salita/commit/1cbb8f03eeca2c39fec95dda33936928535d8f0c)

## [v0.4.3](https://github.com/ljharb/salita/compare/v0.4.2...v0.4.3) - 2014-09-26

### Commits

- Updating npm [`a7020bf`](https://github.com/ljharb/salita/commit/a7020bf340dcc86bfbc0295381fba3e250cfcf04)

## [v0.4.2](https://github.com/ljharb/salita/compare/v0.4.1...v0.4.2) - 2014-09-25

### Commits

- Use the Promise interface of json-file-plus [`79abdfc`](https://github.com/ljharb/salita/commit/79abdfcd32176fd0b98f6f42cdda0bbac029f9ac)
- Update json-file-plus. [`77a3bd7`](https://github.com/ljharb/salita/commit/77a3bd730681d2453562a8fe533221530c4ef5e4)

## [v0.4.1](https://github.com/ljharb/salita/compare/v0.4.0...v0.4.1) - 2014-09-20

### Commits

- Add "contributors" section to package.json [`136dbe7`](https://github.com/ljharb/salita/commit/136dbe70a4d548a56e36ca860195d682e2928d11)
- Updating npm [`4d88e85`](https://github.com/ljharb/salita/commit/4d88e857dae399e98d8485d407a7cf200682ffd2)
- Updating `npm` [`0f25f2d`](https://github.com/ljharb/salita/commit/0f25f2d5fbbdd13b2e23d6945258134dd9a90ccc)
- Updating `promise` [`cba85bd`](https://github.com/ljharb/salita/commit/cba85bdd529065427769bc8769a6b84ccc0f93e8)

## [v0.4.0](https://github.com/ljharb/salita/compare/v0.3.0...v0.4.0) - 2014-09-06

### Commits

- Add an --ignore-stars option, to skip updating of packages listed with "*". [`2871617`](https://github.com/ljharb/salita/commit/28716176d5f21ee876c7e110dfe72ca909a50438)
- Add --dry-run / -n option to prevent modifying package.json files. [`ba3f0e8`](https://github.com/ljharb/salita/commit/ba3f0e8aa5958f9a3cc17468c38e14a71759c2e8)
- Reformat options in README. [`6cbaa21`](https://github.com/ljharb/salita/commit/6cbaa214bdf53422c0c97a283f397a3481d7ab2a)
- Separate out the steps here into intermediate variables. [`134e393`](https://github.com/ljharb/salita/commit/134e3937997a6ce061ad9cefad625bad9e3703f5)

## [v0.3.0](https://github.com/ljharb/salita/compare/v0.2.0...v0.3.0) - 2014-09-06

### Commits

- Add support for `--json` option. [`a645b39`](https://github.com/ljharb/salita/commit/a645b396823d1808d6d59bc6d6bebeda4889f020)
- Move "create table" logic to a reusable function. [`ed8eb7d`](https://github.com/ljharb/salita/commit/ed8eb7d33eb12098f4be5be0b5319656d76c0357)
- Separate display logic from data gathering logic. [`09f014d`](https://github.com/ljharb/salita/commit/09f014de94c6a1c6271b04095a37a5a966b6cdb6)
- Create a separate dependencies table, and dev dependencies table. [`ff6d0a6`](https://github.com/ljharb/salita/commit/ff6d0a6681cf4230f22fc5e332f68f5f7e78e597)
- Use promises for dependenciesLookup instead of callbacks and async. [`674903b`](https://github.com/ljharb/salita/commit/674903bd37df52f413fa3b2a3d26e318c316ba07)
- Make dependenciesLookup pass its result rather than mutating globals [`12abc61`](https://github.com/ljharb/salita/commit/12abc611849b34b04e2e0427cdd6a844c12cf01a)
- Documenting the "no-color" option via minimist. [`e292917`](https://github.com/ljharb/salita/commit/e292917003edc232ababe6a4988a63b4a9967e03)
- Sort package names alphabetically in each table. [`2cc7e5d`](https://github.com/ljharb/salita/commit/2cc7e5de6dade4044bfbeb949be15b772b99427f)
- Updating npm [`0a1cb08`](https://github.com/ljharb/salita/commit/0a1cb0869f0e0c38d8ba36c62026acce27b46b3d)
- Updating npm [`119af6e`](https://github.com/ljharb/salita/commit/119af6e2e564438e001050ee9623bde28bc6dba3)
- Updating json-file-plus [`2b3aeca`](https://github.com/ljharb/salita/commit/2b3aeca945da04c1fb26ab84ff5c06500c3511f1)

## [v0.2.0](https://github.com/ljharb/salita/compare/v0.1.11...v0.2.0) - 2014-08-31

### Commits

- Change signature of salita function. [`9b22693`](https://github.com/ljharb/salita/commit/9b22693dbe9ddd2a849f0029b6917d9f1d0963ea)
- Making the package prefix respect the npm config. [`e41fb78`](https://github.com/ljharb/salita/commit/e41fb781dfae95ed6aeb86f03fc26991b44b8f5e)
- Bump to v0.2.0 due to breaking API change. [`a97cc44`](https://github.com/ljharb/salita/commit/a97cc44ce4013f41d71553388950a67e0c385f08)

## [v0.1.11](https://github.com/ljharb/salita/compare/v0.1.10...v0.1.11) - 2014-08-29

### Merged

- Update dependencies [`#3`](https://github.com/ljharb/salita/pull/3)
- Add "repository" field [`#5`](https://github.com/ljharb/salita/pull/5)

### Commits

- Add repository field [`105c332`](https://github.com/ljharb/salita/commit/105c3328f22f1ed761faf5a4e04dd8ebfd0e9e41)
- Bump to new version since I made an NPMistake [`3eb5a8d`](https://github.com/ljharb/salita/commit/3eb5a8d1a2f61e9fd5aac423554410fa78e98ade)
- Updating json-file-plus [`c7a9225`](https://github.com/ljharb/salita/commit/c7a9225e8e9a1e806adaf91e293e6791d6b5a795)
- Updating npm [`1e99d96`](https://github.com/ljharb/salita/commit/1e99d965a8785ec7310549dc696cc23bf4cb5b6e)
- Updating chalk [`9614564`](https://github.com/ljharb/salita/commit/9614564255054a008273fb8316b7d4b506136d7c)

## [v0.1.10](https://github.com/ljharb/salita/compare/v0.1.9...v0.1.10) - 2014-08-28

### Merged

- Use json-file-plus to preserve JSON file formatting [`#2`](https://github.com/ljharb/salita/pull/2)

### Commits

- Use json-file-plus to preserve JSON file formatting. [`066c7eb`](https://github.com/ljharb/salita/commit/066c7eb3fffd4ee29014f421b25e3433072c0940)
- Bump to 0.1.10 [`617426b`](https://github.com/ljharb/salita/commit/617426b007e3cdcad9817b2d13aa9bd352eda7f2)

## v0.1.9 - 2014-05-31

### Merged

- different message if version stays the same [`#1`](https://github.com/ljharb/salita/pull/1)

### Commits

- Initial commit. [`50e5c4a`](https://github.com/ljharb/salita/commit/50e5c4a1d7d9866cbbcab9fc2e906448a42c8c9a)
- Added nicer formatting. [`0b6c49a`](https://github.com/ljharb/salita/commit/0b6c49a3c9f13f374d7473a10f5b1695ba16ae8a)
- Nicer readme. [`857348f`](https://github.com/ljharb/salita/commit/857348f01cdbb3dd7d979b7417696701a6880722)
- Added some color and bug fixes. [`c1d6fed`](https://github.com/ljharb/salita/commit/c1d6fedd0442f09523bb1252a39a3a9063acf6c6)
- Added an example to the readme. [`8012f4a`](https://github.com/ljharb/salita/commit/8012f4ad14dd4600ce6ec0d20e69debd14b7b020)
- Ensure missing dev or dep doesn't break. [`a7078f0`](https://github.com/ljharb/salita/commit/a7078f0488b5851c2e764cf22bc089a4909acc9f)
- Removed erroneous package. [`88b8d28`](https://github.com/ljharb/salita/commit/88b8d28bd220f2341a046346e0fc0b1b9d2fd52f)
- Add bin field in package.json. [`89e3581`](https://github.com/ljharb/salita/commit/89e35814ee694eae214aa92bb75043ef100cf2a3)
- Still need tests... [`8fe6600`](https://github.com/ljharb/salita/commit/8fe6600239cf73fa706aceda94dd94dac0458c24)
- I really need tests. [`51d08a3`](https://github.com/ljharb/salita/commit/51d08a32a38870f1086a2306fa087fae25ec5d49)
- Fixed bin directory. [`b1e84c1`](https://github.com/ljharb/salita/commit/b1e84c1c0cb42f62bf0967d5e2276591a240b9f0)
- Bumped version to contain Greg's fix. [`b0386ef`](https://github.com/ljharb/salita/commit/b0386effd8419d6baa4df37983ba3531abdc6437)
