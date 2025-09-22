# 📚 김동주의 개발 블로그 - 콘텐츠 저장소

> 검색엔진 최적화된 정적 콘텐츠 관리 시스템

[![SEO Auto Update](https://github.com/jook1356/djb-contents/actions/workflows/seo-update.yml/badge.svg)](https://github.com/jook1356/djb-contents/actions/workflows/seo-update.yml)
[![Content Update](https://github.com/jook1356/djb-contents/actions/workflows/seo-content-change.yml/badge.svg)](https://github.com/jook1356/djb-contents/actions/workflows/seo-content-change.yml)

## 🌐 Live Site

- **메인 블로그**: [https://jook1356.github.io/djb-gith](https://jook1356.github.io/djb-gith)
- **콘텐츠 저장소**: [https://jook1356.github.io/contents](https://jook1356.github.io/contents)

## 📋 개요

이 저장소는 검색엔진 크롤링과 SEO 최적화를 위한 정적 콘텐츠를 관리합니다:

- 🤖 **자동 SEO 파일 생성**: sitemap.xml, robots.txt
- 📱 **반응형 콘텐츠**: 모든 디바이스 호환
- 🔄 **실시간 동기화**: GitHub Actions로 자동 업데이트
- 🎯 **검색엔진 최적화**: 구조화된 데이터, Open Graph 등

## 📁 프로젝트 구조

```
📦 contents/
├── 🤖 .github/workflows/        # GitHub Actions 자동화
│   ├── seo-update.yml           # 정기/수동 SEO 업데이트
│   └── seo-content-change.yml   # 콘텐츠 변경시 즉시 업데이트
├── 📝 boards/                   # 게시글 저장소
│   ├── frontend/                # 프론트엔드 게시글
│   ├── backend/                 # 백엔드 게시글
│   ├── general/                 # 일반 게시글
│   └── tutorial/                # 튜토리얼 게시글
├── 🛠️ scripts/                 # SEO 자동화 스크립트
│   ├── generate-seo-files.js   # SEO 파일 생성기
│   └── watch-content-changes.js # 파일 변경 감시
├── 🌐 sitemap.xml              # 검색엔진 사이트맵 (자동생성)
├── 🤖 robots.txt               # 크롤링 규칙 (자동생성)
├── 🏠 index.html               # 메인 페이지
└── 🔄 redirect.js              # 리다이렉트 로직
```

## 🚀 빠른 시작

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/jook1356/djb-contents.git
cd djb-contents
```

### 2️⃣ SEO 파일 생성

```bash
npm run seo:generate
```

### 3️⃣ 개발 모드 (실시간 감지)

```bash
npm run dev
```

## 📊 자동화 기능

### 🤖 GitHub Actions

#### **정기 업데이트** 📅

- **시간**: 매일 오전 11시 (KST)
- **동작**: 전체 SEO 파일 재생성
- **워크플로우**: `seo-update.yml`

#### **즉시 업데이트** ⚡

- **트리거**: 콘텐츠 파일 변경 (`*.json`, `*.md`, `*.html`)
- **동작**: 빠른 SEO 파일 업데이트
- **워크플로우**: `seo-content-change.yml`

#### **수동 실행** 🖱️

- **위치**: GitHub Actions 탭 → "SEO Files Auto Update" → "Run workflow"
- **옵션**: 강제 업데이트 가능

### 📈 생성되는 파일

- **`sitemap.xml`**: 검색엔진용 사이트 구조도
- **`robots.txt`**: 크롤링 규칙 및 사이트맵 위치

## ✍️ 콘텐츠 추가하기

### 새 게시글 작성

1. **폴더 생성**

```bash
mkdir boards/frontend/2024-09-22_1500_새로운-게시글_abc123
```

2. **메타데이터 작성** (`meta.json`)

```json
{
  "id": "2024-09-22_1500_새로운-게시글_abc123",
  "title": "새로운 게시글",
  "description": "게시글 설명...",
  "published": true,
  "featured": false,
  "tags": ["JavaScript", "React"],
  "difficulty": "Intermediate"
}
```

3. **콘텐츠 작성** (`index.html`, `index.md`)

4. **푸시하면 자동 SEO 업데이트!** 🎉

```bash
git add .
git commit -m "feat: 새로운 게시글 추가"
git push
```

## 🔧 설정

### SEO 설정 변경

`scripts/generate-seo-files.js`의 `CONFIG` 객체에서 수정:

```javascript
const CONFIG = {
  baseUrl: "https://jook1356.github.io/contents",
  author: "김동주",
  siteName: "김동주의 개발 블로그",
};
```

### GitHub Actions 권한 설정

Repository Settings → Actions → General:

- ✅ **Workflow permissions**: "Read and write permissions"
- ✅ **Allow GitHub Actions to create and approve pull requests**: 활성화

## 📊 통계

현재 콘텐츠 현황:

- 📝 **총 게시글**: 12개
- 🌟 **Featured**: 5개
- 📂 **카테고리**: Frontend, Backend, General, Tutorial

## 🤝 기여하기

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 라이센스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

- **블로그**: [https://jook1356.github.io/djb-gith](https://jook1356.github.io/djb-gith)
- **GitHub**: [@jook1356](https://github.com/jook1356)

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요! ⭐**

</div>
