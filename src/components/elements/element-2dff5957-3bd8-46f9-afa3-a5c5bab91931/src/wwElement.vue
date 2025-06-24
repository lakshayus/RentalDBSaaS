<template>
    <div class="ww-form-input-range" :style="cssVars">
        <div v-if="content.isTooltip" :style="tooltipStyle" id="tooltiptext" class="ww-form-input-range__tooltip">
            {{ value }}
        </div>
        <input
            ref="input"
            :value="value"
            :class="{ editing: isEditing }"
            type="range"
            :name="wwElementState.name"
            :required="content.required"
            :style="style"
            :min="content.min"
            :max="content.max"
            :step="content.step"
            @input="handleManualInput($event)"
        />
    </div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['trigger-event'],
    setup(props) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            type: 'number',
            defaultValue: computed(() => {
                let value = parseFloat(props.content.value);
                value = isNaN(value) ? 0 : value;
                return value;
            }),
        });

        const isDebouncing = ref(false);
        let debounceTimeout = null;

        return { variableValue, setValue, isDebouncing, debounceTimeout };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        value() {
            return this.variableValue;
        },
        cssVars() {
            const ratio = ((this.value - this.content.min) / (this.content.max - this.content.min)) * 100;
            if (!this.content || !this.content.globalStyle)
                return {
                    '--ratio': `${ratio}%`,
                };
            return {
                '--range-border': this.content.globalStyle.rangeBorderColor,
                '--range-background': this.content.globalStyle.rangeBackgroundColor,
                '--active-range-background': this.content.globalStyle.useActiveRangeBackground
                    ? this.content.globalStyle.activeRangeBackgroundColor
                    : this.content.globalStyle.rangeBackgroundColor,
                '--selector-border': this.content.globalStyle.selectorBorderColor,
                '--selector-background': this.content.globalStyle.selectorBackgroundColor,
                '--ratio': `${ratio}%`,
            };
        },
        tooltipStyle() {
            const ratio = (this.value - this.content.min) / (this.content.max - this.content.min);
            return {
                fontSize: this.content.globalStyle.fontSize,
                fontFamily: this.content.globalStyle.fontFamily,
                '--tooltip-background': this.content.globalStyle.tooltipBackground,
                '--tooltip-text-color': this.content.globalStyle.tooltipTextColor,
            };
        },
        delay() {
            return this.content.debounceDelay ? wwLib.wwUtils.getLengthUnit(this.content.debounceDelay)[0] : 500;
        },
    },
    watch: {
        'content.value'(newValue) {
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) newValue = 0;
            if (newValue === this.value) return;
            this.setValue(newValue);
            this.$emit('trigger-event', { name: 'initValueChange', event: { value: newValue } });
        },
    },
    methods: {
        handleManualInput(event) {
            const value = parseFloat(event.target.value);
            if (isNaN(value)) value = 0;
            if (value === this.value) return;
            this.setValue(value);

            if (this.content.debounce) {
                this.isDebouncing = true;
                if (this.debounceTimeout) {
                    clearTimeout(this.debounceTimeout);
                }
                this.debounceTimeout = setTimeout(() => {
                    this.$emit('trigger-event', { name: 'change', event: { domEvent: event, value } });
                    this.isDebouncing = false;
                }, this.delay);
            } else {
                this.$emit('trigger-event', { name: 'change', event: { domEvent: event, value } });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-form-input-range {
    position: relative;
    width: 100%;
    outline: none;
    font-family: inherit;
    border: inherit;
    &::placeholder {
        color: inherit;
        opacity: 0.7;
    }
    input[type='range'] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 10px 0;
        width: 100%;
        background: transparent;
    }
    input[type='range']:focus {
        outline: none;
    }
    input[type='range']::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        box-shadow: 0px 0px 0px #000000;
        background: linear-gradient(var(--active-range-background), var(--active-range-background)) 0 / var(--ratio)
            100% no-repeat var(--range-background);
        border-radius: 1px;
        border: 0px solid #000000;
    }
    input[type='range']::-webkit-slider-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid var(--selector-border);
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: var(--selector-background);
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -7px;
    }
    input[type='range']::-moz-range-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        box-shadow: 0px 0px 0px #000000;
        background: linear-gradient(var(--active-range-background), var(--active-range-background)) 0 / var(--ratio)
            100% no-repeat var(--range-background);
        border-radius: 1px;
        border: 0px solid #000000;
    }
    input[type='range']::-moz-range-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid var(--selector-border);
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: var(--selector-background);
        cursor: pointer;
    }
    input[type='range']::-ms-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
    }
    input[type='range']::-ms-fill-lower {
        background: linear-gradient(var(--active-range-background), var(--active-range-background)) 0 / var(--ratio)
            100% no-repeat var(--range-background);
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
    }
    input[type='range']::-ms-fill-upper {
        background: linear-gradient(var(--active-range-background), var(--active-range-background)) 0 / var(--ratio)
            100% no-repeat var(--range-background);
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
    }
    input[type='range']::-ms-thumb {
        margin-top: 1px;
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid var(--selector-border);
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: var(--selector-background);
        cursor: pointer;
    }
    input[type='range']:focus::-ms-fill-lower {
        background: linear-gradient(var(--active-range-background), var(--active-range-background)) 0 / var(--ratio)
            100% no-repeat var(--range-background);
    }
    input[type='range']:focus::-ms-fill-upper {
        background: linear-gradient(var(--active-range-background), var(--active-range-background)) 0 / var(--ratio)
            100% no-repeat var(--range-background);
    }
    &__tooltip {
        visibility: visible;
        box-sizing: border-box;
        background-color: var(--tooltip-background);
        color: var(--tooltip-text-color);
        text-align: center;
        padding: 5px 15px;
        border-radius: 6px;
        position: absolute;
        z-index: 20;
        top: 0px;
        left: var(--ratio);
        transform: translateY(-120%) translateX(-50%);
    }
    &:hover &__tooltiptext {
        visibility: visible;
    }
}
</style>
