
import { generatePassword, generatePassphrase, calculateEntropy, PasswordGenerator } from './index';
import { exec } from 'child_process';
import path from 'path';

describe('Rigorous Password Testing', () => {
    describe('Fuzzing-like Tests', () => {
        it('should generate 1000 passwords satisfying constraints', () => {
            for (let i = 0; i < 1000; i++) {
                // Randomize options
                const length = Math.floor(Math.random() * 50) + 4; // 4 to 53
                const uppercase = Math.random() > 0.5;
                const lowercase = Math.random() > 0.5;
                const numbers = Math.random() > 0.5;
                const special = Math.random() > 0.5;
                const ambiguous = Math.random() > 0.5;

                // Ensure at least one set is true, otherwise it defaults to lowercase
                // The implementation defaults to lowercase if nothing selected.

                const pwd = generatePassword({
                    length,
                    uppercase,
                    lowercase,
                    numbers,
                    special,
                    ambiguous,
                    minUppercase: uppercase ? 1 : 0,
                    minLowercase: lowercase ? 1 : 0,
                    minNumbers: numbers ? 1 : 0,
                    minSpecial: special ? 1 : 0,
                });

                // Length check
                // Note: if length < sum of mins, it extends to sum of mins.
                const minLength = (uppercase ? 1 : 0) + (lowercase ? 1 : 0) + (numbers ? 1 : 0) + (special ? 1 : 0);
                const expectedLength = Math.max(length, minLength);

                // If requested length is smaller than required chars, the implementation currently returns string of length `remainingLength + requiredChars.length`.
                // In `password.ts`: `remainingLength = Math.max(0, opts.length - requiredChars.length)`
                // `allChars = [...requiredChars, ...randomChars]`
                // So length is indeed Math.max(length, requiredChars.length)

                expect(pwd.length).toBe(expectedLength);

                if (uppercase) expect(/[A-Z]/.test(pwd)).toBe(true);
                if (lowercase) expect(/[a-z]/.test(pwd)).toBe(true);
                if (numbers) expect(/[0-9]/.test(pwd)).toBe(true);
                if (special) expect(/[^A-Za-z0-9]/.test(pwd)).toBe(true);

                if (!ambiguous) {
                   // Ambiguous chars: I, l, 1, 0, O
                   // Wait, checking `password.ts`:
                   // UPPERCASE_NO_AMBIGUOUS = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // No I, L, O
                   // LOWERCASE_NO_AMBIGUOUS = 'abcdefghjkmnpqrstuvwxyz'; // No i, l, o
                   // NUMBERS_NO_AMBIGUOUS = '23456789'; // No 0, 1

                   // Note: 'L' is excluded in uppercase?
                   // The comment says "No I, L, O". Code: 'ABCDEFGHJKMNPQRSTUVWXYZ'.
                   // 'I' (missing between H and J), 'L' (missing between K and M), 'O' (missing between N and P). Correct.

                   // Note: 'i', 'l', 'o' excluded in lowercase?
                   // 'abcdefghjkmnpqrstuvwxyz'
                   // 'i' (missing between h and j), 'l' (missing between k and m), 'o' (missing between n and p). Correct.

                   expect(/[Il10Oilo]/.test(pwd)).toBe(false);
                }
            }
        });
    });

    describe('Edge Cases', () => {
        it('should handle length 0 by defaulting to 16 or adhering to logic', () => {
             // If length is 0, logic:
             // requiredChars might be added if defaults (minUppercase=1 etc) are active.
             // defaultPasswordOptions has length 16.
             // But if we pass { length: 0 } explicitly:
             const pwd = generatePassword({ length: 0, minUppercase: 0, minLowercase: 0, minNumbers: 0, minSpecial: 0 });
             // requiredChars = []
             // remainingLength = 0
             // returns empty string?
             expect(pwd).toBe('');
        });

        it('should handle length 1 with multiple requirements by extending length', () => {
            // If we ask for length 1 but require uppercase, lowercase, number
            const pwd = generatePassword({
                length: 1,
                uppercase: true, minUppercase: 1,
                lowercase: true, minLowercase: 1,
                numbers: true, minNumbers: 1
            });
            // Should have at least 3 chars
            expect(pwd.length).toBeGreaterThanOrEqual(3);
        });

        it('should default to lowercase if all types disabled', () => {
             const pwd = generatePassword({
                 length: 10,
                 uppercase: false,
                 lowercase: false,
                 numbers: false,
                 special: false,
                 minUppercase: 0,
                 minLowercase: 0,
                 minNumbers: 0,
                 minSpecial: 0
             });
             expect(pwd.length).toBe(10);
             expect(/^[a-z]+$/.test(pwd)).toBe(true); // Should be all lowercase (default fallback)
        });
    });
});

describe('Rigorous Passphrase Testing', () => {
     it('should generate distinct passphrases (randomness check)', () => {
         const phrases = new Set();
         for(let i=0; i<100; i++) {
             phrases.add(generatePassphrase({ numWords: 3 }));
         }
         // Extremely unlikely to have collision in 100 tries with EFF long list
         expect(phrases.size).toBe(100);
     });

     it('should handle Korean QWERTY conversion with Capitalization correctly', () => {
         // This tests the logic I saw in passphrase.ts
         const result = generatePassphrase({
             language: 'ko',
             qwertyConvert: true,
             capitalize: true, // Should capitalize converted words
             numWords: 3,
             includeNumber: false,
             wordSeparator: ' '
         });

         const words = result.split(' ');
         expect(words.length).toBe(3);
         words.forEach(w => {
             expect(/^[A-Z]/.test(w)).toBe(true); // Starts with uppercase
             expect(/^[a-zA-Z]+$/.test(w)).toBe(true); // Only letters (since no numbers)
         });
     });
});

describe('CLI Integration Test', () => {
    const cliPath = path.resolve(__dirname, 'cli.ts');
    // Using ts-node to run cli.ts
    // We assume ts-node is available or we can run with node -r ts-node/register
    // Or we can compile first. Since 'npm test' runs jest with ts-jest, we might not have 'ts-node' in path for child_process.
    // However, we can use `npx ts-node` or `node_modules/.bin/ts-node`.

    // Better: use the compiled output if available, or assume `npm run build` ran?
    // The environment might not have build artifacts.
    // Let's try `npx ts-node src/cli.ts`

    const runCli = (args: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            exec(`npx ts-node ${cliPath} ${args}`, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr || error.message);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    };

    // Note: This test might be slow. Increase timeout.
    jest.setTimeout(30000);

    it('should print help', async () => {
        const output = await runCli('--help');
        expect(output).toContain('Usage:');
        expect(output).toContain('passphrase-generator');
    });

    it('should generate a password via CLI', async () => {
        const output = await runCli('password -l 25');
        expect(output.length).toBe(25);
    });

    it('should generate a passphrase via CLI', async () => {
        const output = await runCli('passphrase -w 5 --sep "_"');
        expect(output.split('_').length).toBe(5);
    });

    it('should calculate strength via CLI', async () => {
        const output = await runCli('strength "password123"');
        expect(output).toContain('Strength:');
        expect(output).toContain('Entropy:');
    });
});
