import { getRandomNumber } from './utils';
import { EFF_LONG_WORDLIST } from './wordlists/eff-long';

export interface PassphraseGeneratorOptions {
    numWords: number;
    wordSeparator: string;
    capitalize: boolean;
    includeNumber: boolean;
}

export const defaultPassphraseOptions: PassphraseGeneratorOptions = {
    numWords: 4,
    wordSeparator: '-',
    capitalize: true,
    includeNumber: true,
};

/**
 * Generate a passphrase
 */
export function generatePassphrase(options: Partial<PassphraseGeneratorOptions> = {}): string {
    const opts = { ...defaultPassphraseOptions, ...options };

    const words: string[] = [];
    for (let i = 0; i < opts.numWords; i++) {
        let word = EFF_LONG_WORDLIST[getRandomNumber(EFF_LONG_WORDLIST.length)];
        if (opts.capitalize) {
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

    return words.join(opts.wordSeparator);
}
