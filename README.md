# Passcend 패스프레이즈 생성기 (Passcend Passphrase Generator)

Node.js 및 브라우저를 위한 안전하고 유연하며 종속성이 없는 비밀번호 및 패스프레이즈 생성기입니다.

## 특징 (Features)

*   **보안 (Secure)**: `crypto.getRandomValues` (브라우저) 또는 `crypto.randomBytes` (Node.js)를 사용하여 암호학적으로 안전한 난수를 생성합니다.
*   **유연성 (Flexible)**: 문자 세트(대문자, 소문자, 숫자, 특수 문자)를 사용자 정의하여 임의의 비밀번호를 생성할 수 있습니다.
*   **패스프레이즈 (Passphrases)**: EFF 대용량 단어 목록 (7776개 단어)을 사용하여 기억하기 쉬운 패스프레이즈를 생성합니다.
*   **강도 측정기 (Strength Meter)**: 내장된 비밀번호 강도 추정 기능 (0-4점).
*   **무의존성 (Zero Dependencies)**: 외부 런타임 종속성이 없습니다.
*   **TypeScript 지원 (TypeScript Support)**: TypeScript로 작성되었으며 전체 타입 정의를 포함합니다.

## 설치 (Installation)

```bash
npm install @passcend/passphrase-generator
```

## 사용법 (Usage)

### 비밀번호 생성 (Generate a Password)

```typescript
import { PasswordGenerator } from '@passcend/passphrase-generator';

// 기본 비밀번호 생성 (16자, 모든 유형 포함)
const password = PasswordGenerator.generatePassword();
console.log(password); // 예: "x8!kL9#mP2$qR5@z"

// 옵션 사용자 정의
const customPassword = PasswordGenerator.generatePassword({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: false,
    ambiguous: false // I, l, 1, 0, O 제외
});
console.log(customPassword);
```

### 패스프레이즈 생성 (Generate a Passphrase)

```typescript
import { PasswordGenerator } from '@passcend/passphrase-generator';

// 기본 패스프레이즈 생성 (4단어, 대문자화, 숫자 포함)
const passphrase = PasswordGenerator.generatePassphrase();
console.log(passphrase); // 예: "Correct-Horse-Battery-Staple5"

// 옵션 사용자 정의
const customPassphrase = PasswordGenerator.generatePassphrase({
    numWords: 6,
    wordSeparator: ' ',
    capitalize: false,
    includeNumber: false
});
console.log(customPassphrase); // 예: "correct horse battery staple blue sky"
```

### 비밀번호 강도 확인 (Check Password Strength)

```typescript
import { PasswordGenerator } from '@passcend/passphrase-generator';

const strength = PasswordGenerator.calculateStrength('weakpassword');
console.log(strength);
// 출력:
// {
//   score: 1,
//   label: 'Weak',
//   color: 'orange'
// }
```

## API 참조 (API Reference)

### `PasswordGenerator.generatePassword(options?)`

임의의 비밀번호 문자열을 생성합니다.

**옵션 (Options):**

*   `length` (number): 비밀번호 길이 (기본값: 16).
*   `uppercase` (boolean): 대문자 포함 여부 (기본값: true).
*   `lowercase` (boolean): 소문자 포함 여부 (기본값: true).
*   `numbers` (boolean): 숫자 포함 여부 (기본값: true).
*   `special` (boolean): 특수 문자 포함 여부 (기본값: true).
*   `ambiguous` (boolean): 모호한 문자 포함 여부 (기본값: false).
*   `minUppercase` (number): 최소 대문자 개수 (기본값: 1).
*   `minLowercase` (number): 최소 소문자 개수 (기본값: 1).
*   `minNumbers` (number): 최소 숫자 개수 (기본값: 1).
*   `minSpecial` (number): 최소 특수 문자 개수 (기본값: 1).

### `PasswordGenerator.generatePassphrase(options?)`

EFF 대용량 단어 목록을 사용하여 임의의 패스프레이즈 문자열을 생성합니다.

**옵션 (Options):**

*   `numWords` (number): 단어 수 (기본값: 4).
*   `wordSeparator` (string): 단어 사이의 구분자 (기본값: '-').
*   `capitalize` (boolean): 각 단어의 첫 글자 대문자화 여부 (기본값: true).
*   `includeNumber` (boolean): 단어 중 하나에 임의의 숫자 추가 여부 (기본값: true).

### `PasswordGenerator.calculateStrength(password)`

비밀번호의 추정 강도를 계산합니다.

**반환값 (Returns):**

*   `score` (number): 0 (매우 약함) ~ 4 (매우 강함).
*   `label` (string): 사람이 읽을 수 있는 강도 라벨.
*   `color` (string): 추천 UI 색상 (red, orange, yellow, lime, green).

## 라이선스 (License)

MIT
