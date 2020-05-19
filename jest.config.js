module.exports = {
  roots: ['<rootDir>'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
