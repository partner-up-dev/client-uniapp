module.exports = {
    vueFiles: ['src/**/*.vue'],
    languageFiles: ['src/locale/**/*.ts'],
    output: 'temp/i18n-report.json',
    detect: ['missing', 'unused'],
    ci: false,
    separator: '.',
    exclude: []
};
