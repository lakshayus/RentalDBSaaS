<template>
    <wwEditorInputRow
        type="query"
        label="Channel"
        placeholder="Channel name"
        bindable
        small
        required
        :model-value="channel"
        @update:modelValue="setChannel"
    />
    <wwEditorInputRow
        type="onoff"
        label="Listen to presence"
        tooltip="Subscribes to channel presence to see who else is in the channel and events when others join/leave."
        bindable
        small
        :model-value="presence"
        @update:modelValue="setPresence"
    />
    <wwEditorInputRow
        type="onoff"
        label="Get history on join"
        tooltip="Returns the channel message history on join (if its enabled on a channel)"
        bindable
        small
        :model-value="history"
        @update:modelValue="setHistory"
    />
    <wwEditorInputRow
        type="onoff"
        label="Queue offline actions"
        tooltip="In the event of a disconnect, or when sending actions before the channel connection is established, actions will be put in a queue and sent as soon as the connection is established"
        bindable
        small
        :model-value="queueOfflineActions"
        @update:modelValue="setQueueOfflineActions"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        channel() {
            return this.args.channel || '';
        },
        presence() {
            return this.args.presence ?? false;
        },
        history() {
            return this.args.history ?? false;
        },
        queueOfflineActions() {
            return this.args.queueOfflineActions ?? true;
        },
    },
    methods: {
        setChannel(channel) {
            this.$emit('update:args', { ...this.args, channel });
        },
        setPresence(presence) {
            this.$emit('update:args', { ...this.args, presence });
        },
        setHistory(history) {
            this.$emit('update:args', { ...this.args, history });
        },
        setQueueOfflineActions(queueOfflineActions) {
            this.$emit('update:args', { ...this.args, queueOfflineActions });
        },
    },
};
</script>
