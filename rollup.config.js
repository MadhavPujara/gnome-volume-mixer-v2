import commonjs from '@rollup/plugin-commonjs';

const external = (id) => id.startsWith('gi://') || id.startsWith('resource:///');

export default [
  {
    input: 'src/extension.js',
    output: {
      file: `dist/extension.js`,
      format: 'es',
    },
    external,
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
    external,
    plugins: [
      commonjs()
    ],
  },
];
