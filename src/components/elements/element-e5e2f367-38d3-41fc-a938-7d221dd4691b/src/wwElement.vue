<template>
    <div class="chart-container" style="position: relative">
        <canvas class="chartjs-bar"></canvas>
    </div>
</template>

<script>
import {
    Chart,
    BarElement,
    BarController,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    CategoryScale,
    Legend,
    Title,
    Tooltip,
    SubTitle,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getRelativePosition } from 'chart.js/helpers';

Chart.register(
    BarElement,
    BarController,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    CategoryScale,
    Legend,
    Title,
    Tooltip,
    SubTitle
);

export default {
    props: {
        content: { type: Object, required: true },
    },
    data() {
        this.chartInstance = null;
        return this.chartInstance;
    },
    computed: {
        options() {
            const guidedOptions = {
                indexAxis: this.content.axis,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: this.content.isLegend,
                        position: this.content.legendPosition,
                        align: this.content.legendAlignement,
                        labels: {
                            usePointStyle: true,
                            color: wwLib.getStyleFromToken(this.content.legendColor) || this.content.legendColor,
                            font: { size: parseInt(this.content.legendSize) },
                        },
                    },
                },
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: {
                            color: wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor,
                            borderColor: wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor,
                        },
                        ticks: {
                            color: wwLib.getStyleFromToken(this.content.labelColor) || this.content.labelColor,
                            font: { size: parseInt(this.content.legendSize) },
                        },
                        stacked: this.content.stacked,
                    },
                    y: {
                        grid: {
                            color: wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor,
                            borderColor: wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor,
                        },
                        ticks: {
                            color: wwLib.getStyleFromToken(this.content.labelColor) || this.content.labelColor,
                            font: { size: parseInt(this.content.legendSize) },
                        },
                        stacked: this.content.stacked,
                        beginAtZero: this.content.startAtZero,
                    },
                },
            };

            const advancedOptions = typeof this.content.options === 'object' ? this.content.options : guidedOptions;
            return this.content.dataType === 'advanced' ? advancedOptions : guidedOptions;
        },
        config() {
            let labels = [];
            let datasets = [];

            if (this.content.dataType === 'guided') {
                let data = wwLib.wwUtils.getDataFromCollection(this.content.data) || [];
                data = Array.isArray(data) ? data : [];

                const yAxis = this.content.yAxis;
                let dataXField = this.content.dataXField;
                let dataXFieldProperty = this.content.dataXFieldProperty;
                let dataYField = yAxis === 'item-count' ? this.content.dataXField : this.content.dataYField;
                let dataYFieldProperty = this.content.dataYFieldProperty;
                let groupBy = this.content.groupBy;
                let groupByProperty = this.content.groupByProperty;
                let aggregate = yAxis === 'item-count' ? 'item-count' : this.content.aggregate;
                const colors = this.content.colors.map(color => wwLib.getStyleFromToken(color) || color);

                if (typeof data[0] !== 'object') {
                    data = data.map(value => ({ value }));
                    dataXField = 'value';
                    dataYFieldProperty = undefined;
                    dataYField = 'value';
                    dataXFieldProperty = undefined;
                    groupBy = undefined;
                    groupByProperty = undefined;
                    aggregate = 'item-count';
                }

                if (!groupBy) {
                    datasets = [
                        {
                            label: `${dataYField}`.split("['").pop().replace("']", ''),
                            backgroundColor: colors[0],
                            data: [],
                        },
                    ];
                    if (!data.length || !Array.isArray(_.get(data[0], dataXField))) {
                        datasets[0].data = data.map(item => ({
                            [this.content.axis]: _.get(item, dataXField),
                            [this.content.axis === 'x' ? 'y' : 'x']: this.aggregate(
                                aggregate,
                                data
                                    .filter(elem => _.get(elem, dataXField) === _.get(item, dataXField))
                                    .map(elem => _.get(elem, dataYField))
                            ),
                        }));
                    } else {
                        const arrayValues = [
                            ...new Set(
                                data
                                    .map(item => {
                                        const result = _.get(item, dataXField, []);
                                        return Array.isArray(result)
                                            ? result.map(elem => _.get(elem, dataXFieldProperty, elem))
                                            : result;
                                    })
                                    .flat()
                            ),
                        ];
                        datasets[0].data = arrayValues.map(arrayValue => ({
                            [this.content.axis]: arrayValue,
                            [this.content.axis === 'x' ? 'y' : 'x']: this.aggregate(
                                aggregate,
                                data
                                    .filter(item => {
                                        let result = _.get(item, dataXField, []);
                                        result = Array.isArray(result)
                                            ? result.map(elem => _.get(elem, dataXFieldProperty, elem))
                                            : result;
                                        return result.includes(arrayValue);
                                    })
                                    .map(item => {
                                        const result = _.get(item, dataYField, []);
                                        return Array.isArray(result)
                                            ? result.map(elem => _.get(elem, dataYFieldProperty, elem))
                                            : result;
                                    })
                            ),
                        }));
                    }
                } else {
                    const groupByValues = [
                        ...new Set(
                            data
                                .map(item => {
                                    const result = _.get(item, groupBy, []);
                                    return Array.isArray(result)
                                        ? result.map(elem => _.get(elem, groupByProperty, elem))
                                        : result;
                                })
                                .flat()
                        ),
                    ];
                    const t = [
                        ...new Set(
                            data
                                .map(item => {
                                    const result = _.get(item, dataXField, []);
                                    return Array.isArray(result)
                                        ? result.map(elem => _.get(elem, dataXFieldProperty, elem))
                                        : result;
                                })
                                .flat()
                        ),
                    ];
                    datasets = groupByValues.map((groupByValue, index) => ({
                        label: `${groupByValue}`.split("['").pop().replace("']", ''),
                        backgroundColor: colors[index % colors.length],
                        data: t.map(elem => ({
                            [this.content.axis]: elem,
                            [this.content.axis === 'x' ? 'y' : 'x']: this.aggregate(
                                aggregate,
                                data
                                    .filter(item => {
                                        const currentDataXFieldValue = _.get(item, dataXField);
                                        const currentGroupByValue = _.get(item, groupBy);
                                        return (
                                            (Array.isArray(currentDataXFieldValue)
                                                ? currentDataXFieldValue
                                                      .map(elem => _.get(elem, dataXFieldProperty, elem))
                                                      .includes(elem)
                                                : currentDataXFieldValue === elem) &&
                                            (Array.isArray(currentGroupByValue)
                                                ? currentGroupByValue
                                                      .map(elem => _.get(elem, groupByProperty, elem))
                                                      .includes(groupByValue)
                                                : currentGroupByValue === groupByValue)
                                        );
                                    })
                                    .map(item => {
                                        const result = _.get(item, dataYField);
                                        return Array.isArray(result)
                                            ? result.map(elem => _.get(elem, dataYFieldProperty, elem))
                                            : result;
                                    })
                            ),
                        })),
                    }));
                }

                // Remove duplicates based on the current axis
                for (const dataset of datasets) {
                    // Use the actual current axis for deduplication
                    const axisKey = this.content.axis; // 'x' or 'y'
                    
                    // Properly use the current axis for deduplication
                    dataset.data = dataset.data.filter(
                        (item, index) => dataset.data.findIndex(elem => item[axisKey] === elem[axisKey]) === index
                    );
                }
                
                // Empty values - Consider both axes
                if (this.content.dataXEmpty === false) {
                    for (const dataset of datasets) {
                        // Check for emptiness based on both axes, not just hardcoded x and y
                        // This ensures we retain all data points regardless of which axis is primary
                        dataset.data = dataset.data.filter(item => {
                            const hasX = item.x !== undefined && item.x !== null && item.x !== '';
                            const hasY = item.y !== undefined && item.y !== null && item.y !== '';
                            return hasX && hasY;
                        });
                    }
                }
                
                // Order by
                if (this.content.dataOrderBy !== 'default') {
                    for (const item of datasets) {
                        item.data.sort((a, b) => {
                            const field = this.content.dataOrderBy;
                            return (
                                (typeof a[field] === 'string'
                                    ? a[field].localeCompare(b[field])
                                    : a[field] - b[field]) * (this.content.dataDirection === 'DESC' ? -1 : 1)
                            );
                        });
                        item.data = item.data.map(item => ({ x: `${item.x}`, y: item.y }));
                    }
                }
                const dataAxisValues = datasets.map(dataset => dataset.data.map(elem => elem[this.content.axis])).flat();
                labels = [...new Set(dataAxisValues)];
            } else {
                if(!this.content.labels) {
                    labels = [];
                } else if(!Array.isArray(this.content.labels)) {
                    // {0: 'label1', 1: 'label2'} => ['label1', 'label2']
                    labels = Object.values(this.content.labels);
                } else {
                    labels = this.content.labels;
                }
                datasets = this.content.datasets || [];
            }

            return {
                type: 'bar',
                data: {
                    labels,
                    datasets,
                },
                options: {
                    onClick: e => {
                        const position = getRelativePosition(e, this.chartInstance);
                        const points = this.chartInstance.getElementsAtEventForMode(
                            e,
                            this.options?.interaction?.mode || 'nearest',
                            { intersect: this.options?.interaction?.intersect ?? true },
                            true
                        );

                        // Substitute the appropriate scale IDs
                        const dataX = this.chartInstance.scales.x.getValueForPixel(position.x);
                        const dataY = this.chartInstance.scales.y.getValueForPixel(position.y);
                        this.$emit('trigger-event', {
                            name: 'chart:click',
                            event: {
                                dataX,
                                dataY,
                                position,
                                points: points.map(point => ({
                                    datasetLabel: this.chartInstance.data.datasets[point.datasetIndex].label,
                                    label: this.chartInstance.data.labels[point.index],
                                    value:
                                        typeof this.chartInstance.data.datasets[point.datasetIndex].data[
                                            point.index
                                        ] === 'object'
                                            ? this.chartInstance.data.datasets[point.datasetIndex].data[point.index][
                                                  this.content.axis === 'x' ? 'y' : 'x'
                                              ]
                                            : this.chartInstance.data.datasets[point.datasetIndex].data[point.index],
                                    ...point,
                                })),
                            },
                        });
                    },
                    ...this.options,
                },
            };
        },
    },
    watch: {
        'config.data.datasets'() {
            this.chartInstance.data.datasets = this.config.data.datasets;
            if (this.chartInstance) this.chartInstance.destroy();
            this.initChart();
            this.chartInstance.update();
        },
        options: {
            deep: true,
            handler() {
                this.chartInstance.data.datasets = this.config.data.datasets;
                if (this.chartInstance) this.chartInstance.destroy();
                this.initChart();
                this.chartInstance.update();
            },
        },
        'config.data.labels'() {
            this.chartInstance.data.labels = this.config.data.labels;
            this.chartInstance.update();
        },
        'content.isLegend'() {
            this.chartInstance.options.plugins.legend.display = this.content.isLegend;
            this.chartInstance.update();
        },
        'content.legendPosition'() {
            this.chartInstance.options.plugins.legend.position = this.content.legendPosition;
            this.chartInstance.update();
        },
        'content.legendAlignement'() {
            this.chartInstance.options.plugins.legend.align = this.content.legendAlignement;
            this.chartInstance.update();
        },
        'content.legendColor'() {
            this.chartInstance.options.plugins.legend.labels.color =
                wwLib.getStyleFromToken(this.content.legendColor) || this.content.legendColor;
            this.chartInstance.update();
        },
        'content.labelColor'() {
            this.chartInstance.options.scales.x.ticks.color =
                wwLib.getStyleFromToken(this.content.labelColor) || this.content.labelColor;
            this.chartInstance.options.scales.y.ticks.color =
                wwLib.getStyleFromToken(this.content.labelColor) || this.content.labelColor;
            this.chartInstance.update();
        },
        'content.legendSize'() {
            this.chartInstance.options.plugins.legend.labels.font.size = parseInt(this.content.legendSize);
            this.chartInstance.options.scales.x.ticks.font.size = parseInt(this.content.legendSize);
            this.chartInstance.options.scales.y.ticks.font.size = parseInt(this.content.legendSize);
            this.chartInstance.update();
        },
        'content.gridColor'() {
            this.chartInstance.options.scales.x.grid.borderColor =
                wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor;
            this.chartInstance.options.scales.x.grid.color =
                wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor;
            this.chartInstance.options.scales.y.grid.borderColor =
                wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor;
            this.chartInstance.options.scales.y.grid.color =
                wwLib.getStyleFromToken(this.content.gridColor) || this.content.gridColor;
            this.chartInstance.update();
        },
        'content.axis'() {
            if (this.chartInstance) this.chartInstance.destroy();
            this.initChart();
        },
        'content.stacked'() {
            if (this.chartInstance) this.chartInstance.destroy();
            this.initChart();
        },
        'content.startAtZero'() {
            if (this.chartInstance) this.chartInstance.destroy();
            this.initChart();
        },
        'content.dataYField'() {
            // eslint-disable-next-line vue/require-explicit-emits
            this.$emit('update:content:effect', { dataYFieldProperty: null });
        },
        'content.dataYFieldProperty'() {
            const data =
                (!this.content.data || Array.isArray(this.content.data) ? this.content.data : this.content.data.data) ||
                [];
            let field = _.get(data[0], this.content.dataYField);
            const isArray = Array.isArray(field);
            if (Array.isArray(field) && field.length)
                field = _.get(field[0], this.content.dataYFieldProperty, field[0]);
            const isNumber = Number.isFinite(data[0] && this.content.dataYField && field);
            if (isNumber) {
                // eslint-disable-next-line vue/require-explicit-emits
                this.$emit('update:content:effect', { aggregate: isArray ? 'sum' : 'value' });
            }
        },
        'content.dataXField'() {
            // eslint-disable-next-line vue/require-explicit-emits
            this.$emit('update:content:effect', { dataXFieldProperty: null });
        },
        'content.groupBy'() {
            // eslint-disable-next-line vue/require-explicit-emits
            this.$emit('update:content:effect', { groupByProperty: null });
        },
    },
    mounted() {
        this.initChart();
    },
    beforeUnmount() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    },
    methods: {
        initChart() {
            try {
                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }
                const element = this.$el.querySelector('.chartjs-bar');
                if (!element) {
                    console.error('Canvas element not found');
                    return;
                }
                this.chartInstance = new Chart(element, this.config);
            } catch (error) {
                console.error('Failed to initialize chart:', error);
            }
        },
        aggregate(operator, data) {
            if (!data) return undefined;
            switch (operator) {
                case 'item-count':
                    return [data].flat().length;
                case 'distinct':
                    return [...new Set([data].flat())].length;
                case 'value':
                    return [data].flat()[0];
                case 'sum':
                    return this.sum([data].flat());
                case 'average':
                    return this.average([data].flat());
                case 'median':
                    return this.median([data].flat());
                case 'min':
                    return Math.min(...[data].flat());
                case 'max':
                    return Math.max(...[data].flat());
            }
        },
        median(arr) {
            const mid = Math.floor(arr.length / 2),
                nums = [...arr].sort((a, b) => a - b);
            return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
        },
        sum(arr) {
            return arr.reduce((a, b) => a + b, 0);
        },
        average(arr) {
            return arr.reduce((a, b) => a + b, 0) / arr.length;
        },
    },
};
</script>

<style lang="scss" scoped>
.chart-container {
    #chartjs-vertical-bar {
        width: 100% !important;
        height: 100% !important;
    }
}
</style>
