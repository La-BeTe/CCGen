# CCGen

[![codecov](https://codecov.io/gh/La-BeTe/CCGen/branch/master/graph/badge.svg?token=6PGAIGKMET)](https://codecov.io/gh/La-BeTe/CCGen)
[![BuildStatus](https://travis-ci.com/La-BeTe/CCGen.svg?branch=master)](https://travis-ci.com/La-BeTe/CCGen)

A simple credit card generator.

## Installation

```
    $ npm install @la-bete/ccgen
```

## Basic Usage

```javascript
import { CCGen } from "@la-bete/ccgen";
const ccgen = new CCGen();

const CC = ccgen.generateCC();
/*
    CC => {
        name: [string],
        cvv: [string],
        pan: [string],
        expiryDate: [string],
        brand: [string]
    }
*/

const pan = 12345678934567;
const isPANValid = ccgen.validatePAN(pan);
// isPANValid => false
```

## GenerateCC

The generateCC method takes an optional Options argument. `PAN(Primary Account Number)` refers to the 16-digit number generated, `BIN(Bank Identification Number)` is the first 6 digits of a PAN and can be used to identify the PAN's brand and issuer. `CC` refers to the credit card generated as well as other details, such as name, cvv, expiry date

<table>
    <thead>
        <th>Name</th>
        <th>Description</th>
        <th>Default</th>
    </thead>
    <tbody>
        <tr>
            <td>brand</td>
            <td>This should be one of visa, mastercard or verve</td>
            <td>""</td>
        </tr>
        <tr>
            <td>startsWith</td>
            <td>A string of numbers the generated PAN should start with</td>
            <td>A random BIN</td>
        </tr>
        <tr>
            <td>endsWith</td>
            <td>A string of numbers the generated PAN should end with</td>
            <td>""</td>
        </tr>
        <tr>
            <td>contains</td>
            <td>A string of numbers the generated PAN should include</td>
            <td>""</td>
        </tr>
        <tr>
            <td>amount</td>
            <td>The quantity of CCs to generate. If this is greater than 1, an array is returned else, the single CC is returned</td>
            <td>1</td>
        </tr>
        <tr>
            <td>attributes</td>
            <td>The properties that should be present in the CC returned, you can pass a single string or an array of strings</td>
            <td>
            ["name", "cvv", "pan", "expiryDate", "brand", "issuer"]
            </td>
        </tr>
        <tr>
            <td>issuer</td>
            <td>The bank issuing the CC. Find below the list of acceptable strings for this argument</td>
            <td>""</td>
        </tr>
    </tbody>
</table>

### Available Issuers

For the `options.issuer` argument, you have to pass one of the keys of the object below. The corresponding bank is also shown below.

```json
{
    "fcmb": "First City Monument Bank",
    "wema": "Wema Bank PLC",
    "union": "Union Bank of Nigeria",
    "access": "Access Bank PLC",
    "zenith": "Zenith Bank PLC",
    "gtb": "Guaranty Trust Bank PLC",
    "ecobank": "Ecobank Nigeria PLC",
    "stanbic": "Stanbic IBTC Bank",
    "uba": "United Bank for Africa PLC",
    "intercontinental": "Intercontinental Bank PLC",
    "polaris": "Polaris Bank PLC",
    "fbn": "First Bank of Nigeria PLC",
    "scbn": "Standard Chartered Bank"
};
```

## ValidatePAN

This method can accept a single PAN or an array of PANs. If a single PAN is passed in, a boolean is returned which tells whether the PAN is Luhn-valid. If an array of PANs is passed in, an object is returned whose keys are the passed-in PANs while the entries are booleans showing the Luhn-validity of each key.
