<template>
    <component
        :is="tag"
        class="ww-button"
        :class="{ button: tag, '-link': hasLink && !isEditing, active: isActive }"
        :type="buttonType"
        :style="buttonStyle"
        :data-ww-flag="'btn-' + content.buttonType"
        :disabled="content.disabled"
        v-bind="properties"
        @focus="isReallyFocused = true"
        @blur="onBlur($event)"
        @mousedown="onActivate"
        @mouseup="onDeactivate"
        @mouseleave="onDeactivate"
        @touchstart="onActivate"
        @touchend="onDeactivate"
        @touchcancel="onDeactivate"
        @keydown.enter="onActivate"
        @keydown.space="onActivate"
        @keyup.enter="onDeactivate"
        @keyup.space="onDeactivate"
    >
        <wwElement v-if="content.hasLeftIcon && content.leftIcon" v-bind="content.leftIcon"></wwElement>
        <wwText tag="span" :text="text"></wwText>
        <wwElement v-if="content.hasRightIcon && content.rightIcon" v-bind="content.rightIcon"></wwElement>
    </component>
</template>

<script>
import { computed } from 'vue';
const TEXT_ALIGN_TO_JUSTIFY = {
    center: 'center',
    right: 'flex-end',
    left: 'flex-start',
    justify: 'center',
};
export default {
    props: {
        content: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: [
        'update:content',
        'update:content:effect',
        'change-menu-visibility',
        'change-borders-style',
        'add-state',
        'remove-state',
        'trigger-event',
    ],
    setup(props) {
        const {
            hasLink,
            tag: linkTag,
            properties,
        } = wwLib.wwElement.useLink({
            isDisabled: computed(() => props.content.disabled),
        });
        return {
            hasLink,
            linkTag,
            properties,
        };
    },

    data() {
        return {
            isReallyFocused: false,
            isReallyActive: false,
        };
    },
    computed: {
        buttonStyle() {
            return {
                justifyContent: TEXT_ALIGN_TO_JUSTIFY[this.content['_ww-text_textAlign']] || 'center',
            };
        },
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        tag() {
            if (this.isEditing) return 'div';
            if (this.hasLink) {
                return this.linkTag;
            }
            if (
                this.content.buttonType === 'submit' ||
                this.content.buttonType === 'reset' ||
                this.content.buttonType === 'button'
            )
                return 'button';
            return 'div';
        },
        buttonType() {
            if (this.isEditing || this.hasLink) return '';
            if (
                this.content.buttonType === 'submit' ||
                this.content.buttonType === 'reset' ||
                this.content.buttonType === 'button'
            )
                return this.content.buttonType;
            return '';
        },
        text() {
            return this.wwElementState.props.text;
        },
        isFocused() {
            return this.isReallyFocused;
        },
        isActive() {
            return this.isReallyActive;
        },
    },
    watch: {
        'content.disabled': {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'disabled');
                } else {
                    this.$emit('remove-state', 'disabled');
                }
            },
        },
        isReallyFocused(isFocused, wasFocused) {
            if (isFocused && !wasFocused) {
                this.$emit('trigger-event', { name: 'focus' });
            } else if (!isFocused && wasFocused) {
                this.$emit('trigger-event', { name: 'blur' });
            }
        },
        isFocused: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'focus');
                } else {
                    this.$emit('remove-state', 'focus');
                }
            },
        },
        isActive: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'active');
                } else {
                    this.$emit('remove-state', 'active');
                }
            },
        },
    },
    methods: {
        onBlur() {
            this.isReallyFocused = false;
        },
        onActivate(event) {
            this.isReallyActive = true;
            // Emit the original event name
            const eventName = event.type;
            this.$emit('trigger-event', { name: eventName });
        },
        onDeactivate(event) {
            this.isReallyActive = false;
            // Emit the original event name
            const eventName = event.type;
            this.$emit('trigger-event', { name: eventName });
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-button {
    justify-content: center;
    align-items: center;
    &.button {
        outline: none;
        border: none;
        background: none;
        font-family: inherit;
        font-size: inherit;
    }
    &.-link {
        cursor: pointer;
    }
}
</style>
