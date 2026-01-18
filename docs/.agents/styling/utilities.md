# Utilities

## UnoCSS Utilities

Prefer UnoCSS for utility styles in templates:

```vue
<view class="flex items-center justify-between p-4 bg-surface rounded-lg">
  <text class="text-lg font-medium text-on-surface">Title</text>
</view>
```

UnoCSS is configured in `uno.config.ts` with design system presets.

## Safe Area Handling

Handle device safe areas (notches, rounded corners, etc.):

**SafeAreaInset component** (`src/components/common/safeAreaInset.vue`):

```vue
<SafeAreaInset top>
  <!-- Content with top safe area padding -->
</SafeAreaInset>
```

**SafeArea component** (`src/components/common/safeArea.vue`):

```vue
<SafeArea>
  <!-- Weixin menu button safe area -->
</SafeArea>
```
