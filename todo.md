# TODOs

- [ ] 添加模板代码的格式化（标签对齐、属性换行巴拉巴拉）
- [ ] PUButton 通过 inject/provide 读取属性（可以用于 ButtonGroup 或者常见的 Operations 中）
- [x] Avatar组件、Partners组件
- [ ] 在 business/ 中将 computed 与类再进一步结合
- [x] 移除 Business 或者 Business 基于 valibot
- [x] Location.get 使用 Store 做缓存
- [x] TabBar 改为普通的版本，不用悬浮
- [ ] PRList 可以使用 scroll-view
- [ ] uniuse (<https://uni-helper.js.org/uni-use/guide/installation>)
- [ ] 基于对 wd-transition 原理的总结，再次尝试实现 wd-transition
- [ ] vue-i18n types support
- [ ] BusinessClass.use 的某些值的双向绑定问题解决方案作成 composable
- [ ] 硬编码文本放到国际化中
- [x] 组件单元测试页面模板组件（写明对应的props；处理安全区域）
- [ ] 抽离出 Section 组件
- [ ] 合并 root-portal 到 PUDrawer 中
- [x] V.class 支持 extend

## 接入后端

- [ ] 获取可选搭子角色列表

## PR Create

- [ ] Use type specific form
- [x] Add form-item component
- [x] validate 不等同于 parse。parse还有很多除数据正确性以外的复杂规则，包括跨字段的。（但似乎有 refine 这种东西）

## Me Page

- [x] 将 vertical-cell 分离为 field 组件
- [x] OSS use fp extension if key extension is missing
- [x] Nickname 编辑
- [x] Bio, gender, mbti, birthday 编辑
- [ ] 大学生认证 <https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/industry/student.html#%E4%BA%94%E3%80%81%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3>
- [ ] 手机号编辑

## PRTimeline

- [x] 编写测试
- [x] 改进 Card 组件 （Expandable）
- [x] 添加手风琴组件，控制只能展开几个
- [ ] 其它状态的推荐操作

## Explore

- [x] 添加 GeoElementFilter Button 到 FixedFilters （目前只有这两种 Filter，所以可以这么做）

## PRDetail

- [x] Partners Section
- [ ] Partner Header 都可点击，有点击反馈
- [x] Route Section
- [x] Drawer expand
  - [x] PRApplyForm
  - [x] AddPartner
  - [x] DeletePartner
  - [x] Available PartnerRoles 抽屉效果优化（点击遮罩层收起、动画）（独立的组件）
  - [x] PartnerRole 组件
- [ ] 点击 PRStatusTag 则抽屉展开并且显示 Timeline (Tag背景色更深，表示 toggled)
- [ ] 点击 More-Btn 弹出底部 ActionSheet
- [ ] Share 操作（选择分享目标）

## PRGeoElementFilter

- [x] 移除 filtering 属性
- [x] Filtering -> GeoElement
- [x] 滑动 GeoElementPreview 区域切换 GeoElement
- [ ] 添加放大按钮
- [x] 修改复位按钮的图标

## PUMap

- [x] 支持多路线（未选中的路线多段线和气泡都叠加 disabled 的透明度），仅可以激活一条（双向绑定激活值）
- [x] includePoints 仅激活路线
- [x] 双向绑定 `v-model:activeElement` ，删除 `emit:element-click`
- [ ] 随着视野的缩放加载更多路线（lazyPlan）
- [ ] simplify props
- [x] 添加 operations slot
