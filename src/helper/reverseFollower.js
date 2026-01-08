export default function formatFollowers(number) {
  if (typeof number !== 'number' || Number.isNaN(number)) return null;

  if (number >= 1_000_000) {
    return format(number / 1_000_000) + 'tr';
  }

  if (number >= 1_000) {
    return format(number / 1_000) + 'k';
  }

  return String(number);
}

function format(value) {
  // Giữ tối đa 1 chữ số thập phân, bỏ .0
  let result = value.toFixed(1);

  if (result.endsWith('.0')) {
    result = result.slice(0, -2);
  }

  // Đổi dấu chấm thành dấu phẩy
  return result.replace('.', ',');
}