---
name: ww-progressbar-donut
description: The `ww-progressbar-donut` component is a customizable, donut-shaped progress bar that supports dynamic styling, color adjustments, animations, and real-time updates, utilizing the `vue-ellipse-progress` library and `ResizeObserver` API for responsive design.
keywords: donut-shaped progress bar, customizable styles, vue-ellipse-progress, resizeobserver api, dynamic updates, variable binding, change event, animation duration, fillcolor, emptycolor
---

#### ww-progressbar-donut

***Purpose:***
Renders a donut-shaped progress bar with customizable styles, colors, and animations.

***Features:***
- Uses vue-ellipse-progress library
- Responsive sizing via ResizeObserver API
- Dynamic updates through variable binding
- Change event emission on value updates

***Properties:***
- value: number - Current progress value. Default: 65
- style: 'center' | 'out' | 'out-over' | 'in' | 'in-over' - Progress bar style. Default: "center"
- offset: string - Progress line offset from center (px). Visible with "out" or "in" style
- thickness: string - Fill progress line thickness (px)
- emptyThickness: string - Empty progress line thickness (px)
- fillColor: string | null - Filled portion color
- emptyColor: string | null - Empty portion color
- animationDuration: string - Animation duration (ms)
- animationDelay: string - Animation delay (ms)

***Slots:***
- container: ww-text[] - Text array for progress value display. Ex: {"uid":"progressbar_donut","tag":"ww-progressbar-donut","slots":{"container":[{"uid":"progress_text","tag":"ww-text","props":{"default":{"text":{"en":{"js":"return variables['progressbar_donut-value'"}}}}}]}}

***Events:***
- change: Emitted when the progress value is updated. Payload: { value: number }

***Exposed Variables:***
- value: number (default: 0) - Current progress value that can be bound to external data (path: variables['current_element_uid-value'])
