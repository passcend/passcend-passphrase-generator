import { checkKeyboardPatterns } from './keyboard';

describe('Keyboard Pattern Detection', () => {
    test('detects simple horizontal patterns', () => {
        expect(checkKeyboardPatterns('qwerty')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
        expect(checkKeyboardPatterns('asdf')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
        expect(checkKeyboardPatterns('zxcv')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('detects simple vertical patterns', () => {
        expect(checkKeyboardPatterns('qaz')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
        expect(checkKeyboardPatterns('wsx')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
        expect(checkKeyboardPatterns('edc')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('detects reverse patterns', () => {
        // q-w is adj, w-q is adj. So reverse should work if adjacency is bidirectional.
        expect(checkKeyboardPatterns('ytrewq')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
        expect(checkKeyboardPatterns('fdsa')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('detects patterns in mixed case', () => {
        expect(checkKeyboardPatterns('QwErTy')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('detects patterns with shifted characters', () => {
        expect(checkKeyboardPatterns('!@#$')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('does not flag random strings', () => {
        expect(checkKeyboardPatterns('qplm')).toEqual([]);
        expect(checkKeyboardPatterns('a8z2')).toEqual([]);
        expect(checkKeyboardPatterns('correcthorse')).toEqual([]);
    });

    test('detects embedded patterns', () => {
        expect(checkKeyboardPatterns('mypasSword123qwerty')).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('handles short strings', () => {
        expect(checkKeyboardPatterns('qw')).toEqual([]); // Length < 3
        expect(checkKeyboardPatterns('')).toEqual([]);
    });
});
