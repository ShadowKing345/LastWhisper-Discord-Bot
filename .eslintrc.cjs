module.exports = {
    env: {
        "node": true,
        "es2022": true,
        "jest": true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: "@typescript-eslint/parser",
    plugins: [ "@typescript-eslint" ],
    parserOptions: {
        project: [ './tsconfig.test.json' ],
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module"
    },
    root: true,
};
