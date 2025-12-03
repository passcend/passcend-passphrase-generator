# Passcend Passgen

Node.js 및 브라우저를 위한 안전하고 유연하며 종속성이 없는 비밀번호 및 패스프레이즈 생성기입니다. 한국어 패스프레이즈 생성과 QWERTY 변환, Leet Speak 등 다양한 기능을 지원합니다.

## 특징 (Features)

*   **보안 (Secure)**: `crypto.getRandomValues` (브라우저) 또는 `crypto.randomBytes` (Node.js)를 사용하여 암호학적으로 안전한 난수를 생성합니다.
*   **유연성 (Flexible)**: 문자 세트(대문자, 소문자, 숫자, 특수 문자)를 사용자 정의하여 임의의 비밀번호를 생성할 수 있습니다.
*   **패스프레이즈 (Passphrases)**:
    *   **영어**: EFF 대용량 단어 목록 (7776개 단어)을 사용합니다.
    *   **한국어**: BIP-39 한국어 단어 목록을 사용하여 기억하기 쉬운 패스프레이즈를 생성합니다.
*   **PIN 생성기 (PIN Generator)**: 보안성이 강화된 숫자 PIN 생성 (연속된 숫자 및 반복되는 숫자 방지 기능).
*   **변환 기능 (Transformations)**:
    *   대소문자 변환 (Lowercase, Uppercase, Titlecase)
    *   Leet Speak (1337) 지원
    *   한글 -> 영문 QWERTY 키보드 입력 변환
*   **강도 측정기 (Strength Meter)**: 내장된 비밀번호 강도 추정 기능 (0-4점).
    *   **엔트로피 계산 (Entropy Calculation)**: 비밀번호의 정보 엔트로피를 비트(bit) 단위로 계산하여 정밀한 강도를 보여줍니다.
    *   **키보드 패턴 감지**: 'qwerty', 'asdf' 등 키보드 상에서 인접한 키의 패턴을 감지하여 경고를 제공합니다.
*   **AES-GCM 암호화**: PBKDF2 키 유도(기본 600,000회 반복)를 사용하는 안전한 텍스트 암호화 및 복호화 기능을 제공합니다.
*   **무의존성 (Zero Dependencies)**: 외부 런타임 종속성이 없습니다.
*   **TypeScript 지원 (TypeScript Support)**: TypeScript로 작성되었으며 전체 타입 정의를 포함합니다.
*   **CLI 도구**: 커맨드 라인에서 바로 비밀번호 생성 및 암호화 작업을 수행할 수 있습니다.

## 설치 (Installation)

```bash
npm install @passcend/passgen
```

## CLI 사용법 (CLI Usage)

이 패키지는 CLI 도구를 포함하고 있습니다. 전역으로 설치하거나 `npx`를 사용하여 실행할 수 있습니다.

```bash
# npx로 실행 (설치 없이)
npx @passcend/passgen [command] [options]

# 또는 전역 설치 후 실행
npm install -g @passcend/passgen
passgen [command] [options]
```

### 명령어 (Commands)

*   `password`: 임의의 비밀번호 생성 (기본값)
*   `passphrase`: 기억하기 쉬운 패스프레이즈 생성
*   `pin`: 숫자 PIN 생성
*   `strength <password>`: 비밀번호 강도 확인
*   `encrypt <text>`: 텍스트 암호화
*   `decrypt <text>`: 텍스트 복호화
*   `help`: 도움말 표시

### 옵션 (Options)

#### 암호화/복호화 옵션 (Encryption/Decryption Options)

| 옵션 | 설명 | 기본값 |
| --- | --- | --- |
| `--secret <string>` | 암호화/복호화에 사용할 비밀 키 (필수) | - |
| `--iterations <n>` | PBKDF2 반복 횟수 | 600,000 |
| `--salt-len <n>` | Salt 길이 (bytes) | 16 |
| `--iv-len <n>` | IV 길이 (bytes) | 12 |

#### 패스프레이즈 옵션 (Passphrase Options)

