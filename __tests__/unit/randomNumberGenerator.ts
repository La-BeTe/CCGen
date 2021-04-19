import rng from "../../src/helpers/randomNumberGenerator";

describe("Random Number Generator", () => {
    test("should generate numbers greater than the min and lesser than the max passed in", () => {
        for (let i = 0; i < 1000; i++) {
            const result = rng({
                min: 1000,
                max: 10000
            });
            expect(Number(result)).toBeLessThanOrEqual(10000);
            expect(Number(result)).toBeGreaterThanOrEqual(1000);
        }
    });

    test("should reverse min and max silently if max is less than min", () => {
        const result = rng({
            min: 100000,
            max: 10000
        });
        expect(Number(result)).toBeLessThanOrEqual(100000);
        expect(Number(result)).toBeGreaterThanOrEqual(10000);
    });

    test("should return a number with 'length' digits", () => {
        for (let i = 0; i < 1000; i++) {
            const result = rng({
                length: i
            });
            expect(result.length).toEqual(i);
        }
    });

    test("should throw an error if invalid numbers are passed in", () => {
        //@ts-ignore
        expect(() => rng(true)).toThrow(
            "Random Number Generator expects an object argument, got 'true'"
        );
        expect(() =>
            rng({
                min: "1234",
                //@ts-ignore
                max: {}
            })
        ).toThrow(
            "Random Number Generator requires a numeric max argument, got '{}'"
        );
        expect(() =>
            rng({
                length: "test1234"
            })
        ).toThrow(
            "Random Number Generator requires a numeric length argument, got 'test1234'"
        );
        expect(() =>
            rng({
                //@ts-ignore
                min: {},
                //@ts-ignore
                max: []
            })
        ).toThrow(
            "Random Number Generator requires a numeric min argument, got '{}'"
        );
    });
});
