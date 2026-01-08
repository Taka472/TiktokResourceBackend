export default function getStartEndOfTodayVN() {
    const now = new Date();

    const vnNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    const start = new Date(vnNow);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(vnNow);
    end.setUTCHours(23, 59, 59, 999);

    return {
        startOfDay: start,
        endOfDay: end,
    };
}