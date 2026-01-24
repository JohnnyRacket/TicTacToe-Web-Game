import path from 'path';
import { fileURLToPath } from 'url';

import baseConfig from '../../eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.*?.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // type-aware rules go in project, see https://nx.dev/docs/technologies/eslint/guides/eslint
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      'no-process-exit': 'warn',
      'no-sync': 'warn',
    },
  },
  {
    files: ['**/main.ts', '**/main.js'],
    rules: {
      'no-process-exit': 'off',
    },
  },
];
