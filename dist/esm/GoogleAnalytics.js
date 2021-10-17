export const trackEvent = (timingCategory, timingVar, timingLabel) => {
    const { ga, guardian } = window;
    const trackerName = guardian.config?.googleAnalytics?.trackers.editorial;
    if (typeof ga !== 'function') {
        return;
    }
    const timeSincePageLoad = Math.round(window.performance.now());
    const send = trackerName ? `${trackerName}.send` : 'send';
    window.ga(send, 'timing', timingCategory, timingVar, timeSincePageLoad, timingLabel);
};
