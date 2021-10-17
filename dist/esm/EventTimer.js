import { trackEvent } from './GoogleAnalytics';
class Event {
    constructor(name, mark) {
        this.name = name;
        this.ts = mark.startTime;
    }
}
export class EventTimer {
    constructor() {
        this._events = [];
        this.startTS = window.performance.now();
        this.triggers = {
            first: {
                slotReady: false,
                prebidStart: false,
                prebidEnd: false,
                slotInitialised: false,
                adOnPage: false,
            },
            'top-above-nav': {
                slotReady: false,
                prebidStart: false,
                prebidEnd: false,
                slotInitialised: false,
                adOnPage: false,
            },
            page: {
                commercialStart: false,
                commercialEnd: false,
            },
        };
        this.gaConfig = {
            logEvents: [
                {
                    timingVariable: 'slotReady',
                },
                {
                    timingVariable: 'slotInitialised',
                },
                {
                    timingVariable: 'commercialStart',
                    timingLabel: 'Commercial start parse time',
                },
                {
                    timingVariable: 'commercialEnd',
                    timingLabel: 'Commercial end parse time',
                },
            ],
        };
        this.properties =
            'connection' in window.navigator
                ? {
                    type: 'type' in window.navigator.connection
                        ? window.navigator.connection.type
                        : undefined,
                    downlink: 'downlink' in window.navigator.connection
                        ? window.navigator.connection.downlink
                        : undefined,
                    effectiveType: 'effectiveType' in window.navigator.connection
                        ? window.navigator.connection.effectiveType
                        : undefined,
                }
                : {};
    }
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
    static init() {
        var _a;
        return ((_a = window.guardian).commercialTimer || (_a.commercialTimer = new EventTimer()));
    }
    /**
     * Just a helper method to access the singleton instance of EventTimer.
     * Typical use case is EventTimer.get().trigger
     */
    static get() {
        return this.init();
    }
    /**
     * Returns all commercial timers. CMP-related timers are not tracked
     * by EventTimer so they need to be concatenated to EventTimer's private events array.
     */
    get events() {
        return typeof window.performance !== 'undefined' &&
            'getEntriesByName' in window.performance
            ? [
                ...this._events,
                ...EventTimer._externallyDefinedEventNames
                    .filter((eventName) => window.performance.getEntriesByName(eventName)
                    .length)
                    .map((eventName) => new Event(eventName, window.performance.getEntriesByName(eventName)[0])),
            ]
            : this._events;
    }
    mark(name) {
        const longName = `gu.commercial.${name}`;
        if (typeof window.performance !== 'undefined' &&
            'mark' in window.performance) {
            window.performance.mark(longName);
            // Most recent mark with this name is the event we just created.
            const mark = window.performance
                .getEntriesByName(longName, 'mark')
                .slice(-1)[0];
            if (typeof mark !== 'undefined') {
                this._events.push(new Event(name, mark));
            }
        }
    }
    /**
     * Creates a new performance mark
     * For slot events also ensures each TYPE of event event is marked only once for 'first'
     * (the first time that event is triggered for ANY slot) and once for topAboveNav
     *
     * @param {string} eventName - The short name applied to the mark
     * @param {origin} [origin=page] - Either 'page' (default) or the name of the slot
     */
    trigger(eventName, origin = 'page') {
        const TRACKEDSLOTNAME = 'top-above-nav';
        if (origin === 'page' &&
            !this.triggers.page[eventName]) {
            this.mark(eventName);
            this.trackInGA(eventName);
            this.triggers.page[eventName] = true;
            return;
        }
        if (!this.triggers.first[eventName]) {
            const trackLabel = `first-${eventName}`;
            this.mark(trackLabel);
            this.trackInGA(eventName, trackLabel);
            this.triggers.first[eventName] = true;
        }
        if (origin === TRACKEDSLOTNAME) {
            if (!this.triggers[TRACKEDSLOTNAME][eventName]) {
                const trackLabel = `${TRACKEDSLOTNAME}-${eventName}`;
                this.mark(trackLabel);
                this.trackInGA(eventName, trackLabel);
                this.triggers[TRACKEDSLOTNAME][eventName] = true;
            }
        }
    }
    trackInGA(eventName, label = '') {
        const gaEvent = this.gaConfig.logEvents.find((e) => e.timingVariable === eventName);
        if (gaEvent) {
            const labelToUse = gaEvent.timingLabel ?? label;
            trackEvent('Commercial Events', gaEvent.timingVariable, labelToUse);
        }
    }
}
EventTimer._externallyDefinedEventNames = [
    'cmp-tcfv2-init',
    'cmp-tcfv2-got-consent',
    'cmp-ccpa-init',
    'cmp-ccpa-got-consent',
    'cmp-aus-init',
    'cmp-aus-got-consent',
];
