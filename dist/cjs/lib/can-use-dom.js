"use strict";
// Based on https://github.com/JedWatson/exenv
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseDom = void 0;
const canUseDom = () => !!(typeof window !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ensure we check at runtime
    window.document &&
    window.document.createElement);
exports.canUseDom = canUseDom;
