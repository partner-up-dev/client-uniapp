// 枚举相关的工具函数，参阅 https://git.hadream.ltd/anana/application/uniapp/wikis/Standard/Uniapp/Utils#枚举

export function enumToPickerOptions(
    enumObj: Record<string, string | number | boolean>,
    label_t?: (msgid: string) => string
) {
    return Object.values(enumObj).map((value) => ({
        label: label_t ? label_t(value.toString()) : value.toString(),
        value: value
    }));
}

/**
 * 判断某个字符串值是否存在于枚举对象的值列表中
 */
export function isInEnum(value: string, enumObj: Record<string, unknown>): boolean {
    return Object.values(enumObj).includes(value)
}
