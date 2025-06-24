export default {
    editor: {
        label: { fr: 'Range Input', en: 'Range Input' },
        customStylePropertiesOrder: ['isTooltip', 'globalStyle'],
        customSettingsPropertiesOrder: ['required', 'value', 'min', 'max', 'step', 'debounce', 'debounceDelay'],
    },
    triggerEvents: [
        { name: 'change', label: { en: 'On change' }, event: { value: '' }, default: true },
        { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
    ],
    properties: {
        value: {
            label: {
                en: 'Init value',
            },
            type: 'Number',
            options: content => ({ min: content.min, max: content.max, noRange: true }),
            section: 'settings',
            bindable: true,
            defaultValue: 0,
        },
        required: {
            label: { en: 'Required', fr: 'Requis' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: true,
            bindable: true,
        },
        min: {
            label: { en: 'Min range', fr: 'Min range' },
            type: 'Number',
            section: 'settings',
            options: { min: 0, max: 1000, noRange: true },
            defaultValue: 0,
            bindable: true,
        },
        max: {
            label: { en: 'Max range', fr: 'Max range' },
            type: 'Number',
            section: 'settings',
            options: { min: 1, max: 1000, noRange: true },
            defaultValue: 100,
            bindable: true,
        },
        step: {
            label: { en: 'Step', fr: 'Step' },
            type: 'Number',
            section: 'settings',
            options: { min: 1, max: 100, noRange: true },
            defaultValue: 1,
            bindable: true,
        },
        debounce: {
            label: { en: 'Debounce' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: true,
        },
        debounceDelay: {
            type: 'Length',
            label: {
                en: 'Delay',
            },
            options: {
                unitChoices: [{ value: 'ms', label: 'ms', min: 1, max: 5000 }],
            },
            section: 'settings',
            defaultValue: '500ms',
            responsive: true,
            hidden: content => !content.debounce,
        },
        isTooltip: {
            label: { en: 'Tooltip', fr: 'Tooltip' },
            type: 'OnOff',
            defaultValue: true,
        },
        globalStyle: {
            type: 'Object',
            options: {
                item: {
                    fontSize: {
                        type: 'Length',
                        label: { en: 'Font size', fr: 'Taille du texte' },
                        options: {
                            unitChoices: [
                                { value: 'px', label: 'px', min: 10, max: 50 },
                                { value: 'em', label: 'em', min: 1, max: 50 },
                                { value: 'rem', label: 'rem', min: 1, max: 50 },
                            ],
                        },
                        hidden: ({ isTooltip }) => !isTooltip,
                    },
                    fontFamily: {
                        type: 'FontFamily',
                        label: { en: 'Font family', fr: 'Font' },
                        hidden: ({ isTooltip }) => !isTooltip,
                    },
                    useActiveRangeBackground: {
                        type: 'OnOff',
                        label: 'Use an active range background color',
                        default: false,
                    },
                    rangeBackgroundColor: {
                        label: { en: 'Range background', fr: 'Range background' },
                        type: 'Color',
                        bindable: true,
                    },
                    activeRangeBackgroundColor: {
                        label: { en: 'Active range background' },
                        type: 'Color',
                        hidden: content => !content.globalStyle.useActiveRangeBackground,
                        bindable: true,
                    },
                    selectorBorderColor: {
                        label: { en: 'Selector border', fr: 'Selector border' },
                        type: 'Color',
                        bindable: true,
                    },
                    selectorBackgroundColor: {
                        label: { en: 'Selector background', fr: 'Selector background' },
                        type: 'Color',
                        bindable: true,
                    },
                    tooltipBackground: {
                        label: { en: 'Tooltip background', fr: 'Tooltip background' },
                        type: 'Color',
                        hidden: ({ isTooltip }) => !isTooltip,
                    },
                    tooltipTextColor: {
                        label: { en: 'Tooltip text', fr: 'Tooltip texte' },
                        type: 'Color',
                        hidden: ({ isTooltip }) => !isTooltip,
                    },
                },
            },
            responsive: true,
            states: true,
            classes: true,
            defaultValue: {
                fontSize: '15px',
                fontFamily: '',
                activeRangeBackgroundColor: null,
                rangeBackgroundColor: 'rgb(9, 154, 242)',
                selectorBorderColor: '#1565C0',
                selectorBackgroundColor: 'rgb(9, 154, 242)',
                tooltipBackground: 'rgb(9, 154, 242)',
                tooltipTextColor: '#FFFFFF',
            },
        },
    },
};
