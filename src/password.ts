import { getRandomNumber, shuffleArray } from './utils';

export interface PasswordGeneratorOptions {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
    ambiguous: boolean; // Include ambiguous characters (0, O, l, 1, I)
    minUppercase: number;
    minLowercase: number;
    minNumbers: number;
    minSpecial: number;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const UPPERCASE_NO_AMBIGUOUS = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // No I, L, O
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const LOWERCASE_NO_AMBIGUOUS = 'abcdefghjkmnpqrstuvwxyz'; // No i, l, o
const NUMBERS = '0123456789';
const NUMBERS_NO_AMBIGUOUS = '23456789'; // No 0, 1
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export const defaultPasswordOptions: PasswordGeneratorOptions = {
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
    ambiguous: false,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSpecial: 1,
};

/**
 * Generate a random password
 */
export function generatePassword(options: Partial<PasswordGeneratorOptions> = {}): string {
    const opts = { ...defaultPasswordOptions, ...options };

    // Build character pool
    let chars = '';
    const requiredChars: string[] = [];

    const upperPool = opts.ambiguous ? UPPERCASE : UPPERCASE_NO_AMBIGUOUS;
    const lowerPool = opts.ambiguous ? LOWERCASE : LOWERCASE_NO_AMBIGUOUS;
    const numberPool = opts.ambiguous ? NUMBERS : NUMBERS_NO_AMBIGUOUS;

    if (opts.uppercase) {
        chars += upperPool;
        // Add minimum required uppercase
        for (let i = 0; i < opts.minUppercase; i++) {
            requiredChars.push(upperPool[getRandomNumber(upperPool.length)]);
        }
    }

    if (opts.lowercase) {
        chars += lowerPool;
        // Add minimum required lowercase
        for (let i = 0; i < opts.minLowercase; i++) {
            requiredChars.push(lowerPool[getRandomNumber(lowerPool.length)]);
        }
    }

    if (opts.numbers) {
        chars += numberPool;
        // Add minimum required numbers
        for (let i = 0; i < opts.minNumbers; i++) {
            requiredChars.push(numberPool[getRandomNumber(numberPool.length)]);
        }
    }

    if (opts.special) {
        chars += SPECIAL;
        // Add minimum required special
        for (let i = 0; i < opts.minSpecial; i++) {
            requiredChars.push(SPECIAL[getRandomNumber(SPECIAL.length)]);
        }
    }

    // Handle edge case where no character types are selected
    if (chars.length === 0) {
        chars = LOWERCASE_NO_AMBIGUOUS;
    }

    // Generate remaining random characters
    const remainingLength = Math.max(0, opts.length - requiredChars.length);
    const randomChars: string[] = [];
    for (let i = 0; i < remainingLength; i++) {
        randomChars.push(chars[getRandomNumber(chars.length)]);
    }

    // Combine and shuffle
    const allChars = [...requiredChars, ...randomChars];
    const shuffled = shuffleArray(allChars);

    return shuffled.join('');
}
