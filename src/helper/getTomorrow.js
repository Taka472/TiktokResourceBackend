export default function getStartOfTomorrowVN() {
    const now = new Date();

    // Chuyển sang giờ VN (UTC+7)
    const vnNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // Set sang 00:00 ngày mai (giờ VN)
    vnNow.setHours(0, 0, 0, 0);
    vnNow.setDate(vnNow.getDate() + 1);

    // Chuyển ngược lại UTC để lưu/query Mongo
    return new Date(vnNow.getTime() - 7 * 60 * 60 * 1000);
}