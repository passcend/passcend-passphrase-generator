import { PasswordGenerator } from './index';

describe('PasswordGenerator', () => {
    describe('generatePassword', () => {
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

    describe('generatePassphrase', () => {
        it('should generate a passphrase with correct word count', () => {
            const passphrase = PasswordGenerator.generatePassphrase({ numWords: 5, wordSeparator: '-' });
            const words = passphrase.split('-');
            expect(words.length).toBe(5);
        });

        it('should capitalize words if requested', () => {
            const passphrase = PasswordGenerator.generatePassphrase({ numWords: 3, capitalize: true });
            const words = passphrase.split('-');
            words.forEach(word => {
                // Check if first char is uppercase (ignoring the number if it's appended)
                // Actually, if number is appended, it's at the end.
                // But if number is appended to a word, the word itself starts with uppercase.
                expect(word[0]).toMatch(/[A-Z]/);
            });
        });
    });

    describe('calculateStrength', () => {
        it('should return a score between 0 and 4', () => {
            const strength = PasswordGenerator.calculateStrength('password123');
            expect(strength.score).toBeGreaterThanOrEqual(0);
            expect(strength.score).toBeLessThanOrEqual(4);
        });
    });
});
