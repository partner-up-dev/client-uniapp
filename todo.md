# TODOs

## Technical & Refactoring

- [ ] 添加模板代码的格式化（标签对齐、属性换行巴拉巴拉）
- [ ] PUButton 通过 inject/provide 读取属性
- [ ] 在 business/ 中将 computed 与类再进一步结合
- [x] 移除 Business 或者 Business 基于 valibot
- [x] Location.get 使用 Store 做缓存
- [x] TabBar 改为普通的版本，不用悬浮
- [ ] PRList 可以使用 scroll-view
- [ ] 引入 uniuse, uni-promisesm
- [ ] 尝试 uni-devtools
- [ ] retry migrate wd-transition
- [ ] BusinessClass.use 的某些值的双向绑定问题解决方案作成 composable
- [ ] 硬编码文本放到国际化中
- [x] 组件单元测试页面模板组件
- [ ] 抽离出 Section 组件
- [ ] 合并 root-portal 到 PUDrawer 中
- [x] V.class 支持 extend
- [ ] `pages.json` 作为 SSoT
- [ ] PR Create Use type specific form
- [ ] 重构国际化
  - [x] messages 模块化杂乱不清晰且过度设计
  - typescript 与 i18n Ally 兼容性不好，换成 json
  - 工程化: lint (eslint-plugin-vue-i18n), Type Schema, automation (vue-i18n-extract)
  - use 的拆分是没有必要的，直接放在 index 里就行
  - src/locales/AGENTS.md, and <>

## Auth & Profile (注册/登录/资料)

- [x] Avatar Component (Basic)
- [ ] Register / Login (UI & Logic integration)
- [x] Profile Edit (Nickname, Bio, Gender, MBTI)
- [x] Avatar Switch/Upload
- [ ] Student Verification (大学生认证)
- [ ] Phone Number Edit

## Partner Request (My Requests)

- [ ] My Requests List (我的搭子请求)
- [ ] Create Partner Request (创建)
  - [x] Basic Flow (Start/Trip/End)
  - [x] Form Items
  - [ ] Backend Integration (Create)
- [ ] Edit Partner Request (编辑)
- [ ] Publish Logic (发布)

## Explore (探索)

- [x] Explore Page UI
- [x] GeoElement Filter
- [x] PUMap Multi-route support
- [ ] Get Explore Results (Backend)
- [ ] Lazy Plan (Map loads more routes on zoom)

## Collections (收藏)

- [ ] My Collections List (我的搭子请求收藏)
- [ ] Collect / Uncollect Action (收藏/取消收藏)

## Applications & Participation (申请/参与)

- [x] Apply Form (申请入队 - PRApplyForm)
- [x] Partner Role Component & List (获取搭子角色)
- [x] Available Partner Roles Drawer
- [ ] Get Partner Requests Partners List (获取搭子列表)
- [ ] Check Participation Status (Acting/Not Acting check)
- [ ] Approve / Reject Application (同意/拒绝)
- [ ] Withdraw Application

## Social (社交)

- [ ] Share Partner Request (分享搭子请求)
- [ ] Invite Partner (搭子邀请)

## Onboarding (引导)

- [ ] Onboarding Flow
- [ ] Interests / Subscriptions (兴趣/订阅)
- [ ] Trust Issues (信任问题)

## Partner Types (搭子类型)

- [ ] Beauty (美妆)
- [ ] Concert (演唱会)
- [ ] Carpool (拼车 - Commute/RideHailing exists)
- [ ] Merch (谷搭子)
- [ ] Shopping (逛街/山姆)
