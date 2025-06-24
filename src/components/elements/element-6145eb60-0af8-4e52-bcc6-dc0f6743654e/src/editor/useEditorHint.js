import { provide, ref } from 'vue';

export default function useEditorHint() {
    provide('_wwSelect:isInSelect', ref(true));
    return {};
}
