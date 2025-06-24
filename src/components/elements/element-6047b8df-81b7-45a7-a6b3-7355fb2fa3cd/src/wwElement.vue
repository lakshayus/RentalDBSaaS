<template>
    <div class="ww-progress-bar" :style="cssVariables">
        <div class="progression">
            <wwElement
                v-if="content.label === 'progress'"
                v-bind="content.progressionLabel"
                :ww-props="{ text: `${value}%` }"
            />
        </div>
        <wwElement
            v-if="content.label === 'element'"
            v-bind="content.progressionLabel"
            :ww-props="{ text: `${value}%` }"
        />
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
    },
    emits: ['update:content:effect', 'trigger-event'],
    setup(props) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            type: 'number',
            defaultValue: computed(() => {
                let val = parseInt(props.content.value);
                if (isNaN(val)) val = 0;
                return val === undefined ? 0 : val;
            }),
        });


        return {
            variableValue,
            setValue,
        };
    },
    computed: {
        value() {
            let val = parseInt(this.variableValue);
            if (isNaN(val)) return 0;
            return val;
        },
        cssVariables() {
            return {
                '--progression': `${this.value}%`,
                '--selector-color': `${this.content.progressBarColor}`,
            };
        },
    },
    watch: {
        'content.value'(newValue) {
            if (newValue === undefined) return;
            newValue = parseInt(this.content.value);
            if (isNaN(newValue)) newValue = 0;
            if (newValue === this.value) return;
            this.setValue(newValue);
            this.$emit('trigger-event', { name: 'change', event: { value: newValue } });
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-progress-bar {
    justify-content: center;
    align-items: center;
    box-sizing: content-box;
    position: relative;
    transition: inherit;
    overflow: hidden;
    .progression {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: var(--progression);
        background: var(--selector-color);
        border-radius: inherit;
        transition: inherit;
    }
}
</style>
