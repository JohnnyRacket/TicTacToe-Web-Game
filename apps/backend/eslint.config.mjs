import path from 'path';
import { fileURLToPath } from 'url';

import importPlugin from 'eslint-plugin-import';

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
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: path.resolve(__dirname, 'tsconfig.app.json'),
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'no-process-exit': 'warn',
      'no-sync': 'warn',
      'import/no-restricted-paths': [
        'error',
        {
          basePath: path.resolve(__dirname, '../..'),
          zones: [
            {
              target: './apps/backend/src/api/games/**',
              from: './apps/backend/src/api',
              except: ['./games', './users'],
              message:
                'Cross-API imports are not allowed. The games module cannot import from other API subfolders.',
            },
            {
              target: './apps/backend/src/api/leaderboard/**',
              from: './apps/backend/src/api',
              except: ['./leaderboard', './users'],
              message:
                'Cross-API imports are not allowed. The leaderboard module cannot import from other API subfolders.',
            },
            {
              target: './apps/backend/src/api/users/**',
              from: './apps/backend/src/api',
              except: ['./users'],
              message:
                'Cross-API imports are not allowed. The users module cannot import from other API subfolders.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/main.ts', '**/main.js'],
    rules: {
      'no-process-exit': 'off',
    },
  },
];
