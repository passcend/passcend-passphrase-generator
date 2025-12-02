import { EFF_LONG_WORDLIST } from './wordlists/eff-long';

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

export interface PassphraseGeneratorOptions {
    numWords: number;
    wordSeparator: string;
    capitalize: boolean;
    includeNumber: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const UPPERCASE_NO_AMBIGUOUS = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // No I, L, O
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const LOWERCASE_NO_AMBIGUOUS = 'abcdefghjkmnpqrstuvwxyz'; // No i, l, o
const NUMBERS = '0123456789';
const NUMBERS_NO_AMBIGUOUS = '23456789'; // No 0, 1
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export class PasswordGenerator {
    static defaultPasswordOptions: PasswordGeneratorOptions = {
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

    static defaultPassphraseOptions: PassphraseGeneratorOptions = {
        numWords: 4,
        wordSeparator: '-',
        capitalize: true,
        includeNumber: true,
    };

    /**
     * Get cryptographically secure random bytes
     */
    private static getRandomBytes(length: number): Uint8Array {
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
     * Get a random number in range [0, max)
     */
    private static getRandomNumber(max: number): number {
        const randomBytes = this.getRandomBytes(4);
        const randomNumber = new DataView(randomBytes.buffer).getUint32(0, true);
        return randomNumber % max;
    }

    /**
     * Shuffle an array using Fisher-Yates algorithm
     */
    private static shuffleArray<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = this.getRandomNumber(i + 1);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Generate a random password
     */
    static generatePassword(options: Partial<PasswordGeneratorOptions> = {}): string {
        const opts = { ...this.defaultPasswordOptions, ...options };

        // Build character pool
        let chars = '';
        let requiredChars: string[] = [];

        const upperPool = opts.ambiguous ? UPPERCASE : UPPERCASE_NO_AMBIGUOUS;
        const lowerPool = opts.ambiguous ? LOWERCASE : LOWERCASE_NO_AMBIGUOUS;
        const numberPool = opts.ambiguous ? NUMBERS : NUMBERS_NO_AMBIGUOUS;

        if (opts.uppercase) {
            chars += upperPool;
            // Add minimum required uppercase
            for (let i = 0; i < opts.minUppercase; i++) {
                requiredChars.push(upperPool[this.getRandomNumber(upperPool.length)]);
            }
        }

        if (opts.lowercase) {
            chars += lowerPool;
            // Add minimum required lowercase
            for (let i = 0; i < opts.minLowercase; i++) {
                requiredChars.push(lowerPool[this.getRandomNumber(lowerPool.length)]);
            }
        }

        if (opts.numbers) {
            chars += numberPool;
            // Add minimum required numbers
            for (let i = 0; i < opts.minNumbers; i++) {
                requiredChars.push(numberPool[this.getRandomNumber(numberPool.length)]);
            }
        }

        if (opts.special) {
            chars += SPECIAL;
            // Add minimum required special
            for (let i = 0; i < opts.minSpecial; i++) {
                requiredChars.push(SPECIAL[this.getRandomNumber(SPECIAL.length)]);
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
            randomChars.push(chars[this.getRandomNumber(chars.length)]);
        }

        // Combine and shuffle
        const allChars = [...requiredChars, ...randomChars];
        const shuffled = this.shuffleArray(allChars);

        return shuffled.join('');
    }

    /**
     * Generate a passphrase
     */
    static generatePassphrase(options: Partial<PassphraseGeneratorOptions> = {}): string {
        const opts = { ...this.defaultPassphraseOptions, ...options };

        const words: string[] = [];
        for (let i = 0; i < opts.numWords; i++) {
            let word = EFF_LONG_WORDLIST[this.getRandomNumber(EFF_LONG_WORDLIST.length)];
            if (opts.capitalize) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            words.push(word);
        }

        // Add number to a random word if requested
        if (opts.includeNumber) {
            const randomIndex = this.getRandomNumber(words.length);
            const randomNumber = this.getRandomNumber(10).toString();
            words[randomIndex] = words[randomIndex] + randomNumber;
        }

        return words.join(opts.wordSeparator);
    }

    /**
     * Calculate password strength (0-4 scale like zxcvbn)
     * Returns: 0 = very weak, 1 = weak, 2 = fair, 3 = strong, 4 = very strong
     */
    static calculateStrength(password: string): {
        score: number;
        label: string;
        color: string;
    } {
        if (!password) {
            return { score: 0, label: 'Very Weak', color: 'red' };
        }

        let score = 0;
        const length = password.length;

        // Length scoring
        if (length >= 8) score++;
        if (length >= 12) score++;
        if (length >= 16) score++;
        if (length >= 20) score++;

        // Character variety scoring
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);

        const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
        if (varietyCount >= 2) score++;
        if (varietyCount >= 3) score++;
        if (varietyCount >= 4) score++;

        // Penalize common patterns
        if (/^[a-zA-Z]+$/.test(password)) score -= 1;
        if (/^[0-9]+$/.test(password)) score -= 2;
        if (/(.)\1{2,}/.test(password)) score -= 1; // Repeating characters
        if (/^(123|abc|qwe|password|admin)/i.test(password)) score -= 2;

        // Normalize score to 0-4
        score = Math.max(0, Math.min(4, Math.floor(score / 2)));

        const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        const colors = ['red', 'orange', 'yellow', 'lime', 'green'];

        return {
            score,
            label: labels[score],
            color: colors[score],
        };
    }
}
