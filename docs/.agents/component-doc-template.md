# Component Documentation Template

Template and best practices for writing component documentation.

## Best Practices

- **Readers are Coding Agents**; optimize for token efficiency
  - Write only what's necessary; avoid redundancy (if naming is self-explanatory, don't explain "what it is")
  - Keep language concise and clear
- Prefer structure over prose (use lists/tables where possible)
- Keep terminology consistent with the codebase and existing docs
- Document behaviors, constraints, and edge cases over implementation trivia
- Put defaults, ranges, and validation rules next to the relevant prop/event/model
- Avoid restating obvious UI; highlight user-visible states and transitions
- Link to shared concepts instead of duplicating (use `docs/` or existing component docs)
- If a section is not applicable, omit it rather than writing "N/A"

## Owner Guard

- Component docs own component-local API, props, events, slots, models, observable UI states, and local edge cases.
- Product why, business rules, and domain language belong in `docs/10-prd/`.
- Surface IDs and route addresses belong in `docs/15-alignment/ui-surface-map.md`.
- Cross-unit contracts belong in `docs/20-product-tdd/`.
- Link to those owners instead of copying their truth into component docs.

## Doc Template

```markdown
# compName

## Rationale

Component-local reason for this component. Do not restate product strategy.

## Goals

Component-local goals and observable UI contract.

## Key Concepts

Key terms used by the component. Link domain terms to `docs/10-prd/glossary.md`.

## Specification

Component-local content, UI states, behavior, and constraints.

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

## Example

See existing component docs in `src/components/` for examples.

## References

- Shared conventions: `docs/.agents/shared-conventions.md`
- Vue patterns: `docs/.agents/vue-patterns.md`
- Styling guide: `docs/.agents/styling/index.md`
