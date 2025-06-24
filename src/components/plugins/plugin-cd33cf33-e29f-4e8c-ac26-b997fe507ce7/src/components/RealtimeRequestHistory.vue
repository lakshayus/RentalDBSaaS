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
    <div class="content-secondary body-sm mb-2">
        Sends a message to realtime requesting the latest channel history. You have to setup a workflow on `history`
        event type to listen the response.
    </div>
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
            return this.args.channel || [];
        },
    },
    methods: {
        setChannel(channel) {
            this.$emit('update:args', { ...this.args, channel });
        },
    },
};
</script>
