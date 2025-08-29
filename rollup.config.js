import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/Allonsh.js',
    output: [
      {
        file: 'dist/allonsh.js',
        format: 'umd',
        name: 'Allonsh',
        sourcemap: false,
      },
      {
        file: 'dist/allonsh.min.js',
        format: 'umd',
        name: 'Allonsh',
        plugins: [terser()],
        sourcemap: false,
      },
    ],
    plugins: [resolve(), commonjs()],
  },
];
