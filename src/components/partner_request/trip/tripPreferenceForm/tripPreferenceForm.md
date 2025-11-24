# tripPreferenceForm 出行偏好表单

## Rationale

提供出行偏好信息的编辑功能，用于搭子请求表单。

## Goals

- 编辑出行目的
- 编辑行李数量
- 根据出行目的显示航班号或列车号输入

## Key Concepts

- 行李数量按件计算，每件按 20L 换算成体积
- 出行目的决定是否显示航班号/列车号字段

## Specification

根据出行目的（purpose）显示相应的表单项：
- 所有类型：出行目的、行李数量
- 机场送机/接机：航班号
- 火车站送站/接站：列车号

## Implementation

### Props

- `modelValue` (`TripPreference`, required): 出行偏好数据

### Events

- `update:modelValue(value: TripPreference)`: 数据更新
- `change()`: 数据变化通知

### Methods

- `validate(): Promise<{ valid: boolean; errors: string[] }>`: 验证表单
