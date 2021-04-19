import luhnChecker from "./helpers/luhnChecker";
import binList from "./binlist";

export default class CCGen {
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

    private createIndexes() {
        // Array of properties of the binList I want to index
        const indexes = ["brand", "issuer"];
        for (const index of indexes) {
            this.indexes.set(index, new Map());
        }
        binList.forEach((bin: { [x: string]: string }, i) => {
            for (const each of indexes) {
                const index = this.indexes.get(each);
                if (index) {
                    const map = index.get(bin[each]);
                    if (map) {
                        map.push(i);
                    } else {
                        index.set(bin[each], [i]);
                    }
                }
            }
        });
    }

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

// console.log(new CCGen().indexes);
