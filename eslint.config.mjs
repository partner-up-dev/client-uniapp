import pluginVue from 'eslint-plugin-vue';
import pluginVueI18n from '@intlify/eslint-plugin-vue-i18n';
import vueParser from 'vue-eslint-parser';

const vueFiles = ['**/*.vue'];

export default [
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/coverage/**',
            '**/unpackage/**',
            '**/temp/**'
        ]
    },
    {
        files: vueFiles,
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: '@typescript-eslint/parser',
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue']
            }
        },
        plugins: {
            vue: pluginVue,
            'vue-i18n': pluginVueI18n
        },
        settings: {
            'vue-i18n': {
                localeDir: 'src/locale/**/*.ts',
                messageSyntaxVersion: '^9.0.0'
            }
        },
        rules: {
            ...pluginVue.configs['flat/recommended'].rules,
            ...pluginVueI18n.configs['flat/recommended'].rules
        }
    }
];
