import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('prettier'),
    {
        rules: {
            'no-console': [
                'error',
                {
                    allow: ['info', 'warn', 'error'],
                },
            ],
        },
    },
    {
        ignores: ['.serverless/**'],
    },
];

export default eslintConfig;
