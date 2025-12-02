import { PasswordGenerator, generatePassword, generatePassphrase, calculateStrength, calculateEntropy } from './index';

describe('PasswordGenerator', () => {
    describe('generatePassword (Class method)', () => {
        it('should generate a password of specified length', () => {
            const password = PasswordGenerator.generatePassword({ length: 20 });
            expect(password.length).toBe(20);
        });

        it('should include requested character types', () => {
            const password = PasswordGenerator.generatePassword({
                length: 50,
                uppercase: true,
                lowercase: true,
                numbers: true,
                special: true,
                minUppercase: 1,
                minLowercase: 1,
                minNumbers: 1,
                minSpecial: 1
            });
            expect(/[A-Z]/.test(password)).toBe(true);
            expect(/[a-z]/.test(password)).toBe(true);
            expect(/[0-9]/.test(password)).toBe(true);
            expect(/[^A-Za-z0-9]/.test(password)).toBe(true);
        });
    });

    describe('generatePassphrase (Class method)', () => {
        it('should generate a passphrase with correct word count', () => {
            const passphrase = PasswordGenerator.generatePassphrase({ numWords: 5, wordSeparator: '-' });
            const words = passphrase.split('-');
            expect(words.length).toBe(5);
        });

        it('should capitalize words if requested', () => {
            const passphrase = PasswordGenerator.generatePassphrase({ numWords: 3, capitalize: true });
            const words = passphrase.split('-');
            words.forEach(word => {
                // If number is appended, it's at the end.
                // The word itself should start with uppercase.
                expect(word[0]).toMatch(/[A-Z]/);
            });
        });
    });

    describe('calculateStrength (Class method)', () => {
        it('should return a score between 0 and 4', () => {
            const strength = PasswordGenerator.calculateStrength('password123');
            expect(strength.score).toBeGreaterThanOrEqual(0);
            expect(strength.score).toBeLessThanOrEqual(4);
            expect(strength.entropy).toBeDefined();
        });
    });
});

describe('Standalone Functions', () => {
    describe('generatePassword', () => {
        it('should generate a password', () => {
            const password = generatePassword({ length: 10 });
            expect(password.length).toBe(10);
        });
    });

    describe('generatePassphrase', () => {
        it('should generate a passphrase', () => {
            const passphrase = generatePassphrase();
            expect(passphrase).toBeTruthy();
            expect(passphrase.split('-').length).toBe(4);
        });
    });

    describe('calculateEntropy', () => {
        it('should calculate 0 for empty string', () => {
            expect(calculateEntropy('')).toBe(0);
        });

        it('should calculate entropy for simple lowercase password', () => {
            // 'abc', length 3, pool 26. 3 * log2(26) = 3 * 4.7 = 14.1
            expect(calculateEntropy('abc')).toBe(14);
        });

        it('should calculate higher entropy for complex password', () => {
            const entropy1 = calculateEntropy('password');
            const entropy2 = calculateEntropy('P@ssw0rd123!');
            expect(entropy2).toBeGreaterThan(entropy1);
        });
    });
});
