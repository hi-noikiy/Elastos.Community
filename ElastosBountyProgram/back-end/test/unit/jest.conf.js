const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../../'),
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFiles: ['<rootDir>/test/unit/setup'],
    coverageDirectory: '<rootDir>/test/unit/coverage',
    collectCoverageFrom: [
        'src/**/*.{ts}',
        '!**/node_modules/**',
        '!src/db/**/*.ts',
        '!src/router/**/*.ts',
        '!src/*.ts'
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: [
        "ts",
        "js",
        "jsx",
        "json"
    ],
    globals: {
        "ts-jest": {
            "skipBabel": true
        }
    }
};