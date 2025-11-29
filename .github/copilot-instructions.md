# PartnerUp Uniapp

This repo is UniApp client of PartnerUp.
PartnerUp is a social-driven lifestyle e-commerce service platform.

Has following domains:

- base: shared
- partner_request: find partners
- communication: chat, message, notification
- account: auth, user

## File Structure

```txt
src/ 
├── business/  # Split by domain
├── components/  # Split by domain
├── composables/ 
├── pages/  # Split by domain
│   └── test/  # Page for tests use
├── store/  # Split by domain
├── utils/ 
├── styles/  # Design tokens, sass mixins, unocss presets
├── locale/  # Split by `language/domain`
├── static/ 
├── data/  # Avoid magic values
├── pages.json  # Page registration
├── manifest.json  # App configuration
tests/  # Test cases
docs
```

## Tech Stacks

- Package Manager: pnpm
- Development Framework: UniApp (Mini Program platform only) + Vue 3 (Composition API)
  - UniApp Types: [UniTyped](https://uni-helper.js.org/uni-typed)
- State Management: Pinia 
  - `pinia-plugin-unistorage` for persistence in localStorage
- Style Management: SCSS, UnoCSS
- Data Modeling: Valibot
- Network Requests: uni-network
- Date Handling: day.js
- Tests: Vitest

## Code Conventions

- Refer to `.github/instructions/coding.instructions.md`
- No need to run type-check or build

### TypeScript

Refer to `.github/instructions/typescript.instructions.md`

### Naming Conventions

- 组件: PascalCase (file), kebab-case (name)
- 常量：UPPER_SNAKE_CASE
- 函数/方法: camelCase
