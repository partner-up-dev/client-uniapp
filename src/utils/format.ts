// 格式化相关的工具函数封装，查阅 https://git.hadream.ltd/anana/application/uniapp/wikis/Standard/Uniapp/Utils#格式化

export function formatRange(
    range: [any, any], 
    connector: string = "~", 
    space: boolean = false
) {

    if (space) {
        connector = ` ${connector} `
    }

    return range.join(connector);
}
