# PRApplyForm 申请表单

Rationale

- 为搭子请求提交申请，包含多个搭子角色的理由输入和提交逻辑。

Goals

- 展示目标 PR 的全部角色
- 支持为所选角色填写申请理由
- 调用后端 PRV2Apply 接口提交
- 支持外部控制提交按钮（externalSubmit）

Specification

- 使用 Partner 组件的 Editor 视图展示角色与职责说明
- 每个角色附带一个 textarea 输入 rationale
- 点击提交调用 POST /partner_request/application?partner_request_id={id}，请求体为 SubPartnerApplication[]
- 成功后触发 submitted 事件

Implementation

- 参见同目录下 .vue, .ts, .scss

Props

- partnerRequestId: number (required)
- externalSubmit: boolean (default false)
- initialSelectedRoles: number[] (default [])

Events

- submitted(application: PartnerApplication)
- error(err: unknown)
- change(roles: number[])

Methods

- submit(): 返回 Promise，解析值为 PartnerApplication

其它

- rationale 非空时需不少于 6 个字符（与后端约束保持一致）。
