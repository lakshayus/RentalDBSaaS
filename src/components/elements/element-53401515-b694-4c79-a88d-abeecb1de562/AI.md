---
name: ww-expand
description: Accordion-style interface element that toggles content visibility with a button or clickable area, featuring transition animations and customizable layouts for both collapsed and expanded states.
keywords: accordion component, expand collapse, toggle button, transition animations, content area, initial value, toggle layout, active toggle layout, content layout, editor mode
---

#### ww-expand

***Purpose:***
Accordion-style component that hides/reveals content via expand/collapse state with toggle button and animated transitions.

***Properties:***
- value: boolean - Initial expand/collapse state. Default: false.

***Slots:***
- toggleLayout: any[] - Components for toggle container area when expanded
- activeToggleLayout: any[] - Components for toggle container area closed expanded (requires all styles from toggleLayout)
- contentLayout: any[] - Components for content area

***Exposed Variables:***
- value: boolean - Current expand state of the component (Path: variables['current_element_uid-value'])

***Notes:***
All 3 slots are required.
Be careful : toggleLayout is for EXPANDED toggle container and activeToggleLayout is for CLOSED toggle container.
***IMPORTANT***: The logic to expand and colapse on click is already managed in the code of the ww-expand element. Do not add click events or functions to manage it.
