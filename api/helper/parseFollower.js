export default function parseFollowers(input) {
    if (!input || typeof input !== 'string') return null;

    //Chuẩn hoá
    let value = input.toLowerCase().replace(/\s+/g, '');
    let multiplier = 1;

    if (value.endsWith('k')) {
        multiplier = 1000;
        value = value.slice(0, -1);
    } else if (value.endsWith('tr')) {
        multiplier = 1_000_000;
        value = value.slice(0, -2);
    }

    //Đổi dấu phẩy → dấu chấm chấm
    value = value.replace(',', '.');

    const number = Number(value);
    if (Number.isNaN(number)) return null;

    return number * multiplier;
}