import path from 'path';
import { fileURLToPath } from 'url';

import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';

import baseConfig from '../../eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      'react-hooks': reactHooks,
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
      // Enable React Hooks rules for all files (hooks can be in .ts files)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/no-restricted-paths': [
        'error',
        {
          basePath: path.resolve(__dirname, '../..'),
          zones: [
            {
              target: './apps/frontend/src/features/game/**',
              from: './apps/frontend/src/features',
              except: ['./game'],
              message:
                'Cross-feature imports are not allowed. The game feature cannot import from other features.',
            },
            {
              target: './apps/frontend/src/features/leaderboard/**',
              from: './apps/frontend/src/features',
              except: ['./leaderboard'],
              message:
                'Cross-feature imports are not allowed. The leaderboard feature cannot import from other features.',
            },
            {
              target: './apps/frontend/src/features/lobby/**',
              from: './apps/frontend/src/features',
              except: ['./lobby'],
              message:
                'Cross-feature imports are not allowed. The lobby feature cannot import from other features.',
            },
            {
              target: './apps/frontend/src/features/sidebar/**',
              from: './apps/frontend/src/features',
              except: ['./sidebar'],
              message:
                'Cross-feature imports are not allowed. The sidebar feature cannot import from other features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // Disable explicit return type requirement for React components
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];
