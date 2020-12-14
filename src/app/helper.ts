export const convertToPercent = (reference: number, value: number) => {
    return `${(value / reference * 100).toFixed(5)}%`;
}
