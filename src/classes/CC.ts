import rng from "../helpers/randomNumberGenerator";
import names from "../lists/names";

const Issuers = {
    fcmb: "First City Monument Bank",
    wema: "Wema Bank PLC",
    union: "Union Bank of Nigeria",
    access: "Access Bank PLC",
    zenith: "Zenith Bank PLC",
    gtb: "Guaranty Trust Bank PLC",
    ecobank: "Ecobank Nigeria PLC",
    stanbic: "Stanbic IBTC Bank",
    uba: "United Bank for Africa PLC",
    intercontinental: "Intercontinental Bank PLC",
    polaris: "Polaris Bank PLC",
    fbn: "First Bank of Nigeria PLC",
    scbn: "Standard Chartered Bank"
};

export default class CC {
    private name: string;
    private cvv: string;
    private expiryDate: string;
    private attributes: string[];
    private issuer: string;

    constructor(
        private pan: string,
        private brand = "",
        issuer = "",
        attrs?: string | string[]
    ) {
        this.name = this.getName();
        this.cvv = this.getCVV();
        this.expiryDate = this.getExpiryDate();
        //@ts-ignore
        this.issuer = Issuers[issuer];
        if (attrs && (typeof attrs === "string" || Array.isArray(attrs))) {
            this.attributes = typeof attrs === "string" ? [attrs] : attrs;
        } else {
            this.attributes = [
                "name",
                "cvv",
                "pan",
                "expiryDate",
                "brand",
                "issuer"
            ];
        }
    }

    private getName() {
        const firstNameIndex = Number(rng({ min: 0, max: names.length }));
        const lastNameIndex = Number(rng({ min: 0, max: names.length }));
        return `${names[lastNameIndex]} ${names[firstNameIndex]}`;
    }

    private getCVV() {
        return rng({ length: 3 });
    }

    private getExpiryDate() {
        const month = rng({ min: 1, max: 12 }).padStart(2, "0");
        const currentYear = String(new Date().getFullYear()).slice(-2);
        const year = rng({ min: currentYear, max: currentYear + 10 });
        return `${month}/${year}`;
    }

    get data() {
        const result: { [x: string]: string } = {};
        const allowedAttrs = [
            "name",
            "pan",
            "cvv",
            "expiryDate",
            "brand",
            "issuer"
        ];
        for (let attr of this.attributes) {
            if (!allowedAttrs.includes(attr)) continue;
            //@ts-ignore
            const thisAttr = this[attr];
            if (!thisAttr) continue;
            result[attr] = thisAttr;
        }
        return result;
    }
}
