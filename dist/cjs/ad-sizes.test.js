"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ad_sizes_1 = require("./ad-sizes");
const { getAdSize } = ad_sizes_1._;
describe('ad sizes', () => {
    it.each([
        [2, 2, '2,2'],
        [100, 100, '100,100'],
        [320, 50, '320,50'],
        [970, 250, '970,250'],
        [0, 0, 'fluid'],
    ])('getAdSize(%d,%d) outputs string "%s"', (expectedWidth, expectedHeight, expectedString) => {
        const adSize = getAdSize(expectedWidth, expectedHeight);
        expect(adSize.width).toEqual(expectedWidth);
        expect(adSize.height).toEqual(expectedHeight);
        expect(adSize.toString()).toEqual(expectedString);
    });
});
