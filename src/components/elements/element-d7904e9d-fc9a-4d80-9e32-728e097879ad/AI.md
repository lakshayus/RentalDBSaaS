---
name: ww-text
description: HTML text component with multi-language support
keywords:
  - text
  - multilang
  - html
  - paragraph
  - heading
---

#### ww-text
Props:
- text: object - Text content. An object can be used for multi-language support (e.g., `{ "en": "Hello", "fr": "Bonjour" }`). `text` itself is not bindable but each lang inside are, ex: `"text": { "en": {"js":"return ..."}, "fr": {"js":"return ..."} }`
- tag: p|h1|h2|h3|h4|button|div - HTML element type

Events: none

Variables: none

Slots: none

Note: Available languages can be found in Page Info variable.
