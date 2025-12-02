#!/usr/bin/env node
import {
    generatePassword,
    generatePassphrase,
    calculateStrength,
    defaultPasswordOptions,
    defaultPassphraseOptions
} from './index';

const args = process.argv.slice(2);

function printHelp() {
    console.log(`
Passcend Passphrase Generator - CLI

Usage:
  passphrase-generator [command] [options]

Commands:
  password (default)    Generate a random password
  passphrase            Generate a memorable passphrase
  strength <password>   Check strength of a password

Global Options:
  --help, -h            Show this help message

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

Examples:
  passphrase-generator password -l 20 --no-special
  passphrase-generator passphrase -w 5 --sep "_"
  passphrase-generator strength "correct-horse-battery-staple"
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
        if (['password', 'passphrase', 'strength', 'help'].includes(cmd)) {
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

        // Password options
        if (arg === '--length' || arg === '-l') {
            const next = args[i + 1];
            if (next && /^\d+$/.test(next)) {
                options.length = parseInt(next, 10);
                i++;
            }
        } else if (arg === '--no-upper') {
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
        }
        // Input for strength (or loose args)
        else if (!arg.startsWith('-')) {
            input = arg;
        }
    }

    return { command, options, input };
}

function run() {
    const { command, options, input } = parseArgs(args);

    try {
        switch (command) {
            case 'help':
                printHelp();
                break;
            case 'password':
                console.log(generatePassword(options));
                break;
            case 'passphrase':
                console.log(generatePassphrase(options));
                break;
            case 'strength':
                if (!input) {
                    console.error('Error: Please provide a password to check.');
                    console.log('Usage: passphrase-generator strength <password>');
                    process.exit(1);
                }
                const result = calculateStrength(input);
                console.log(`Password: ${input}`);
                console.log(`Strength: ${result.label} (Score: ${result.score}/4)`);
                console.log(`Entropy:  ${result.entropy} bits`);
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
