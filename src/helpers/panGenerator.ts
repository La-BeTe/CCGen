import rng from "./randomNumberGenerator";
import luhnChecker from "./luhnChecker";

interface Options<T extends string | number> {
    startsWith?: T;
    endsWith?: T;
    length?: T;
    contains?: T;
}

function validateNum(suspectedNum: unknown) {
    const tempNum = Number(suspectedNum);
    return !Number.isNaN(tempNum);
}

export default function ({
    startsWith,
    endsWith,
    length,
    contains
}: Options<string | number> = {}) {
    let result = "",
        endsWithStr = "",
        startsWithStr = "",
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
        modifiersLength += startsWithStr.length;
        result = startsWithStr + result.slice(startsWithStr.length);
    }
    if (typeof endsWith !== "undefined" && validateNum(endsWith)) {
        endsWithStr = String(endsWith);
        modifiersLength += endsWithStr.length;
        result =
            result.slice(0, result.length - endsWithStr.length) + endsWithStr;
    }
    if (typeof contains !== "undefined" && validateNum(contains)) {
        containsStr = String(contains);
        modifiersLength += containsStr.length;
        result =
            result.slice(0, startsWithStr.length || 7) +
            containsStr +
            result.slice((startsWithStr.length || 7) + containsStr.length);
    }
    if (modifiersLength > 10)
        throw new Error(
            "The 'startsWith', 'contains' and 'endsWith' argument should have a combined length less than or equal to 10"
        );
    for (let i = 0, j = 0; i < 10; i++) {
        if (luhnChecker(result)) break;
        if (endsWithStr === "") {
            result = result.slice(0, -1) + luhnChecker(result, true);
        } else {
            const splitResult = result.split("");
            if (i === 0) {
                j = splitResult.findIndex((_, k) => {
                    return (
                        k > modifiersLength - endsWithStr.length &&
                        result[k] === originalStr[k]
                    );
                });
            }
            splitResult[j] = String(i);
            result = splitResult.join("");
        }
    }
    return result;
}
