<template>
    <div
        class="ww-select"
        :class="{ 'ww-select-z-index': isOpen && content.zIndexOpen }"
        :style="{ '--select-z-index': isOpen && content.zIndexOpen ? content.zIndexOpen : 'auto' }"
        ref="componentKey"
        data-ww-flag="ww-select"
    >
        <div
            class="ww-select__trigger"
            ref="triggerElement"
            @click="toggleDropdown"
            @keydown="handleKeydown"
            role="combobox"
            :aria-haspopup="selectType === 'single' ? 'listbox' : 'true'"
            :aria-expanded="isOpen"
            :aria-controls="dropdownId"
            :aria-activedescendant="activeDescendant"
            :tabindex="isDisabled ? -1 : 0"
            :aria-disabled="isDisabled"
        >
            <SelectTriger :content="content" @remove-multiselect-value="removeSpecificValue" />
        </div>
        <teleport v-if="isOpen" :to="appDivRef">
            <div
                class="ww-select__dropdown__wrapper"
                :style="{ pointerEvents: isEditing && forceOpenInEditor ? 'none' : 'auto' }"
            >
                <div
                    class="ww-select__dropdown"
                    ref="dropdownElement"
                    :style="[floatingStyles || {}]"
                    :id="dropdownId"
                    :role="selectType === 'single' ? 'listbox' : 'group'"
                    :aria-multiselectable="selectType === 'multiple'"
                    :aria-label="'Select options'"
                    inherit-component-style
                >
                    <div :style="[dropdownStyles]">
                        <SelectDropdown :content="content" :wwEditorState="wwEditorState">
                            <SelectSearch v-if="showSearch" :content="content" :wwEditorState="wwEditorState" />
                            <!-- List mode -->
                            <SelectOptionList :content="content" :wwEditorState="wwEditorState" />
                        </SelectDropdown>
                    </div>
                </div>
            </div>
        </teleport>

        <input
            type="input"
            :name="content.fieldName"
            :value="variableValue"
            :required="content.required"
            tabindex="-1"
            class="fake-input"
        />
    </div>
</template>

<script>
import InputSelectTrigger from './wwElement_Trigger.vue';
import InputSelectDropdown from './wwElement_Dropdown.vue';
import InputSelectOption from './wwElement_Option.vue';
import InputSelectOptionList from './wwElement_OptionsList.vue';
import InputSelectSearch from './wwElement_Search.vue';
import { ref, computed, provide, watch, inject, nextTick, toValue, onMounted, onBeforeUnmount, shallowRef } from 'vue';
import useAccessibility from './select/useAccessibility';
import useSearch from './select/useSearch';
import { debounce, findValueIndex, areValuesEqual } from './utils';


