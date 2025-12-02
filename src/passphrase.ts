import { getRandomNumber } from './utils';
import { EFF_LONG_WORDLIST } from './wordlists/eff-long';
import { KOREAN_WORDLIST } from './wordlists/korean';
import { convertHangulToQwerty, attachJosa, JosaType } from './hangul';

export interface PassphraseGeneratorOptions {
    numWords: number;
    wordSeparator: string;
    capitalize: boolean;
    includeNumber: boolean;
    language: 'en' | 'ko';
    qwertyConvert: boolean; // For Korean only
    useJosa: boolean; // For Korean only - "sentence mode"
}

export const defaultPassphraseOptions: PassphraseGeneratorOptions = {
    numWords: 4,
    wordSeparator: '-',
    capitalize: true,
    includeNumber: true,
    language: 'en',
    qwertyConvert: false,
    useJosa: false,
};

// Cycle of Josa types to make it sound like a sentence
const JOSA_CYCLE: JosaType[] = ['subject', 'object', 'and', 'direction', 'topic', 'possessive'];

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

    let words: string[] = [];
    for (let i = 0; i < opts.numWords; i++) {
        let word = wordlist[getRandomNumber(wordlist.length)];

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

    // Apply Korean specific logic
    if (opts.language === 'ko') {
        // Apply Josa if requested
        if (opts.useJosa) {
            words = words.map((word, index) => {
                const josaType = JOSA_CYCLE[index % JOSA_CYCLE.length];
                return attachJosa(word, josaType);
            });
        }

        // Handle Korean QWERTY conversion
        if (opts.qwertyConvert) {
            // Convert words first (possibly with Josa attached)
            let convertedWords = words.map(w => convertHangulToQwerty(w));

            // Apply capitalization to converted English words if requested
            // Note: In original code, capitalization was ignored for Korean path unless it was 'en'.
            // But if we convert to QWERTY, the result is alphabetic, so capitalization applies.
            // The original code comment said: "Standard Korean doesn't have capitalization."
            // But if we convert to QWERTY, users might expect it.
            // Let's enable capitalization for QWERTY output if capitalize is true.
            if (opts.capitalize) {
                convertedWords = convertedWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));
            }

            return convertedWords.join(opts.wordSeparator);
        }
    }

    return words.join(opts.wordSeparator);
}
