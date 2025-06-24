<template>
    <div
        class="ww-dialog"
        :style="!content.overlay && dialogStyle"
        :class="[
            {
                overlay: content.overlay,
                'no-overlay': !content.overlay,
                transform: !content.overlay,
                '-modal': content.type === 'modal',
                '-editing': isEditing,
            },
            !content.overlay && animationClasses,
        ]"
        @click.self="onRootClick"
    >
        <template v-if="!content.overlay">
            <div v-if="content.clickOutsideCloses" @click="onCloseInterceptorClick" class="interceptor"></div>
        </template>

        <wwLayout
            path="children"
            class="content"
            role="dialog"
            :style="content.overlay && dialogStyle"
            :class="[
                { transform: content.overlay, '-modal': content.type === 'modal' },
                content.overlay && animationClasses,
            ]"
        ></wwLayout>
    </div>
</template>

<script>
import { computed, onBeforeUnmount, watchEffect, inject, unref } from 'vue';
import { useDialogStyle } from './composables/useDialogStyle';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
    },
    setup(props, { emit }) {
        const isEditing = computed(() => {
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const { getModalStyle, getSheetStyle } = useDialogStyle();

        // TODO: will not work with several instances
        watchEffect(() => {
            if (props.content.preventScroll && !isEditing.value) {
                wwLib.getFrontDocument().documentElement.classList.add('ww-dialog-open');
            } else {
                wwLib.getFrontDocument().documentElement.classList.remove('ww-dialog-open');
            }
        });

        const animationDuration = computed(() => {
            return props.content.animationDuration + 'ms';
        });
        const animationEasing = computed(() => {
            return props.content.animationEasing;
        });

        const dialogStyle = computed(() => {
            let style = {};
            switch (props.content.type) {
                case 'modal':
                    style = getModalStyle(
                        props.content.sideModal,
                        props.content.align,
                        props.content.customPositionX,
                        props.content.customPositionY
                    );
                    break;
                case 'sheet':
                    style = getSheetStyle(props.content.sideSheet);
                    break;
            }
            return style;
        });

        const localContext = inject('_wwLocalContext', null);

        function onEscapeKeyDown(event) {
            if (isEditing.value) return;
            if (event.key !== 'Escape') return;
            if (!props.content.escClose) return;
            unref(localContext)?.methods?.popup?.close.method();
        }

        watchEffect(() => {
            if (props.content.escClose) {
                wwLib.getFrontDocument().addEventListener('keydown', onEscapeKeyDown);
            } else {
                wwLib.getFrontDocument().removeEventListener('keydown', onEscapeKeyDown);
            }
        });

        onBeforeUnmount(() => {
            wwLib.getFrontDocument().removeEventListener('keydown', onEscapeKeyDown);
            wwLib.getFrontDocument().documentElement.classList.remove('ww-dialog-open');
        });

        return {
            dialogStyle,
            animationClasses: computed(() => {
                return {
                    'fade-animation': props.content.animation === 'fade',
                    'zoomin-animation': props.content.animation === 'zoom',
                    'slideDown-animation':
                        props.content.animation === 'slide-in' && props.content.slideInDirection === 'bottom',
                    'slideUp-animation':
                        props.content.animation === 'slide-in' && props.content.slideInDirection === 'top',
                    'slideLeft-animation':
                        props.content.animation === 'slide-in' && props.content.slideInDirection === 'left',
                    'slideRight-animation':
                        props.content.animation === 'slide-in' && props.content.slideInDirection === 'right',
                };
            }),
            animationDuration,
            animationEasing,
            onRootClick: () => {
                if (isEditing.value) {
                    return;
                }
                if (props.content.overlay && props.content.overlayClickCloses) {
                    unref(localContext)?.methods?.popup?.close.method();
                }
            },
            onCloseInterceptorClick: event => {
                if (isEditing.value) {
                    return;
                }
                event.stopPropagation();
                if (props.content.clickOutsideCloses) {
                    unref(localContext)?.methods?.popup?.close.method();
                }
            },
            onInterceptorClick: event => {
                if (isEditing.value) {
                    return;
                }
                if (props.content.preventInteractionsOutside) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            isEditing,
        };
    },
};
</script>

<style lang="scss" scoped>
.no-overlay {
    display: flex;
    flex-direction: var(--content-flow, row);
    &.-modal {
        flex-direction: column;
        width: 100%;
        height: 100dvh;
    }
    pointer-events: none !important;
    .content > * {
        pointer-events: initial;
    }
    &:not(.-editing) {
        .interceptor {
            pointer-events: initial;
        }
    }
}
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw !important;
    height: 100dvh !important;
    --ww-overlay-background-color: v-bind(content.overlayBackgroundColor);
    background-color: var(--ww-overlay-background-color, rgba(0, 0, 0, 0.5)) !important;
}
.interceptor {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw !important;
    height: 100dvh !important;
}

.content {
    display: flex;
    flex-direction: var(--content-flow, row);
    pointer-events: none;
    > * {
        pointer-events: initial;
    }
    &.-modal {
        flex-direction: column;
        align-items: var(--align-items);
        justify-content: var(--justify-content);
        width: 100%;
        height: 100dvh;
    }
}

.ww-dialog {
    isolation: isolate;
}

.fade-animation {
    animation: fadeIn v-bind(animationDuration) v-bind(animationEasing);
    will-change: opacity;
}
.zoomin-animation {
    animation: zoomIn v-bind(animationDuration) v-bind(animationEasing);
    will-change: opacity, transform;
}
.slideDown-animation {
    animation: slideDown v-bind(animationDuration) v-bind(animationEasing);
    will-change: opacity, transform;
}
.slideUp-animation {
    animation: slideUp v-bind(animationDuration) v-bind(animationEasing);
    will-change: opacity, transform;
}
.slideLeft-animation {
    animation: slideLeft v-bind(animationDuration) v-bind(animationEasing);
    will-change: opacity, transform;
}
.slideRight-animation {
    animation: slideRight v-bind(animationDuration) v-bind(animationEasing);
    will-change: opacity, transform;
}

.transform {
    --translate-x: 0px;
    --translate-y: 0px;
    transform: translate(var(--translate-x), var(--translate-y));
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: translate(var(--translate-x), var(--translate-y)) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translate(var(--translate-x), var(--translate-y)) scale(1);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translate(var(--translate-x), calc(var(--translate-y) - 30px));
    }
    to {
        opacity: 1;
        transform: translate(var(--translate-x), calc(var(--translate-y)));
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translate(var(--translate-x), calc(var(--translate-y) + 30px));
    }
    to {
        opacity: 1;
        transform: translate(var(--translate-x), calc(var(--translate-y)));
    }
}

@keyframes slideLeft {
    from {
        opacity: 0;
        transform: translate(calc(var(--translate-x) - 30px), var(--translate-y));
    }
    to {
        opacity: 1;
        transform: translate(var(--translate-x), calc(var(--translate-y)));
    }
}
@keyframes slideRight {
    from {
        opacity: 0;
        transform: translate(calc(var(--translate-x) + 30px), var(--translate-y));
    }
    to {
        opacity: 1;
        transform: translate(var(--translate-x), calc(var(--translate-y)));
    }
}
</style>

<style>
.ww-dialog-open {
    overflow: hidden !important;
}
</style>
