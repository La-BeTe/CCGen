import panGenerator from "../../src/helpers/panGenerator";
import luhnChecker from "../../src/helpers/luhnChecker";

describe("PAN Generator", () => {
    test("should return a 16 character string by default", () => {
        expect(panGenerator()).toHaveLength(16);
    });

    test("should return a longer string if the 'length' argument is passed in", () => {
        expect(panGenerator({ length: 20 })).toHaveLength(20);
    });

    test("should return a Luhn-valid PAN", () => {
        expect(luhnChecker(panGenerator())).toBe(true);
    });

    test("should return a Luhn-valid PAN that starts with the 'startsWith' argument", () => {
        const pan = panGenerator({ startsWith: 23456 });
        expect(pan.startsWith("23456")).toBe(true);
        expect(luhnChecker(pan)).toBe(true);
    });

    test("should return a Luhn-valid PAN that ends with the 'endsWith' argument", () => {
        const pan = panGenerator({ endsWith: 23456 });
        expect(pan.endsWith("23456")).toBe(true);
        expect(luhnChecker(pan)).toBe(true);
    });

    test("should return a Luhn-valid PAN that contains the 'contains' argument", () => {
        const pan = panGenerator({ contains: 23456 });
        expect(pan.includes("23456")).toBe(true);
        expect(pan.startsWith("23456")).toBe(false);
        expect(pan.endsWith("23456")).toBe(false);
        expect(luhnChecker(pan)).toBe(true);
    });

    test("should return a Luhn-valid PAN that strts with the 'startsWith' argument, contains the 'contains' argument and ends with the 'endsWith' argument", () => {
        const pan = panGenerator({
            startsWith: 1572,
            contains: 234,
            endsWith: 347
        });
        expect(pan.includes("234")).toBe(true);
        expect(pan.startsWith("1572")).toBe(true);
        expect(pan.endsWith("347")).toBe(true);
        expect(luhnChecker(pan)).toBe(true);
    });

    test("should return a Luhn-valid PAN that strts with the 'startsWith' argument, contains the 'contains' argument, ends with the 'endsWith' argument and is as long as the 'length' argument", () => {
        const pan = panGenerator({
            startsWith: 1572,
            contains: 234,
            endsWith: 347,
            length: 20
        });
        expect(pan.includes("234")).toBe(true);
        expect(pan.startsWith("1572")).toBe(true);
        expect(pan.endsWith("347")).toBe(true);
        expect(pan).toHaveLength(20);
        expect(luhnChecker(pan)).toBe(true);
    });

    test("should work with strings", () => {
        const pan = panGenerator({
            startsWith: "1572",
            contains: "234",
            endsWith: "347",
            length: "20"
        });
        expect(pan.includes("234")).toBe(true);
        expect(pan.startsWith("1572")).toBe(true);
        expect(pan.endsWith("347")).toBe(true);
        expect(pan).toHaveLength(20);
        expect(luhnChecker(pan)).toBe(true);
    });

    test("should work if an object containing the expected arguments is passed in", () => {
        const pan = panGenerator({
            startsWith: 1572,
            contains: 234,
            endsWith: 347,
            length: 20
        });
        expect(pan.includes("234")).toBe(true);
        expect(pan.startsWith("1572")).toBe(true);
        expect(pan.endsWith("347")).toBe(true);
        expect(pan).toHaveLength(20);
        expect(luhnChecker(pan)).toBe(true);
    });

    test("should throw an error if the 'startsWith', 'contains' and 'endsWith' arguments have a combined length greater than 10", () => {
        expect(() => panGenerator({ startsWith: "123445678903" })).toThrow(
            "The 'startsWith', 'contains' and 'endsWith' argument should have a combined length less than or equal to 10"
        );
        expect(() =>
            panGenerator({ startsWith: "12344567", endsWith: 36363636 })
        ).toThrow(
            "The 'startsWith', 'contains' and 'endsWith' argument should have a combined length less than or equal to 10"
        );
    });
});
