<template>
    <slot />
</template>

<script>
import InputSelectOptionsList from './wwElement_OptionsList.vue';
import InputSelectSearch from './wwElement_Search.vue';
import { computed, watch, inject } from 'vue';

export default {
    components: {
        'ww-element-options-list': InputSelectOptionsList,
        'ww-element-search': InputSelectSearch,
    },
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    setup(props) {
        const updateDropdownConfig = inject('_wwSelect:updateDropdownConfig', () => {});

        const dropdownConfig = computed(() => ({
            side: props.content.side,
            align: props.content.align,
            offsetX: props.content.offsetX,
            offsetY: props.content.offsetY,
            autoPosition: props.content.autoPosition,
            boundOffset: props.content.boundOffset,
        }));

        watch(
            dropdownConfig,
            () => {
                updateDropdownConfig(dropdownConfig.value);
            },
            { immediate: true, deep: true }
        );

        return {
            dropdownConfig,
        };
    },
};
</script>
