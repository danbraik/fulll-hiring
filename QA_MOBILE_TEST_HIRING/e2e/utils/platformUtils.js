/**
 * Platform helpers, mirroring the Fulll e2e standard (utils/platformUtils.js).
 */
export const isIOS = () => device.getPlatform() === 'ios'
export const isAndroid = () => device.getPlatform() === 'android'

/** Explicit pause. Avoid in tests — prefer waitFor(...). Kept for hooks only. */
export const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
