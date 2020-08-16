import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import cleaner from 'rollup-plugin-cleaner';
import cleanup from 'rollup-plugin-cleanup';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json'

const external = [
  'react',
  'react-dom'
];

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external,
  plugins: [
    cleanup(),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    resolve(),
    typescript({
      objectHashIgnoreUnknownHack: true,
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer']
      }
    })
  ].concat(cleaner({ targets: ['dist/'] }))
}
