---
name: ww-progress-bar
description: Displays a customizable progress bar with adjustable color and value, featuring an optional label that can be positioned inside the bar or as a separate element.
keywords: progress bar, customizable color, progress value, label display, gradient support, ww-text, progression label, component properties, default settings, children components
---

#### ww-progress-bar

***Purpose:***
Renders a progress bar with customizable color and value, with optional label positioning.

***Properties:***
- value: number - Current progress value (0-100). Default: 65
- progressBarColor: string | null - Progress bar color, supports gradients. Default: "#099AF2"
- label: 'element' | 'progress' | 'none' - Label display mode. Default: "progress"

***Slots:***
- progressionLabel: ww-text - Label component for progress display. Set zIndex: 1 in progressionLabel element to ensure it is above the progressbar.

***Events:***
- change: { value: number } - Triggered when the progress value changes

***Exposed Variables:***
- value: number - Current progress value, defaults to content.value or 0. variables['current_element_uid-value']
