module.exports = {
    env: {
        "node": true,
        "es2022": true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        project: [
            '../tsconfig.json',
        ],
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module"
    },
    root: true,
    ignorePatterns: [
        "/build/",
        "/node_modules/",
        "/coverage/",
        "/logs/",
    ]
};
