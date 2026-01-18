# AGENTS.md of component documentation

This guide covers how to write and read component docs.

## Best Practices

- Readers are Coding Agents; optimize for token efficiency
  - Write only what’s necessary; avoid redundancy (if naming is self-explanatory, don’t explain “what it is”)
  - Keep language concise and clear
- Prefer structure over prose (use lists/tables where possible)
- Keep terminology consistent with the codebase and existing docs
- Document behaviors, constraints, and edge cases over implementation trivia
- Put defaults, ranges, and validation rules next to the relevant prop/event/model
- Avoid restating obvious UI; highlight user-visible states and transitions
- Link to shared concepts instead of duplicating (use `docs/` or existing component docs)
- If a section is not applicable, omit it rather than writing “N/A”

## Doc Template

```markdown
# compName

## Rationale

Why this component is needed.

## Goals

The component’s goals (core functionality).

## Key Concepts

Key concepts, mainly domain-specific terms (list only; details live in `docs/`).

## Specification

Refine the goals into content, UI/UX, behavior, etc.

## Implementation

Implementation details.

### Props

- `propName` (`type`, `defaultVal`, [required]): Description

#### propName

> Only when the prop is complex.

### Events

- `eventName(param: ParamType)`: Description

#### eventName

> Only when the event is complex.

### Models

- `modelValue`: Type, default, description

#### model name

> Only when the model binding is complex.

### Slots

- `default`: Description
- `header`: Description

#### slot name

> Only when the slot is complex.

### Methods

- `methodName(param: ParamType): ReturnType {}`: Description

#### methodName

> Only when the method is complex.

### Watches

- `props.propName`: Describe callback behavior
- `refValue`: Describe callback behavior

#### watch target

> Only when the watch target is complex.

## Other

Notes
```
