import luhnChecker from "../../src/helpers/luhnChecker";

describe("Luhn Checker", () => {
    test("should return false if passed an invalid number", () => {
        // @ts-ignore
        expect(luhnChecker(true)).toBe(false);
        // @ts-ignore
        expect(luhnChecker([])).toBe(false);
        // @ts-ignore
        expect(luhnChecker({})).toBe(false);
        expect(luhnChecker("test1234")).toBe(false);
    });

    test("should return false if PAN fails Luhn validation", () => {
        expect(luhnChecker(1407784877612338)).toBe(false);
    });

    test("should return true if PAN is Luhn valid", () => {
        expect(luhnChecker(4007784877621338)).toBe(true);
    });

    test("should also work with strings", () => {
        expect(luhnChecker("4007784877621338")).toBe(true);
        expect(luhnChecker("1407784877612338")).toBe(false);
    });
});
