# 웹 접근성 완벽 가이드

> 모든 사용자가 편리하게 이용할 수 있는 웹사이트 만들기

## 🎯 개요

웹 접근성은 장애인, 고령자 등 모든 사용자가 웹을 이용할 수 있도록 보장하는 것입니다. WCAG 2.1 지침을 바탕으로 실무에서 적용할 수 있는 방법을 알아봅니다.

## 📚 WCAG 4원칙

### 1. 인식 가능성 (Perceivable)

```html
<!-- 이미지 대체 텍스트 -->
<img src="chart.png" alt="2023년 매출 증가 추이를 보여주는 막대 그래프">

<!-- 색상에만 의존하지 않는 정보 전달 -->
<span class="status success" aria-label="성공">
  ✓ 성공
</span>

<!-- 동영상 자막 제공 -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions-ko.vtt" srclang="ko" label="한국어">
</video>
```

### 2. 운용 가능성 (Operable)

```html
<!-- 키보드 접근 가능한 네비게이션 -->
<nav role="navigation" aria-label="주 메뉴">
  <ul>
    <li><a href="/" tabindex="0">홈</a></li>
    <li><a href="/about" tabindex="0">소개</a></li>
    <li>
      <a href="/services" tabindex="0" aria-expanded="false" aria-haspopup="true">
        서비스
      </a>
      <ul class="dropdown" aria-hidden="true">
        <li><a href="/web" tabindex="-1">웹 개발</a></li>
        <li><a href="/mobile" tabindex="-1">모바일 앱</a></li>
      </ul>
    </li>
  </ul>
</nav>

<!-- 자동 재생 콘텐츠 제어 -->
<div class="carousel" aria-live="polite" aria-label="이미지 슬라이더">
  <button aria-label="슬라이드쇼 일시정지" onclick="pauseCarousel()">
    ⏸️
  </button>
</div>
```

### 3. 이해 가능성 (Understandable)

```html
<!-- 명확한 폼 라벨과 오류 메시지 -->
<form>
  <div class="form-group">
    <label for="email">이메일 주소 (필수)</label>
    <input 
      type="email" 
      id="email" 
      required 
      aria-describedby="email-error"
      aria-invalid="false"
    >
    <div id="email-error" class="error" aria-live="polite"></div>
  </div>
  
  <div class="form-group">
    <label for="password">비밀번호 (최소 8자)</label>
    <input 
      type="password" 
      id="password" 
      minlength="8"
      aria-describedby="password-help"
    >
    <div id="password-help" class="help-text">
      영문, 숫자, 특수문자를 포함해야 합니다.
    </div>
  </div>
</form>
```

### 4. 견고성 (Robust)

```html
<!-- 시맨틱 HTML 사용 -->
<article>
  <header>
    <h1>기사 제목</h1>
    <time datetime="2024-09-21">2024년 9월 21일</time>
  </header>
  
  <main>
    <p>기사 내용...</p>
  </main>
  
  <footer>
    <p>작성자: 김동주</p>
  </footer>
</article>

<!-- ARIA 역할과 속성 올바른 사용 -->
<div role="tablist" aria-label="설정 탭">
  <button role="tab" aria-selected="true" aria-controls="panel1" id="tab1">
    일반
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel2" id="tab2">
    보안
  </button>
</div>

<div role="tabpanel" id="panel1" aria-labelledby="tab1">
  <h2>일반 설정</h2>
  <!-- 패널 내용 -->
</div>
```

## 🔧 실무 적용 가이드

### 키보드 네비게이션

```javascript
// 포커스 트랩 구현
class FocusTrap {
  constructor(element) {
    this.element = element;
    this.focusableElements = this.getFocusableElements();
    this.firstElement = this.focusableElements[0];
    this.lastElement = this.focusableElements[this.focusableElements.length - 1];
  }
  
  getFocusableElements() {
    const selector = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.element.querySelectorAll(selector));
  }
  
  handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === this.firstElement) {
          e.preventDefault();
          this.lastElement.focus();
        }
      } else {
        if (document.activeElement === this.lastElement) {
          e.preventDefault();
          this.firstElement.focus();
        }
      }
    }
    
    if (e.key === 'Escape') {
      this.close();
    }
  }
}
```

### 스크린 리더 지원

```javascript
// 동적 콘텐츠 업데이트 알림
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// 사용 예시
announceToScreenReader('새 메시지가 도착했습니다', 'assertive');
```

### 색상 대비 확인

```css
/* WCAG AA 기준 색상 대비 4.5:1 이상 */
.text-primary {
  color: #1a365d; /* 대비율 7.1:1 (흰 배경 기준) */
  background-color: #ffffff;
}

.button-primary {
  color: #ffffff;
  background-color: #2b6cb0; /* 대비율 4.6:1 */
}

.error-text {
  color: #c53030; /* 대비율 5.9:1 */
}
```

## 🚀 접근성 테스팅

### 자동화된 테스트

```javascript
// Jest + jest-axe를 사용한 접근성 테스트
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

test('컴포넌트가 접근성 기준을 만족한다', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 수동 테스트 체크리스트

```markdown
## 키보드 테스트
- [ ] Tab 키로 모든 인터랙티브 요소에 접근 가능
- [ ] Enter/Space 키로 버튼과 링크 활성화 가능
- [ ] Escape 키로 모달/드롭다운 닫기 가능
- [ ] 화살표 키로 메뉴/탭 네비게이션 가능

## 스크린 리더 테스트
- [ ] 모든 이미지에 적절한 alt 텍스트 제공
- [ ] 폼 요소에 명확한 라벨 제공
- [ ] 헤딩 구조가 논리적으로 구성됨
- [ ] 링크 텍스트가 목적을 명확히 설명함

## 시각적 테스트
- [ ] 200% 확대 시에도 가로 스크롤 없이 이용 가능
- [ ] 색상만으로 정보를 전달하지 않음
- [ ] 텍스트 대비가 4.5:1 이상 (AA 기준)
```

## 📝 마무리

웹 접근성은 단순히 장애인을 위한 것이 아니라 모든 사용자의 사용성을 개선합니다. 개발 초기부터 접근성을 고려하여 더 나은 웹을 만들어보세요.
