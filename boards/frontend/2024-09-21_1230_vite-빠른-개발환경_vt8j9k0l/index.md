# Vite로 빠른 개발 환경 구축

> 번개처럼 빠른 Vite로 현대적인 개발 환경 만들기

## 🎯 개요

Vite는 ES 모듈을 기반으로 한 빠른 빌드 도구로, 개발 서버 시작 시간과 HMR(Hot Module Replacement) 속도를 획기적으로 개선했습니다.

## 📚 Vite 시작하기

### 프로젝트 생성

```bash
# React 프로젝트
npm create vite@latest my-react-app -- --template react-ts

# Vue 프로젝트
npm create vite@latest my-vue-app -- --template vue-ts

# Vanilla JS
npm create vite@latest my-app -- --template vanilla-ts
```

### 기본 설정

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 🔧 고급 설정

### 환경 변수

```javascript
// .env.development
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=개발환경

// .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=프로덕션
```

```typescript
// 사용법
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

### 플러그인 활용

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    // PWA 플러그인
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
    }
  }
})
```

## 🚀 성능 최적화

### 코드 스플리팅

```typescript
// 동적 임포트를 통한 코드 스플리팅
const LazyComponent = lazy(() => import('./components/LazyComponent'));

// 라우트 레벨 스플리팅
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
```

### 빌드 최적화

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@emotion/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## 🔍 개발 도구

### HMR 커스터마이징

```typescript
// HMR API 사용
if (import.meta.hot) {
  import.meta.hot.accept('./utils', (newModule) => {
    // 모듈 업데이트 처리
  });
  
  import.meta.hot.dispose(() => {
    // 정리 작업
  });
}
```

## 📝 마무리

Vite는 현대적인 프론트엔드 개발의 새로운 표준으로 자리잡고 있습니다. 빠른 개발 서버와 효율적인 빌드 시스템으로 개발 생산성을 크게 향상시킬 수 있습니다.
