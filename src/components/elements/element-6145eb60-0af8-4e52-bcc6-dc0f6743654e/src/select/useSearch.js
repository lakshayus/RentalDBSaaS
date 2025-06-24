import { ref, nextTick, unref } from 'vue';

export default function useSearch(searchState, { updateSearch }) {
    const hasSearch = ref(false);
    const searchElement = ref(null);
    const autoFocusSearch = ref(false);

    function updateHasSearch(value) {
        hasSearch.value = value;
    }

    function updateSearchElement(value) {
        searchElement.value = value;
    }

    function focusSearch() {
        nextTick(() => {
            if (searchElement.value) {
                searchElement.value.focus();
            }
        });
    }

    function updateAutoFocusSearch(value) {
        autoFocusSearch.value = unref(value);
    }

    function resetSearch() {
        if (searchElement.value) {
            searchElement.value.value = '';
            updateSearch({ ...searchState, value: '' });
        }
    }

    return {
        hasSearch,
        autoFocusSearch,
        updateHasSearch,
        updateSearchElement,
        resetSearch,
        updateAutoFocusSearch,
        focusSearch,
    };
}
