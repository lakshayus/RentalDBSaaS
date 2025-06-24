<template>
    <div class="ww-input-select__trigger">
        <!-- SINGLE SELECT -->
        <div v-if="isSingleSelect" :style="triggerStyle">
            <span v-if="isOptionSelected" :style="selectedValueStyle">{{ selectedLabel }}</span>
            <span v-else :style="placeholderStyle">{{ data.placeholder }}</span>
            <div v-html="chipIcon" :style="triggerIconStyle" aria-hidden="true"></div>
        </div>
        <!-- MULTI SELECT -->
        <div v-else :style="triggerStyle">
            <div v-if="isOptionSelected" class="ww-input-select__chip_container">
                <div
                    class="ww-input-select__chip"
                    v-for="option in localContext?.data?.select?.active?.details"
                    :key="option.value"
                    @click="e => handleChipClick(e, option.value)"
                    :style="chipStyle"
                >
                    <span>{{ option.label }}</span>
                    <div v-html="chipIconUnselect" :style="chipIconStyle" aria-hidden="true"></div>
                </div>
            </div>
            <span v-else :style="placeholderStyle">{{ data.placeholder }}</span>
            <div v-html="chipIcon" :style="triggerIconStyle" aria-hidden="true"></div>
        </div>
        <!-- <wwElement class="ww-select-trigger" v-bind="content.triggerContainer" /> -->
    </div>
</template>

<script>
import { computed, inject, ref, watch } from 'vue';

const CLOSE_CHIP_PLACEHOLDER =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>';
const OPEN_CHIP_PLACEHOLDER =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>';
const UNSELECT_CHIP_PLACEHOLDER =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18M6 6l12 12"/></svg>';

export default {
    props: {
        content: { type: Object, required: true },
    },
    emits: ['remove-multiselect-value'],
    setup(props, { emit }) {
        const { getIcon } = wwLib.useIcons();

        const registerTriggerLocalContext = inject('_wwSelect:registerTriggerLocalContext');
        const localContext = inject('_wwSelect:localContext');

        const isSingleSelect = computed(() => props.content.selectType === 'single');

        const placeholder = computed(() => wwLib.wwLang.getText(props.content.placeholder));
        const selectedLabel = computed(() => {
            return localContext.value?.data?.select?.active?.details?.label;
        });
        const isOptionSelected = computed(
            () =>
                !!localContext.value?.data?.select?.active?.details?.label ||
                localContext.value?.data?.select?.active?.details?.length > 0
        );
        const isOpen = computed(() => localContext.value?.data?.select?.utils?.isOpen);
        const data = ref({
            placeholder,
        });

        const markdown = `### Select Trigger local informations

- \`placeholder\`: The placeholder text for the select trigger.`;

        registerTriggerLocalContext({ data, methods: {}, markdown });

        const triggerStyle = computed(() => {
            const borderCss = !props.content.triggerBorder
                ? {
                      border: props.content.triggerBorderAll,
                  }
                : {
                      'border-top': props.content.triggerBorderTop,
                      'border-right': props.content.triggerBorderRight,
                      'border-bottom': props.content.triggerBorderBottom,
                      'border-left': props.content.triggerBorderLeft,
                  };

            return {
                padding: props.content.triggerPadding,
                margin: props.content.triggerMargin,
                'background-color': props.content.triggerBgColor,
                width: '100%',
                height: props.content.triggerHeight,
                'border-radius': props.content.triggerBorderRadius,
                'box-shadow': props.content.triggerShadows,
                cursor: 'pointer',

                display: 'flex',
                'flex-direction': 'row',
                'align-items': 'center',
                'justify-content': 'space-between',

                ...borderCss,
            };
        });

        const triggerIconStyle = computed(() => {
            return {
                width: props.content.triggerIconSize,
                color: props.content.triggerIconColor,
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'pointer-events': 'none',
            };
        });

        const selectedValueStyle = computed(() => {
            return {
                'font-size': props.content.selectedFontSize,
                'font-family': props.content.selectedFontFamily,
                color: props.content.selectedFontColor,
                'font-weight': props.content.selectedFontWeight,
                'text-align': props.content.selectedTextAlign,
                width: '100%',
            };
        });

        const placeholderStyle = computed(() => {
            return {
                'font-size': props.content.placeholderFontSize,
                'font-family': props.content.placeholderFontFamily,
                color: props.content.placeholderFontColor,
                'font-weight': props.content.placeholderFontWeight,
                'text-align': props.content.placeholderTextAlign,
                width: '100%',
            };
        });

        const chipStyle = computed(() => {
            const borderCss = !props.content.chipBorder
                ? {
                      border: props.content.chipBorderAll,
                  }
                : {
                      'border-top': props.content.chipBorderTop,
                      'border-right': props.content.chipBorderRight,
                      'border-bottom': props.content.chipBorderBottom,
                      'border-left': props.content.chipBorderLeft,
                  };

            return {
                'font-size': props.content.chipFontSize,
                'font-family': props.content.chipFontFamily,
                color: props.content.chipFontColor,
                'font-weight': props.content.chipFontWeight,
                padding: props.content.chipPadding,
                'background-color': props.content.chipBgColor,
                'border-radius': props.content.chipBorderRadius,
                ...borderCss,
            };
        });

        const chipIcon = ref(null);
        const chipIconUnselect = ref(null);

        watch(
            [isOpen, () => props.content.triggerIconOpen, () => props.content.triggerIconClose],
            async () => {
                const iconKey = isOpen.value ? 'triggerIconClose' : 'triggerIconOpen';
                const defaultIcon = isOpen.value ? CLOSE_CHIP_PLACEHOLDER : OPEN_CHIP_PLACEHOLDER;

                if (props.content[iconKey]) {
                    chipIcon.value = (await getIcon(props.content[iconKey])) || defaultIcon;
                } else {
                    chipIcon.value = defaultIcon;
                }
            },
            { immediate: true }
        );

        watch(
            () => props.content.chipIconUnselect,
            async newValue => {
                if (newValue) {
                    chipIconUnselect.value = (await getIcon(newValue)) || UNSELECT_CHIP_PLACEHOLDER;
                } else {
                    chipIconUnselect.value = UNSELECT_CHIP_PLACEHOLDER;
                }
            },
            { immediate: true }
        );

        const chipIconStyle = computed(() => {
            return {
                width: props.content.chipIconSize,
                color: props.content.chipIconColor,
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'pointer-events': 'none',
            };
        });

        const handleChipClick = (event, value) => {
            event.stopPropagation();
            emit('remove-multiselect-value', value);
        };

        return {
            isSingleSelect,
            data,
            selectedLabel,
            isOptionSelected,
            localContext,
            triggerStyle,
            triggerIconStyle,
            selectedValueStyle,
            placeholderStyle,
            chipIcon,
            chipStyle,
            chipIconStyle,
            chipIconUnselect,
            isOpen,
            handleChipClick,
        };
    },
};
</script>

<style lang="scss" scoped>
.ww-input-select__trigger {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .ww-input-select__chip_container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        width: 100%;
        flex-wrap: wrap;

        .ww-input-select__chip {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;
            cursor: pointer;
        }
    }
}

.ww-select-trigger {
    width: 100%;
}
</style>
