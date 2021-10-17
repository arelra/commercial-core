import type { AdsConfig, AdsConfigDisabled } from './types';
declare type MaybeArray<T> = T[] | T;
declare type CustomParams = Record<string, MaybeArray<string | number | boolean>>;
declare const disabledAds: AdsConfigDisabled;
declare const buildAdsConfigWithConsent: (isAdFreeUser: boolean, adUnit: string, customParams: CustomParams) => Promise<AdsConfig>;
export { buildAdsConfigWithConsent, disabledAds };
