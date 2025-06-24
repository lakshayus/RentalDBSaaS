import { watch, inject } from 'vue';

export default function useTabTriggerHint(emit) {
    const missingTabOrField = inject('_wwTabsMissingTabOrFieldObj');

    watch(
        missingTabOrField,
        value => {
            emit('update:sidepanel-content', { path: 'missingTabOrField', value });
        },
        { immediate: true }
    );

    return {};
}
