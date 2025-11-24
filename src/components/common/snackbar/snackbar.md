# Snackbar Component

A simple snackbar component for displaying notifications or action prompts.

## Usage

```vue
<Snackbar
  :title="'Your message here'"
  @click="handleClick"
/>
```

## Props

- `title`: String (required) - The text to display in the snackbar

## Events

- `click`: Emitted when the snackbar is clicked
