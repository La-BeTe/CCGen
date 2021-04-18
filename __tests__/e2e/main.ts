import CCGen from "../../src/main";

const ccgen = new CCGen();
describe("CCGen class instance", () => {
    describe("should have a generateCC method", () => {
        test("", () => {
            expect(ccgen.generateCC).toBeInstanceOf(Function);
        });

        test("that returns a PAN that passes the Luhn check", () => {
            let { pan } = ccgen.generateCC();
            expect(ccgen.validatePAN(pan)).toBe(true);
        });

        test("that returns a valid PAN that starts with the 'startsWith' argument", () => {
            let { pan } = ccgen.generateCC({
                startsWith: 1234
            });
            expect(String(pan).startsWith("1234")).toBe(true);
            expect(ccgen.validatePAN(pan)).toBe(true);
        });

        test("that returns a valid PAN that ends with the 'endsWith' argument", () => {
            let { pan } = ccgen.generateCC({
                endsWith: 1234
            });
            expect(String(pan).endsWith("1234")).toBe(true);
            expect(ccgen.validatePAN(pan)).toBe(true);
        });

        test("that returns a valid PAN that contains the 'contains' argument", () => {
            let { pan } = ccgen.generateCC({
                contains: 1234
            });
            expect(String(pan).includes("1234")).toBe(true);
            expect(ccgen.validatePAN(pan)).toBe(true);
        });

        test("that returns a valid PAN that matches the 'brand' argument", () => {
            const { pan } = ccgen.generateCC({
                brand: "visa"
            });
            expect(String(pan).startsWith("4")).toBe(true);
            const { pan: pan2 } = ccgen.generateCC({
                brand: "american express"
            });
            const pan2Start = String(pan2).slice(0, 2);
            expect(pan2Start === "34" || pan2Start === "37").toEqual(true);
        });

        test("that throws an error if 'brand' argument is not one of 'mastercard', 'visa', 'american express', 'verve'", () => {
            const testFn = () => {
                return ccgen.generateCC({
                    brand: "randomBrand"
                });
            };
            expect(testFn).toThrow("randomBrand brand is not available");
        });

        test("that returns an object with all properties if called with no arguments", () => {
            const result = ccgen.generateCC();
            expect(result).toHaveProperty([
                "pan",
                "cvv",
                "expiryDate",
                "name",
                "brand"
            ]);
        });

        test("that returns an object with some object properties if the 'attributes' argument is passed in", () => {
            const result1 = ccgen.generateCC({
                attributes: "pan"
            });
            expect(result1).toHaveProperty("pan");
            expect(result1).not.toHaveProperty([
                "name",
                "brand",
                "cvv",
                "expiryDate"
            ]);

            const result2 = ccgen.generateCC({
                attributes: ["pan", "cvv", "expiryDate"]
            });
            expect(result2).toHaveProperty(["pan", "cvv", "expiryDate"]);
            expect(result2).not.toHaveProperty(["name", "brand"]);
        });

        test("that returns an object with properties except 'pan' and 'brand' being overriden if arguments of thesame property are passed in", () => {
            const result = ccgen.generateCC({
                name: "Hello World",
                cvv: 234,
                pan: 123456,
                brand: "unknown"
            });
            expect(result).toHaveProperty("cvv", 234);
            expect(result).toHaveProperty("name", "Hello World");
            expect(result.pan).not.toEqual(123456);
            expect(result.brand).not.toEqual("unknown");
        });

        test("that returns an object with no brand if the 'startsWith' argument is passed in", () => {
            let result = ccgen.generateCC({
                startsWith: 1234
            });
            expect(result).not.toHaveProperty("brand");
        });

        test("that returns an array if the 'amount' argument is passed in", () => {
            const result = ccgen.generateCC({
                amount: 20
            });
            expect(result.length).toEqual(20);
            for (let { pan } of result) {
                expect(ccgen.validatePAN(pan)).toBe(true);
            }
        });
    });

    describe("should have a validatePAN method", () => {
        test("", () => {
            expect(ccgen.validatePAN).toBeInstanceOf(Function);
        });

        test("that returns true if PAN passed in is valid", () => {
            const validPAN = 4007784877621338;
            expect(ccgen.validatePAN(validPAN)).toEqual(true);
        });

        test("that returns false if PAN passed in is invalid", () => {
            const invalidPAN = 4007784872621338;
            expect(ccgen.validatePAN(invalidPAN)).toEqual(false);
        });

        test("that always returns false if PAN passed in is less than 16 numbers", () => {
            // The PAN below is valid according to Luhn algorithm but is short
            const shortPAN = 400778727373828;
            expect(ccgen.validatePAN(shortPAN)).toEqual(false);
        });

        test("that works even if PAN passed in is a string", () => {
            const invalidPAN = "4007784872621338";
            expect(ccgen.validatePAN(invalidPAN)).toEqual(false);
        });

        test("that returns an object if an array of PANs are passed in", () => {
            const PANs = [4007784877621338, "4007784872621338", 459046373737];
            const expectedResult = {
                "4007784877621338": true,
                // Invalid PAN
                "4007784872621338": false,
                // Short PAN
                "459046373737": false
            };
            expect(ccgen.validatePAN(...PANs)).toEqual(expectedResult);
        });
    });
});
