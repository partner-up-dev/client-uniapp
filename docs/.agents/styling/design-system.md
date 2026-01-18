# Design System

## Design Tokens (SCSS)

**When to use:** Always when defining colors, spacing, typography, or other design values in SCSS.

**Why:** Ensures consistent theming across the app, makes it easy to update the design system, and leverages predefined values for better maintainability.

Use SCSS design tokens for consistent theming:

```scss
// Access design tokens via sys-var()
color: sys-var('color-primary');
background: sys-var('color-surface');
padding: sys-var('spacing-md');
border-radius: sys-var('radius-sm');
```

Design tokens are defined in `src/styles/presets/design.ts` and injected via Vite config.

### sys-var() Function

Use `sys-var(category, type, ...)` function to reference system-level design tokens, which returns CSS variable references.

```scss
// Color tokens
color: sys-var(color, primary);              // -> var(--sys-color-primary)
color: sys-var(color, on-surface);           // -> var(--sys-color-on-surface)
background-color: sys-var(color, surface-container);

// Spacing tokens
padding: sys-var(spacing, sm) sys-var(spacing, med);  // 8px 16px
gap: sys-var(spacing, xs);                            // 4px

// Radius tokens
border-radius: sys-var(radius, med);         // 8px
border-radius: sys-var(radius, full);        // 50%

// Size tokens
width: sys-var(size, large);                 // 44px

// Icon size tokens
width: sys-var(icon, size, medium);          // 24px

// Opacity tokens
opacity: sys-var(opacity, disabled);         // 0.6
```

### Available Tokens

**Colors** (`sys-var(color, <name>)`):

- Primary: `primary`, `primary-container`, `on-primary`, `on-primary-container`
- Secondary: `secondary`, `secondary-container`, `on-secondary`
- Tertiary: `tertiary`, `tertiary-container`, `on-tertiary`
- Error: `error`, `error-container`, `on-error`
- Warning: `warning`, `on-warning`
- Surface: `surface`, `surface-container`, `surface-container-low`, `surface-container-highest`, `on-surface`, `on-surface-variant`
- Neutral: `neutral`, `neutral-container`, `on-neutral`
- Outline: `outline`, `outline-variant`
- Utility: `green`, `red`, `yellow`, `blue`

**Spacing** (`sys-var(spacing, <size>)`): `xs` (4px), `sm` (8px), `med` (16px), `lg` (32px)

**Radius** (`sys-var(radius, <size>)`): `none`, `xs`, `sm`, `med` (8px), `lg` (16px), `full` (50%)

**Size** (`sys-var(size, <size>)`): `xSmall` (20px), `small` (24px), `medium` (32px), `large` (44px), `xLarge` (60px)

**Icon** (`sys-var(icon, size, <size>)`): `small` (20px), `medium` (24px), `large` (40px)

**Opacity** (`sys-var(opacity, <type>)`): `disabled` (0.6), `invalid` (0.6)

## Design Mixins

**When to use:** When applying typography, shadows, or icon sizing in SCSS.

**Why:** Provides reusable, consistent implementations of common design patterns and reduces code duplication.

Use design mixins for common patterns:

```scss
// Typography
@include pu-font('title-large');
@include pu-font('body-medium');

// Elevation (shadows)
@include pu-elevation(1);  // subtle shadow
@include pu-elevation(2);  // medium shadow
@include pu-elevation(3);  // prominent shadow

// Icons
@include pu-icon(24px);    // icon sizing
@include pu-icon("medium", true);  // true adds flex layout centering
```

## Icons

- Load icons by configuring class `i-mdi-<icon-name>` on `<text>` elements
- If the class name is computed at runtime, add the icon class name to `safeListOfIcons` in `uno.config.ts`.
