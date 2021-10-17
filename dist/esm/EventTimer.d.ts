declare class Event {
    name: string;
    ts: DOMHighResTimeStamp;
    constructor(name: string, mark: PerformanceEntry);
}
interface GALogEvent {
    timingVariable: string;
    timingLabel?: string;
}
interface GAConfig {
    logEvents: GALogEvent[];
}
interface SlotEventStatus {
    prebidStart: boolean;
    prebidEnd: boolean;
    slotInitialised: boolean;
    slotReady: boolean;
    adOnPage: boolean;
}
interface PageEventStatus {
    commercialStart: boolean;
    commercialEnd: boolean;
}
export declare class EventTimer {
    private _events;
    private static _externallyDefinedEventNames;
    startTS: DOMHighResTimeStamp;
    triggers: {
        first: SlotEventStatus;
        'top-above-nav': SlotEventStatus;
        page: PageEventStatus;
    };
    gaConfig: GAConfig;
    properties: {
        type?: ConnectionType;
        downlink?: number;
        effectiveType?: string;
    };
    /**
     * Initalise the EventTimer class on page.
     * Returns the singleton instance of the EventTimer class and binds
     * to window.guardian.commercialTimer. If it's been previously
     * initalised and bound it returns the original instance
     * Note: We save to window.guardian.commercialTimer because
     * different bundles (DCR / DCP) can use commercial core, and we want
     * all timer events saved to a single instance per-page
     * @returns {EventTimer} Instance of EventTimer
     */
    static init(): EventTimer;
    /**
     * Just a helper method to access the singleton instance of EventTimer.
     * Typical use case is EventTimer.get().trigger
     */
    static get(): EventTimer;
    /**
     * Returns all commercial timers. CMP-related timers are not tracked
     * by EventTimer so they need to be concatenated to EventTimer's private events array.
     */
    get events(): Event[];
    constructor();
    mark(name: string): void;
    /**
     * Creates a new performance mark
     * For slot events also ensures each TYPE of event event is marked only once for 'first'
     * (the first time that event is triggered for ANY slot) and once for topAboveNav
     *
     * @param {string} eventName - The short name applied to the mark
     * @param {origin} [origin=page] - Either 'page' (default) or the name of the slot
     */
    trigger(eventName: string, origin?: string): void;
    trackInGA(eventName: string, label?: string): void;
}
export {};
