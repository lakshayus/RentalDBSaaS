---
name: ww-icon
description: Renders a customizable icon with adjustable color, and type, linkable to URL/action for interactive functionality.
keywords: icon rendering, customizable size, customizable color, icon type, linkable icon, responsive properties, state bindings, url redirection, action trigger, icon class name
---

#### ww-icon

***Purpose:***
Renders an icon element with customizable size, color, and icon type. Can be linked to URL or action.
When put inside a ww-button, do not forget to ad the proper margin to the left or right.

***Features:***
- Linkable for URL redirection or action triggers
- Responsive size and color values with states support
- Icon property supports state bindings
- When the icon is the child of a button, do not forget to add the proper margin
- Icon property must match an available iconSet in the current project

***Properties:***
- color: string - Color of icon (name, hex, RGB/RGBA). (Mandatory)
- icon: string - iconSet/name. Default: "phosphor-regular/heart" (Mandatory)

***Notes:***
- Use `width` and `height (default is auto)` in styles to set the size of the icon. fontSize is not available.
- `width` is the size of the container of the icon, not the icon itself. You can then add paddings if needed but it will reduce the visual size of the icon. Example: if `width` is 50px and padding is 10px (on all sides), the visual icon size will be 30px.
- If you use the phosphor-bold library (when available), make sure that the icons names end with -bold (ex: phosphor-bold/plus-bold)
- If you use the phosphor-fill library (when available), make sure that the icons names end with -fill (ex: phosphor-fill/plus-fill)
- *** IMPORTANT ***: The `color` property are in the `props` key of the element, not in the `styles` key.

<example>
  Icon with different color and backgroundColor on hover:
  {"uid":"hover_icon","tag":"ww-icon","name":"Hover Icon","props":{"default":{"color":"red", ...},"_wwHover_default":{"color":"blue"},"_wwHover_mobile":{"color":"blue"}},"styles":{"default":{"backgroundColor":"yellow", "width":"24px", "height":"auto",...},"_wwHover_default":{"backgroundColor":"green"}}}
</example>
