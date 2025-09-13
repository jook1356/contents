# React Hooks 완벽 가이드

> React 16.8에서 도입된 Hooks를 활용하여 함수형 컴포넌트에서 상태와 생명주기를 다루는 완전한 가이드입니다.

## 개요

React Hooks는 함수형 컴포넌트에서도 클래스 컴포넌트의 기능을 사용할 수 있게 해주는 강력한 기능입니다. 이 가이드에서는 가장 널리 사용되는 Hook들과 실제 사용 사례를 다룹니다.

## 기본 Hooks

### useState

상태 관리를 위한 가장 기본적인 Hook입니다.

```javascript
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

### useEffect

컴포넌트의 생명주기와 부수 효과를 처리합니다.

```javascript
import React, { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>타이머: {seconds}초</div>;
}
```

## 고급 사용법

### 커스텀 Hook 만들기

재사용 가능한 로직을 커스텀 Hook으로 분리할 수 있습니다.

```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
```

## 주의사항

1. **Hook은 항상 React 함수의 최상위에서 호출해야 합니다.**
2. **조건문, 반복문, 중첩 함수 내에서 Hook을 호출하지 마세요.**
3. **React 함수 내에서만 Hook을 호출하세요.**

## 결론

React Hooks는 함수형 컴포넌트의 가능성을 크게 확장시켜 주는 도구입니다. 올바른 사용법을 익혀서 더 깔끔하고 재사용 가능한 컴포넌트를 만들어 보세요.

## 참고 자료

- [React 공식 문서 - Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
