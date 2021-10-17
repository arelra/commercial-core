"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disabledAds = exports.buildAdsConfigWithConsent = void 0;
const consent_management_platform_1 = require("@guardian/consent-management-platform");
const libs_1 = require("@guardian/libs");
const can_use_dom_1 = require("./lib/can-use-dom");
const construct_query_1 = require("./lib/construct-query");
const permutive_1 = require("./permutive");
const buildCustomParamsFromCookies = () => (0, can_use_dom_1.canUseDom)()
    ? {
        permutive: (0, permutive_1.getPermutivePFPSegments)(),
        si: (0, libs_1.getCookie)({ name: 'GU_U' }) ? 't' : 'f',
    }
    : {};
const buildAdsConfig = (cmpConsent, adUnit, customParams) => {
    const mergedCustomParams = {
        ...customParams,
        ...buildCustomParamsFromCookies(),
    };
    const defaultAdsConfig = {
        adTagParameters: {
            iu: adUnit,
            // TODO: Why are we double encoding? Following Frontend process for now
            cust_params: encodeURIComponent((0, construct_query_1.constructQuery)(mergedCustomParams)),
        },
    };
    if (cmpConsent.ccpa) {
        const canTarget = !cmpConsent.ccpa.doNotSell;
        return {
            ...defaultAdsConfig,
            restrictedDataProcessor: !canTarget,
        };
    }
    if (cmpConsent.aus) {
        const canTarget = cmpConsent.aus.personalisedAdvertising;
        return {
            ...defaultAdsConfig,
            restrictedDataProcessor: !canTarget,
        };
    }
    const tcfData = cmpConsent.tcfv2;
    // ConsentState type allows for an undefined tcfv2
    if (tcfData) {
        const canTarget = Object.values(tcfData.consents).every(Boolean);
        const mergedAdTagParameters = {
            ...defaultAdsConfig.adTagParameters,
            cmpGdpr: tcfData.gdprApplies ? 1 : 0,
            cmpGvcd: tcfData.addtlConsent,
            cmpVcd: tcfData.tcString,
        };
        return {
            adTagParameters: mergedAdTagParameters,
            nonPersonalizedAd: !canTarget,
        };
    }
    // Shouldn't happen but handle if no matching framework
    return disabledAds;
};
const disabledAds = { disableAds: true };
exports.disabledAds = disabledAds;
const buildAdsConfigWithConsent = async (isAdFreeUser, adUnit, customParams) => {
    if (isAdFreeUser) {
        return disabledAds;
    }
    const consentState = await new Promise((resolve, reject) => {
        try {
            (0, consent_management_platform_1.onConsentChange)((cmpConsent) => {
                resolve(cmpConsent);
            });
        }
        catch (err) {
            reject(new Error('Error getting consent state'));
        }
    }).catch(() => undefined);
    return consentState
        ? buildAdsConfig(consentState, adUnit, customParams)
        : disabledAds;
};
exports.buildAdsConfigWithConsent = buildAdsConfigWithConsent;
