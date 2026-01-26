export function getMonth(year, month) {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    return { start, end };
}