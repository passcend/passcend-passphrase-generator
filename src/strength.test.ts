import { calculateStrength, calculateEntropy } from './strength';

describe('Strength Calculator', () => {
    test('calculates basic entropy', () => {
        // 'abc', length 3, pool 26. 3 * log2(26) = 3 * 4.7 = 14.1
        expect(calculateEntropy('abc')).toBe(14);
        expect(calculateEntropy('')).toBe(0);
    });

    test('penalizes keyboard patterns', () => {
        // 'qwerty' length 6.
        // Entropy: 6 * log2(26) = 28.2.
        // Base Score: < 8 chars -> 0.
        // Variety: Lower only -> 0.
        // Penalties:
        // - Letters only (-1)
        // - Common pattern (-2) because 'qwe' matches /^(123|abc|qwe...)/
        // - Keyboard pattern (-2)
        // Entropy < 40 -> -1
        // Total should be very low (0).

        const result = calculateStrength('qwerty');
        expect(result.warnings).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
        expect(result.score).toBe(0);
    });

    test('penalizes complex keyboard patterns even if not standard starts', () => {
        // 'asdfgh'
        // 'asd' matches /abc|qwe/ etc? No.
        // But 'asdf' is a keyboard pattern.
        const result = calculateStrength('asdfgh');
        expect(result.warnings).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('penalizes vertical keyboard patterns', () => {
        // 'qazwsx'
        const result = calculateStrength('qazwsx');
        expect(result.warnings).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });

    test('does not warn for strong random passwords', () => {
        const result = calculateStrength('C0rr3ctH0rs3B@tt3rySt@pl3');
        expect(result.warnings).not.toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
        expect(result.score).toBeGreaterThanOrEqual(3);
    });

    test('returns correct warning structure', () => {
        const result = calculateStrength('123456');
        // Should have "Numbers only", "Common pattern detected" (123), maybe "Keyboard pattern" if 123456 is considered one (it's adjacent).
        // 1-2-3-4-5-6 is adjacent in my graph.

        expect(result.warnings).toContain('Numbers only');
        // '123' is in the common regex check too.
        expect(result.warnings).toContain('Common pattern detected');
        // And keyboard pattern.
        expect(result.warnings).toContain("Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')");
    });
});
