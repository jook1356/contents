# 🚀 Contents 저장소 독립 설정 가이드

이 가이드는 `contents` 폴더를 별도의 GitHub 저장소로 분리하여 독립적으로 관리하는 방법을 설명합니다.

## 📋 준비사항

- [x] GitHub 계정 및 새 저장소 생성 권한
- [x] Git 설치 및 기본 설정 완료
- [x] Node.js 18+ 설치

## 🔧 단계별 설정

### 1️⃣ GitHub에서 새 저장소 생성

1. **GitHub.com** 접속
2. **"New repository"** 클릭
3. **Repository name**: `djb-contents` (또는 원하는 이름)
4. **Public** 설정 (GitHub Pages용)
5. **"Create repository"** 클릭

### 2️⃣ Contents 폴더를 Git 저장소로 초기화

```bash
# contents 폴더로 이동
cd contents

# Git 초기화
git init

# 기본 브랜치를 main으로 설정
git branch -M main

# 모든 파일 스테이징
git add .

# 첫 커밋
git commit -m "🎉 Initial commit: Contents repository setup

- 📝 Blog content structure
- 🤖 Automated SEO file generation
- 🔄 GitHub Actions workflows
- 📊 Dynamic sitemap.xml & robots.txt"

# 원격 저장소 연결 (YOUR_USERNAME을 본인 GitHub 계정으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/djb-contents.git

# 첫 푸시
git push -u origin main
```

### 3️⃣ GitHub Pages 설정

1. **Settings** → **Pages** 접속
2. **Source**: "Deploy from a branch" 선택
3. **Branch**: `main` / `/ (root)` 선택
4. **Save** 클릭

> 📍 **접속 URL**: `https://YOUR_USERNAME.github.io/djb-contents`

### 4️⃣ GitHub Actions 권한 설정

1. **Settings** → **Actions** → **General**
2. **Workflow permissions**:
   - ✅ "Read and write permissions" 선택
3. **Allow GitHub Actions to create and approve pull requests**:
   - ✅ 체크박스 활성화
4. **Save** 클릭

### 5️⃣ 첫 번째 SEO 파일 자동 생성 테스트

```bash
# 테스트용 변경사항
echo "# Test Update $(date)" >> README.md

# 커밋 & 푸시
git add .
git commit -m "test: GitHub Actions 자동화 테스트"
git push
```

**Actions 탭에서 워크플로우 실행 확인** ✅

## 🔄 메인 저장소와의 관계 정리

### 메인 저장소 (djb-gith)

- 🎨 **Next.js 블로그 애플리케이션**
- 📱 **사용자 인터페이스**
- 🔧 **빌드 및 배포 설정**

### Contents 저장소 (djb-contents)

- 📝 **게시글 콘텐츠**
- 🤖 **SEO 자동화**
- 🔍 **검색엔진 최적화**

## 📊 워크플로우 동작 확인

### ✅ 정상 동작 확인 사항

1. **콘텐츠 변경시 즉시 업데이트**:

   - 게시글 수정 → 자동 커밋 → SEO 파일 업데이트

2. **정기 업데이트** (매일 11시):

   - Actions 탭에서 "SEO Files Auto Update" 스케줄 실행

3. **수동 실행**:
   - Actions → "SEO Files Auto Update" → "Run workflow"

## 🚨 문제 해결

### 권한 오류 발생시

```bash
# Personal Access Token으로 인증
git remote set-url origin https://TOKEN@github.com/YOUR_USERNAME/djb-contents.git
```

### Actions 실패시

1. **로그 확인**: Actions 탭 → 실패한 워크플로우 클릭
2. **권한 확인**: Settings → Actions → General
3. **Node.js 버전**: 워크플로우에서 Node 18 사용 확인

### SEO 파일 생성 안될 때

```bash
# 로컬에서 직접 실행
npm run seo:generate

# 결과 확인
ls -la sitemap.xml robots.txt
```

## 🎉 완료 확인

다음 항목들이 모두 정상 동작하면 설정 완료:

- [ ] GitHub Pages로 사이트 접속 가능
- [ ] Actions 탭에서 워크플로우 정상 실행
- [ ] 콘텐츠 변경시 자동 SEO 파일 업데이트
- [ ] sitemap.xml, robots.txt 올바른 내용 생성
- [ ] 검색엔진에서 사이트 크롤링 가능

---

**🎊 축하합니다! Contents 저장소가 성공적으로 독립되었습니다.**

이제 콘텐츠만 수정하면 SEO가 자동으로 최적화됩니다! 🚀
