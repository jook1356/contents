# 🚀 동적 SEO 파일 생성기

게시판과 게시글이 유동적으로 변경되는 블로그 콘텐츠에 맞춰 `robots.txt`와 `sitemap.xml`을 자동으로 생성하는 JavaScript 도구입니다.

## ✨ 주요 기능

- 📁 **자동 콘텐츠 스캔**: `boards/` 디렉토리를 재귀적으로 탐색
- 🎯 **스마트 우선순위**: Featured 게시글, 최신성, 난이도에 따른 우선순위 자동 계산
- 🔄 **실시간 감지**: 콘텐츠 변경시 자동으로 SEO 파일 업데이트
- 📊 **상세 분석**: 보드별, 게시글별 상태 정보 제공

## 🎉 완성된 파일들

### `generate-seo-files.js`

콘텐츠 구조를 분석하여 SEO 파일을 즉시 생성하는 스크립트

### `watch-content-changes.js`

파일 변경을 실시간 감지하여 SEO 파일을 자동 업데이트하는 감시 도구

## 📋 사용법

### 1️⃣ 한 번만 생성하기

```bash
# 프로젝트 루트에서
npm run seo:generate

# 또는 직접 실행
node contents/scripts/generate-seo-files.js
```

### 2️⃣ 실시간 자동 업데이트 (개발환경)

```bash
# 개발 중 계속 실행 (백그라운드 권장)
npm run seo:watch

# 또는 직접 실행
node contents/scripts/watch-content-changes.js
```

### 3️⃣ GitHub Actions 자동화 🤖

콘텐츠 변경시 자동으로 SEO 파일이 업데이트됩니다:

- **즉시 업데이트**: 콘텐츠 파일 변경시 자동 실행
- **정기 업데이트**: 매일 오전 11시 (KST) 자동 실행
- **수동 실행**: GitHub 웹에서 언제든지 수동 실행 가능

#### 워크플로우 파일들

- `.github/workflows/seo-update.yml` - 메인 SEO 업데이트 (정기 + 수동)
- `.github/workflows/seo-content-change.yml` - 콘텐츠 변경시 즉시 업데이트

## 🔧 동작 원리

### 스캔 대상

```
contents/
├── scripts/                    ← SEO 스크립트들
│   ├── generate-seo-files.js  ← 메인 생성기
│   └── watch-content-changes.js ← 실시간 감시기
├── boards/
│   ├── frontend/
│   │   ├── 2024-09-13_1400_react-hooks-완벽-가이드_a1b2c3d4/
│   │   │   ├── meta.json     ← 메타데이터 읽음
│   │   │   ├── index.html    ← HTML 존재 확인
│   │   │   └── index.md
│   │   └── ...
│   ├── backend/
│   └── ...
└── boards-config.json        ← 설정 파일 감시
```

### 우선순위 계산 로직

```javascript
기본 우선순위: 0.6
+ Featured 게시글: +0.2
+ 3개월 이내 최신: +0.1
+ Advanced 난이도: +0.1
+ Beginner 난이도: +0.05
= 최대 1.0
```

## 📊 생성되는 파일

### `sitemap.xml`

- ✅ 메인 페이지 (`priority: 1.0`)
- ✅ 보드별 페이지 (`priority: 0.8`)
- ✅ Featured 게시글 (높은 우선순위)
- ✅ 일반 게시글 (계산된 우선순위)
- ✅ 적절한 `changefreq` 설정

### `robots.txt`

- ✅ 모든 보드 디렉토리 `Allow`
- ✅ 불필요한 파일들 `Disallow`
- ✅ Sitemap 위치 명시
- ✅ 크롤링 딜레이 설정

## 🎯 실행 결과 예시

```bash
🤖 SEO 파일 생성기 시작...
📁 스캔 디렉토리: C:\...\contents\boards
📊 발견된 항목:
   - 보드: 4개 (backend, frontend, general, tutorial)
   - 게시글: 12개 (발행됨)
   - Featured: 5개
✅ sitemap.xml 생성 완료
✅ robots.txt 생성 완료
🎉 SEO 파일 생성 완료!
```

## 🔄 자동 감지 기능

`watch-content-changes.js` 실행시:

- 📝 `.json`, `.md`, `.html` 파일 변경 감지
- ⏱️ 2초 디바운스 (연속 변경 묶어서 처리)
- 🔄 자동 SEO 파일 재생성
- 📊 실시간 상태 업데이트

## ⚠️ 주의사항

1. **메타데이터 필수**: 게시글 폴더에 `meta.json`과 `index.html` 필요
2. **발행 상태**: `meta.json`에서 `"published": true`인 게시글만 포함
3. **경로 구조**: `boards/카테고리/게시글폴더/` 구조 준수 필요

## 🚀 배포 워크플로우

### 자동화된 워크플로우 (권장) ✨

```bash
# 1. 콘텐츠 수정 후 푸시만 하면 끝!
git add contents/boards/frontend/새로운게시글/
git commit -m "feat: 새로운 게시글 추가"
git push

# 2. GitHub Actions가 자동으로:
#    - SEO 파일 생성
#    - 자동 커밋 & 푸시
#    - 결과 리포트 생성
```

### 수동 워크플로우

```bash
# 콘텐츠 수정 후
npm run seo:generate

# Git 커밋
git add contents/sitemap.xml contents/robots.txt
git commit -m "chore: update SEO files"
git push
```

### GitHub Actions 설정 확인

Repository Settings → Actions → General에서 다음 권한 확인:

- ✅ **Workflow permissions**: "Read and write permissions"
- ✅ **Allow GitHub Actions to create and approve pull requests**: 체크

## 🛠️ 커스터마이징

`generate-seo-files.js`의 `CONFIG` 객체에서:

- `baseUrl`: 사이트 기본 URL
- `author`: 작성자명
- `siteName`: 사이트명

필요시 우선순위 계산 로직이나 changefreq 로직도 수정 가능합니다.

---

**🎉 이제 콘텐츠가 변경될 때마다 SEO가 자동으로 최적화됩니다!** 🚀
