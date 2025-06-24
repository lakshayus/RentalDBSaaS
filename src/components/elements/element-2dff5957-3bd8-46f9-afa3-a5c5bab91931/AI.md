---
name: ww-input-range
description: The ww-input-range component provides a customizable range input slider that allows users to select a value within a specified range, featuring optional tooltips to display the current value and various styling options for enhanced visual presentation.
keywords: range input, slider component, numeric value input, tooltip display, customizable styles, min-max range, step value, active range background, selector styling, tooltip styling
---

#### ww-input-range

***Purpose:***
Renders a range input for selecting a value within a specified range with optional tooltip display.

***Purpose:***
- value: number - Initial value. Default: 0
- required: boolean - If input is required. Default: true
- min: number - Minimum value (0-1000). Default: 0
- max: number - Maximum value (1-1000). Default: 100
- step: number - Step value (1-100). Default: 1
- isTooltip: boolean - Show value tooltip. Default: true
- globalStyle: object - Component styling
  => fontSize: string - Tooltip text size
  => fontFamily: string - Tooltip font
  => useActiveRangeBackground: boolean - Use different active range color. Default: false
  => rangeBackgroundColor: string - Range background. Default: "rgb(9, 154, 242)"
  => activeRangeBackgroundColor: string - Active range color. Default: null
  => selectorBorderColor: string - Selector border. Default: "#1565C0"
  => selectorBackgroundColor: string - Selector background. Default: "rgb(9, 154, 242)"
  => tooltipBackground: string - Tooltip background. Default: "rgb(9, 154, 242)"
  => tooltipTextColor: string - Tooltip text color. Default: "#FFFFFF"

***Exposed Variables:***
- value: number - Current value of the range input (path: variables['current_element_uid-number'])

***Events:***
- change: Triggered when user changes the range value. Payload: { value: number, domEvent: Event }
- initValueChange: Triggered when the initial value property changes. Payload: { value: number }
