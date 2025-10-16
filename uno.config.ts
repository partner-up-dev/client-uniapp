import { presetUni } from "@uni-helper/unocss-preset-uni";
import presetIcons from "@unocss/preset-icons";
import { presetWeapp } from "unocss-preset-weapp";
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import partnerUpDesignPreset from './src/styles/presets/design'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

const safeListOfIcons = [
  'i-mdi-bookmark-outline',
  'i-mdi-refresh',
  'i-mdi-filter',
  'i-mdi-map-marker',
  'i-mdi-map-marker-circle',
  'i-mdi-map-marker-check',
  'i-mdi-directions',
  'i-mdi-vector-polygon',
  // dynamically used in Partner component
  'i-mdi-chevron-down',
  'i-mdi-chevron-up',
  // chat page icons
  'i-mdi-arrow-left',
  'i-mdi-dots-vertical',
  'i-mdi-send'
]

export default {
  presets: [
    presetUni(),
    presetWeapp({
      prefix: "uno-",
      designWidth: 750,
    }),
    presetWeappAttributify(),
    partnerUpDesignPreset(),
    presetIcons(),
  ],
  transformers: [transformerAttributify(), transformerClass()],
  shortcuts: [],
  safelist: [...safeListOfIcons],
};
