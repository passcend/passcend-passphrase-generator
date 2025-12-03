
import { encrypt, decrypt } from './aes-gcm';

describe('AES-GCM Encryption', () => {
    const secret = 'super-secret-password';
    const plaintext = 'This is a test message. 안녕하세요.';

    it('should encrypt and decrypt with default options', async () => {
        const encrypted = await encrypt(plaintext, secret);
        expect(typeof encrypted).toBe('string');
        const decrypted = await decrypt(encrypted, secret);
        expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertexts for same input (due to random salt/iv)', async () => {
        const enc1 = await encrypt(plaintext, secret);
        const enc2 = await encrypt(plaintext, secret);
        expect(enc1).not.toBe(enc2);
    });

    it('should fail to decrypt with wrong password', async () => {
        const encrypted = await encrypt(plaintext, secret);
        await expect(decrypt(encrypted, 'wrong-password')).rejects.toThrow();
    });

    it('should work with custom iterations (speed up test)', async () => {
        // Use lower iterations for faster test, though default is 600k now
        const options = { iterations: 1000 };
        const encrypted = await encrypt(plaintext, secret, options);
        const decrypted = await decrypt(encrypted, secret, options);
        expect(decrypted).toBe(plaintext);
    });

    it('should fail if iterations do not match', async () => {
        const optionsEnc = { iterations: 2000 };
        const optionsDec = { iterations: 1000 };
        const encrypted = await encrypt(plaintext, secret, optionsEnc);
        await expect(decrypt(encrypted, secret, optionsDec)).rejects.toThrow();
    });

    it('should work with custom salt and IV lengths', async () => {
        const options = { saltLength: 32, ivLength: 16, iterations: 1000 };
        const encrypted = await encrypt(plaintext, secret, options);

        // Check length roughly: base64 overhead ~1.33x
        // Raw length = 32 (salt) + 16 (iv) + plaintext_len + 16 (tag)
        // plaintext len ~ 35 bytes (English + Korean chars take more bytes)
        // Just verify it decrypts
        const decrypted = await decrypt(encrypted, secret, options);
        expect(decrypted).toBe(plaintext);
    });

    it('should fail if salt length mismatch', async () => {
         const encOptions = { saltLength: 32, iterations: 1000 };
         const decOptions = { saltLength: 16, iterations: 1000 }; // Default is 16
         const encrypted = await encrypt(plaintext, secret, encOptions);

         // This might throw "Invalid encrypted data" or decryption failure or return garbage
         // Because we are slicing the buffer incorrectly
         await expect(decrypt(encrypted, secret, decOptions)).rejects.toThrow();
    });
});
