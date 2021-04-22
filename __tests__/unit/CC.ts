import CC from "../../src/classes/CC";

describe("Class CC", () => {
    it("should generate random details about the CC", () => {
        const cc = new CC("1234567890");
        expect(cc).toHaveProperty("data");
        const data = cc.data;
        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("cvv");
        expect(data).toHaveProperty("expiryDate");
        expect(data).toHaveProperty("pan", "1234567890");
    });

    it("should include brand in the data if 'brand' argument is passed in", () => {
        const cc = new CC("1234567890", "test");
        expect(cc).toHaveProperty("data");
        const data = cc.data;
        expect(data).toHaveProperty("brand", "TEST");
    });

    it("should include issuer in the data if 'issuer' argument is passed in", () => {
        const cc = new CC("1234567890", "test", "zenith");
        expect(cc).toHaveProperty("data");
        const data = cc.data;
        expect(data).toHaveProperty("issuer", "Zenith Bank PLC");
    });

    it("should not include issuer in the data if 'issuer' argument is not recognized", () => {
        const cc = new CC("1234567890", "test", "test");
        expect(cc).toHaveProperty("data");
        const data = cc.data;
        expect(data).not.toHaveProperty("issuer");
    });

    describe("should include properties in the data if present in the attributes argument", () => {
        it("if attributes is a string", () => {
            const cc = new CC("1234567890", "test", null, "pan");
            expect(cc).toHaveProperty("data");
            const data = cc.data;
            expect(data).toHaveProperty("pan", "1234567890");
            expect(data).not.toHaveProperty("brand");
            expect(data).not.toHaveProperty("name");
            expect(data).not.toHaveProperty("cvv");
            expect(data).not.toHaveProperty("expiryDate");
        });
        it("if attributes is an array", () => {
            const cc = new CC("1234567890", "test", null, ["pan", "brand"]);
            expect(cc).toHaveProperty("data");
            const data = cc.data;
            expect(data).toHaveProperty("pan", "1234567890");
            expect(data).toHaveProperty("brand", "TEST");
            expect(data).not.toHaveProperty("name");
            expect(data).not.toHaveProperty("cvv");
            expect(data).not.toHaveProperty("expiryDate");
        });
    });

    it("should include all properties if attributes is invalid", () => {
        // @ts-ignore
        const cc = new CC("1234567890", "test", null, {});
        expect(cc).toHaveProperty("data");
        const data = cc.data;
        expect(data).toHaveProperty("pan", "1234567890");
        expect(data).toHaveProperty("brand", "TEST");
        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("cvv");
        expect(data).toHaveProperty("expiryDate");
    });

    it("should skip invalid properties passed in the attribues argument", () => {
        const cc = new CC("1234567890", "test", null, ["pan", "test"]);
        expect(cc).toHaveProperty("data");
        const data = cc.data;
        expect(data).toHaveProperty("pan", "1234567890");
        expect(data).not.toHaveProperty("test");
        expect(data).not.toHaveProperty("brand");
        expect(data).not.toHaveProperty("name");
        expect(data).not.toHaveProperty("cvv");
        expect(data).not.toHaveProperty("expiryDate");
    });
});
