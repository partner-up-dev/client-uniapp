import { definePreset } from 'unocss'

const colors = {
    primary: '#96D945',
    'primary-on': '##050A00',
    'primary-container': '#CDEDA4',
    'primary-container-on': '#102000',
    secondary: '#85976E',
    'secondary-on': '#ffffff',
    'secondary-container': '#DBE7C8',
    'secondary-container-on': '#151E0B',
    tertiary: '#4C9E99',
    'tertiary-on': '#ffffff',
    'tertiary-container': '#BBECE8',
    'tertiary-container-on': '#00201E',
    error: '#d32f2f',
    'error-on': '#ffffff',
    'error-container': '#FFDAD6',
    'error-container-on': '#410002',
    warning: '#F6C430',
    'warning-on': '#241A00',
    surface: '#F9FAEF',
    'surface-on': '#000000',
    'surface-on-variant': '#44483D',
    'surface-container': '#EEEFE3',
    'surface-container-high': '#E8E9DE',
    'surface-container-highest': '#E2E3D8',
    'surface-container-low': '#F3F4E9',
    outline: '#75796C',
    'outline-variant': '#C5C8BA',
    blue: '#4C9E99',
    red: '#d32f2f',
    green: '#96D945',
    yellow: '#F6C430',
}

const spacing = {
    xs: '4px',
    sm: '8px',
    med: '16px',
    lg: '32px',
}

const shadows = {
    0: 'none',
    1: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    2: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    3: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
    4: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    6: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    8: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    12: '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
    16: '0px 8px 9px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
    24: '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
}

const sizes = {
    xSmall: '20px',
    small: '24px',
    medium: '32px',
    large: '48px',
    xLarge: '60px',
}

const iconSizes = {
    small: '20px',
    medium: '24px',
    large: '40px',
}

const borderRadius = {
    none: '0px',
    xs: '0px',
    sm: '0px',
    med: '16px',
    lg: '24px',
    full: '50%',
}

const fonts = {
    'display-large': {
        'font-size': '42px',
        'font-weight': 200,
        'line-height': '48px',
    },
    'headline-large': {
        'font-size': '32px',
        'font-weight': 200,
        'line-height': '48px',
    },
    'title-large': {
        'font-size': '22px',
        'font-weight': 400,
        'line-height': '32px',
    },
    'body-large': {
        'font-size': '16px',
        'font-weight': 400,
        'line-height': '24px',
    },
    'label-large': {
        'font-size': '14px',
        'font-weight': 400,
        'line-height': '20px',
    },
    'label-medium': {
        'font-size': '12px',
        'font-weight': 400,
        'line-height': '16px',
    },
    'label-small': {
        'font-size': '10px',
        'font-weight': 400,
        'line-height': '16px',
    },
    'mono': {
        'font-family': 'ui-monospace',
    }
}

const paddingPropertyMap: Record<string, string[]> = {
    x: ['padding-left', 'padding-right'],
    y: ['padding-top', 'padding-bottom'],
    lt: ['padding-left', 'padding-top'],
    rt: ['padding-right', 'padding-top'],
    rb: ['padding-right', 'padding-bottom'],
    lb: ['padding-left', 'padding-bottom'],
}

const marginPropertyMap: Record<string, string[]> = {
    x: ['margin-left', 'margin-right'],
    y: ['margin-top', 'margin-bottom'],
    lt: ['margin-left', 'margin-top'],
    rt: ['margin-right', 'margin-top'],
    rb: ['margin-right', 'margin-bottom'],
    lb: ['margin-left', 'margin-bottom'],
}

export default definePreset(() => ({
    name: 'partner-up-design',
    theme: {
        colors,
        spacing,
        sizes,
        iconSizes,
        'box-shadow': shadows,
        'border-radius': borderRadius,
        fonts,
    },
    rules: [
        // Elevation utilities
        [/^elevation-(\d+)$/, ([, d]) => {
            const elevation = parseInt(d)
            if (elevation in shadows) {
                return { 'box-shadow': shadows[elevation as keyof typeof shadows] }
            }
        }],
        // Shape utilities
        [/^shape-(none|sm|med|lg|full)$/, ([, size]) => ({
            'border-radius': borderRadius[size as keyof typeof borderRadius]
        })],
        [/^shape-(x|y|lt|rt|rb|lb)-(none|sm|med|lg|full)$/, ([, pos, size]) => {
            const value = borderRadius[size as keyof typeof borderRadius]
            if (pos === 'x') {
                return { 'border-radius': `${value} 0 0 ${value}` }
            } else if (pos === 'y') {
                return { 'border-radius': `0 ${value} ${value} 0` }
            } else if (pos === 'lt') {
                return { 'border-radius': `${value} 0 0 0` }
            } else if (pos === 'rt') {
                return { 'border-radius': `0 ${value} 0 0` }
            } else if (pos === 'rb') {
                return { 'border-radius': `0 0 ${value} 0` }
            } else if (pos === 'lb') {
                return { 'border-radius': `0 0 0 ${value}` }
            }
        }],
        // Font utilities
        [/^font-(.+)$/, ([, key]) => {
            const font = fonts[key as keyof typeof fonts]
            if (font) {
                return font
            }
        }],
        [/^font-(.+)$-mono/, ([, key]) => {
            const font = fonts[key as keyof typeof fonts]
            if (font) {
                return {
                    ...font,
                    'font-family': 'ui-monospace',
                }
            }
        }],
        // Spacing utilities
        [/^space-p-(xs|sm|med|lg)$/, ([, size]) => ({
            padding: spacing[size as keyof typeof spacing]
        })],
        [/^space-m-(xs|sm|med|lg)$/, ([, size]) => ({
            margin: spacing[size as keyof typeof spacing]
        })],
        [/^space-g-(xs|sm|med|lg)$/, ([, size]) => ({
            gap: spacing[size as keyof typeof spacing]
        })],
        [/^space-p-(x|y|lt|rt|rb|lb)-(xs|sm|med|lg)$/, ([, pos, size]) => {
            const properties = paddingPropertyMap[pos]
            if (properties) {
                return properties.reduce((acc, prop) => {
                    acc[prop] = spacing[size as keyof typeof spacing]
                    return acc
                }, {} as Record<string, string>)
            }
        }],
        [/^space-m-(x|y|lt|rt|rb|lb)-(xs|sm|med|lg)$/, ([, pos, size]) => {
            const properties = marginPropertyMap[pos]
            if (properties) {
                return properties.reduce((acc, prop) => {
                    acc[prop] = spacing[size as keyof typeof spacing]
                    return acc
                }, {} as Record<string, string>)
            }
        }]
    ],
    shortcuts: [
    ],
}))