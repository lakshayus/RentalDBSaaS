import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ShortUniqueId from 'short-unique-id';
const createId = new ShortUniqueId();
 
export const usePopupStore = defineStore('popups', () => {
    const availablePopups = computed(() => {
        const libraryId = wwLib.$store.getters['libraries/getLibrary'].id;
        return Object.values(wwLib.$store.getters['libraries/getComponents'])
            .filter(libraryComponent => libraryComponent.type === 'modal' && libraryComponent.libraryId === libraryId)
            .map(libraryComponent => {
                return {
                    name: libraryComponent.name,
                    libraryComponentBaseId: libraryComponent.id,
                    libraryId,
                };
            });
    });

    const onClosePromises = {};

    const instances = ref({});

    async function open(libraryComponentBaseId, content, { waitClosing = false } = {}) {
        const uid = `popup-${createId.rnd()}`;
        instances.value[uid] = {
            uid,
            libraryComponentBaseId,
            content,
        };
        if (waitClosing) {
            return new Promise(resolve => {
                onClosePromises[uid] = resolve;
            });
        }
        return Promise.resolve(uid);
    }

    function close(uid, data) {
        delete instances.value[uid];
        if (onClosePromises[uid]) {
            onClosePromises[uid](data);
            delete onClosePromises[uid];
        }
    }

    function closeAll(libraryComponentBaseId) {
        Object.keys(instances.value).forEach(uid => {
            if (instances.value[uid].libraryComponentBaseId === libraryComponentBaseId) {
                close(uid);
            }
        });
    }
 
    return {
        availablePopups,
        open,
        close,
        closeAll,
        instances,
     };
});