export default {
    components: {
        SelectTriger: InputSelectTrigger,
        SelectDropdown: InputSelectDropdown,
        SelectOption: InputSelectOption,
        SelectOptionList: InputSelectOptionList,
        SelectSearch: InputSelectSearch,
    },
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['trigger-event', 'update:content', 'update:sidepanel-content'],
    setup(props, { emit }) {

        const componentKey = ref(0);
        const isEditing = computed(() => {
            // eslint-disable-next-line no-unreachable
            return false;
        });
        const forceOpenInEditor = computed(() => {
            return false;
        });

        const appDivRef = shallowRef(wwLib.getFrontDocument().querySelector('#app'));

        const selectType = computed(() => props.content.selectType);
        const initValue = computed(() =>
            selectType.value === 'single' ? (props.content.initValueSingle ?? null) : props.content.initValueMulti || []
        );
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            type: selectType.value === 'single' ? 'any' : 'array',
            defaultValue: initValue,
        });

        const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

        const fieldName = computed(() => props.content.fieldName || props.wwElementState.name);
        const validation = computed(() => props.content.validation);
        const customValidation = computed(() => props.content.customValidation);

        const useForm = inject('_wwForm:useForm', () => {});
        useForm(
            variableValue,
            { fieldName, validation, customValidation, initialValue: initValue },
            { elementState: props.wwElementState, emit, sidepanelFormPath: 'form', setValue }
        );

        const triggerElement = ref(null);
        const dropdownElement = ref(null);
        const autoFocus = computed(() => props.content.autoFocus);
        const optionsMap = ref(new Map());
        const options = computed(() => Array.from(optionsMap.value.values()));
        const isOpen = ref(false);
        const rawData = computed(() => props.content.choices || []);
        const isDisabled = computed(() => props.content.disabled || false);
        const isReadonly = computed(() => props.content.readonly || false);
        const canUnselect = computed(() => props.content.unselectOnClick || false);
        const initialState = computed(() => props.content.initialState || 'closed');
        const closeOnClickOutside = computed(() => props.content.closeOnClickOutside || false);
        const manualTrigger = computed(() => props.content.manualTrigger || false);
        const searchState = ref(null);
        const optionProperties = ref({});
        const resizeObserver = ref(null);
        const triggerWidth = ref(0);
        const triggerHeight = ref(0);
        const shouldCloseDropdown = ref(true);
        const mappingLabel = computed(() => props.content.mappingLabel);
        const mappingValue = computed(() => props.content.mappingValue);
        const mappingDisabled = computed(() => props.content.mappingDisabled);
        const showSearch = computed(() => props.content.showSearch);
        const allowScrollingWhenOpen = computed(() => props.content.allowScrollingWhenOpen);

        // Styles
        const syncFloating = () => {
            if (!triggerElement?.value) return;
            const triggerElementBounding = triggerElement.value.getBoundingClientRect();
            floatingStyles.value = {
                position: 'absolute',
                top: `${
                    triggerElementBounding.top + triggerElementBounding.height + parseInt(props.content.offsetY)
                }px`,
                left: `${triggerElementBounding.left + parseInt(props.content.offsetX)}px`,
            };
        };
        let floatingStyles = ref({});

        const selectStyles = computed(() => {
            if (isOpen.value && props.content.zIndexOpen) {
                return {
                    zIndex: `${props.content.zIndexOpen} !important`,
                };
            }
            return {};
        });
        const dropdownStyles = computed(() => {
            const dropdownBorderCss = !props.content.dropdownBorder
                ? {
                      border: props.content.dropdownBorderAll,
                  }
                : {
                      'border-top': props.content.dropdownBorderTop,
                      'border-right': props.content.dropdownBorderRight,
                      'border-bottom': props.content.dropdownBorderBottom,
                      'border-left': props.content.dropdownBorderLeft,
                  };

            return {
                width: props.content.dropdownWidth,
                'max-height': props.content.dropdownMaxHeight,
                'border-radius': props.content.dropdownBorderRadius,
                padding: props.content.dropdownPadding,
                'background-color': props.content.dropdownBgColor,
                'box-shadow': props.content.dropdownShadows,
                overflow: 'auto',
                ...dropdownBorderCss,
            };
        });

        const lastTriggeredComponentAction = ref(Date.now());

        // Methods
        const registerOption = (id, option) => {
            optionsMap.value.set(id, option);
        };

        const unregisterOption = id => {
            optionsMap.value.delete(id);
        };

        const registerOptionProperties = object => {
            if (object) optionProperties.value = object;
        };

        const updateSearch = filter => {
            searchState.value = filter;
        };

        const updateValue = value => {
            if (selectType.value === 'single') {
                // Check if value is an array
                if (Array.isArray(value)) {
                    console.warn('Single select component received an array value. Only the first value will be used.');
                    value = value[0];
                }
                setValue(value);
                emit('trigger-event', { name: 'change', event: { value } });
            } else {
                // Check if value is an array
                if (!Array.isArray(value)) {
                    value = [value];
                }

                const currentValue = Array.isArray(variableValue.value) ? [...variableValue.value] : [];
                for (let iValue of value) {
                    // Find index using the utility function
                    const valueIndex = findValueIndex(currentValue, iValue);

                    if (valueIndex === -1) {
                        if (!props.content.limit || currentValue.length < props.content.limit)
                            currentValue.push(iValue);
                    } else {
                        // currentValue.splice(valueIndex, 1);
                        // No need to unselect
                    }
                }

                setValue(currentValue);
                emit('trigger-event', { name: 'change', event: { value: currentValue } });
            }

            if (props.content.closeOnSelect) closeDropdown();
        };

        const toggleValueAccessibility = value => {
            // Don't process empty values
            if (value === '' || value == null || value === undefined) {
                return;
            }
            
            const option = Array.from(optionsMap.value).find(([key, option]) => option.value === value);
            if (!option && !options?.length > 1) return;
            if (option?.[1]?.disabled) return;

            const originalValue = selectType.value === 'single' ? variableValue.value : [...(Array.isArray(variableValue.value) ? variableValue.value : [])];
            let valueChanged = false;
            let eventValue;

            if (selectType.value === 'single') {
                if (variableValue.value === value) {
                    // Unselect ?
                    if (props.content.unselectOnClick) {
                        setValue(null);
                        valueChanged = true;
                        if (props.content.closeOnSelect) {
                            closeDropdown();
                        }
                    }
                } else if (props.content.selectOnClick) {
                    // Select ?
                    setValue(value);
                    valueChanged = true;
                    if (props.content.closeOnSelect) closeDropdown();
                }
                eventValue = variableValue.value;
            } else {
                const currentValue = Array.isArray(variableValue.value) ? [...variableValue.value] : [];

                // Find the index with proper object comparison if needed
                let valueIndex = -1;
                if (typeof value === 'object' && value !== null) {
                    valueIndex = currentValue.findIndex(item => {
                        if (typeof item !== 'object' || item === null) return false;
                        return JSON.stringify(item) === JSON.stringify(value);
                    });
                } else {
                    valueIndex = currentValue.indexOf(value);
                }

                if (valueIndex >= 0) {
                    // Unelect ?
                    if (props.content.unselectOnClick) {
                        currentValue.splice(valueIndex, 1);
                        valueChanged = true;
                        if (props.content.closeOnSelect) {
                            closeDropdown();
                        }
                    }
                } else if (props.content.selectOnClick) {
                    // Select ?
                    currentValue.push(value);
                    valueChanged = true;
                    if (props.content.closeOnSelect) closeDropdown();
                }

                setValue(currentValue);
                eventValue = currentValue;
            }

            // Only emit change event if the value actually changed
            if (valueChanged) {
                emit('trigger-event', { name: 'change', event: { value: eventValue } });
            }
        };

        function removeSpecificValue(valueToRemove) {
            if (selectType.value !== 'multiple' || isDisabled.value || isReadonly.value) {
                return;
            }

            /* This is a workaround to prevent the dropdown from closing when removing a value.
             * The issue is that the click event that triggers this function also bubbles up
             * and triggers closeDropdown (through handleClickOutside).
             * Since we can't access the event object to call stopPropagation(),
             * we use this flag + timeout pattern to temporarily prevent the dropdown from closing.
             * If a better solution is found (like being able to pass the event), this should be refactored.
             */
            shouldCloseDropdown.value = false;

            const currentValue = Array.isArray(variableValue.value) ? [...variableValue.value] : [];

            // Find index using the utility function
            const valueIndex = findValueIndex(currentValue, valueToRemove);

            if (valueIndex !== -1) {
                currentValue.splice(valueIndex, 1);
                setValue(currentValue);
            }

            emit('trigger-event', { name: 'change', event: { value: currentValue } });
            
            // Close dropdown if closeOnSelect is enabled, just like regular selection
            if (props.content.closeOnSelect) {
                // Re-enable closing first, then close
                shouldCloseDropdown.value = true;
                closeDropdown();
            } else {
                nextTick(() => {
                    shouldCloseDropdown.value = true;
                });
            }
        }

        const {
            hasSearch,
            updateHasSearch,
            updateSearchElement,
            resetSearch,
            autoFocusSearch,
            updateAutoFocusSearch,
            focusSearch,
        } = useSearch(searchState, {
            updateSearch,
        });

        function openDropdown() {
            if (isDisabled.value || isReadonly.value) return;
            const triggerElementBounding = triggerElement.value.getBoundingClientRect();
            floatingStyles.value = {
                position: 'absolute',
                top: `${
                    triggerElementBounding.top + triggerElementBounding.height + parseInt(props.content.offsetY)
                }px`,
                left: `${triggerElementBounding.left + parseInt(props.content.offsetX)}px`,
            };

            isOpen.value = true;
            nextTick(syncFloating);
            if (autoFocusSearch.value) focusSearch();
        }

        function closeDropdown() {
            if (!shouldCloseDropdown.value) return;

            resetSearch();
            resetFocus();
            isOpen.value = false;
        }

        function toggleDropdown(event = null) {
            if (isEditing.value || (manualTrigger.value && event)) return;
            if (isOpen.value) closeDropdown();
            else openDropdown();
        }

        function resetValue() {
            setValue(initValue.value || null);
            emit('trigger-event', { name: 'change', event: { value: initValue.value || null } });
        }

        function handleClickOutside(event) {
            if (
                closeOnClickOutside.value &&
                isOpen.value &&
                !triggerElement.value.contains(event.target) &&
                !dropdownElement.value.contains(event.target) &&
                !isEditing.value &&
                Date.now() > lastTriggeredComponentAction.value + 400
            ) {
                closeDropdown();
            }
        }

        const { dropdownId, activeDescendant, handleKeydown, resetFocus, setInitialFocus } = useAccessibility({
            elementRef: triggerElement,
            options,
            isOpen,
            methods: { openDropdown, closeDropdown, toggleDropdown, toggleValue: toggleValueAccessibility },
        });

        function handleInitialFocus() {
            if (!variableValue.value) return;
            if (selectType.value === 'single') {
                setInitialFocus(variableValue.value);
            } else if (Array.isArray(variableValue.value) && variableValue.value.length) {
                setInitialFocus(variableValue.value[0]);
            }
        }

        const observeTriggerSize = () => {
            if (!triggerElement.value) return;

            if (resizeObserver.value) {
                resizeObserver.value.disconnect();
                resizeObserver.value = null;
            }

            resizeObserver.value = new ResizeObserver(
                debounce(entries => {
                    if (entries[0]) {
                        const rect = triggerElement.value.getBoundingClientRect();
                        triggerWidth.value = rect.width;
                        triggerHeight.value = rect.height;
                    }
                }, 16)
            );

            resizeObserver.value.observe(triggerElement.value);
        };

        const selectionDetails = computed(() => {
            const _optionsMap = new Map(
                rawData.value.map(option => {
                    // Handle primitive values (strings, numbers) vs objects
                    const isPrimitive = typeof option !== 'object' || option === null;

                    let mappedValue, mappedOption;
                    if (isPrimitive) {
                        // For primitive values, the option IS the value and label
                        mappedValue = option;
                        mappedOption = option;
                    } else {
                        // For objects, use the mapping formulas
                        mappedValue = resolveMappingFormula(toValue(mappingValue), option) ?? option.value ?? option;
                        mappedOption = option;
                    }

                    return [mappedValue, mappedOption];
                })
            );

            // Format option for display
            const formatOption = opt => {
                const isPrimitive = typeof opt !== 'object' || opt === null;

                if (isPrimitive) {
                    // For primitive values, use the value as both value and label
                    return {
                        value: opt,
                        label: opt,
                        disabled: false,
                        data: opt,
                    };
                } else {
                    // For objects, use the mapping formulas
                    return {
                        value: resolveMappingFormula(toValue(mappingValue), opt) ?? opt.value ?? opt,
                        label: resolveMappingFormula(toValue(mappingLabel), opt) ?? opt.label ?? opt.value ?? opt,
                        disabled: opt.disabled || false,
                        data: opt || {},
                    };
                }
            };

            // Find option by value using the utility function
            const findOptionByValue = value => {
                // Use the utility function to find an entry with matching key
                const entry = Array.from(_optionsMap.entries()).find(([key, _]) => areValuesEqual(key, value));
                return entry ? entry[1] : null;
            };

            // Handle single select
            if (selectType.value === 'single') {
                const option = findOptionByValue(variableValue.value);
                return option ? formatOption(option) : null;
            }
            // Handle multiple select
            else {
                const selectedValues = Array.isArray(variableValue.value) ? variableValue.value : [];
                return selectedValues.map(value => {
                    const option = findOptionByValue(value);

                    if (!option) {
                        return {
                            value,
                            label: value,
                            isInOptions: false,
                            info: 'This value is not in the defined options',
                        };
                    }

                    return formatOption(option);
                });
            }
        });

        const _options = computed(() => options.value?.map(({ optionId, ...option }) => option) || ref([])); // Hide optionId

        const data = ref({
            options: _options,
            active: { value: variableValue, details: selectionDetails },
            utils: { type: selectType, isOpen, triggerWidth, triggerHeight },
        });

        let initialOverflow = null;
        let initialBodyStyle = null;
        let initialTouchAction = null;
        let initialPaddingRight = '0px';
        let supportsPassive = false;
        let wheelOpt = false;
        let wheelEvent = '';

        // Initialize passive event support detection
        try {
            window.addEventListener(
                'test',
                null,
                Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportsPassive = true;
                    },
                })
            );
        } catch (e) {}

        wheelOpt = supportsPassive ? { passive: false } : false;
        wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

        const preventDefault = e => {
            e.preventDefault();
        };

        const preventDefaultForScrollKeys = e => {
            const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        };

        const blockScrolling = () => {
            const _w = wwLib.getFrontWindow();
            const _d = wwLib.getFrontDocument();

            if (!_w || !_d) return;

            initialOverflow = { ..._d.documentElement.style };
            initialBodyStyle = { ..._d.body.style };
            _d.body.style.touchAction = 'none';

            // Add event listeners to prevent scrolling
            _w.addEventListener('DOMMouseScroll', preventDefault, false);
            _w.addEventListener(wheelEvent, preventDefault, wheelOpt);
            _w.addEventListener('touchmove', preventDefault, wheelOpt);
            _w.addEventListener('keydown', preventDefaultForScrollKeys, false);
        };

        const revertBlockScrolling = () => {
            const _d = wwLib.getFrontDocument();
            const _w = wwLib.getFrontWindow();

            if (!_d || !_w) return;

            if (initialOverflow === null) return;
            if (initialBodyStyle === null) return;

            _d.body.style.touchAction = initialTouchAction || '';
            _d.body.style['touch-action'] = initialTouchAction || '';

            // Remove event listeners
            _w.removeEventListener('DOMMouseScroll', preventDefault, false);
            _w.removeEventListener(wheelEvent, preventDefault, wheelOpt);
            _w.removeEventListener('touchmove', preventDefault, wheelOpt);
            _w.removeEventListener('keydown', preventDefaultForScrollKeys, false);

            initialOverflow = null;
            initialBodyStyle = null;
        };

        watch(
            hasSearch,
            newHasSearch => {
                if (newHasSearch) {
                    data.value.search = {
                        value: computed(() => searchState.value?.value || ''),
                        searchBy: computed(() => searchState.value?.searchBy || []),
                        searchMatches: computed(() => searchState.value?.searchMatches || []),
                    };
                } else {
                    delete data.value.search;
                }
            },
            { immediate: true }
        );

        watch(autoFocus, value => {
            if (updateAutoFocusSearch) updateAutoFocusSearch(value);
        });

        watch(showSearch, () => {
            updateHasSearch(showSearch);
        });

        watch(isOpen, () => {
            nextTick(syncFloating);
            handleInitialFocus();
            if (isOpen.value) {
                if (!allowScrollingWhenOpen.value) blockScrolling();
            } else {
                if (!allowScrollingWhenOpen.value) revertBlockScrolling();
            }
        });

        watch(
            variableValue,
            () => {
                nextTick(syncFloating);
            },
            { deep: true }
        );

        watch(
            [initValue, selectType],
            () => {
                if (
                    (initValue.value !== null && initValue.value !== undefined) ||
                    (Array.isArray(initValue.value) && initValue.value.length)
                ) {
                    setValue(initValue.value);
                    nextTick(debounce(handleInitialFocus, 300));
                } else {
                    setValue(null);
                }

                emit('trigger-event', { name: 'initValueChange', event: { value: initValue.value } });
            },
            { immediate: true },
            { deep: true }
        );

        watch(
            initialState,
            () => {
                if (initialState.value && initialState.value === 'open') openDropdown();
                else if (!forceOpenInEditor.value) closeDropdown();
            },
            { immediate: true }
        );


        // Local context is an object with select and selectTrigger keys
        const currentLocalContext = ref({});
        const registerLocalContext =
            key =>
            ({ data, markdown }) => {
                const selectLocalContext = currentLocalContext.value;
                const newLocalContext = {
                    data: {
                        ...selectLocalContext.data,
                        [key]: data,
                    },
                    methods: {},
                    markdown: {
                        ...selectLocalContext.markdown,
                        [key]: markdown,
                    },
                };
                wwLib.wwElement.useRegisterElementLocalContext(
                    'select',
                    newLocalContext.data,
                    newLocalContext.methods,
                    newLocalContext.markdown
                );
                currentLocalContext.value = newLocalContext;
            };
        const registerTriggerLocalContext = registerLocalContext('selectTrigger');
        const registerSelectLocalContext = registerLocalContext('select');

        provide('_wwSelect:mappingLabel', mappingLabel);
        provide('_wwSelect:mappingValue', mappingValue);
        provide('_wwSelect:mappingDisabled', mappingDisabled);
        provide('_wwSelect:rawData', rawData);
        provide('_wwSelect:options', options);
        provide('_wwSelect:type', selectType);
        provide('_wwSelect:value', variableValue);
        provide('_wwSelect:setValue', setValue);
        provide('_wwSelect:isDisabled', isDisabled);
        provide('_wwSelect:isReadonly', isReadonly);
        provide('_wwSelect:canUnselect', canUnselect);
        provide('_wwSelect:searchState', searchState);
        provide('_wwSelect:optionProperties', optionProperties);
        provide('_wwSelect:updateValue', updateValue);
        provide('_wwSelect:removeSpecificValue', removeSpecificValue);
        provide('_wwSelect:registerOption', registerOption);
        provide('_wwSelect:unregisterOption', unregisterOption);
        provide('_wwSelect:registerOptionProperties', registerOptionProperties);
        provide('_wwSelect:registerTriggerLocalContext', registerTriggerLocalContext);
        provide('_wwSelect:dropdownMethods', { closeDropdown });
        provide('_wwSelect:useSearch', { updateHasSearch, updateSearchElement, updateSearch, updateAutoFocusSearch });
        provide('_wwSelect:localContext', currentLocalContext);

        const markdown = `### Select local informations

            #### options
            Array of all available options in the dropdown. Each option contains:
            - \`value\`: Option's value
            - \`label\`: Display text
            - \`disabled\`: Boolean indicating if option is disabled
            - \`isSelected\`: Boolean indicating if option is selected
            - \`data\`: Data from the repeat context (optional)

            #### active
            Information about currently selected option(s):
            - \`value\`: Current selection (single value or array for multiple select)
            - \`details\`: Detailed information about selected option(s)

            #### utils
            Component state information:
            - \`type\`: Select type ('single' or 'multiple')
            - \`isOpen\`: Boolean indicating if dropdown is open
            - \`triggerWidth\`: Width of trigger element
            - \`triggerHeight\`: Height of trigger element

            #### search (optional)
            Present when search is enabled:
            - \`value\`: Current search input value
            - \`searchBy\`: Fields to search by
            - \`searchMatches\`: Options matching search criteria`;

        registerSelectLocalContext({
            data,
            markdown,
        });

        updateAutoFocusSearch(autoFocus);

        onMounted(() => {
            nextTick(() => {
                debounce(syncFloating, 300);
                observeTriggerSize();
            });
            wwLib.getFrontDocument().addEventListener('click', handleClickOutside);
            wwLib.getFrontWindow().addEventListener('scroll', syncFloating);
        });

        onBeforeUnmount(() => {
            if (resizeObserver.value) {
                resizeObserver.value.disconnect();
                resizeObserver.value = null;
            }
            revertBlockScrolling();
            wwLib.getFrontDocument().removeEventListener('click', handleClickOutside);
        });

        watch(
            optionProperties,
            value => {
                emit('update:sidepanel-content', { path: 'optionProperties', value });
            },
            { immediate: true, deep: true }
        );

        return {
            appDivRef,
            showSearch,
            componentKey,
            isEditing,
            forceOpenInEditor,
            isOpen,
            triggerElement,
            dropdownElement,
            floatingStyles,
            dropdownStyles,
            dropdownId,
            activeDescendant,
            isDisabled,
            selectType,
            handleKeydown,
            toggleDropdown,
            resizeObserver,
            options,
            currentLocalContext,
            variableValue,
            lastTriggeredComponentAction,
            selectStyles,

            // Methods
            openDropdown,
            closeDropdown,
            toggleDropdown,
            updateValue,
            resetValue,
            removeSpecificValue,
            resetSearch,
        };
    },
    methods: {
        resetLastTriggerComponentAction() {
            this.lastTriggeredComponentAction = Date.now();
        },
        actionOpenDropdown() {
            this.resetLastTriggerComponentAction();
            this.openDropdown();
        },
        actionCloseDropdown() {
            this.resetLastTriggerComponentAction();
            this.closeDropdown();
        },
        actionToggleDropdown() {
            this.resetLastTriggerComponentAction();
            this.toggleDropdown();
        },
        actionUpdateValue(value) {
            this.resetLastTriggerComponentAction();
            this.updateValue(value);
        },
        actionResetValue() {
            this.resetLastTriggerComponentAction();
            this.resetValue();
        },
        actionRemoveSpecificValue(value) {
            this.resetLastTriggerComponentAction();
            this.removeSpecificValue(value);
        },
        actionResetSearch() {
            this.resetLastTriggerComponentAction();
            this.resetSearch();
        },
    },
};
</script>

<style lang="scss" scoped>
// dropdown width is

.ww-select {
    position: relative;
}

.ww-select-z-index {
    z-index: var(--select-z-index, auto) !important;
}

.ww-select__trigger {
    width: 100%;
}

.ww-select__dropdown__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 9999;
}

.fake-input {
    background: rgba(0, 0, 0, 0);
    border: 0;
    bottom: -1px;
    font-size: 0;
    height: 1px;
    left: 0;
    outline: none;
    padding: 0;
    position: absolute;
    right: 0;
    width: 100%;
}

.fake-input {
    background: rgba(0, 0, 0, 0);
    border: 0;
    bottom: -1px;
    font-size: 0;
    height: 1px;
    left: 0;
    outline: none;
    padding: 0;
    position: absolute;
    right: 0;
    width: 100%;
}
</style>
