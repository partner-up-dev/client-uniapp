遵循下列步骤实现新页面：

1. 创建[文件结构](.github/instructions/page.instructions.md#文件结构)定义的文件
2. 在 `src/pages.json` 中按如下示例注册页面：

- 对于主包中的页面（也就是在 `src/pages` 中的页面 ）

  ```json
  {
    "pages": [
      {
        "path": "pages/pageName/pageName",
        "style": {
          "navigationBarTitleText": "页面标题"
        }
      }
    ]
  }
  ```

- 对于分包中的页面（也就是在 `src/sub_packages/<subPackageName>/pages` 中的页面 ）

  ```json
  {
    "subPackages": [
      {
        "root": "sub_packages/<subPackageName>",
        "pages": [
          {
            "path": "pages/pageName/pageName",
            "style": {
              "navigationBarTitleText": "页面标题"
            }
          }
        ]
      }
    ]
  }
  ```

- 对于 TabBar 页面，还要在 `tabBar.list` 中注册：

  ```json
  {
    "tabBar": {
      "list": [
        {
          "pagePath": "pages/pageName/pageName",
          "text": "页面名称",
          "iconPath": "static/tabbar/icon.png",
          "selectedIconPath": "static/tabbar/icon-active.png"
        }
      ]
    }
  }
  ```

3. 在 `data/mapper.ts` 的 `PAGE_PATH` 中添加页面路径记录
4. 仅实现布局骨架，用空白占位符替代具体内容

其它注意事项：

- 无需了解已有哪些组件
- 页面不可以配置 BasicComponentOptions
