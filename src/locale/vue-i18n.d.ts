import type { MessageSchema } from '@/locale/schema';

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema { }
  export interface DefineDateTimeFormat { }
  export interface DefineNumberFormat { }
}
