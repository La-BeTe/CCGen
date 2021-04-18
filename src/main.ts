import luhnChecker from "./helpers/luhnChecker";

export default class CCGen {
    generateCC() {}
    validatePAN<T extends string | number>(...pans: T[]) {
        const result: { [x: string]: boolean } = {};
        for (const pan of pans) {
            if (String(pan).length < 16) {
                result[pan] = false;
            } else {
                result[pan] = luhnChecker(pan);
            }
        }
        return pans.length === 1 ? result[pans[0]] : result;
    }
}
