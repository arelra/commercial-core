import { onConsentChange } from '@guardian/consent-management-platform';
import { getCookie } from '@guardian/libs';
import { canUseDom } from './lib/can-use-dom';
import { constructQuery } from './lib/construct-query';
import { getPermutivePFPSegments } from './permutive';
const buildCustomParamsFromCookies = () => canUseDom()
    ? {
        permutive: getPermutivePFPSegments(),
        si: getCookie({ name: 'GU_U' }) ? 't' : 'f',
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
            cust_params: encodeURIComponent(constructQuery(mergedCustomParams)),
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
const buildAdsConfigWithConsent = async (isAdFreeUser, adUnit, customParams) => {
    if (isAdFreeUser) {
        return disabledAds;
    }
    const consentState = await new Promise((resolve, reject) => {
        try {
            onConsentChange((cmpConsent) => {
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
export { buildAdsConfigWithConsent, disabledAds };
