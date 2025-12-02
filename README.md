# Passcend Passphrase Generator

A secure, flexible, and zero-dependency password and passphrase generator for Node.js and the browser.

## Features

*   **Secure**: Uses `crypto.getRandomValues` (Browser) or `crypto.randomBytes` (Node.js) for cryptographically secure random number generation.
*   **Flexible**: Generate random passwords with customizable character sets (uppercase, lowercase, numbers, special characters).
*   **Passphrases**: Generate memorable passphrases using the EFF Large Wordlist (7776 words).
*   **Strength Meter**: Built-in password strength estimation (0-4 score).
*   **Zero Dependencies**: No external runtime dependencies.
*   **TypeScript Support**: Written in TypeScript with full type definitions.

## Installation

```bash
npm install passcend-passphrase-generator
```

## Usage

### Generate a Password

```typescript
import { PasswordGenerator } from 'passcend-passphrase-generator';

// Generate a default password (16 chars, all types)
const password = PasswordGenerator.generatePassword();
console.log(password); // e.g., "x8!kL9#mP2$qR5@z"

// Customize options
const customPassword = PasswordGenerator.generatePassword({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: false,
    ambiguous: false // Exclude I, l, 1, 0, O
});
console.log(customPassword);
```

### Generate a Passphrase

```typescript
import { PasswordGenerator } from 'passcend-passphrase-generator';

// Generate a default passphrase (4 words, capitalized, with number)
const passphrase = PasswordGenerator.generatePassphrase();
console.log(passphrase); // e.g., "Correct-Horse-Battery-Staple5"

// Customize options
const customPassphrase = PasswordGenerator.generatePassphrase({
    numWords: 6,
    wordSeparator: ' ',
    capitalize: false,
    includeNumber: false
});
console.log(customPassphrase); // e.g., "correct horse battery staple blue sky"
```

### Check Password Strength

```typescript
import { PasswordGenerator } from 'passcend-passphrase-generator';

const strength = PasswordGenerator.calculateStrength('weakpassword');
console.log(strength);
// Output:
// {
//   score: 1,
//   label: 'Weak',
//   color: 'orange'
// }
```

## API Reference

### `PasswordGenerator.generatePassword(options?)`

Generates a random password string.

**Options:**

*   `length` (number): Length of the password (default: 16).
*   `uppercase` (boolean): Include uppercase letters (default: true).
*   `lowercase` (boolean): Include lowercase letters (default: true).
*   `numbers` (boolean): Include numbers (default: true).
*   `special` (boolean): Include special characters (default: true).
*   `ambiguous` (boolean): Include ambiguous characters (default: false).
*   `minUppercase` (number): Minimum number of uppercase letters (default: 1).
*   `minLowercase` (number): Minimum number of lowercase letters (default: 1).
*   `minNumbers` (number): Minimum number of numbers (default: 1).
*   `minSpecial` (number): Minimum number of special characters (default: 1).

### `PasswordGenerator.generatePassphrase(options?)`

Generates a random passphrase string using the EFF Large Wordlist.

**Options:**

*   `numWords` (number): Number of words (default: 4).
*   `wordSeparator` (string): Separator between words (default: '-').
*   `capitalize` (boolean): Capitalize the first letter of each word (default: true).
*   `includeNumber` (boolean): Append a random number to one of the words (default: true).

### `PasswordGenerator.calculateStrength(password)`

Calculates the estimated strength of a password.

**Returns:**

*   `score` (number): 0 (Very Weak) to 4 (Very Strong).
*   `label` (string): Human-readable strength label.
*   `color` (string): Suggested UI color (red, orange, yellow, lime, green).

## License

MIT
