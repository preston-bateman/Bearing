# Design Tokens

Shared visual tokens for the mobile app live in `tokens.ts`.

The module is split into small buckets so feature screens can reuse the same language without introducing a heavyweight theme system:

- `colors` for semantic surfaces and text
- `spacing` for layout rhythm
- `radii` for corner treatment
- `typography` for titles, body copy, and labels
- `layout` for shell measurements such as tab bar height and page padding
- `componentTokens` for recurring UI pieces like buttons, cards, and tab icons

Use these tokens when adding new screens or primitives so the design stays consistent as the app grows.
