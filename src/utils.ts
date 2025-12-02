
/**
 * Get cryptographically secure random bytes
 */
export function getRandomBytes(length: number): Uint8Array {
    const array = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(array);
    } else {
        // Fallback for Node.js environments where global crypto might not be set (older versions)
        // Ideally, consumers should ensure crypto is available or use a polyfill.
        // But let's try to require it dynamically if we are in a CommonJS env.
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const nodeCrypto = require('crypto');
            const buffer = nodeCrypto.randomBytes(length);
            array.set(buffer);
        } catch (e) {
            throw new Error('Cryptographically secure random number generator not available.');
        }
    }
    return array;
}

/**
 * Get a random number in range [0, max) using rejection sampling to avoid modulo bias.
 */
export function getRandomNumber(max: number): number {
    if (max < 1) throw new Error('Max must be greater than 0');
    if (max === 1) return 0;

    // The maximum value of a 32-bit unsigned integer is 2^32 - 1 = 4294967295.
    // We want to sample from [0, limit) where limit is the largest multiple of max <= 2^32.
    // If the random number falls >= limit, we reject it and try again.

    // 2^32 = 4294967296
    const maxUint32 = 4294967296;
    const limit = maxUint32 - (maxUint32 % max);

    let randomNumber: number;
    do {
         const randomBytes = getRandomBytes(4);
         randomNumber = new DataView(randomBytes.buffer).getUint32(0, true);
    } while (randomNumber >= limit);

    return randomNumber % max;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = getRandomNumber(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