| 옵션 | 설명 | 기본값 |
| --- | --- | --- |
| `--words`, `-w <n>` | 단어 수 | 4 |
| `--sep`, `-s <char>` | 단어 구분자 | `-` |
| `--no-caps` | 단어의 첫 글자를 대문자로 변경하지 않음 | false |
| `--no-number` | 임의의 숫자 하나를 포함하지 않음 | false |
| `--lang <code>` | 언어 선택 (`en`: 영어, `ko`: 한국어) | `en` |
| `--qwerty` | 한국어 단어를 QWERTY 키보드 입력 영문으로 변환 | false |
| `--transform <type>` | 대소문자 변환 (`lowercase`, `uppercase`, `titlecase`) | - |
| `--leet` | Leet Speak 적용 (예: e -> 3, a -> 4) | false |

#### 비밀번호 옵션 (Password Options)

| 옵션 | 설명 | 기본값 |
| --- | --- | --- |
| `--length`, `-l <n>` | 비밀번호 길이 | 16 |
| `--no-upper` | 대문자 제외 | false |
| `--no-lower` | 소문자 제외 | false |
| `--no-numbers` | 숫자 제외 | false |
| `--no-special` | 특수 문자 제외 | false |
| `--ambiguous`, `-a` | 모호한 문자 (I, l, 1, 0, O) 포함 | false |

#### PIN 옵션 (PIN Options)

| 옵션 | 설명 | 기본값 |
| --- | --- | --- |
| `--length`, `-l <n>` | PIN 길이 | 4 |
| `--allow-seq` | 연속된 숫자 허용 (예: 1234) | false |
| `--allow-repeat` | 반복되는 숫자 허용 (예: 1111) | false |

### CLI 예제 (Examples)

```bash
# 기본 비밀번호 생성 (강도 및 엔트로피 정보 표시)
passgen password
# 출력 예:
# Password: TqR7+pxnr56;
# Strength: Strong (78 bits)

# 20자 길이의 비밀번호 생성, 특수문자 제외
passgen password -l 20 --no-special

# 한국어 패스프레이즈 생성
passgen passphrase --lang ko
# 출력 예: 강낭콩-아버지-소나무-바다

# 한국어 패스프레이즈를 QWERTY 영문으로 변환
passgen passphrase --lang ko --qwerty
# 출력 예: rkdskdzhd-dkqjwl-thskan-qkek

# Leet Speak 적용 및 대문자 변환
passgen passphrase --leet --transform uppercase
# 출력 예: P455W0RD-C0RR3C7-H0R53-B4773RY

# PIN 생성 (기본 4자리, 보안 규칙 적용)
passgen pin
# 출력 예: 5028

# 6자리 PIN 생성
passgen pin -l 6

# 텍스트 암호화 (비밀키 사용)
passgen encrypt "Hello World" --secret "my-secret-key"

# 텍스트 복호화 (동일한 비밀키 사용)
passgen decrypt "Base64String..." --secret "my-secret-key"

# 반복 횟수를 지정하여 암호화/복호화
passgen encrypt "Secure Data" --secret "key" --iterations 1000000
passgen decrypt "..." --secret "key" --iterations 1000000
```

## 라이브러리 사용법 (Library Usage)

### 패스프레이즈 생성 (Generate a Passphrase)

```typescript
import { PasswordGenerator } from '@passcend/passgen';

// 기본 패스프레이즈 생성 (4단어, 대문자화, 숫자 포함)
const passphrase = PasswordGenerator.generatePassphrase();
console.log(passphrase); // 예: "Correct-Horse-Battery-Staple5"

// 고급 옵션 사용
const customPassphrase = PasswordGenerator.generatePassphrase({
    numWords: 5,
    wordSeparator: '_',
    language: 'ko', // 한국어 사용
    qwertyConvert: true, // 한글 -> QWERTY 영문 변환
    transform: 'lowercase', // 소문자로 변환
    leet: true // Leet speak 적용
});
console.log(customPassphrase);
```

### 비밀번호 생성 (Generate a Password)

