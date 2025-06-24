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
        type="query"
        label="Message"
        placeholder="Message"
        bindable
        small
        required
        :model-value="message"
        @update:modelValue="setMessage"
    />
    <wwEditorFormRow label="Audience">
        <wwEditorInputRadio
            :model-value="audience"
            :choices="[
                { label: 'Everyone', value: 'public' },
                { label: 'Authenticated', value: 'authenticated' },
                { label: 'Single', value: 'private' },
            ]"
            small
            @update:modelValue="setAudience"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        v-if="audience === 'private'"
        type="query"
        label="Socket ID"
        placeholder="Socket ID"
        bindable
        small
        :model-value="socketId"
        @update:modelValue="setSocketId"
        tooltip="You can find the source socket id in every message received. You can get the list of every connected clients by using the `Get Presence` action."
    />
    <div class="content-secondary body-sm mb-2">
        {{
            audience === 'public'
                ? 'Every users in the channel will receive the message'
                : audience === 'authenticated'
                ? 'Only authenticated users in the channel will receive the message'
                : 'Only the specified user (socket id) in the channel will receive the message'
        }}
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
        message() {
            return this.args.message || '';
        },
        socketId() {
            return this.args.socketId ?? null;
        },
        audience() {
            return this.args.audience ?? 'public';
        },
    },
    methods: {
        setChannel(channel) {
            this.$emit('update:args', { ...this.args, channel });
        },
        setMessage(message) {
            this.$emit('update:args', { ...this.args, message });
        },
        setSocketId(socketId) {
            this.$emit('update:args', { ...this.args, socketId });
        },
        setAudience(audience) {
            this.$emit('update:args', { ...this.args, audience, socketId: null });
        },
    },
};
</script>
