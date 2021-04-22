import rng from "./randomNumberGenerator";
import luhnChecker from "./luhnChecker";

interface Options<T extends string | number> {
    startsWith?: T;
    endsWith?: T;
    length?: T;
    contains?: T;
    startsWithIsBin?: boolean;
}

function validateNum(suspectedNum: unknown) {
    const tempNum = Number(suspectedNum);
    return !Number.isNaN(tempNum);
}

export default function ({
    startsWith,
    endsWith,
    length,
    contains,
    startsWithIsBin
}: Options<string | number> = {}) {
    let result = "",
        endsWithStr = "",
        startsWithStr = "",
        // originalStr keeps track of the initially generated random string
        // so we can modify it if the generated string does not pass the Luhn check
        originalStr = "",
        containsStr = "";
    // Passing a default length of 16
    let validatedLength = 16,
        modifiersLength = 0;

    if (typeof length !== "undefined" && validateNum(length)) {
        const numLength = Number(length);
        validatedLength = numLength > 16 ? numLength : 16;
    }
    // Generate a random number with the passed in length or 16
    originalStr = result = rng({ length: validatedLength });
    if (typeof startsWith !== "undefined" && validateNum(startsWith)) {
        startsWithStr = String(startsWith);
        if (!startsWithIsBin) modifiersLength += startsWithStr.length;
        result = startsWithStr + result.slice(startsWithStr.length);
        originalStr = originalStr.slice(startsWithStr.length);
    }
    if (typeof endsWith !== "undefined" && validateNum(endsWith)) {
        endsWithStr = String(endsWith);
        modifiersLength += endsWithStr.length;
        result =
            result.slice(0, result.length - endsWithStr.length) + endsWithStr;
        originalStr = originalStr.slice(
            0,
            originalStr.length - endsWithStr.length
        );
    }
    if (typeof contains !== "undefined" && validateNum(contains)) {
        containsStr = String(contains);
        modifiersLength += containsStr.length;
        result =
            result.slice(0, startsWithStr.length || 7) +
            containsStr +
            result.slice((startsWithStr.length || 7) + containsStr.length);
        originalStr = originalStr.slice(containsStr.length);
    }
    if (modifiersLength > 10) {
        throw new Error(
            "The 'startsWith', 'contains' and 'endsWith' argument should have a combined length less than or equal to 10"
        );
    } else if (startsWithIsBin && modifiersLength > 8) {
        // It is 8 here so we can move back a character in the loop below
        // if indexOfLastCharInOriginalStr is a doubled number
        throw new Error(
            "The 'contains' and 'endsWith' argument should have a combined length less than or equal to 8"
        );
    }
    for (let i = 0, indexOfLastCharInOriginalStr = 0; i <= 10; i++) {
        if (luhnChecker(result)) break;
        if (endsWithStr === "") {
            result = result.slice(0, -1) + luhnChecker(result, true);
        } else {
            if (i === 0) {
                // On first iteration, find the index of the last character in 'result' that hasn't been modified
                // We start searching after the startsWith and contains modifier strings, just in case they also contain the original string
                indexOfLastCharInOriginalStr =
                    result.indexOf(
                        originalStr,
                        startsWithStr.length + containsStr.length
                    ) +
                    originalStr.length -
                    1;
                if (indexOfLastCharInOriginalStr % 2 === validatedLength % 2) {
                    // If the index is to be doubled in the Luhn check, move to the previous character
                    indexOfLastCharInOriginalStr--;
                }
            }
            const newStrArr = result.split("");
            newStrArr[indexOfLastCharInOriginalStr] = String(i);
            result = newStrArr.join("");
        }
    }
    return result;
}
