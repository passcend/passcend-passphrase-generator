import { decomposeHangul, convertHangulToQwerty } from './hangul';
import { generatePassphrase } from './passphrase';

describe('Hangul Utilities', () => {
    test('decomposeHangul decomposes syllable correctly', () => {
        // '한' (D55C) -> ㅎ(18), ㅏ(0), ㄴ(4)
        expect(decomposeHangul('한')).toEqual(['ㅎ', 'ㅏ', 'ㄴ']);
        // '글' (AE00) -> ㄱ(0), ㅡ(18), ㄹ(8)
        expect(decomposeHangul('글')).toEqual(['ㄱ', 'ㅡ', 'ㄹ']);
        // '가' (AC00) -> ㄱ(0), ㅏ(0), (no jongsung)
        expect(decomposeHangul('가')).toEqual(['ㄱ', 'ㅏ']);
    });

    test('convertHangulToQwerty converts correctly', () => {
        // 홍 (ghd) 길 (rlf) 동 (ehd)
        expect(convertHangulToQwerty('홍길동')).toBe('ghdrlfehd');
        // 안녕 (dkssud)
        expect(convertHangulToQwerty('안녕')).toBe('dkssud');
        // Mixed: abc가 (abcrk)
        expect(convertHangulToQwerty('abc가')).toBe('abcrk');
    });

    test('convertHangulToQwerty handles complex Jamos', () => {
        // 닭 (ekfr) -> ㄷ(e) + ㅏ(k) + ㄹ(f) + ㄱ(r)
        // Decomposed: ㄷ, ㅏ, ㄺ
        // ㄺ maps to fr in my implementation? No, let's check source.
        // QWERTY_MAP 'ㄺ': 'fr'
        expect(convertHangulToQwerty('닭')).toBe('ekfr');
    });
});

describe('Passphrase Generator (Korean)', () => {
    test('Generates Korean passphrase', () => {
        const passphrase = generatePassphrase({ language: 'ko', numWords: 3, includeNumber: false });
        expect(passphrase.split('-').length).toBe(3);
        // Should contain Hangul
        expect(/[가-힣]/.test(passphrase)).toBe(true);
    });

    test('Generates QWERTY converted passphrase', () => {
        const passphrase = generatePassphrase({
            language: 'ko',
            numWords: 3,
            includeNumber: false,
            qwertyConvert: true,
            capitalize: false // To simplify check
        });
        expect(passphrase.split('-').length).toBe(3);
        // Should NOT contain Hangul
        expect(/[가-힣]/.test(passphrase)).toBe(false);
        // Should contain only english/symbols
        expect(/^[a-zA-Z\-]+$/.test(passphrase)).toBe(true);
    });
});
