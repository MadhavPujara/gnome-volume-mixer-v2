import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/extension.js',
    output: {
      file: `dist/extension.js`,
      format: 'es',
    },
    plugins: [
      commonjs()
    ],
  },
  {
    input: 'src/prefs.js',
    output: {
      file: `dist/prefs.js`,
      format: 'es',
    },
    plugins: [
      commonjs()
    ],
  },
];
