export default {
    inherit: {
        type: 'ww-text',
        exclude: ['text'],
    },
    editor: {
        label: { en: 'Form Input', fr: 'Entrée de Formulaire' },
        icon: 'text-input',
        customSettingsPropertiesOrder: [
            'formInfobox',
            ['fieldName', 'customValidation', 'validation'],
            'type',
            'value',
            'placeholder',
            'readonly',
            'required',
            'autocomplete',
            'debounce',
            'debounceDelay',
        ],
        customStylePropertiesOrder: [
            'placeholderColor',
            [
                'precision',
                'min',
                'max',
                'minDate',
                'maxDate',
                'step',
                'timePrecision',
                'hideArrows',
                'displayPassword',
                'rows',
                'resize',
                'currencyShowSymbol',
                'currencySymbol',
                'currencySymbolPosition',
                'currencyDecimalPlaces',
                'currencyThousandsSeparator',
                'currencyDecimalSeparator',
                'currencySymbolColor',
                'currencySymbolFontSize',
                'currencySymbolPadding',
            ],
        ],
        hint: (_, sidePanelContent) => {
            if (!sidePanelContent.parentSelection) return null;
            const { header, text, button, args } = sidePanelContent.parentSelection;
            const sections = ['style', 'settings'];
            return sections.map(section => ({
                section,
                header: header,
                text: text,
                button: {
                    text: button,
                    action: 'selectParent',
                    args,
                },
            }));
        },
    },
    states: ['focus', 'readonly'],
    actions: [{ label: 'Focus element', action: 'focusInput' }],
    triggerEvents: [
        { name: 'change', label: { en: 'On change' }, event: { value: '' }, default: true },
        { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
        { name: 'onEnterKey', label: { en: 'On enter key' }, event: { value: '' } },
        { name: 'focus', label: { en: 'On focus' }, event: null },
        { name: 'blur', label: { en: 'On blur' }, event: null },
    ],
    properties: {
        placeholderColor: {
            label: {
                en: 'Placeholder color',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            bindable: true,
            responsive: true,
            classes: true,
            states: true,
            hidden: content => content.advancedPlaceholder,
        },
        value: {
            label: {
                en: 'Init value',
            },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: '',
        },
        type: {
            label: { en: 'Input type', fr: 'Input type' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'text', label: { en: 'Short answer', fr: 'Texte' } },
                    { value: 'textarea', label: { en: 'Long answer', fr: 'Texte' } },
                    { value: 'email', label: { en: 'Email', fr: 'Email' } },
                    { value: 'search', label: { en: 'Search', fr: 'Recherche' } },
                    { value: 'password', label: { en: 'Password', fr: 'Mot de passe' } },
                    { value: 'number', label: { en: 'Number', fr: 'Nombre' } },
                    { value: 'decimal', label: { en: 'Decimal', fr: 'Decimal' } },
                    { value: 'date', label: { en: 'Date', fr: 'Date' } },
                    { value: 'time', label: { en: 'Time', fr: 'Heure' } },
                    { value: 'tel', label: { en: 'Phone', fr: 'Téléphone' } },
                    { value: 'color', label: { en: 'Color', fr: 'Couleur' } },
                    { value: 'currency', label: { en: 'Currency', fr: 'Devise' } },
                ],
            },
            defaultValue: 'text',
        },
        displayPassword: {
            label: {
                en: 'Display password',
            },
            type: 'OnOff',
            bindable: true,
            defaultValue: false,
            classes: true,
            hidden: content => content.type !== 'password',
        },
        readonly: {
            label: { en: 'Read only', fr: 'Lecture seule' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
            hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.readonly !== undefined),
        },
        required: {
            label: { en: 'Required', fr: 'Requis' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: true,
            bindable: true,
        },
        precision: {
            label: { en: 'Precision', fr: 'Precision' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: '0.1', label: { en: '1.0' } },
                    { value: '0.01', label: { en: '1.00' } },
                    { value: '0.001', label: { en: '1.000' } },
                    { value: '0.0001', label: { en: '1.0000' } },
                    { value: '0.00001', label: { en: '1.00000' } },
                    { value: '0.000001', label: { en: '1.000000' } },
                    { value: '0.0000001', label: { en: '1.0000000' } },
                    { value: '0.00000001', label: { en: '1.00000000' } },
                ],
            },
            hidden: content => content.type !== 'decimal',
            defaultValue: '0.1',
        },
        step: {
            label: { en: 'Step', fr: 'Step' },
            type: 'Number',
            options: content =>
                content.type === 'decimal'
                    ? { min: 0, max: 10 * parseFloat(content.precision), step: parseFloat(content.precision) }
                    : { min: 1, max: 100, step: 1 },
            defaultValue: 1,
            bindable: true,
            hidden: content => content.type !== 'decimal' && content.type !== 'number',
        },
        timePrecision: {
            label: { en: 'Time precision', fr: 'Time precision' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 3600, label: { en: 'hh' } },
                    { value: 60, label: { en: 'hh:mm' } },
                    { value: 1, label: { en: 'hh:mm:ss' } },
                    { value: 0.1, label: { en: 'hh:mm:ss.s' } },
                ],
            },
            bindable: true,
            hidden: content => content.type !== 'time',
            defaultValue: 1,
        },
        placeholder: {
            label: { en: 'Placeholder', fr: 'Placeholder' },
            type: 'Text',
            options: { placeholder: 'Type text' },
            section: 'settings',
            hidden: content => content.type === 'date' || content.type === 'time',
            multiLang: true,
            bindable: true,
            defaultValue: {},
        },
        rows: {
            label: { en: 'Rows', fr: 'Rows' },
            type: 'Number',
            options: { min: 1, max: 25 },
            hidden: content => content.type !== 'textarea',
            bindable: true,
            defaultValue: 4,
            classes: true,
        },
        resize: {
            label: { en: 'Resize', fr: 'Resize' },
            type: 'OnOff',
            hidden: content => content.type !== 'textarea',
            defaultValue: false,
            classes: true,
        },
        min: {
            label: { en: 'Min number', fr: 'Min number' },
            type: 'Number',
            options: { min: 0, max: 100 },
            hidden: content => content.type !== 'number' && content.type !== 'decimal',
            defaultValue: '0',
            bindable: true,
        },
        max: {
            label: { en: 'Max number', fr: 'Max number' },
            type: 'Number',
            options: { min: 0, max: 10000 },
            hidden: content => content.type !== 'number' && content.type !== 'decimal',
            defaultValue: '10000',
            bindable: true,
        },
        minDate: {
            label: { en: 'Min date' },
            type: 'Text',
            hidden: content => content.type !== 'date',
            defaultValue: '',
            bindable: true,
        },
        maxDate: {
            label: { en: 'Max date' },
            type: 'Text',
            hidden: content => content.type !== 'date',
            defaultValue: '',
            bindable: true,
        },
        hideArrows: {
            label: { en: 'Hide arrows', fr: 'Masquer les flèches' },
            type: 'OnOff',
            hidden: content => content.type !== 'number' && content.type !== 'decimal',
            defaultValue: false,
            classes: true,
        },
        debounce: {
            label: { en: 'Debounce' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
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
        autocomplete: {
            label: { en: 'Autocomplete', fr: 'Autocomplétion' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            bindable: true,
        },
        fieldName: {
            label: 'Field name',
            section: 'settings',
            type: 'Text',
            defaultValue: '',
            bindable: true,
            hidden: (_, sidePanelContent) => {
                return !sidePanelContent.form?.uid;
            },
        },
        customValidation: {
            label: 'Custom validation',
            section: 'settings',
            type: 'OnOff',
            defaultValue: false,
            bindable: true,
            hidden: (_, sidePanelContent) => {
                return !sidePanelContent.form?.uid;
            },
        },
        validation: {
            label: 'Validation',
            section: 'settings',
            type: 'Formula',
            defaultValue: '',
            bindable: true,
            hidden: (content, sidePanelContent) => {
                return !sidePanelContent.form?.uid || !content.customValidation;
            },
        },
        // Currency type
        currencyShowSymbol: {
            label: {
                en: 'Show currency symbol',
            },
            type: 'OnOff',
            bindable: true,
            defaultValue: true,
            hidden: content => content.type !== 'currency',
        },
        currencySymbol: {
            label: {
                en: 'Currency symbol',
            },
            type: 'Text',
            bindable: true,
            defaultValue: '$',
            hidden: content => !content.currencyShowSymbol || content.type !== 'currency',
        },
        currencySymbolPosition: {
            label: {
                en: 'Symbol position',
            },
            type: 'TextRadioGroup',
            bindable: true,
            defaultValue: 'prefix',
            options: {
                choices: [
                    { value: 'prefix', title: 'Before', icon: 'align-left' },
                    { value: 'suffix', title: 'After', icon: 'align-right' },
                ],
            },
            hidden: content => !content.currencyShowSymbol || content.type !== 'currency',
        },
        currencyDecimalPlaces: {
            label: {
                en: 'Decimal places',
            },
            type: 'Number',
            bindable: true,
            defaultValue: 2,
            options: {
                min: 0,
                max: 10,
                step: 1,
            },
            hidden: content => content.type !== 'currency',
        },
        currencyThousandsSeparator: {
            label: {
                en: 'Thousands separator',
            },
            type: 'TextSelect',
            bindable: true,
            defaultValue: ',',
            options: {
                options: [
                    { value: ',', label: 'Comma (,)' },
                    { value: '.', label: 'Dot (.)' },
                    { value: ' ', label: 'Space ( )' },
                    { value: "'", label: "Apostrophe (')" },
                    { value: '', label: 'None' },
                ],
            },
            hidden: content => content.type !== 'currency',
        },
        currencyDecimalSeparator: {
            label: {
                en: 'Decimal separator',
            },
            type: 'TextSelect',
            bindable: true,
            defaultValue: '.',
            options: {
                options: [
                    { value: '.', label: 'Dot (.)' },
                    { value: ',', label: 'Comma (,)' },
                ],
            },
            hidden: content => content.type !== 'currency',
        },
        currencySymbolColor: {
            label: {
                en: 'Symbol color',
            },
            type: 'Color',
            classes: true,
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: '#666666',
            hidden: content => content.type !== 'currency',
        },
        currencySymbolFontSize: {
            label: {
                en: 'Symbol font size',
            },
            type: 'Length',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 0, max: 100 },
                    { value: 'em', label: 'em', min: 0, max: 10 },
                    { value: '%', label: '%', min: 0, max: 100 },
                ],
            },
            classes: true,
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: '1em',
            responsive: true,
            hidden: content => content.type !== 'currency',
        },
        currencySymbolPadding: {
            label: {
                en: 'Symbol padding',
            },
            type: 'Length',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 0, max: 100 },
                    { value: 'em', label: 'em', min: 0, max: 10 },
                    { value: '%', label: '%', min: 0, max: 100 },
                ],
            },
            classes: true,
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: '4px',
            responsive: true,
            hidden: content => content.type !== 'currency',
        },
    },
};
