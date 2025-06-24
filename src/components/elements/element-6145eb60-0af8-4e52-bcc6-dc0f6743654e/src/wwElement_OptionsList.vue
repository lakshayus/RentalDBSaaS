<template>
    <DynamicScroller
        v-if="/*virtualScroll &&*/ filteredOptions.length > 0"
        style="height: 100%"
        :items="dynamicScrollerItems"
        :min-item-size="virtualScrollMinItemSize"
        :buffer="virtualScrollBuffer"
        :key="filteredOptions.length"
    >
        <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="JSON.stringify(item)"
                :data-index="index"
            >
                <wwLayoutItemContext :key="index" is-repeat :index="index" :data="item">
                    <div :style="index != filteredOptions.length - 1 ? { paddingBottom: content.optionSpacing } : {}">
                        <ww-element-option :local-data="item" :content="content" :wwEditorState="wwEditorState" />
                    </div>
                </wwLayoutItemContext>
            </DynamicScrollerItem>
        </template>
    </DynamicScroller>

    <!-- <div v-else-if="!virtualScroll && filteredOptions.length > 0" style="height: 100%;overflow: auto;">
        <wwLayoutItemContext
            v-for="(item, index) in filteredOptions"
            :key="index"
            is-repeat
            :index="index"
            :data="item"
        >
            <ww-element-option :local-data="item" :content="content" :wwEditorState="wwEditorState" />
        </wwLayoutItemContext>
    </div> -->

    <div v-show="filteredOptions.length === 0 || showEmptyStateInEditor" :style="emptyStateStyle">
        <span>{{ emptyStateText }}</span>
        <!-- <wwElement v-bind="content.emptyStateContainer" /> -->
    </div>
</template>

<script>
import InputSelectOption from './wwElement_Option.vue';
import { ref, inject, computed, watch } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { useMemoize } from '@vueuse/core';

export default {
    components: {
        DynamicScroller,
        DynamicScrollerItem,
        'ww-element-option': InputSelectOption,
    },
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['update:sidepanel-content'],
    setup(props, { emit }) {

        const isEditing = computed(() => {
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const showEmptyStateInEditor = computed(() => {
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const rawData = inject('_wwSelect:rawData', ref([]));
        const searchState = inject('_wwSelect:searchState', ref(null));
        const { updateSearch } = inject('_wwSelect:useSearch', {});
        const registerOptionProperties = inject('_wwSelect:registerOptionProperties', () => {});
        const virtualScroll = computed(() => props.content.virtualScroll);
        const virtualScrollSizeDependencies = computed(() => props.content.virtualScrollSizeDependencies);
        const virtualScrollMinItemSize = computed(() => props.content.virtualScrollMinItemSize || 40);
        const virtualScrollBuffer = computed(() => props.content.virtualScrollBuffer || 400);

        const emptyStateText = computed(() => wwLib.wwLang.getText(props.content.emptyStateText));

        const options = computed(() => {
            const items = rawData.value;
            return Array.isArray(items) ? items : [];
        });

        const optionProperties = computed(() => {
            if (!options.value || options.value.length === 0) return {};
            return options.value[0];
        });

        const memoizedFilter = useMemoize((options, filterValue) => {
            return options.filter(option => {
                // Handle primitive values directly
                const isPrimitive = typeof option !== 'object' || option === null;
                if (isPrimitive) {
                    const normalizedOption = option
                        .toString()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase();
                    const normalizedFilter = filterValue
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase();
                    return normalizedOption.includes(normalizedFilter);
                } else {
                    // For objects, use the existing search logic
                    const searchBy = searchState.value?.searchBy?.length
                        ? searchState.value?.searchBy
                        : Object.keys(option);
                    return searchBy.some(key => {
                        const optionValue = option[key];
                        if (!optionValue) return false;
                        const normalizedOption = optionValue
                            .toString()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .toLowerCase();
                        const normalizedFilter = filterValue
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .toLowerCase();

                        return normalizedOption.includes(normalizedFilter);
                    });
                }
            });
        });

        const filteredOptions = computed(() => {
            if (!searchState.value || !searchState.value.value) return options.value;
            let filtered = memoizedFilter(options.value, searchState.value.value);
            return filtered;
        });

        const dynamicScrollerItems = computed(() => {
            return filteredOptions.value.map((item, index) => {
                // Handle primitive values properly - don't spread them as they become indexed objects
                const isPrimitive = typeof item !== 'object' || item === null;
                if (isPrimitive) {
                    // For primitives, create a simple object wrapper
                    return { value: item, id: `id_${index}` };
                } else {
                    // For objects, use the existing spread logic
                    return { ...item, id: item.id ?? `id_${index}` };
                }
            });
        });

        watch(filteredOptions, () => {
            if (updateSearch) {
                const searchMatches = searchState.value && searchState.value.value ? filteredOptions.value : [];
                updateSearch({ ...searchState.value, searchMatches });
            }
        });

        // Styles
        const emptyStateStyle = computed(() => {
            return {
                'font-family': props.content.emptyStateFontFamily,
                'font-size': props.content.emptyStateFontSize,
                'font-weight': props.content.emptyStateFontWeight,
                color: props.content.emptyStateFontColor,
                padding: props.content.emptyStatePadding,
                'text-align': props.content.emptyStateTextAlign,
                width: '100%',
            };
        });

        // Watch
        watch(
            optionProperties,
            value => {
                emit('update:sidepanel-content', { path: 'optionProperties', value });
                if (registerOptionProperties) registerOptionProperties(value);
            },
            { immediate: true }
        );


        return {
            emptyStateText,
            filteredOptions,
            virtualScroll,
            virtualScrollSizeDependencies,
            virtualScrollMinItemSize,
            virtualScrollBuffer,
            showEmptyStateInEditor,
            dynamicScrollerItems,
            emptyStateStyle,
        };
    },
};
</script>

<style>
@import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
</style>
