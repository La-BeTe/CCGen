import luhnChecker from "../helpers/luhnChecker";
import panGen from "../helpers/panGenerator";
import rng from "../helpers/randomNumberGenerator";
import binList from "../lists/bins";
import CC from "./CC";

interface GenerateCCOptions {
    attributes?: string | string[];
    amount?: string | number;
    startsWith?: string | number;
    endsWith?: string | number;
    contains?: string | number;
    brand?: string;
    issuer?: string;
}

export class CCGen {
    /*
     * The 'indexes' variable allows for fast fetching of bins
     * It is a Map of a string representing the property being indexed
     * to a Map of each of the possible property values mapped
     * to an array containing indexes that have that property value in the binList variable above
     */
    private indexes: Map<string, Map<string, Array<number>>>;

    constructor() {
        this.indexes = new Map();
        this.createIndexes();
    }

    private getIndexedBrand(arg: string) {
        const brand = this.indexes.get("brand");
        if (brand) {
            return brand.get(arg.toLowerCase());
        }
        return undefined;
    }

    private getIndexedIssuer(arg: string) {
        const issuer = this.indexes.get("issuer");
        if (issuer) {
            return issuer.get(arg.toLowerCase());
        }
        return undefined;
    }

    private normalizeIssuer(issuer: string) {
        const obj = {
            "first city monument": "fcmb",
            wema: "wema",
            union: "union",
            access: "access",
            zenith: "zenith",
            "guaranty trust bank": "gtb",
            ecobank: "ecobank",
            "stanbic ibtc": "stanbic",
            "united bank for africa": "uba",
            "intercontinental bank": "intercontinental",
            skye: "polaris",
            "standard chartered bank": "scbn",
            "first bank": "fbn"
        };
        for (const each in obj) {
            const regex = new RegExp(each, "i");
            // @ts-ignore
            if (regex.test(issuer)) return obj[each];
        }
        return null;
    }

    private createIndexes() {
        // Array of properties of the binList I want to index
        const indexes = ["brand", "issuer"];
        for (const index of indexes) {
            this.indexes.set(index, new Map());
        }
        binList.forEach((bin: { [x: string]: string }, i) => {
            bin.issuer = this.normalizeIssuer(bin.issuer);
            if (!bin.issuer) return;
            for (const each of indexes) {
                const index = this.indexes.get(each);
                if (index) {
                    const map = index.get(bin[each]);
                    if (map) {
                        map.push(i);
                    } else {
                        index.set(bin[each].toLowerCase(), [i]);
                    }
                }
            }
        });
    }

    generateCC({
        startsWith,
        endsWith,
        contains,
        amount,
        attributes,
        brand,
        issuer
    }: GenerateCCOptions = {}) {
        let startsWithIsBin = true;
        amount = amount ? this.validateNumber(amount) : 1;
        const results = [];
        for (let i = 0; i < amount; i++) {
            let pan: string;
            if (brand) {
                const indexedBrandOriginal = this.getIndexedBrand(brand);
                if (indexedBrandOriginal) {
                    let indexedBrand = [...indexedBrandOriginal];
                    if (issuer) {
                        const indexedIssuer = this.getIndexedIssuer(issuer);
                        if (!indexedIssuer)
                            throw `${issuer} is not a recognized issuer`;
                        // Filter indexed brand list based on passed in issuer
                        indexedBrand = indexedBrand.filter((brand) => {
                            return indexedIssuer.includes(brand);
                        });
                        if (!indexedBrand.length)
                            throw `BIN issued by ${issuer} with brand ${brand} is not available`;
                    }
                    const randomIndex = rng({
                        min: 0,
                        max: indexedBrand.length - 1
                    });
                    const index = indexedBrand[Number(randomIndex)];
                    startsWith = binList[index].bin;
                } else {
                    if (["mastercard", "visa", "verve"].includes(brand))
                        throw `The ${brand} brand is not available yet`;
                    throw `${brand} is not a recognized brand`;
                }
            } else if (issuer) {
                const indexedIssuer = this.getIndexedIssuer(issuer);
                if (!indexedIssuer)
                    throw `'${issuer}' is not a recognized issuer`;
                const randomIndex = rng({
                    min: 0,
                    max: indexedIssuer.length - 1
                });
                const index = indexedIssuer[Number(randomIndex)];
                startsWith = binList[index].bin;
            } else if (!startsWith) {
                const index = Number(
                    rng({
                        min: 0,
                        max: binList.length - 1
                    })
                );
                startsWith = binList[index].bin;
                brand = binList[index].brand;
            } else if (startsWith) {
                startsWithIsBin = false;
            }
            pan = panGen({ startsWith, endsWith, contains, startsWithIsBin });
            const cc = new CC(pan, brand, issuer, attributes);
            results.push(cc.data);
        }
        return results.length === 1 ? results[0] : results;
    }

    private validateNumber(
        suspectedNumber: unknown,
        errorMessage = `${suspectedNumber} is not a number`
    ) {
        const tempNum = Number(suspectedNumber);
        if (Number.isNaN(tempNum)) throw new Error(errorMessage);
        return tempNum;
    }

    validatePAN<T extends string | number>(...pans: T[]) {
        const result: { [x: string]: boolean } = {};
        for (const pan of pans) {
            if (String(pan).length < 16) {
                result[pan] = false;
            } else {
                result[pan] = luhnChecker(pan) as boolean;
            }
        }
        return pans.length === 1 ? result[pans[0]] : result;
    }
}
