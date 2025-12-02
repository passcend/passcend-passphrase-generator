import { getRandomNumber } from './utils';
import { EFF_LONG_WORDLIST } from './wordlists/eff-long';
import { KOREAN_WORDLIST } from './wordlists/korean';
import { convertHangulToQwerty } from './hangul';
import { CaseType, leetSpeak, transformCase } from './transformations';

export interface PassphraseGeneratorOptions {
    numWords: number;
    wordSeparator: string;
    capitalize: boolean;
    includeNumber: boolean;
    language: 'en' | 'ko';
    qwertyConvert: boolean; // For Korean only
    transform?: CaseType;
    leet?: boolean;
}

export const defaultPassphraseOptions: PassphraseGeneratorOptions = {
    numWords: 4,
    wordSeparator: '-',
    capitalize: true,
    includeNumber: true,
    language: 'en',
    qwertyConvert: false,
    leet: false,
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

    let words: string[] = [];
    for (let i = 0; i < opts.numWords; i++) {
        words.push(wordlist[getRandomNumber(wordlist.length)]);
    }

    // Handle Korean QWERTY conversion first if needed, so we can treat everything as English/ASCII for transforms
    if (opts.language === 'ko' && opts.qwertyConvert) {
        words = words.map(w => convertHangulToQwerty(w));
    }

    // Add number to a random word if requested
    if (opts.includeNumber) {
        const randomIndex = getRandomNumber(words.length);
        const randomNumber = getRandomNumber(10).toString();
        words[randomIndex] = words[randomIndex] + randomNumber;
    }

    // Apply transformations
    words = words.map(word => {
        let newWord = word;

        // Apply Case Transform
        // Priority: options.transform > options.capitalize (legacy for TitleCase)
        if (opts.transform) {
            newWord = transformCase(newWord, opts.transform);
        } else if (opts.capitalize) {
            // Default legacy behavior: TitleCase for English or converted QWERTY
            // (Only if language is en OR converted ko)
            if (opts.language === 'en' || opts.qwertyConvert) {
                 newWord = transformCase(newWord, 'titlecase');
            }
        }

        // Apply Leet Speak
        if (opts.leet) {
            newWord = leetSpeak(newWord);
        }

        return newWord;
    });

    return words.join(opts.wordSeparator);
}
