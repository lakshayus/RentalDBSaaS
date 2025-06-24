---
name: chartjs-bar
description: Renders a Chart.js bar chart with guided and advanced data input modes, supporting legend display, axis orientation, data stacking, and styling properties.
keywords: [chart.js, bar chart, guided mode, advanced mode, data visualization, legend position, axis orientation, stacked bars, data aggregation, responsive design]
---

#### chartjs-bar

***Purpose:***
Renders a bar chart using Chart.js library.

***Properties:***
- isLegend: boolean - Display legend. Default: true
- legendPosition: 'top' | 'bottom' | 'left' | 'right' - Legend position. Default: 'top'
- legendAlignement: 'start' | 'center' | 'end' - Legend alignment. Default: 'center'
- legendSize: string - Legend label font size. Default: "12px"
- legendColor: string | null - Legend label color. Default: null
- labelColor: string | null - Axis label color. Default: null
- gridColor: string | null - Grid line color. Default: null
- axis: 'x' | 'y' - Bar orientation. Default: 'x'
- stacked: boolean - Stack bars. Default: false
- startAtZero: boolean - Start y-axis at zero. Default: true
- dataType: string - Data input mode. ALWAYS SET 'advanced'
- labels: binded<string[]> - X-axis labels
- datasets: binded<object[]> - Chart datasets
- options: binded<object> - Additional chart options

***Events:***
- chart:click: Triggered when clicking on the chart. Payload: { dataX: any, dataY: any, position: { x: number, y: number }, points: [{ label: string, value: number, index: number, datasetIndex: number }] }

***Notes:***
- ALWAYS MAKE IT RESPONSIVE: Set these options: responsive: true and maintainAspectRatio: false, PLUS, set min-width: 0px to direct parent container.

***Example:***

<elements>
{"uid":"chartjs-vehicle","tag":"chartjs-bar","name":"Vehicle Distribution Chart","props":{"default":{"axis":"x","yAxis":"item-count","labels":{"js":"return Object.keys(variables['__VAR_1__'])"},"options":{"js":"return {responsive:true,maintainAspectRatio:false,plugins:{title:{display:false}},scales:{y:{grid:{display:true,color:'#e2e8f0'},ticks:{font:{size:12}}},x:{grid:{display:false},ticks:{font:{size:12}}}}}"},"stacked":false,"dataType":"advanced","datasets":{"js":"return [{label:'Number of Vehicles',data:Object.values(variables['__VAR_2__']),backgroundColor:['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'],borderWidth:1,borderRadius:6}]"},"isLegend":false,"aggregate":"distinct","dataXEmpty":false,"legendSize":"12px","dataOrderBy":"default","startAtZero":true,"dataDirection":"ASC","legendPosition":"top","legendAlignement":"center"}},"styles":{"default":{"flex":"1","minHeight":"300px"}}}
</elements>
