import ljharb from '@ljharb/eslint-config/flat/node/24';

export default [
  ...ljharb,
  {
    rules: {
      'func-name-matching': 'warn',
      'func-style': 'off',
      indent: ['error', 2],
      'max-lines-per-function': 'off',
      'max-nested-callbacks': ['error', 4],
      'max-params': ['error', 4],
      'max-statements-per-line': ['error', { max: 2 }],
      'new-cap': [
        'error', {
          capIsNewExceptions: ['Range'],
        },
      ],
      'no-extra-parens': 'off',
      'no-magic-numbers': 'off',
      'no-use-before-define': 'warn',
      'sort-keys': 'off',
    },
  },
];
