# Jest & React Testing Library 테스팅 가이드

> 견고한 프론트엔드 테스트 코드 작성하기

## 🎯 개요

Jest와 React Testing Library는 React 애플리케이션의 테스팅을 위한 최고의 조합입니다. 사용자 중심의 테스트 작성으로 더 안정적인 코드를 만들 수 있습니다.

## 📚 기본 설정

### 설치 및 설정

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```javascript
// setupTests.js
import '@testing-library/jest-dom';

// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## 🔧 기본 테스트 작성

### 컴포넌트 테스트

```jsx
// Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button 컴포넌트', () => {
  test('버튼이 올바르게 렌더링된다', () => {
    render(<Button>클릭하세요</Button>);
    
    const button = screen.getByRole('button', { name: '클릭하세요' });
    expect(button).toBeInTheDocument();
  });

  test('클릭 이벤트가 올바르게 작동한다', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>클릭하세요</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 폼 테스트

```jsx
// LoginForm.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

test('로그인 폼 제출이 올바르게 작동한다', async () => {
  const mockSubmit = jest.fn();
  const user = userEvent.setup();
  
  render(<LoginForm onSubmit={mockSubmit} />);
  
  // 입력 필드 찾기
  const emailInput = screen.getByLabelText(/이메일/i);
  const passwordInput = screen.getByLabelText(/비밀번호/i);
  const submitButton = screen.getByRole('button', { name: /로그인/i });
  
  // 폼 입력
  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);
  
  // 검증
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

## 🚀 고급 테스팅 패턴

### 커스텀 훅 테스트

```jsx
// useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('useCounter 훅이 올바르게 작동한다', () => {
  const { result } = renderHook(() => useCounter(0));
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### API 모킹

```jsx
// UserList.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserList from './UserList';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: '홍길동' },
      { id: 2, name: '김철수' }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('사용자 목록을 올바르게 표시한다', async () => {
  render(<UserList />);
  
  expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
  });
});
```

### Context 테스트

```jsx
// ThemeProvider.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

const renderWithTheme = (ui, { initialTheme = 'light' } = {}) => {
  return render(
    <ThemeProvider initialTheme={initialTheme}>
      {ui}
    </ThemeProvider>
  );
};

test('테마 토글이 올바르게 작동한다', async () => {
  const user = userEvent.setup();
  
  renderWithTheme(<ThemeToggle />);
  
  const toggleButton = screen.getByRole('button');
  expect(toggleButton).toHaveTextContent('다크 모드');
  
  await user.click(toggleButton);
  
  expect(toggleButton).toHaveTextContent('라이트 모드');
});
```

## 🎯 테스트 베스트 프랙티스

### 1. 사용자 중심 쿼리 사용

```jsx
// ❌ 구현 세부사항에 의존
const button = container.querySelector('.submit-button');

// ✅ 사용자가 보는 방식으로 쿼리
const button = screen.getByRole('button', { name: '제출' });
```

### 2. 적절한 대기 사용

```jsx
// ❌ 고정 지연
await new Promise(resolve => setTimeout(resolve, 1000));

// ✅ 조건부 대기
await waitFor(() => {
  expect(screen.getByText('데이터 로드됨')).toBeInTheDocument();
});
```

## 📝 마무리

좋은 테스트는 코드의 안정성을 보장하고 리팩토링을 안전하게 만들어줍니다. 사용자 관점에서 테스트를 작성하여 실제 사용 시나리오를 검증하세요.
