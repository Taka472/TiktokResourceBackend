export default function parseFollowers(input) {
    if (!input) return 0;

    const raw = input.toString().toLowerCase().trim();

    // chấp nhận cả . và ,
    const match = raw.match(/^(\d+)(?:[.,](\d+))?\s*(k|tr)?$/);

    if (!match) return 0;

    const intPart = Number(match[1]);
    const decimalPart = match[2] ? Number(match[2]) : 0;
    const decimalLength = match[2]?.length || 0;

    let value =
        intPart +
        (decimalPart / Math.pow(10, decimalLength));

    if (match[3] === "k") return Math.round(value * 1000);
    if (match[3] === "tr") return Math.round(value * 1_000_000);

    return Math.round(value);
}