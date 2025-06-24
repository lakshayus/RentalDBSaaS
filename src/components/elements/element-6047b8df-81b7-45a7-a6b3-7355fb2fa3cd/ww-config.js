export default {
    editor: {
        label: {
            en: 'Progress bar',
            fr: 'Progress bar',
        },
        // Some Font Awesome icons missing : https://fontawesome.com/icons/bars-progress?s=regular
        // icon: 'fontawesome/regular/bars-progress',
    },
    options: {
        displayAllowedValues: ['flex', 'inline-flex'],
    },
    triggerEvents: [{ name: 'change', label: { en: 'On change' }, event: { value: '' } }],
    properties: {
        value: {
            type: 'Number',
            label: {
                en: 'Value',
            },
            options: {
                min: 0,
                max: 100,
                step: 1,
            },
            section: 'settings',
            defaultValue: 65,
            bindable: true,
        },
        progressBarColor: {
            type: 'Color',
            label: {
                en: 'Progress bar color',
                fr: 'Couleur de la progress bar',
            },
            defaultValue: '#099AF2',
            bindable: true,
            states: true,
            responsive: true,
            classes: true,
        },
        label: {
            label: {
                en: 'Label',
                fr: 'Label',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'element', label: { en: 'Element' } },
                    { value: 'progress', label: { en: 'Progression' } },
                    { value: 'none', label: { en: 'None' } },
                ],
            },
            defaultValue: 'progress',
            states: true,
            responsive: true,
            classes: true,
        },
        progressionLabel: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-text' },
        },
    },
};
