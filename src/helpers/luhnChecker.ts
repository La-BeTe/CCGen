export default function (
    num: string | number,
    returnCorrectCheckDigit = false
) {
    // num = Number(num);
    // if (Number.isNaN(num)) return false;
    // // Luhn Check algo below
    // let checkDigit,
    //     sum = 0;
    // for (let i = 0; num >= 1; i++) {
    //     const current = num % 10;
    //     num = Math.floor(num / 10);
    //     if (i === 0) {
    //         checkDigit = current;
    //     } else if (i % 2 === 0) {
    //         sum += current;
    //     } else {
    //         let k = current * 2;
    //         if (k > 9) {
    //             k -= 9;
    //         }
    //         sum += k;
    //     }
    // }
    // const correctCheckDigit = (sum * 9) % 10;
    // return returnCorrectCheckDigit
    //     ? String(correctCheckDigit)
    //     : correctCheckDigit === checkDigit;

    // We're using the below instead of above, so luhnChecker can handle large numbers
    // Javascript is unable to properly represent numbers larger than 2^53,
    // so they should be passed in as strings
    if (isNaN(num as number)) return false;
    if (typeof num === "number" && num > Math.pow(2, 53))
        throw new Error(`${num} is too large, pass as a string instead`);
    num = String(num);
    const numArr = num.split("");
    let checkDigit: number;
    const sum = numArr.reduceRight((sum, val, i) => {
        const currentIndex = numArr.length - i - 1;
        const numVal = Number(val);
        let newSum: number;
        if (currentIndex === 0) {
            checkDigit = numVal;
            newSum = sum;
        } else if (currentIndex % 2 === 0) {
            newSum = sum + numVal;
        } else {
            let k = numVal * 2;
            newSum = k > 9 ? sum + k - 9 : sum + k;
        }
        return newSum;
    }, 0);
    const correctCheckDigit = (sum * 9) % 10;
    return returnCorrectCheckDigit
        ? String(correctCheckDigit)
        : correctCheckDigit === Number(numArr[numArr.length - 1]);
}
