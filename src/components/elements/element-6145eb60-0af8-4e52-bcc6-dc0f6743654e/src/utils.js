export function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export function findValueIndex(array, value) {
    if (typeof value === 'object' && value !== null) {
        return array.findIndex(item => {
            if (typeof item !== 'object' || item === null) return false;
            return JSON.stringify(item) === JSON.stringify(value);
        });
    } else {
        return array.indexOf(value);
    }
}

export function areValuesEqual(value1, value2) {
    if (typeof value1 === 'object' && value1 !== null && typeof value2 === 'object' && value2 !== null) {
        return JSON.stringify(value1) === JSON.stringify(value2);
    }
    return value1 === value2;
}
