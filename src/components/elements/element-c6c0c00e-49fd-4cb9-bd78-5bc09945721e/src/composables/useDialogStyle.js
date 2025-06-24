export function useDialogStyle() {
    function getTransitionName(animation, slideInDirection) {
        switch (animation) {
            case 'fade':
                return 'fade-transition';
            case 'slide-in':
                switch (slideInDirection) {
                    default:
                        return 'slide-in-left-transition';
                    case 'left':
                        return 'slide-in-left-transition';
                    case 'right':
                        return 'slide-in-right-transition';
                    case 'top':
                        return 'slide-in-top-transition';
                    case 'bottom':
                        return 'slide-in-bottom-transition';
                }
            case 'zoom':
                return 'zoom-transition';
            default:
                return '';
        }
    }

    function getModalStyle(side, align, customPositionX, customPositionY) {
        const style = {
            position: 'fixed',
        };

        switch (side) {
            case 'left':
                style.left = 0;
                style['--align-items'] = 'flex-start';
                break;
            case 'right':
                style.right = 0;
                style['--align-items'] = 'flex-end';
                break;
            case 'custom':
                style.left = customPositionX;
                style['--align-items'] = 'flex-start';
                break;
            default:
                style.left = '50%';
                style['--translate-x'] = '-50%';
                style['--align-items'] = 'center';
                break;
        }

        switch (align) {
            case 'top':
                style.top = 0;
                style['--justify-content'] = 'flex-start';
                break;
            case 'bottom':
                style.bottom = 0;
                style['--justify-content'] = 'flex-end';
                break;
            case 'custom':
                style.top = customPositionY;
                style['--justify-content'] = 'flex-start';
                break;
            default:
                style.top = '50%';
                style['--translate-y'] = '-50%';
                style['--justify-content'] = 'center';
                break;
        }

        return style;
    }

    function getSheetStyle(side) {
        const style = {
            position: 'fixed',
        };

        switch (side) {
            case 'left':
                Object.assign(style, {
                    height: '100dvh',
                    top: 0,
                    bottom: 0,
                    left: 0,
                });
                break;
            case 'right':
                Object.assign(style, {
                    height: '100dvh',
                    top: 0,
                    bottom: 0,
                    right: 0,
                });
                break;
            case 'top':
                Object.assign(style, {
                    width: '100dvw',
                    top: 0,
                    left: 0,
                    right: 0,
                    '--content-flow': 'column',
                });
                break;
            case 'bottom':
                Object.assign(style, {
                    width: '100dvw',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    '--content-flow': 'column',
                });
                break;
        }

        return style;
    }

    return {
        getModalStyle,
        getSheetStyle,
        getTransitionName,
    };
}
