
import { attachJosa, decomposeHangul, convertHangulToQwerty } from './hangul';
import { generatePassphrase } from './passphrase';

describe('Hangul Josa Attachment', () => {
  test('attachJosa attaches correct particles for Hangul syllables', () => {
    // Subject: 이/가
    expect(attachJosa('책상', 'subject')).toBe('책상이'); // Ends in consonant (ㅇ)
    expect(attachJosa('바다', 'subject')).toBe('바다가'); // Ends in vowel (ㅏ)

    // Object: 을/를
    expect(attachJosa('구름', 'object')).toBe('구름을'); // Ends in consonant (ㅁ)
    expect(attachJosa('나무', 'object')).toBe('나무를'); // Ends in vowel (ㅜ)

    // Topic: 은/는
    expect(attachJosa('하늘', 'topic')).toBe('하늘은'); // Ends in consonant (ㄹ)
    expect(attachJosa('지구', 'topic')).toBe('지구는'); // Ends in vowel (ㅜ)

    // And: 와/과
    expect(attachJosa('밥', 'and')).toBe('밥과'); // Ends in consonant (ㅂ)
    expect(attachJosa('빵', 'and')).toBe('빵과'); // Ends in consonant (ㅇ)
    expect(attachJosa('우유', 'and')).toBe('우유와'); // Ends in vowel (ㅠ)

    // Direction: 로/으로
    // Consonant ending (except ㄹ) -> 으로
    expect(attachJosa('집', 'direction')).toBe('집으로');
    // Vowel ending -> 로
    expect(attachJosa('학교', 'direction')).toBe('학교로');
    // 'ㄹ' ending -> 로 (Special case)
    expect(attachJosa('서울', 'direction')).toBe('서울로');
    expect(attachJosa('터널', 'direction')).toBe('터널로');
  });

  test('attachJosa attaches correct particles for Digits', () => {
    // 0 (영 - ㅇ) -> Consonant
    expect(attachJosa('number0', 'subject')).toBe('number0이');
    // 1 (일 - ㄹ) -> Consonant but 'ㄹ' for direction
    expect(attachJosa('number1', 'subject')).toBe('number1이');
    expect(attachJosa('number1', 'direction')).toBe('number1로'); // ㄹ exception
    // 2 (이 - vowel)
    expect(attachJosa('number2', 'subject')).toBe('number2가');
    expect(attachJosa('number2', 'direction')).toBe('number2로');
    // 3 (삼 - ㅁ) -> Consonant
    expect(attachJosa('number3', 'direction')).toBe('number3으로');
    // 6 (육 - ㄱ) -> Consonant
    expect(attachJosa('number6', 'object')).toBe('number6을');
    // 8 (팔 - ㄹ) -> Consonant, ㄹ exception
    expect(attachJosa('number8', 'direction')).toBe('number8로');
  });

  test('decomposeHangul decomposes correctly', () => {
    expect(decomposeHangul('가')).toEqual(['ㄱ', 'ㅏ']);
    expect(decomposeHangul('각')).toEqual(['ㄱ', 'ㅏ', 'ㄱ']);
    expect(decomposeHangul('닭')).toEqual(['ㄷ', 'ㅏ', 'ㄺ']);
  });
});

describe('Passphrase Generator with Josa', () => {
  test('generates passphrase with Josa enabled', () => {
    const passphrase = generatePassphrase({
      language: 'ko',
      useJosa: true,
      numWords: 2,
      wordSeparator: ' ',
      includeNumber: false
    });
    // Should contain two words with particles
    // Since words are random, we check if they end with typical Josa characters
    // Word 0: Subject -> 이/가
    // Word 1: Object -> 을/를
    const parts = passphrase.split(' ');
    expect(parts.length).toBe(2);
    expect(parts[0]).toMatch(/(이|가)$/);
    expect(parts[1]).toMatch(/(을|를)$/);
  });

  test('integrates with QWERTY conversion', () => {
    const passphrase = generatePassphrase({
      language: 'ko',
      useJosa: true,
      qwertyConvert: true,
      numWords: 2,
      wordSeparator: '-',
      includeNumber: false,
      capitalize: false
    });
    // Result should be in English characters
    expect(passphrase).toMatch(/^[a-zA-Z-]+$/);
  });

  test('integrates with QWERTY conversion and capitalization', () => {
      const passphrase = generatePassphrase({
        language: 'ko',
        useJosa: true,
        qwertyConvert: true,
        numWords: 2,
        wordSeparator: '-',
        includeNumber: false,
        capitalize: true
      });
      // Should start with Capital letter for each word
      const parts = passphrase.split('-');
      expect(parts[0][0]).toMatch(/[A-Z]/);
      expect(parts[1][0]).toMatch(/[A-Z]/);
  });
});
