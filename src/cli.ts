#!/usr/bin/env node
import {
    generatePassword,
    generatePassphrase,
    generatePin,
    calculateStrength,
    defaultPasswordOptions,
    defaultPassphraseOptions,
    defaultPinOptions,
    encrypt,
    decrypt
} from './index';

const args = process.argv.slice(2);

function printHelp() {
    console.log(`
Passcend Passgen - CLI

Usage:
  passgen [command] [options]

Commands:
  password (default)    Generate a random password
  passphrase            Generate a memorable passphrase
  pin                   Generate a numeric PIN
  strength <password>   Check strength of a password
  encrypt <text>        Encrypt a text
  decrypt <text>        Decrypt a text

Global Options:
  --help, -h            Show this help message
  --secret <string>     Secret password for encryption/decryption (required for encrypt/decrypt)

Password Options:
  --length, -l <n>      Length of password (default: ${defaultPasswordOptions.length})
  --no-upper            Exclude uppercase letters
  --no-lower            Exclude lowercase letters
  --no-numbers          Exclude numbers
  --no-special          Exclude special characters
  --ambiguous, -a       Include ambiguous characters (I, l, 1, 0, O)

Passphrase Options:
  --words, -w <n>       Number of words (default: ${defaultPassphraseOptions.numWords})
  --sep, -s <char>      Word separator (default: "${defaultPassphraseOptions.wordSeparator}")
  --no-caps             Don't capitalize words
  --no-number           Don't include a number
  --lang <code >        Language: 'en' (default) or 'ko' (Korean)
  --qwerty              Convert Korean characters to QWERTY keyboard input
  --transform <type>    Case transformation: 'lowercase', 'uppercase', 'titlecase'
  --leet                Apply 1337 substitutions (e.g. 'e' -> '3')

PIN Options:
  --length, -l <n>      Length of PIN (default: ${defaultPinOptions.length})
  --allow-seq           Allow sequential patterns (e.g. 1234)
  --allow-repeat        Allow repeated patterns (e.g. 1111)

Encryption/Decryption Options:
  --iterations <n>      PBKDF2 iterations (default: 600000)
  --salt-len <n>        Salt length in bytes (default: 16)
  --iv-len <n>          IV length in bytes (default: 12)

Examples:
  passgen password -l 20 --no-special
  passgen passphrase -w 5 --sep "_"
  passgen passphrase --lang ko
  passgen pin -l 6
  passgen strength "correct-horse-battery-staple"
  passgen encrypt "Hello" --secret "my-secret"
  passgen decrypt "..." --secret "my-secret"
`);
}

function parseArgs(args: string[]) {
    const options: any = {};
    let command = 'password';
    let input = '';

    // Check for command as first argument
    let startIndex = 0;
    if (args.length > 0 && !args[0].startsWith('-')) {
        const cmd = args[0].toLowerCase();
        if (['password', 'passphrase', 'pin', 'strength', 'help', 'encrypt', 'decrypt'].includes(cmd)) {
            command = cmd;
            startIndex = 1;
        }
    }

    // Parse flags
    for (let i = startIndex; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--help' || arg === '-h') {
            command = 'help';
            break;
        }

        // Common options (Length used for Password and PIN)
        if (arg === '--length' || arg === '-l') {
            const next = args[i + 1];
            if (next && /^\d+$/.test(next)) {
                options.length = parseInt(next, 10);
                i++;
            }
        }
        // Password options
        else if (arg === '--no-upper') {
            options.uppercase = false;
        } else if (arg === '--no-lower') {
            options.lowercase = false;
        } else if (arg === '--no-numbers') {
            options.numbers = false;
        } else if (arg === '--no-special') {
            options.special = false;
        } else if (arg === '--ambiguous' || arg === '-a') {
            options.ambiguous = true;
        }
        // Passphrase options
        else if (arg === '--words' || arg === '-w') {
            const next = args[i + 1];
            if (next && /^\d+$/.test(next)) {
                options.numWords = parseInt(next, 10);
                i++;
            }
        } else if (arg === '--sep' || arg === '-s') {
            const next = args[i + 1];
            // Check if next looks like a flag (starts with - followed by letter, or --)
            // Allow "-" as a valid separator.
            const isFlag = next && (next.startsWith('--') || (/^-[a-zA-Z]/.test(next)));
            if (next && !isFlag) {
                options.wordSeparator = next;
                i++;
            }
        } else if (arg === '--no-caps') {
            options.capitalize = false;
        } else if (arg === '--no-number') {
            options.includeNumber = false;
        } else if (arg === '--lang') {
            const next = args[i + 1];
            if (next) {
                options.language = next;
                i++;
            }
        } else if (arg === '--qwerty') {
            options.qwertyConvert = true;
        } else if (arg === '--transform') {
            const next = args[i + 1];
            if (next && ['lowercase', 'uppercase', 'titlecase'].includes(next)) {
                options.transform = next;
                i++;
            }
        } else if (arg === '--leet') {
            options.leet = true;
        }
        // PIN options
        else if (arg === '--allow-seq') {
            options.allowSequential = true;
        } else if (arg === '--allow-repeat') {
            options.allowRepeated = true;
        }
        // Encryption options
        else if (arg === '--secret') {
             const next = args[i+1];
             if (next) {
                 options.secret = next;
                 i++;
             }
        } else if (arg === '--iterations') {
             const next = args[i+1];
             if (next && /^\d+$/.test(next)) {
                 options.iterations = parseInt(next, 10);
                 i++;
             }
        } else if (arg === '--salt-len') {
             const next = args[i+1];
             if (next && /^\d+$/.test(next)) {
                 options.saltLength = parseInt(next, 10);
                 i++;
             }
        } else if (arg === '--iv-len') {
             const next = args[i+1];
             if (next && /^\d+$/.test(next)) {
                 options.ivLength = parseInt(next, 10);
                 i++;
             }
        }
        // Input for strength (or loose args)
        else if (!arg.startsWith('-')) {
            input = arg;
        }
    }

    return { command, options, input };
}

