export declare type AdSizeString = 'fluid' | `${number},${number}`;
export declare type AdSize = Readonly<{
    width: number;
    height: number;
    toString: () => AdSizeString;
}>;
export declare type SizeKeys = 'billboard' | 'leaderboard' | 'mpu' | 'halfPage' | 'portrait' | 'skyscraper' | 'mobilesticky' | 'fluid' | 'outOfPage' | 'googleCard' | 'video' | 'outstreamDesktop' | 'outstreamGoogleDesktop' | 'outstreamMobile' | 'merchandisingHighAdFeature' | 'merchandisingHigh' | 'merchandising' | 'inlineMerchandising' | 'fabric' | 'empty' | '970x250' | '728x90' | '300x250' | '300x600' | '300x1050' | '160x600';
export declare const adSizes: Record<SizeKeys, AdSize>;
export declare const _: {
    getAdSize: (width: number, height: number) => AdSize;
};
