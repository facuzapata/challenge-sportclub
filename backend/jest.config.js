module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        '**/*.(t|j)s',
        '!**/*.module.ts',
        '!**/main.ts',
        '!**/*.interface.ts',
        '!**/*.entity.ts',
        '!**/*.dto.ts',
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@domain/(.*)$': '<rootDir>/domain/$1',
        '^@application/(.*)$': '<rootDir>/application/$1',
        '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
        '^@presentation/(.*)$': '<rootDir>/presentation/$1',
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};