async function run() {
    const { command, options, input } = parseArgs(args);

    try {
        switch (command) {
            case 'help':
                printHelp();
                break;
            case 'password':
                const pwd = generatePassword(options);
                if (process.stdout.isTTY) {
                    const strength = calculateStrength(pwd);
                    console.log(`Password: ${pwd}`);
                    console.log(`Strength: ${strength.label} (${strength.entropy} bits)`);
                } else {
                    console.log(pwd);
                }
                break;
            case 'passphrase':
                const phrase = generatePassphrase(options);
                if (process.stdout.isTTY) {
                    const strength = calculateStrength(phrase);
                    console.log(`Passphrase: ${phrase}`);
                    console.log(`Strength:   ${strength.label} (${strength.entropy} bits)`);
                } else {
                    console.log(phrase);
                }
                break;
            case 'pin':
                const pin = generatePin(options);
                if (process.stdout.isTTY) {
                    const strength = calculateStrength(pin);
                    console.log(`PIN:      ${pin}`);
                    console.log(`Strength: ${strength.label} (${strength.entropy} bits)`);
                } else {
                    console.log(pin);
                }
                break;
            case 'strength':
                if (!input) {
                    console.error('Error: Please provide a password to check.');
                    console.log('Usage: passgen strength <password>');
                    process.exit(1);
                }
                const result = calculateStrength(input);
                console.log(`Password: ${input}`);
                console.log(`Strength: ${result.label} (Score: ${result.score}/4)`);
                console.log(`Entropy:  ${result.entropy} bits`);
                break;
            case 'encrypt':
                if (!input) {
                    console.error('Error: Please provide text to encrypt.');
                    process.exit(1);
                }
                if (!options.secret) {
                    console.error('Error: Please provide a secret using --secret.');
                    process.exit(1);
                }
                const encrypted = await encrypt(input, options.secret, options);
                console.log(encrypted);
                break;
            case 'decrypt':
                if (!input) {
                    console.error('Error: Please provide text to decrypt.');
                    process.exit(1);
                }
                if (!options.secret) {
                    console.error('Error: Please provide a secret using --secret.');
                    process.exit(1);
                }
                try {
                    const decrypted = await decrypt(input, options.secret, options);
                    console.log(decrypted);
                } catch (e) {
                    console.error('Decryption failed. Check your secret and options.');
                    process.exit(1);
                }
                break;
            default:
                printHelp();
        }
    } catch (error) {
        if (error instanceof Error) {
             console.error('Error:', error.message);
        } else {
             console.error('An unknown error occurred');
        }
        process.exit(1);
    }
}

run();
