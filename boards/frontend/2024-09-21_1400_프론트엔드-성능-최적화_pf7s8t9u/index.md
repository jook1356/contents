# 프론트엔드 성능 최적화 베스트 프랙티스

> 웹 애플리케이션의 성능을 극대화하는 핵심 전략들

## 🎯 개요

프론트엔드 성능 최적화는 사용자 경험과 비즈니스 성과에 직접적인 영향을 미칩니다. Core Web Vitals를 중심으로 한 체계적인 최적화 방법을 알아봅니다.

## 📚 Core Web Vitals

### LCP (Largest Contentful Paint)

```javascript
// 이미지 최적화
<img
  src="hero.webp"
  alt="Hero Image"
  loading="eager"
  fetchpriority="high"
  width="800"
  height="400"
/>

// 중요한 리소스 프리로드
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/api/critical-data" as="fetch" crossorigin>
```

### FID (First Input Delay)

```javascript
// 코드 스플리팅으로 초기 번들 크기 줄이기
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// 중요하지 않은 작업 지연
function deferNonCriticalWork() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // 비중요 작업 수행
      performAnalytics();
    });
  } else {
    setTimeout(() => {
      performAnalytics();
    }, 1);
  }
}
```

### CLS (Cumulative Layout Shift)

```css
/* 이미지 컨테이너에 고정 크기 설정 */
.image-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* 폰트 로딩 중 레이아웃 시프트 방지 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}
```

## 🔧 리소스 최적화

### 이미지 최적화

```html
<!-- 반응형 이미지 -->
<picture>
  <source media="(min-width: 800px)" srcset="hero-large.webp" type="image/webp">
  <source media="(min-width: 400px)" srcset="hero-medium.webp" type="image/webp">
  <img src="hero-small.jpg" alt="Hero Image" loading="lazy">
</picture>

<!-- Next.js Image 컴포넌트 -->
<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={400}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### JavaScript 최적화

```javascript
// 트리 쉐이킹을 위한 ES 모듈 임포트
import { debounce } from 'lodash-es';

// 동적 임포트로 코드 스플리팅
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return new Chart(canvas, config);
};

// 웹 워커로 무거운 작업 분리
const worker = new Worker('/heavy-calculation-worker.js');
worker.postMessage(data);
worker.onmessage = (event) => {
  updateUI(event.data);
};
```

## 🚀 캐싱 전략

### HTTP 캐싱

```javascript
// Service Worker 캐시 전략
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  images: 'cache-first'
};

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
    event.respondWith(cacheFirst(event.request));
  }
});
```

### 메모리 캐싱

```javascript
// React 메모이제이션
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return heavyDataProcessing(data);
  }, [data]);
  
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return <div>{/* 렌더링 */}</div>;
});
```

## 🎯 성능 모니터링

### Web Vitals 측정

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // 분석 도구로 전송
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 성능 예산 설정

```javascript
// webpack-bundle-analyzer를 통한 번들 크기 모니터링
// package.json
{
  "scripts": {
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}

// 성능 예산 설정 (Lighthouse CI)
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

## 📊 실전 최적화 체크리스트

### 1. 초기 로딩 최적화
- [ ] 중요한 리소스 프리로드
- [ ] 코드 스플리팅 적용
- [ ] 트리 쉐이킹으로 불필요한 코드 제거
- [ ] 이미지 최적화 (WebP, 적절한 크기)

### 2. 런타임 성능 최적화
- [ ] React.memo, useMemo, useCallback 적절히 사용
- [ ] 무한 스크롤이나 가상화로 긴 목록 최적화
- [ ] 디바운싱/스로틀링으로 이벤트 핸들러 최적화

### 3. 네트워크 최적화
- [ ] HTTP/2 또는 HTTP/3 사용
- [ ] CDN 활용
- [ ] 적절한 캐시 헤더 설정
- [ ] API 응답 압축 (gzip, brotli)

## 📝 마무리

성능 최적화는 일회성 작업이 아닌 지속적인 과정입니다. 정기적인 성능 측정과 모니터링을 통해 사용자에게 최고의 경험을 제공하세요.