```typescript
import { PasswordGenerator } from '@passcend/passgen';

const password = PasswordGenerator.generatePassword({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: false,
});
console.log(password);
```

### PIN 생성 (Generate a PIN)

```typescript
import { PasswordGenerator } from '@passcend/passgen';

// 기본 PIN 생성 (4자리, 연속/반복 불가)
const pin = PasswordGenerator.generatePin();
console.log(pin); // 예: "8402"

// 옵션 사용
const customPin = PasswordGenerator.generatePin({
    length: 6,
    allowSequential: true, // 123456 허용
    allowRepeated: true    // 111111 허용
});
console.log(customPin);
```

### 비밀번호 강도 확인 (Check Password Strength)

```typescript
import { PasswordGenerator } from '@passcend/passgen';

const strength = PasswordGenerator.calculateStrength('qwerty12345');
console.log(strength);
/*
{
  score: 0,
  label: 'Very Weak',
  color: 'red',
  entropy: 26,
  warnings: [
    'Numbers only',
    'Common pattern detected',
    "Keyboard pattern detected (e.g. adjacent keys like 'qwerty' or 'asdf')"
  ]
}
*/
```

### AES-GCM 암호화 (AES-GCM Encryption)

문자열을 AES-GCM 알고리즘으로 암호화하고 복호화할 수 있습니다. 키 유도를 위해 **PBKDF2(SHA-256, 600,000회 반복)**를 기본값으로 사용하며, 암호화된 데이터는 `Salt(16) + IV(12) + Ciphertext` 형식의 Base64 문자열로 반환됩니다. 다양한 옵션을 통해 보안 매개변수를 조정할 수 있습니다.

```typescript
import { encrypt, decrypt } from '@passcend/passgen';

async function runEncryption() {
  const secret = 'my-secret-password';
  const text = 'Hello, World!';

  // 기본 암호화 (600,000 iterations)
  const encrypted = await encrypt(text, secret);
  console.log('Encrypted:', encrypted);

  // 사용자 정의 옵션 사용
  const customEncrypted = await encrypt(text, secret, {
      iterations: 1000000, // 더 높은 보안을 위해 반복 횟수 증가
      saltLength: 32,      // Salt 길이 변경
      ivLength: 16         // IV 길이 변경
  });

  // 복호화 (Decrypt)
  const decrypted = await decrypt(encrypted, secret);
  console.log('Decrypted:', decrypted);

  // 사용자 정의 옵션으로 복호화 (암호화 시 사용한 옵션과 일치해야 함)
  const customDecrypted = await decrypt(customEncrypted, secret, {
      iterations: 1000000,
      saltLength: 32,
      ivLength: 16
  });
}

runEncryption();
```

## API 참조 (API Reference)

### `PasswordGenerator.generatePassphrase(options?)`

**옵션 (Options):**

*   `numWords` (number): 단어 수 (기본값: 4).
*   `wordSeparator` (string): 단어 사이의 구분자 (기본값: '-').
*   `capitalize` (boolean): 각 단어의 첫 글자 대문자화 여부 (기본값: true).
*   `includeNumber` (boolean): 단어 중 하나에 임의의 숫자 추가 여부 (기본값: true).
*   `language` ('en' | 'ko'): 사용할 언어 (기본값: 'en').
*   `qwertyConvert` (boolean): 한국어 단어를 QWERTY 키보드에 해당하는 영문으로 변환 (기본값: false).
*   `transform` ('lowercase' | 'uppercase' | 'titlecase'): 결과 문자열의 대소문자 변환.
*   `leet` (boolean): Leet speak 치환 적용.

### `PasswordGenerator.generatePassword(options?)`

(기존 README 내용과 동일)

### `PasswordGenerator.generatePin(options?)`

**옵션 (Options):**

*   `length` (number): PIN 길이 (기본값: 4).
*   `allowSequential` (boolean): 연속된 숫자 (예: 1234, 4321) 허용 여부 (기본값: false).
*   `allowRepeated` (boolean): 반복되는 숫자 (예: 1111) 허용 여부 (기본값: false).

## 라이선스 (License)

MIT
