"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCommercialMetrics = void 0;
const libs_1 = require("@guardian/libs");
const EventTimer_1 = require("./EventTimer");
function sendCommercialMetrics(pageViewId, browserId, isDev, adBlockerInUse) {
    const devProperties = isDev
        ? [{ name: 'isDev', value: window.location.hostname }]
        : [];
    const adBlockerProperties = adBlockerInUse !== undefined
        ? [
            {
                name: 'adBlockerInUse',
                value: adBlockerInUse.toString(),
            },
        ]
        : [];
    const endpoint = isDev
        ? '//performance-events.code.dev-guardianapis.com/commercial-metrics'
        : '//performance-events.guardianapis.com/commercial-metrics';
    if (document.visibilityState !== 'hidden')
        return false;
    const eventTimer = EventTimer_1.EventTimer.get();
    const events = eventTimer.events;
    const properties = Object.entries(eventTimer.properties)
        .filter(([, value]) => typeof value !== 'undefined')
        .map(([name, value]) => ({ name, value: String(value) }))
        .concat(devProperties)
        .concat(adBlockerProperties);
    const metrics = events.map(({ name, ts }) => ({
        name,
        value: Math.ceil(ts),
    }));
    const commercialMetrics = {
        browser_id: browserId,
        page_view_id: pageViewId,
        platform: 'NEXT_GEN',
        metrics,
        properties,
    };
    (0, libs_1.log)('commercial', 'About to send commercial metrics', commercialMetrics);
    return navigator.sendBeacon(endpoint, JSON.stringify(commercialMetrics));
}
exports.sendCommercialMetrics = sendCommercialMetrics;
