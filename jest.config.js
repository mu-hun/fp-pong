module.exports = {
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
