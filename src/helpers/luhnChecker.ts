export default function (num: string | number) {
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
            let kToBeAddedToSum = 0;
            if (k > 9) {
                while (k >= 1) {
                    kToBeAddedToSum += k % 10;
                    k = Math.floor(k / 10);
                }
            } else {
                kToBeAddedToSum = k;
            }
            sum += kToBeAddedToSum;
        }
    }
    return (sum * 9) % 10 === checkDigit;
}
