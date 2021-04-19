type Options = {
    length?: string | number;
    max?: string | number;
    min?: string | number;
};

function stringify(arg: unknown) {
    return typeof arg === "string" ? arg : JSON.stringify(arg);
}

export default function (options: Options) {
    if (typeof options !== "object")
        throw new Error(
            `Random Number Generator expects an object argument, got '${options}'`
        );
    const { length, max, min } = options;
    let result = "";
    // Handler for if 0 is passed in for length
    if (length === 0 || length) {
        const numLength = Number(length);
        if (Number.isNaN(numLength))
            throw new Error(
                `Random Number Generator requires a numeric length argument, got '${stringify(
                    length
                )}'`
            );
        while (result.length < length) {
            const randomNum =
                Math.floor(Math.random() * Date.now() * Math.random()) % 10;
            result += randomNum;
        }
    } else {
        let numMin = Number(min);
        let numMax = Number(max);
        if (Number.isNaN(numMin))
            throw new Error(
                `Random Number Generator requires a numeric min argument, got '${stringify(
                    min
                )}'`
            );
        if (Number.isNaN(numMax))
            throw new Error(
                `Random Number Generator requires a numeric max argument, got '${stringify(
                    max
                )}'`
            );
        if (numMax < numMin) [numMin, numMax] = [numMax, numMin];
        const randomNum = Math.floor(
            Math.random() * Math.random() * (numMax - numMin) + numMin
        );
        result = String(randomNum);
    }
    return result;
}
