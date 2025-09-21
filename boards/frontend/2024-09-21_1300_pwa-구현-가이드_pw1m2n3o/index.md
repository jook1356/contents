# Progressive Web App 구현 가이드

> 네이티브 앱과 같은 사용자 경험을 제공하는 PWA 구현하기

## 🎯 개요

PWA는 웹 기술을 사용하여 네이티브 앱과 같은 경험을 제공하는 애플리케이션입니다. 오프라인 지원, 푸시 알림, 홈 화면 설치 등이 가능합니다.

## 📚 핵심 구성 요소

### Web App Manifest

```json
{
  "name": "My PWA App",
  "short_name": "PWA App",
  "description": "Progressive Web App 예제",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker 등록

```javascript
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW 등록 성공:', registration);
      })
      .catch((error) => {
        console.log('SW 등록 실패:', error);
      });
  });
}
```

## 🔧 Service Worker 구현

### 캐시 전략

```javascript
// service-worker.js
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/logo.png'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch 이벤트 (Cache First 전략)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에서 찾으면 반환, 없으면 네트워크 요청
        return response || fetch(event.request);
      })
  );
});
```

### 백그라운드 동기화

```javascript
// 백그라운드 동기화 등록
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // 오프라인 상태에서 저장된 데이터 동기화
  const offlineActions = await getOfflineActions();
  for (const action of offlineActions) {
    try {
      await syncAction(action);
      await removeOfflineAction(action.id);
    } catch (error) {
      console.log('동기화 실패:', error);
    }
  }
}
```

## 🚀 고급 기능

### 푸시 알림

```javascript
// 푸시 알림 구독
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
  });
  
  // 서버에 구독 정보 전송
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Service Worker에서 푸시 이벤트 처리
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('PWA 알림', options)
  );
});
```

### 앱 설치 프롬프트

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // 기본 설치 프롬프트 방지
  e.preventDefault();
  deferredPrompt = e;
  
  // 커스텀 설치 버튼 표시
  showInstallButton();
});

function showInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('사용자가 앱 설치를 승인했습니다');
      }
      deferredPrompt = null;
    });
  }
}
```

## 📝 마무리

PWA는 웹과 네이티브 앱의 장점을 결합한 미래의 웹 애플리케이션 형태입니다. 점진적 향상을 통해 기존 웹 앱을 PWA로 전환할 수 있습니다.
