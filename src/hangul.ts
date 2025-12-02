// Hangul Jamo constants
const CHOSUNG = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];
const JUNGSUNG = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];
const JONGSUNG = [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
    'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// QWERTY map for 2-set Korean keyboard
const QWERTY_MAP: { [key: string]: string } = {
    // Chosung
    'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E', 'ㄹ': 'f',
    'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': 'Q', 'ㅅ': 't', 'ㅆ': 'T', 'ㅇ': 'd',
    'ㅈ': 'w', 'ㅉ': 'W', 'ㅊ': 'c', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
    // Jungsung
    'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'O', 'ㅓ': 'j', 'ㅔ': 'p',
    'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h', 'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hl',
    'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'nj', 'ㅞ': 'np', 'ㅟ': 'nl', 'ㅠ': 'b',
    'ㅡ': 'm', 'ㅢ': 'ml', 'ㅣ': 'l',
    // Jongsung (mapping is mostly same as Chosung but position dependent in logic, here just mapping chars)
    'ㄳ': 'rt', 'ㄵ': 'sw', 'ㄶ': 'sg', 'ㄺ': 'fr', 'ㄻ': 'fa', 'ㄼ': 'fq',
    'ㄽ': 'ft', 'ㄾ': 'fx', 'ㄿ': 'fv', 'ㅀ': 'fg', 'ㅄ': 'qt'
};

export type JosaType = 'subject' | 'object' | 'topic' | 'and' | 'direction' | 'possessive';

export function decomposeHangul(char: string): string[] {
    const code = char.charCodeAt(0);
    // Hangul Syllables range: AC00 - D7A3
    if (code < 0xAC00 || code > 0xD7A3) {
        return [char];
    }

    const offset = code - 0xAC00;
    const jong = offset % 28;
    const jung = ((offset - jong) / 28) % 21;
    const cho = (((offset - jong) / 28) - jung) / 21;

    const result = [CHOSUNG[cho], JUNGSUNG[jung]];
    if (jong > 0) {
        result.push(JONGSUNG[jong]);
    }
    return result;
}

export function convertHangulToQwerty(text: string): string {
    let result = '';
    for (const char of text) {
        const decomposed = decomposeHangul(char);
        for (const jamo of decomposed) {
            // Check if it's a complex Jamo that needs splitting for QWERTY mapping
            // In 2-set, ㄳ is typed as r (ㄱ) then t (ㅅ).
            // However, our QWERTY_MAP has 'rt' for 'ㄳ'.
            if (QWERTY_MAP[jamo]) {
                result += QWERTY_MAP[jamo];
            } else {
                // If not found (e.g. non-Hangul), keep as is
                // But wait, ㄳ in JONGSUNG array is a single string.
                // We need to ensure QWERTY_MAP covers all.
                // Let's verify standard keyboard behavior.
                // Yes, ㄳ is rt.
                result += jamo; // Fallback? Should not happen for valid Hangul Jamo
            }
        }
    }
    return result;
}

/**
 * Returns true if the character has a Jongsung (final consonant)
 * OR acts as if it has one (for digits).
 * Also returns special check for 'ㄹ' ending.
 */
function checkJongsung(word: string): { hasJong: boolean, isRieul: boolean } {
    if (!word || word.length === 0) return { hasJong: false, isRieul: false };
    const lastChar = word.charAt(word.length - 1);
    const code = lastChar.charCodeAt(0);

    // Check if the character is a Hangul Syllable
    if (code >= 0xAC00 && code <= 0xD7A3) {
        const offset = code - 0xAC00;
        const jongIndex = offset % 28;
        return {
            hasJong: jongIndex > 0,
            isRieul: jongIndex === 8
        };
    }

    // Check for digits 0-9
    if (code >= 48 && code <= 57) {
        // 0 (영 - ㅇ), 1 (일 - ㄹ), 2 (이 - vowel), 3 (삼 - ㅁ), 4 (사 - vowel)
        // 5 (오 - vowel), 6 (육 - ㄱ), 7 (칠 - ㄹ), 8 (팔 - ㄹ), 9 (구 - vowel)
        const digit = code - 48;
        const hasJongDigits = [0, 1, 3, 6, 7, 8];
        const isRieulDigits = [1, 7, 8];

        return {
            hasJong: hasJongDigits.includes(digit),
            isRieul: isRieulDigits.includes(digit)
        };
    }

    // Default to vowel ending for non-Hangul/non-digit
    return { hasJong: false, isRieul: false };
}

export function attachJosa(word: string, type: JosaType): string {
    const { hasJong, isRieul } = checkJongsung(word);

    let josa = '';
    switch (type) {
        case 'subject': // 이/가
            josa = hasJong ? '이' : '가';
            break;
        case 'object': // 을/를
            josa = hasJong ? '을' : '를';
            break;
        case 'topic': // 은/는
            josa = hasJong ? '은' : '는';
            break;
        case 'and': // 와/과
            josa = hasJong ? '과' : '와';
            break;
        case 'direction': // 로/으로
            // '로' is used after Vowel or 'ㄹ'.
            // '으로' is used after Consonant except 'ㄹ'.
            if (!hasJong || isRieul) {
                josa = '로';
            } else {
                josa = '으로';
            }
            break;
        case 'possessive': // 의
            josa = '의';
            break;
    }

    return word + josa;
}
