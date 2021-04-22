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

    test("should handle large numbers passed as strings but throw error if the large number is passed literally", () => {
        expect(luhnChecker("15722340029689988343")).toBe(true);
        expect(() => luhnChecker(15722340029689988343)).toThrow();
    });

    test("should return correct check digit if second argument is truthy", () => {
        expect(luhnChecker(4007784877621333, true)).toEqual("8");
    });

    test("should also work with strings", () => {
        expect(luhnChecker("4007784877621338")).toBe(true);
        expect(luhnChecker("1407784877612338")).toBe(false);
    });
});
