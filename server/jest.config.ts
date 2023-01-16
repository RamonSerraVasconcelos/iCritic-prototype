export default {
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1',
    },

    bail: true,
    clearMocks: true,
    preset: 'ts-jest',
    testMatch: ['**/tests/**/*.test.ts'],
    testTimeout: 50000,
};
