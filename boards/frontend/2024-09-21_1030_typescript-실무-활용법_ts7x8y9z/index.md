# TypeScript 실무 활용법

> TypeScript를 실무에서 효과적으로 활용하는 핵심 패턴과 팁

## 🎯 개요

TypeScript는 JavaScript에 정적 타입을 추가한 언어로, 대규모 애플리케이션 개발에서 코드의 안정성과 가독성을 크게 향상시킵니다.

## 📚 기본 타입 시스템

### 인터페이스 정의

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // 선택적 속성
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

### 유니온 타입과 타입 가드

```typescript
type Status = 'loading' | 'success' | 'error';

function handleStatus(status: Status) {
  switch (status) {
    case 'loading':
      return '로딩 중...';
    case 'success':
      return '성공!';
    case 'error':
      return '오류 발생';
  }
}

// 타입 가드
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}
```

## 🔧 고급 타입 패턴

### 제네릭 활용

```typescript
class ApiService<T> {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<U = T>(endpoint: string): Promise<ApiResponse<U>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
}

const userService = new ApiService<User>('/api/users');
```

### 유틸리티 타입

```typescript
// Partial - 모든 속성을 선택적으로 만듦
type PartialUser = Partial<User>;

// Pick - 특정 속성만 선택
type UserSummary = Pick<User, 'id' | 'name'>;

// Omit - 특정 속성을 제외
type CreateUser = Omit<User, 'id'>;

// Record - 키-값 쌍의 타입 생성
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

## 🚀 실전 팁

### 1. 타입 단언보다는 타입 가드 사용

```typescript
// ❌ 타입 단언 (위험)
const user = data as User;

// ✅ 타입 가드 (안전)
if (isUser(data)) {
  // 이 블록에서 data는 User 타입
  console.log(data.name);
}
```

### 2. 엄격한 타입 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true
  }
}
```

## 📝 마무리

TypeScript는 초기 학습 비용이 있지만, 장기적으로 코드 품질과 개발 생산성을 크게 향상시킵니다. 점진적으로 도입하여 팀의 개발 역량을 높여보세요.
