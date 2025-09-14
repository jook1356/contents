# React Hooks 완벽 가이드

> React Hooks의 기본 개념부터 고급 활용법까지 완벽하게 마스터하는 가이드

## 🎯 개요

React Hooks는 React 16.8에서 도입된 혁신적인 기능으로, 함수형 컴포넌트에서도 상태 관리와 생명주기 메서드를 사용할 수 있게 해줍니다. 이 가이드에서는 Hook의 기본 개념부터 고급 활용법까지 모든 것을 다룹니다.

## 📚 기본 Hooks

### 1. useState - 상태 관리

`useState`는 함수형 컴포넌트에서 상태를 관리할 수 있게 해주는 가장 기본적인 Hook입니다.

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </div>
  );
}
```

### 2. useEffect - 사이드 이펙트 처리

`useEffect`는 컴포넌트의 생명주기와 관련된 작업을 처리합니다.

```javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    }
    
    fetchUser();
  }, [userId]); // userId가 변경될 때마다 실행
  
  return user ? <div>{user.name}</div> : <div>로딩 중...</div>;
}
```

### 3. useContext - 전역 상태 관리

`useContext`를 사용하면 컴포넌트 트리 전체에서 데이터를 공유할 수 있습니다.

```javascript
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'} 테마 변경
    </button>
  );
}
```

## 🔧 고급 Hooks

### 1. useReducer - 복잡한 상태 관리

복잡한 상태 로직이 있을 때 `useReducer`를 사용하면 더 예측 가능한 상태 업데이트가 가능합니다.

```javascript
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### 2. useMemo - 성능 최적화

`useMemo`는 비용이 많이 드는 계산을 메모이제이션하여 성능을 최적화합니다.

```javascript
import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="검색..."
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🎨 커스텀 Hooks

자주 사용되는 로직을 커스텀 Hook으로 만들어 재사용할 수 있습니다.

```javascript
// useLocalStorage 커스텀 Hook
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage 저장 오류:', error);
    }
  };
  
  return [storedValue, setValue];
}

// 사용 예시
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <div>
      <p>현재 테마: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        테마 변경
      </button>
    </div>
  );
}
```

## ⚠️ Hook 사용 규칙

Hooks를 사용할 때 반드시 지켜야 할 규칙들이 있습니다:

1. **최상위에서만 호출**: 반복문, 조건문, 중첩 함수 내에서 Hook을 호출하지 마세요.
2. **React 함수에서만 호출**: 일반 JavaScript 함수에서는 Hook을 호출하지 마세요.

```javascript
// ❌ 잘못된 사용
function BadComponent({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // 조건부 Hook 호출
  }
  return <div>Bad Component</div>;
}

// ✅ 올바른 사용
function GoodComponent({ condition }) {
  const [state, setState] = useState(0); // 항상 최상위에서 호출
  
  if (condition) {
    // 조건부 로직은 Hook 호출 후에
  }
  
  return <div>Good Component</div>;
}
```

## 🚀 실전 팁

### 1. 의존성 배열 최적화
`useEffect`의 의존성 배열을 정확히 설정하여 불필요한 리렌더링을 방지하세요.

### 2. 커스텀 Hook으로 로직 분리
복잡한 상태 로직은 커스텀 Hook으로 분리하여 테스트하기 쉽고 재사용 가능하게 만드세요.

### 3. useCallback과 useMemo 적절히 활용
성능 최적화가 필요한 부분에서만 메모이제이션을 사용하세요.

## 📝 마무리

React Hooks는 함수형 컴포넌트의 가능성을 크게 확장시켜준 혁신적인 기능입니다. 기본 Hooks부터 시작해서 점진적으로 고급 기능들을 익혀나가면, 더 깔끔하고 재사용 가능한 React 코드를 작성할 수 있을 것입니다.

지속적인 연습과 실전 적용을 통해 Hooks를 마스터해보세요! 🚀