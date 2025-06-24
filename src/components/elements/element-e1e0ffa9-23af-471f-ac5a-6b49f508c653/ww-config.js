
function isDataValid(data) {
    const cData = (!data || Array.isArray(data) ? data : data.data) || null;
    return data && Array.isArray(cData);
}
function isDataArrayObject(data) {
    const cData = (!data || Array.isArray(data) ? data : data.data) || null;
    return data && Array.isArray(cData) && typeof cData[0] === 'object';
}

export default {
    editor: {
        label: 'Chart - Pie',
        icon: 'logos/chartjs',
        customStylePropertiesOrder: [
            ['displayType', 'isLegend', 'legendPosition', 'legendAlignement', 'legendSize'],
        ],
        customSettingsPropertiesOrder: [
            'dataType',
            ['labels', 'datasets', 'options'],
            'data',
            'dataError',
            ['xAxisTitle', 'dataXField', 'dataXFieldProperty', 'dataOrderBy', 'dataDirection', 'dataXEmpty'],
            ['yAxis', 'dataYField', 'dataYFieldProperty', 'aggregate'],
            ['colors'],
        ],
    },
    triggerEvents: [
        {
            name: 'chart:click',
            label: { en: 'On chart click' },
            event: {
                position: { x: 0, y: 0 },
                points: [{ label: '', value: 0, index: 0, datasetIndex: 0 }],
            },
        },
    ],
    properties: {
        displayType: {
            label: 'Display type',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'pie', label: 'Pie' },
                    { value: 'doughnut', label: 'Donut' },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: 'pie',
            hidden: content => content.dataType === 'advanced',
        },
        isLegend: {
            label: 'Legend',
            type: 'OnOff',
            bindable: true,
            responsive: true,
            states: true,
            classes: true,
            defaultValue: true,
            hidden: content => content.dataType === 'advanced',
        },
        legendPosition: {
            label: 'Position',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            classes: true,
            defaultValue: 'top',
            hidden: content => content.dataType === 'advanced' || !content.isLegend,
        },
        legendAlignement: {
            label: 'Alignment',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'start', label: 'Start' },
                    { value: 'center', label: 'Center' },
                    { value: 'end', label: 'End' },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: 'center',
            classes: true,
            hidden: content => content.dataType === 'advanced' || !content.isLegend,
        },
        legendSize: {
            label: 'Size',
            type: 'Length',
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 0, max: 50 }],
            },
            bindable: true,
            responsive: true,
            states: true,
            classes: true,
            hidden: content => content.dataType === 'advanced' || !content.isLegend,
        },
        legendColor: {
            label: 'Color',
            type: 'Color',
            options: { nullable: true },
            bindable: true,
            responsive: true,
            states: true,
            classes: true,
            hidden: content => content.dataType === 'advanced' || !content.isLegend,
        },
        dataType: {
            label: 'Mode',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'guided', label: 'Guided' },
                    { value: 'advanced', label: 'Advanced' },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: 'advanced',
        },
        labels: {
            label: 'Labels',
            type: 'Info',
            options: { text: 'Chart labels' },
            section: 'settings',
            bindable: 'list',
            responsive: true,
            states: true,
            defaultValue: ['Tatooine', 'Coruscant', 'Kashyyyk', 'Dagobah'],
            hidden: content => content.dataType !== 'advanced',
        },
        datasets: {
            label: 'Datasets',
            type: 'Info',
            options: { text: 'Chart Datasets' },
            section: 'settings',
            bindable: 'list',
            responsive: true,
            states: true,
            defaultValue: [
                {
                    label: 'Millenium Falcon',
                    backgroundColor: ['#055B90', '#69C3FA', '#099AF2', '#E2F3FE'],
                    data: [100.0, 5.0, 70.0, 20.0],
                },
            ],
            hidden: content => content.dataType !== 'advanced',
        },
        options: {
            label: 'Options',
            type: 'Info',
            options: {
                text: 'Chart options',
            },
            section: 'settings',
            bindable: 'list',
            responsive: true,
            states: true,
            defaultValue: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'left',
                        align: 'start',
                        labels: {
                            usePointStyle: true,
                            color: 'black',
                            font: { size: 12 },
                        },
                    },
                },
                responsive: true,
            },
            hidden: content => content.dataType !== 'advanced',
        },
        data: {
            label: 'Data',
            type: 'Info',
            options: {
                text: 'Bind collection data',
            },
            section: 'settings',
            bindable: 'list',
            responsive: true,
            states: true,
            defaultValue: null,
            hidden: content => content.dataType !== 'guided',
        },
        dataError: {
            type: 'Info',
            options: { text: '⚠️ Invalid value. Data must be an array (or a collection).' },
            section: 'settings',
            hidden: content => !(content.dataType === 'guided' && content.data && !isDataValid(content.data)),
        },
        xAxisTitle: {
            label: 'Categories field',
            section: 'settings',
            bindable: true,
            responsive: true,
            states: true,
            hidden: content =>
                !(content.dataType === 'guided' && isDataValid(content.data) && isDataArrayObject(content.data)),
        },
        dataXField: {
            label: 'Field',
            type: 'ObjectPropertyPath',
            options: content => {
                const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
                if (!Array.isArray(data) || !data[0]) return null;
                return { object: data[0] };
            },
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: null,
            hidden: content =>
                !(content.dataType === 'guided' && isDataValid(content.data) && isDataArrayObject(content.data)),
        },
        dataXFieldProperty: {
            label: 'Field property',
            type: 'ObjectPropertyPath',
            options: content => {
                const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
                if (!Array.isArray(data) || !data.length) return true;
                const field = _.get(data[0], content.dataXField);
                return !Array.isArray(field) || !field.length ? null : { object: field[0] };
            },
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: null,
            section: 'settings',
            hidden: content => {
                const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || null;
                if (!Array.isArray(data) || !data[0]) return true;
                const field = _.get(data[0], content.dataXField);
                return !(
                    content.dataType === 'guided' &&
                    isDataValid(content.data) &&
                    isDataArrayObject(content.data) &&
                    Array.isArray(field) &&
                    field.length &&
                    typeof field[0] === 'object'
                );
            },
        },
        dataOrderBy: {
            label: 'Order by',
            type: 'TextRadioGroup',
            options: {
                choices: [
                    { value: 'default', label: 'Default' },
                    { value: 'x', label: 'X' },
                    { value: 'y', label: 'Y' },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: 'default',
            hidden: content => !(content.dataType === 'guided' && isDataValid(content.data)),
        },
        dataDirection: {
            type: 'TextRadioGroup',
            options: {
                choices: [
                    { value: 'ASC', label: 'Ascending' },
                    { value: 'DESC', label: 'Descending' },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: 'ASC',
            hidden: content =>
                !(content.dataType === 'guided' && content.dataOrderBy !== 'default' && isDataValid(content.data)),
        },
        dataXEmpty: {
            label: 'Include empty values',
            type: 'OnOff',
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: false,
            hidden: content => !(content.dataType === 'guided' && isDataValid(content.data)),
        },
        yAxis: {
            label: 'Values',
            type: 'BigIconRadioGroup',
            options: {
                choices: [
                    { icon: 'sum', value: 'item-count', label: 'Item count' },
                    { icon: 'field-sumary', value: 'field-summary', label: 'Field summary' },
                ],
            },
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: 'item-count',
            hidden: content =>
                !(content.dataType === 'guided' && isDataValid(content.data) && isDataArrayObject(content.data)),
        },
        dataYField: {
            label: 'Field',
            type: 'ObjectPropertyPath',
            options: content => {
                const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
                if (!Array.isArray(data) || !data[0]) return null;
                return { object: data[0] };
            },
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: null,
            hidden: content =>
                !(
                    content.dataType === 'guided' &&
                    content.yAxis === 'field-summary' &&
                    isDataValid(content.data) &&
                    isDataArrayObject(content.data)
                ),
        },
        dataYFieldProperty: {
            label: 'Field property',
            type: 'ObjectPropertyPath',
            options: content => {
                const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
                if (!Array.isArray(data) || !data.length) return true;
                const field = _.get(data[0], content.dataYField);
                return !Array.isArray(field) || !field.length ? null : { object: field[0] };
            },
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: null,
            section: 'settings',
            hidden: content => {
                const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || null;
                if (!Array.isArray(data) || !data.length) return true;
                const field = _.get(data[0], content.dataYField);
                return !(
                    content.dataType === 'guided' &&
                    content.yAxis === 'field-summary' &&
                    isDataValid(content.data) &&
                    isDataArrayObject(content.data) &&
                    Array.isArray(field) &&
                    field.length &&
                    typeof field[0] === 'object'
                );
            },
        },
        aggregate: {
            label: 'Aggregate',
            type: 'TextSelect',
            options: content => {
                const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
                let field = _.get(data[0], content.dataYField);
                const isArray = Array.isArray(field);
                if (Array.isArray(field) && field.length) field = _.get(field[0], content.dataYFieldProperty, field[0]);
                const isNumber = Number.isFinite(data[0] && content.dataYField && field);
                return {
                    placeholder: 'Select',
                    options: [
                        { value: 'distinct', label: 'Distinct' },
                        isNumber && !isArray ? { value: 'value', label: 'Value' } : null,
                        isNumber ? { value: 'sum', label: 'Sum' } : null,
                        isNumber ? { value: 'average', label: 'Average' } : null,
                        isNumber ? { value: 'median', label: 'Median' } : null,
                        isNumber ? { value: 'min', label: 'Min' } : null,
                        isNumber ? { value: 'max', label: 'Max' } : null,
                    ].filter(Boolean),
                };
            },
            bindable: true,
            responsive: true,
            states: true,
            section: 'settings',
            defaultValue: 'distinct',
            hidden: content =>
                !(
                    content.dataType === 'guided' &&
                    content.yAxis === 'field-summary' &&
                    isDataValid(content.data) &&
                    isDataArrayObject(content.data)
                ),
        },
        colors: {
            label: 'Colors',
            type: 'Array',
            section: 'settings',
            options: {
                expandable: true,
                item: {
                    type: 'Color',
                },
                getItemLabel(_, index) {
                    return `Color ${index + 1}`;
                },
            },
            defaultValue: [],
            bindable: true,
            responsive: true,
            states: true,
            hidden: content => !(content.dataType === 'guided' && isDataValid(content.data)),
        },
    },
};
