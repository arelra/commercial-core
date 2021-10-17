export declare type TagAtrribute = {
    name: string;
    value: string;
};
export declare type GetThirdPartyTag = (arg0: {
    shouldRun: boolean;
}) => ThirdPartyTag;
export declare type ThirdPartyTag = {
    async?: boolean;
    attrs?: TagAtrribute[];
    beforeLoad?: () => void;
    insertSnippet?: () => void;
    loaded?: boolean;
    onLoad?: () => void;
    shouldRun: boolean;
    name?: string;
    url?: string;
    useImage?: boolean;
};
export declare type GuardianAnalyticsConfig = {
    trackers: Record<string, string>;
};
export declare type GuardianWindowConfig = {
    googleAnalytics?: GuardianAnalyticsConfig;
};
export declare type GoogleTagParams = unknown;
export declare type GoogleTrackConversionObject = {
    google_conversion_id: number;
    google_custom_params: GoogleTagParams;
    google_remarketing_only: boolean;
};
