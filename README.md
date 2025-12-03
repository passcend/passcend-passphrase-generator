# Passcend Passgen

**Node.js 및 브라우저를 위한 안전하고 유연하며 종속성이 없는 비밀번호 및 패스프레이즈 생성기입니다.**

사용자 친화적인 CLI 도구와 강력한 TypeScript 라이브러리를 모두 제공합니다. 한국어 패스프레이즈 생성, QWERTY 키보드 변환, Leet Speak, AES-GCM 암호화 등 다양한 보안 기능을 지원합니다.

---

## 🌟 특징 (Features)

*   **🔒 강력한 보안 (Secure)**:
    *   `crypto.getRandomValues` (브라우저) 및 `crypto.randomBytes` (Node.js)를 사용하여 암호학적으로 안전한 난수를 생성합니다.
    *   편향 없는(Bias-free) 알고리즘을 사용하여 예측 불가능성을 보장합니다.
*   **🛠️ 유연성 (Flexible)**:
    *   사용자 정의 문자 세트(대문자, 소문자, 숫자, 특수 문자)를 조합하여 원하는 규칙의 비밀번호를 생성할 수 있습니다.
*   **🗣️ 패스프레이즈 (Passphrases)**:
    *   **영어**: EFF 대용량 단어 목록 (7,776개)을 사용하여 기억하기 쉽고 강력한 패스프레이즈를 생성합니다.
    *   **한국어**: BIP-39 기반의 한국어 단어 목록을 지원합니다.
*   **🔢 PIN 생성기 (PIN Generator)**:
    *   보안성이 강화된 숫자 PIN을 생성합니다.
    *   `1234` 같은 연속된 숫자나 `1111` 같은 반복된 숫자를 자동으로 방지하는 옵션을 제공합니다.
*   **🔠 변환 기능 (Transformations)**:
    *   **QWERTY 변환**: 한국어 발음을 영문 QWERTY 키보드 입력값으로 변환하여 보안성을 높입니다. (예: `홍길동` -> `ghdrlfehd`)
    *   **Leet Speak**: 텍스트를 해커어(1337)로 변환합니다. (예: `password` -> `p455w0rd`)
    *   **Case**: 대문자, 소문자, Titlecase 변환을 지원합니다.
*   **🛡️ 강도 측정기 (Strength Meter)**:
    *   비밀번호의 정보 엔트로피(Entropy)를 비트 단위로 계산합니다.
    *   키보드 패턴(qwerty, asdf 등) 및 단순 반복을 감지하여 보안 경고를 제공합니다.
*   **🔐 AES-GCM 암호화**:
    *   PBKDF2(SHA-256) 키 유도를 사용하는 표준 AES-GCM 암호화/복호화 기능을 제공합니다.
*   **🚫 무의존성 (Zero Dependencies)**:
    *   외부 런타임 라이브러리에 전혀 의존하지 않아 가볍고 안전합니다.
*   **📘 TypeScript 지원**:
    *   100% TypeScript로 작성되어 완벽한 타입 정의를 제공합니다.

---

## 🚀 설치 (Installation)

npm을 사용하여 프로젝트에 설치할 수 있습니다.

```bash
npm install @passcend/passgen
```

---

## 💻 CLI 사용법 (CLI Usage)

이 패키지는 강력한 CLI 도구를 포함하고 있습니다. 설치 없이 `npx`로 바로 실행하거나 전역으로 설치하여 사용할 수 있습니다.

### 실행 방법

```bash
# 설치 없이 바로 실행 (추천)
npx @passcend/passgen [command] [options]

# 또는 전역 설치
npm install -g @passcend/passgen
passgen [command] [options]
```

---

### 1. 비밀번호 (Password)

무작위 문자열로 구성된 비밀번호를 생성합니다. 별도의 명령어가 없으면 기본적으로 이 모드로 실행됩니다.

**옵션 (Options):**

| 옵션 (Option) | 단축키 (Alias) | 타입 (Type) | 필수 (Required) | 기본값 (Default) | 설명 (Description) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--length` | `-l` | Number | 선택 (Optional) | `16` | 생성할 비밀번호의 길이 |
| `--no-upper` | - | Boolean | 선택 (Optional) | `false` | 대문자를 제외합니다. |
| `--no-lower` | - | Boolean | 선택 (Optional) | `false` | 소문자를 제외합니다. |
| `--no-numbers` | - | Boolean | 선택 (Optional) | `false` | 숫자를 제외합니다. |
| `--no-special` | - | Boolean | 선택 (Optional) | `false` | 특수문자를 제외합니다. |
| `--ambiguous` | `-a` | Boolean | 선택 (Optional) | `false` | 헷갈리는 문자(`l`, `1`, `I`, `0`, `O`)를 포함합니다. (기본적으로는 제외됨) |

**사용 예시 (Example):**

```bash
npx @passcend/passgen password -l 20 --no-special
```

**출력 (Output):**

```text
Password: mK9xP2jL5vN8qR4wZ1yA
Strength: Very Strong (115 bits)
```

---

### 2. 패스프레이즈 (Passphrase)

기억하기 쉬운 단어들을 조합하여 패스프레이즈를 생성합니다.

**옵션 (Options):**

| 옵션 (Option) | 단축키 (Alias) | 타입 (Type) | 필수 (Required) | 기본값 (Default) | 설명 (Description) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--lang` | - | String | 선택 (Optional) | `en` | 언어 코드 (`en`: 영어, `ko`: 한국어) |
| `--words` | `-w` | Number | 선택 (Optional) | `4` | 단어의 개수 |
| `--sep` | `-s` | String | 선택 (Optional) | `-` | 단어 사이의 구분자 |
| `--no-caps` | - | Boolean | 선택 (Optional) | `false` | 단어의 첫 글자를 대문자로 만들지 않습니다. |
| `--no-number` | - | Boolean | 선택 (Optional) | `false` | 패스프레이즈 끝에 숫자를 붙이지 않습니다. |
| `--qwerty` | - | Boolean | 선택 (Optional) | `false` | **(한국어 전용)** 한글 단어를 영문 QWERTY 키보드 입력값으로 변환합니다. |
| `--transform` | - | String | 선택 (Optional) | - | 전체 텍스트 변환 (`uppercase`, `lowercase`, `titlecase`) |
| `--leet` | - | Boolean | 선택 (Optional) | `false` | Leet speak(해커어)를 적용합니다. (예: `E` -> `3`) |

