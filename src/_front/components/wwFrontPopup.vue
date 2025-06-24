<template>
    <wwLocalContext :methods="localMethods" element-key="popup">
        <wwLibraryComponent :uid="modal.uid" is-popup></wwLibraryComponent>
    </wwLocalContext>
</template>

<script>
import { provide } from 'vue';
import wwLibraryComponent from './wwLibraryComponent.vue';
import { usePopupStore } from '@/pinia/popup.js';

export default {
    name: 'wwFrontPopup',
    components: { wwLibraryComponent },
    props: {
        modal: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const modalsStore = usePopupStore();
        const localMethods = {
            close: {
                description: 'Close the popup',
                method(data) {
                    modalsStore.close(props.modal?.uid, data);
                },
                editor: {
                    label: 'Close this popup instance',
                    group: 'Popup',
                    icon: 'popup',
                    args: [
                        {
                            name: 'data',
                            type: 'any',
                            description: 'Data to return to the caller',
                            required: false,
                        },
                    ],
                    copilot: {
                        description: 'Close the popup',
                        schema: {
                            args: {
                                type: 'array',
                                description:
                                    'Array of length 1, containing the data of any type to return to the caller. Only the content of the first element is bindable.',
                                bindable: false,
                            },
                        },
                        utilsFunctionMatch: 'utilsFunctions.closePopup(context, args[0])',
                    },
                },
            },
        };

        provide('dragZoneId', props.modal?.uid);

        return { localMethods };
    },
};
</script>
