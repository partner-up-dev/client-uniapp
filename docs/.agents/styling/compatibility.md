# Compatibility

## Mini-Program Compatibility

**When to use:** Always when developing for mini-program platforms (Weixin, Alipay, etc.) to ensure styles render correctly.

**Why:** Mini-programs have stricter CSS support compared to web browsers, so following these rules prevents styling issues and ensures consistent appearance across platforms.

### Selector Limitations

- Cannot use `*` selector
- Only supports class selectors
- `page` is equivalent to `body` node
- `:root` can only be written in `App.vue`

### Special Element Selector Limitations

Some elements in mini-programs cannot have their styles modified directly using tag names as selectors, such as `<textarea>`, `<input>`, `<scroll-view>`, etc. Use `::after` or `::pseudo:after` pseudo-elements to override styles.

## Best Practices

**When to use:** Always when writing styles to maintain consistency, performance, and maintainability.

**Why:** These practices ensure the codebase follows the design system, avoids common pitfalls, and makes styles easier to maintain and update.

- Use Design Tokens
  - In SCSS, design tokens are auto-injected via Vite config, use `sys-var()` function and `pu-font`, `pu-elevation`, `pu-icon` mixins directly
  - In templates, use UnoCSS (see `uno.config.ts` for available presets)
- Do not perform SCSS arithmetic on `sys-var()` (e.g., `sys-var(spacing, sm) + sys-var(spacing, xs)`), as it returns CSS variables. For calculations, use concrete values
- No need to consider responsive design
- Use utility functions from `utils/style` to help with styling
- Use BEM naming based on SCSS features
- Place state type selectors (e.g., `is-<state>`, `--state`) at the end to override previous styles with the same specificity