**사용 예시 (Example):**

```bash
# 한국어 단어를 QWERTY 영문으로 변환하여 생성
npx @passcend/passgen passphrase --lang ko --qwerty
```

**출력 (Output):**

```text
Passphrase: rkdskdzhd-dkqjwl-thskan-qkek5
Strength:   Very Strong (140 bits)
```

---

### 3. PIN 번호 (PIN)

금융 및 보안 장치에 사용되는 숫자 비밀번호를 생성합니다.

**옵션 (Options):**

| 옵션 (Option) | 단축키 (Alias) | 타입 (Type) | 필수 (Required) | 기본값 (Default) | 설명 (Description) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--length` | `-l` | Number | 선택 (Optional) | `4` | PIN 길이 |
| `--allow-seq` | - | Boolean | 선택 (Optional) | `false` | 연속된 숫자(예: 1234)를 허용합니다. (기본: 차단) |
| `--allow-repeat`| - | Boolean | 선택 (Optional) | `false` | 반복된 숫자(예: 1111)를 허용합니다. (기본: 차단) |

**사용 예시 (Example):**

```bash
npx @passcend/passgen pin -l 6
```

**출력 (Output):**

```text
PIN:      829104
Strength: Weak (20 bits)
```

---

### 4. 암호화 / 복호화 (Encryption / Decryption)

AES-GCM 알고리즘과 PBKDF2(SHA-256) 키 유도를 사용하여 텍스트를 안전하게 보호합니다.

**옵션 (Options):**

| 옵션 (Option) | 단축키 (Alias) | 타입 (Type) | 필수 (Required) | 기본값 (Default) | 설명 (Description) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--secret` | - | String | **필수 (Required)**| - | 암호화/복호화에 사용할 비밀 키 |
| `--iterations` | - | Number | 선택 (Optional) | `600000` | PBKDF2 반복 횟수 (보안 강도 조절) |
| `--salt-len` | - | Number | 선택 (Optional) | `16` | Salt 길이 (bytes) |
| `--iv-len` | - | Number | 선택 (Optional) | `12` | IV 길이 (bytes) |

**사용 예시 (Example):**

```bash
# 암호화
npx @passcend/passgen encrypt "My Secret Data" --secret "password123"

# 복호화
npx @passcend/passgen decrypt "encrypted_string_here..." --secret "password123"
```

**출력 (Output):**

```text
# 암호화 결과
Saltbase64...IVbase64...CiphertextBase64...

# 복호화 결과
My Secret Data
```

---

### 5. 강도 측정 (Strength)

비밀번호의 엔트로피와 패턴을 분석하여 강도를 측정합니다.

**사용 예시 (Example):**

```bash
npx @passcend/passgen strength "password123"
```

**출력 (Output):**

```text
Password: password123
Strength: Very Weak (Score: 1/4)
Entropy:  28 bits
```

---

## 📚 라이브러리 사용법 (Library Usage)

Node.js 또는 브라우저 애플리케이션에서 직접 가져와 사용할 수 있습니다.

### 패스프레이즈 생성

```typescript
import { PasswordGenerator } from '@passcend/passgen';

// 기본 생성
const phrase = PasswordGenerator.generatePassphrase();
// 결과: "Correct-Horse-Battery-Staple5"

// 고급 옵션 (한국어 + QWERTY 변환)
const customPhrase = PasswordGenerator.generatePassphrase({
  language: 'ko',
  qwertyConvert: true,
  numWords: 5,
  leet: true
});
// 결과: "rkdskdzhd-dkqjwl..." (예시)
```

### 비밀번호 생성

```typescript
import { PasswordGenerator } from '@passcend/passgen';

const password = PasswordGenerator.generatePassword({
  length: 24,
  uppercase: true,
  numbers: true,
  special: true
});
```

### PIN 생성

```typescript
import { PasswordGenerator } from '@passcend/passgen';

// 안전한 PIN (연속/반복 숫자 자동 거부)
const safePin = PasswordGenerator.generatePin({ length: 6 });
```

### 비밀번호 강도 측정

```typescript
import { PasswordGenerator } from '@passcend/passgen';

const result = PasswordGenerator.calculateStrength("password123");
console.log(`점수: ${result.score}/4, 엔트로피: ${result.entropy} bits`);
// 경고 메시지 확인
console.log(result.warnings);
```

### 데이터 암호화 (AES-GCM)

```typescript
import { encrypt, decrypt } from '@passcend/passgen';

async function secureData() {
  const secretKey = 'my-super-secret-key';
  const data = 'Sensitive Information';

  // 암호화
  const encrypted = await encrypt(data, secretKey);
  console.log('Encrypted:', encrypted);

  // 복호화
  const original = await decrypt(encrypted, secretKey);
  console.log('Decrypted:', original);
}
```

---

## 📄 라이선스 (License)

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자유롭게 사용, 수정 및 배포할 수 있습니다.
