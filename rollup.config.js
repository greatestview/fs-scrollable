import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/fs-scrollable.js',
  output: {
    dir: 'build',
    format: 'es',
  },
  plugins: [
    minifyHTML(),
    resolve(),
    production && terser(), // Minify, but only in production
  ],
  preserveEntrySignatures: false,
};
