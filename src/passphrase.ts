import { getRandomNumber } from './utils';
import { EFF_LONG_WORDLIST } from './wordlists/eff-long';
import { KOREAN_WORDLIST } from './wordlists/korean';
import { convertHangulToQwerty } from './hangul';

export interface PassphraseGeneratorOptions {
    numWords: number;
    wordSeparator: string;
    capitalize: boolean;
    includeNumber: boolean;
    language: 'en' | 'ko';
    qwertyConvert: boolean; // For Korean only
}

export const defaultPassphraseOptions: PassphraseGeneratorOptions = {
    numWords: 4,
    wordSeparator: '-',
    capitalize: true,
    includeNumber: true,
    language: 'en',
    qwertyConvert: false,
};

/**
 * Generate a passphrase
 */
export function generatePassphrase(options: Partial<PassphraseGeneratorOptions> = {}): string {
    const opts = { ...defaultPassphraseOptions, ...options };
    const wordlist = opts.language === 'ko' ? KOREAN_WORDLIST : EFF_LONG_WORDLIST;

    // Validate if wordlist is empty
    if (!wordlist || wordlist.length === 0) {
        throw new Error(`Wordlist for language '${opts.language}' is empty or not found.`);
    }

    const words: string[] = [];
    for (let i = 0; i < opts.numWords; i++) {
        let word = wordlist[getRandomNumber(wordlist.length)];

        // Capitalization applies to English or QWERTY converted Korean (if desired?)
        // Standard Korean doesn't have capitalization.
        // If qwertyConvert is true, we might want to capitalize the output English string?
        // Let's stick to the logic: capitalize first, then push.
        // But for Korean characters, capitalization does nothing.

        if (opts.language === 'en' && opts.capitalize) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        words.push(word);
    }

    // Add number to a random word if requested
    if (opts.includeNumber) {
        const randomIndex = getRandomNumber(words.length);
        const randomNumber = getRandomNumber(10).toString();
        words[randomIndex] = words[randomIndex] + randomNumber;
    }

    // Handle Korean QWERTY conversion
    if (opts.language === 'ko' && opts.qwertyConvert) {
        // When converting, we usually want the whole phrase to be typable.
        // If we join with '-' first, '-' is same on QWERTY.
        // But numbers are also same.
        // So we can join then convert, or convert then join.
        // The separators usually are simple symbols.

        // However, if we convert individual words, we might want to respect capitalization?
        // Wait, "capitalize" option for Korean might be ambiguous.
        // If "capitalize" is true, and we convert "홍길동" -> "ghdrlfehd",
        // maybe the user expects "Ghdrlfehd"?
        // The current plan: Capitalize only applied for 'en' above.
        // Let's keep it simple. If Korean + QWERTY, we output lowercase unless we implement logic.
        // But user might want it.
        // Let's apply capitalization AFTER conversion if requested?

        const phrase = words.join(opts.wordSeparator);
        let converted = convertHangulToQwerty(phrase);

        // If capitalize was requested, maybe we should capitalize the first letter of the whole string or each word?
        // The original logic capitalizes EACH WORD.
        // So we should probably do conversion on each word, then capitalize, then join.

        const convertedWords = words.map(w => {
            // Check if word has number attached (it might, at the end)
            // Number conversion: digits are same in QWERTY layout usually (top row).
            // But strict Hangul conversion only handles Hangul chars.
            return convertHangulToQwerty(w);
        });

        if (opts.capitalize) {
            // Apply capitalization to the converted roman strings
            for (let i=0; i<convertedWords.length; i++) {
                convertedWords[i] = convertedWords[i].charAt(0).toUpperCase() + convertedWords[i].slice(1);
            }
        }

        return convertedWords.join(opts.wordSeparator);
    }

    return words.join(opts.wordSeparator);
}
