module.exports = {
    'root': true,
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaVersion': 2017,
        'sourceType': 'module',
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true
        }
    },
    'plugins': [
        'flowtype',
        'prettier'
    ],
    'extends': [
        'eslint:recommended',
        'plugin:flowtype/recommended',
        'prettier',
        'prettier/flowtype'
    ],
    'env': {
		'es6': true,
        'node': true
    },
	'globals': {
    	'module': true
	},
    'rules': {
        'no-var': 'error',
        'no-console': 'off',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'indent': ['error', 'tab'],
        'max-len': ['error', 140 ],
        'no-extra-parens': 'error',
		'prettier/prettier': 'error',
        'comma-dangle': ['error', 'never'],
        // 'arrow-parens': ['error', 'always'],
        'no-cond-assign': ['error', 'always'],
        'no-template-curly-in-string': 'error',
        'object-shorthand': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'max-statements-per-line': ['error', { 'max': 2 }],
        'new-cap': ['error', { 'capIsNewExceptions': ['A'] }],
        'no-constant-condition': ['error', { 'checkLoops': false }],
        'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
        'generator-star-spacing': ['error', { 'before': false, 'after': true }]

    }
};
