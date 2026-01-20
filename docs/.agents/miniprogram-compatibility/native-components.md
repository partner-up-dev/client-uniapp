# UniApp Native component compatibility guide

This project mainly targets miniprogram platform, which has differences from Web platform;
the components (HTML tags) comes to the first.

## Mapping rules

- `<div>` -> `<view>`
- `<span>`, `<i>`, `<b>`, `<strong>` -> `<text>` for inline, `<view>` for block
- `<img>` -> `<image>` (always set mode)
- `<a>` -> `<navigator>` (use url, not href)
- `<input>` and `<textarea>` keep the same tag name but use UniApp attributes
- `<picker>` should be used for select-like input

## Layout and sizing

- Use flexbox for layout. Avoid floats and absolute positioning unless unavoidable.

## Scrollable content

- Use `<scroll-view>` instead of overflow scrolling on view.
- Set `scroll-y` or `scroll-x` explicitly.
- Ensure the scroll-view has a fixed height or a flex growth rule.
- Use scrolltolower events for infinite loading.

## Swiper usage

- Use swiper with swiper-item children only.
- Set common properties deliberately, such as indicator dots, autoplay, and circular.
- Images inside swiper should fill the item and include a mode value.

## Text usage

- Only text inside text components can be selected on mobile.
- Use nested text for inline styling instead of spans.

## Images

- Always set image mode. Common choices are widthFix, aspectFill, or aspectFit.
- Set explicit width rules to avoid default sizing behavior.
- Enable lazy loading for long lists where possible.

## Buttons and inputs

- Use button for native behaviors like login and form submission.
- Use view as a custom button only when no native behavior is required.
- Use v-model for input binding.
- Use placeholder-style or placeholder-class for placeholder styling.
