import { generatePassword, PasswordGeneratorOptions, defaultPasswordOptions } from './password';
import { generatePassphrase, PassphraseGeneratorOptions, defaultPassphraseOptions } from './passphrase';
import { calculateStrength, calculateEntropy, PasswordStrength } from './strength';

export {
    generatePassword,
    PasswordGeneratorOptions,
    defaultPasswordOptions,
    generatePassphrase,
    PassphraseGeneratorOptions,
    defaultPassphraseOptions,
    calculateStrength,
    calculateEntropy,
    PasswordStrength
};

// Deprecated: Use named exports instead for better tree-shaking
export class PasswordGenerator {
    static defaultPasswordOptions = defaultPasswordOptions;
    static defaultPassphraseOptions = defaultPassphraseOptions;

    /**
     * Generate a random password
     */
    static generatePassword(options: Partial<PasswordGeneratorOptions> = {}): string {
        return generatePassword(options);
    }

    /**
     * Generate a passphrase
     */
    static generatePassphrase(options: Partial<PassphraseGeneratorOptions> = {}): string {
        return generatePassphrase(options);
    }

    /**
     * Calculate password strength
     */
    static calculateStrength(password: string): PasswordStrength {
        return calculateStrength(password);
    }
}
