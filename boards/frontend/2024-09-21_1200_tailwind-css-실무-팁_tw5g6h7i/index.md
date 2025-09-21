# Tailwind CSS 실무 팁

> Tailwind CSS를 실무에서 효율적으로 활용하는 베스트 프랙티스

## 🎯 개요

Tailwind CSS는 유틸리티 우선 CSS 프레임워크로, 빠른 개발과 일관된 디자인 시스템 구축을 가능하게 합니다.

## 📚 기본 설정

### tailwind.config.js 커스터마이징

```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 컴포넌트 클래스 생성

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
  }
}
```

## 🔧 실무 활용 팁

### 반응형 디자인

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-4">카드 제목</h3>
    <p class="text-gray-600">카드 내용</p>
  </div>
</div>
```

### 다크 모드 지원

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 class="text-2xl font-bold">제목</h1>
  <p class="text-gray-600 dark:text-gray-300">내용</p>
</div>
```

### 성능 최적화

```javascript
// PurgeCSS 설정
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  // 사용하지 않는 CSS 제거
}
```

## 🚀 고급 패턴

### 조건부 스타일링

```jsx
const Button = ({ variant, size, children }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
};
```

## 📝 마무리

Tailwind CSS는 초기 학습 곡선이 있지만, 익숙해지면 매우 빠르고 일관된 UI 개발이 가능합니다. 팀 전체의 생산성 향상에 큰 도움이 됩니다.
