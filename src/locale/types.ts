// types of i18n module

export type named = (msgid: string) => string;
export type msgArgs = { named: named }
