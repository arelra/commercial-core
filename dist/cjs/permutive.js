"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = exports.clearPermutiveSegments = exports.getPermutivePFPSegments = exports.getPermutiveSegments = void 0;
const libs_1 = require("@guardian/libs");
const PERMUTIVE_KEY = `_papns`;
const PERMUTIVE_PFP_KEY = `_pdfps`;
const getSegments = (key) => {
    try {
        const rawSegments = libs_1.storage.local.getRaw(key);
        const segments = rawSegments
            ? JSON.parse(rawSegments)
            : null;
        if (!Array.isArray(segments))
            return [];
        return segments
            .slice(0, 250)
            .map((s) => Number.parseInt(s, 10))
            .filter((n) => typeof n === 'number' && !Number.isNaN(n))
            .map(String);
    }
    catch (err) {
        return [];
    }
};
const getPermutiveSegments = () => getSegments(PERMUTIVE_KEY);
exports.getPermutiveSegments = getPermutiveSegments;
const getPermutivePFPSegments = () => getSegments(PERMUTIVE_PFP_KEY);
exports.getPermutivePFPSegments = getPermutivePFPSegments;
const clearPermutiveSegments = () => {
    libs_1.storage.local.remove(PERMUTIVE_KEY);
    libs_1.storage.local.remove(PERMUTIVE_PFP_KEY);
};
exports.clearPermutiveSegments = clearPermutiveSegments;
exports._ = {
    PERMUTIVE_KEY,
    PERMUTIVE_PFP_KEY,
    getSegments,
};
