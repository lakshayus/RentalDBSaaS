import { ref, provide, watch } from 'vue';

export default function useAccessibility({
    elementRef,
    options,
    isOpen,
    methods: { openDropdown, closeDropdown, toggleValue },
}) {
    const dropdownId = `ww-select-dropdown-${wwLib.wwUtils.getUid()}`;

    const activeDescendant = ref('');
    const focusedOptionIndex = ref(0);
    const activeOptionValue = ref('');

    const updateFocusedOption = index => {
        const focusedOption = options.value[index];
        focusedOptionIndex.value = index;
        activeOptionValue.value = focusedOption.value;
        activeDescendant.value = focusedOption.optionId;
    };

    const focusFromOptionId = optionId => {
        if (optionId === null) {
            resetFocus();
            return;
        }

        const index = options.value.findIndex(option => option.optionId === optionId);
        updateFocusedOption(index);
    };

    const resetFocus = () => {
        activeDescendant.value = '';
        focusedOptionIndex.value = 0;
        activeOptionValue.value = '';
    };

    const focusSelectElement = () => {
        elementRef.value?.focus();
    };

    watch(
        options,
        () => {
            resetFocus();

            if (options.value.length > 0) {
                const selectedOption = options.value.find(option => option.isSelected);
                if (selectedOption) {
                    const selectedIndex = options.value.findIndex(option => option.value === selectedOption.value);
                    updateFocusedOption(selectedIndex);
                }
            }
        },
        { immediate: true, deep: true }
    );

    const navigateOptions = direction => {
        const optionsCount = options.value.length;
        if (optionsCount === 0) return;

        let newIndex;
        if (!isOpen.value) {
            newIndex = 0;
        } else if (activeDescendant.value === '') {
            newIndex = direction > 0 ? 0 : optionsCount - 1;
        } else {
            newIndex = (focusedOptionIndex.value + direction + optionsCount) % optionsCount;
        }

        updateFocusedOption(newIndex);
    };

    const handleKeydown = event => {
        const keyHandlers = {
            ArrowDown: () => {
                event.preventDefault();
                !isOpen.value ? openDropdown() : navigateOptions(1);
            },
            ArrowUp: () => {
                event.preventDefault();
                !isOpen.value ? openDropdown() : navigateOptions(-1);
            },
            Enter: () => {
                event.preventDefault();
                if (isOpen.value && activeOptionValue.value != null && activeOptionValue.value !== undefined && activeOptionValue.value !== '') {
                    toggleValue(activeOptionValue.value);
                } else if (!isOpen.value) {
                    openDropdown();
                }
            },
            Escape: () => {
                event.preventDefault();
                if (isOpen.value) {
                    closeDropdown();
                    resetFocus();
                }
            },
        };

        const handler = keyHandlers[event.key];
        if (handler) handler();
    };

    const setInitialFocus = value => {
        const selectedIndex = options.value.findIndex(option => option.value === value);
        if (selectedIndex !== -1) {
            updateFocusedOption(selectedIndex);
        }
    };

    provide('_wwSelect:activeDescendant', activeDescendant);
    provide('_wwSelect:focusedOptionIndex', focusedOptionIndex);
    provide('_wwSelect:setInitialFocus', setInitialFocus);
    provide('_wwSelect:focusFromOptionId', focusFromOptionId);
    provide('_wwSelect:focusSelectElement', focusSelectElement);

    return {
        dropdownId,
        activeDescendant,
        handleKeydown,
        resetFocus,
        setInitialFocus,
    };
}
