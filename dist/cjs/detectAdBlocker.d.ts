/**
Detect whether or not the user has an ad blocking extension enabled.
A few ad blockers are not detectable with this approach e.g. Safari / Adblock
Code inspired by just-detect-adblock's: https://git.io/JgL4L
*/
/**
 * Determines whether or not the user has an ad blocking extension enabled.
 * Note: positive results can be considered reliable while negative ones may not be.
 * @returns Promise
 */
export declare function isAdBlockInUse(): Promise<boolean>;
