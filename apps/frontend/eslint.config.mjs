import nx from '@nx/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // Enable React Hooks rules for all files (hooks can be in .ts files)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
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
