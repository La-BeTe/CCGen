export default function (
    num: string | number,
    returnCorrectCheckDigit = false
) {
    num = Number(num);
    if (Number.isNaN(num)) return false;
    // Luhn Check algo below
    let checkDigit,
        sum = 0;
    for (let i = 0; num >= 1; i++) {
        const current = num % 10;
        num = Math.floor(num / 10);
        if (i === 0) {
            checkDigit = current;
        } else if (i % 2 === 0) {
            sum += current;
        } else {
            let k = current * 2;
            if (k > 9) {
                k -= 9;
            }
            sum += k;
        }
    }
    const correctCheckDigit = (sum * 9) % 10;
    return returnCorrectCheckDigit
        ? String(correctCheckDigit)
        : correctCheckDigit === checkDigit;
}
