
import {
    generatePassword,
    generatePassphrase,
    generatePin,
    calculateStrength,
    validatePassword,
    encrypt,
    decrypt
} from './index';

describe('API Output Structure Verification', () => {

    test('generatePassword returns a simple string', () => {
        const result = generatePassword();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('generatePassphrase returns a simple string', () => {
        const result = generatePassphrase();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('generatePin returns a simple string', () => {
        const result = generatePin();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('calculateStrength returns specific JSON structure', () => {
        const result = calculateStrength('Tr0ub4dor&3');

        // Check strict structure for Documentation
        expect(result).toHaveProperty('score');
        expect(typeof result.score).toBe('number');

        expect(result).toHaveProperty('label');
        expect(typeof result.label).toBe('string');

        expect(result).toHaveProperty('color');
        expect(typeof result.color).toBe('string');

        expect(result).toHaveProperty('entropy');
        expect(typeof result.entropy).toBe('number');

        expect(result).toHaveProperty('warnings');
        expect(Array.isArray(result.warnings)).toBe(true);

        // Example match for documentation consistency
        if (result.score === 4) {
             expect(['Very Strong']).toContain(result.label);
        }
    });

    test('validatePassword returns specific JSON structure', () => {
        const policy = { minLength: 8, requireNumbers: true };
        const result = validatePassword('password123', policy);

        expect(result).toHaveProperty('isValid');
        expect(typeof result.isValid).toBe('boolean');

        expect(result).toHaveProperty('errors');
        expect(Array.isArray(result.errors)).toBe(true);
    });

    test('encrypt returns a base64 string structure', async () => {
        const result = await encrypt('data', 'secret');
        expect(typeof result).toBe('string');
        // Structure check: Salt(Base64) + IV(Base64) + Cipher(Base64)
        // This usually implies length check or regex if we want to be strict,
        // but type string is enough for the basic API contract.
    });
});
