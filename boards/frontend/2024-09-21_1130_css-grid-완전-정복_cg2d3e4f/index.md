# CSS Grid 완전 정복

> CSS Grid로 복잡한 레이아웃도 쉽게 구현하기

## 🎯 개요

CSS Grid는 2차원 레이아웃 시스템으로, 복잡한 웹 레이아웃을 간단하고 직관적으로 구현할 수 있게 해줍니다.

## 📚 기본 개념

### Grid Container와 Grid Item

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 200px;
  gap: 20px;
}

.grid-item {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
}
```

### Grid 라인과 영역

```css
.grid-container {
  display: grid;
  grid-template-columns: [start] 1fr [middle] 1fr [end];
  grid-template-rows: [header-start] 100px [header-end content-start] 1fr [content-end];
}

.header {
  grid-column: start / end;
  grid-row: header-start / header-end;
}
```

## 🔧 고급 활용법

### 반응형 Grid

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr;
  }
}
```

### Grid Areas

```css
.layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 80px 1fr 60px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

## 🚀 실전 예제

### 카드 레이아웃

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}
```

## 📝 마무리

CSS Grid는 현대적인 웹 레이아웃의 필수 도구입니다. Flexbox와 함께 사용하면 어떤 복잡한 디자인도 구현할 수 있습니다.
