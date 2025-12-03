import { checkKeyboardPatterns } from './keyboard';

export interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    entropy?: number;
    warnings?: string[];
}

/**
 * Calculate the information entropy of a password in bits.
 * Entropy E = L * log2(R)
 * L = password length
 * R = pool size of unique characters
 */
export function calculateEntropy(password: string): number {
    if (!password) return 0;

    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[\uAC00-\uD7AF]/.test(password)) poolSize += 11172; // Hangul Syllables
    // Special chars: anything that is NOT a-z, A-Z, 0-9, or Hangul
    if (/[^a-zA-Z0-9\uAC00-\uD7AF]/.test(password)) poolSize += 32;

    if (poolSize === 0) return 0;

    const length = password.length;
    return Math.floor(length * Math.log2(poolSize));
}

/**
 * Calculate password strength (0-4 scale like zxcvbn)
 * Returns: 0 = very weak, 1 = weak, 2 = fair, 3 = strong, 4 = very strong
 */
export function calculateStrength(password: string): PasswordStrength {
    if (!password) {
        return { score: 0, label: 'Very Weak', color: 'red', entropy: 0, warnings: [] };
    }

    let score = 0;
    const length = password.length;
    const entropy = calculateEntropy(password);
    const warnings: string[] = [];

    // Length scoring
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (length >= 20) score++;

    // Character variety scoring
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasHangul = /[\uAC00-\uD7AF]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9\uAC00-\uD7AF]/.test(password);

    // Hangul counts as a variety type, essentially "Other Letters" but high entropy
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial, hasHangul].filter(Boolean).length;
    if (varietyCount >= 2) score++;
    if (varietyCount >= 3) score++;
    if (varietyCount >= 4) score++;

    // Penalize common patterns
    if (/^[a-zA-Z]+$/.test(password)) {
        score -= 1;
        warnings.push('Letters only');
    }
    if (/^[0-9]+$/.test(password)) {
        score -= 2;
        warnings.push('Numbers only');
    }
    if (/(.)\1{2,}/.test(password)) {
        score -= 1; // Repeating characters
        warnings.push('Repeated characters');
    }
    if (/^(123|abc|qwe|password|admin)/i.test(password)) {
        score -= 2;
        warnings.push('Common pattern detected');
    }

    // Keyboard patterns
    const keyboardPatterns = checkKeyboardPatterns(password);
    if (keyboardPatterns.length > 0) {
        score -= 2;
        warnings.push(...keyboardPatterns);
    }

    // Use entropy to boost or penalize
    if (entropy > 120) score += 2;
    else if (entropy > 80) score += 1;
    else if (entropy < 40) score -= 1;

    // Normalize score to 0-4
    score = Math.max(0, Math.min(4, Math.floor(score / 2)));

    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['red', 'orange', 'yellow', 'lime', 'green'];

    return {
        score,
        label: labels[score],
        color: colors[score],
        entropy,
        warnings
    };
}
