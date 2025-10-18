#!/usr/bin/env node

/**
 * 콘텐츠 변경 감지 및 자동 SEO 파일 재생성
 * 게시글이나 메타데이터가 변경되면 sitemap.xml과 robots.txt를 자동 업데이트
 *
 * 사용법: node watch-content-changes.js
 */

const fs = require("fs");
const path = require("path");
const {
  generateSitemap,
  generateRobots,
  scanDirectory,
} = require("./generate-seo-files.js");

// 설정
const CONFIG = {
  baseUrl: "https://jook1356.github.io/contents",
  outputDir: path.join(__dirname, ".."), // contents 폴더
  boardsDir: path.join(__dirname, "..", "boards"), // contents/boards
  watchPaths: [
    path.join(__dirname, "..", "boards"),
    path.join(__dirname, "..", "boards-config.json"),
  ],
  debounceDelay: 2000, // 2초 디바운스
  author: "김동주",
  siteName: "김동주의 개발 블로그",
};

let updateTimeout;
let isUpdating = false;

/**
 * SEO 파일들을 업데이트
 */
function updateSEOFiles() {
  if (isUpdating) {
    console.log("⏳ 이미 업데이트 중입니다...");
    return;
  }

  isUpdating = true;
  console.log("🔄 콘텐츠 변경 감지됨 - SEO 파일 업데이트 중...");

  try {
    // 디렉토리 스캔
    const items = scanDirectory(CONFIG.boardsDir);

    const posts = items.filter(
      (item) => item.type === "post" && item.meta?.published
    );
    const boards = [
      ...new Set(
        items.filter((item) => item.type === "board").map((board) => board.name)
      ),
    ];

    console.log(`📊 현재 상태:`);
    console.log(`   - 보드: ${boards.length}개`);
    console.log(`   - 발행된 게시글: ${posts.length}개`);
    console.log(
      `   - Featured 게시글: ${posts.filter((p) => p.meta?.featured).length}개`
    );

    // sitemap.xml 업데이트
    const sitemapContent = generateSitemap(items);
    const sitemapPath = path.join(CONFIG.outputDir, "sitemap.xml");
    fs.writeFileSync(sitemapPath, sitemapContent, "utf8");

    // robots.txt 업데이트
    const robotsContent = generateRobots(items);
    const robotsPath = path.join(CONFIG.outputDir, "robots.txt");
    fs.writeFileSync(robotsPath, robotsContent, "utf8");

    const timestamp = new Date().toLocaleTimeString("ko-KR");
    console.log(`✅ SEO 파일 업데이트 완료! (${timestamp})`);
  } catch (error) {
    console.error("❌ SEO 파일 업데이트 실패:", error.message);
  } finally {
    isUpdating = false;
  }
}

/**
 * 디바운스된 업데이트 (연속된 변경사항들을 하나로 묶음)
 */
function debouncedUpdate() {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }

  updateTimeout = setTimeout(() => {
    updateSEOFiles();
  }, CONFIG.debounceDelay);
}

/**
 * 파일 변경 감지 설정
 */
function setupWatchers() {
  console.log("👀 파일 변경 감지 시작...");

  CONFIG.watchPaths.forEach((watchPath) => {
    if (fs.existsSync(watchPath)) {
      const stat = fs.statSync(watchPath);

      if (stat.isDirectory()) {
        // 디렉토리 감지 (재귀적)
        fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
          if (!filename) return;

          // 관심 있는 파일만 감지
          if (
            filename.endsWith(".json") ||
            filename.endsWith(".md") ||
            filename.endsWith(".html")
          ) {
            console.log(`📝 파일 변경 감지: ${filename} (${eventType})`);
            debouncedUpdate();
          }
        });

        console.log(`   📁 감지 중: ${watchPath} (재귀)`);
      } else {
        // 개별 파일 감지
        fs.watch(watchPath, (eventType, filename) => {
          console.log(`📝 파일 변경 감지: ${watchPath} (${eventType})`);
          debouncedUpdate();
        });

        console.log(`   📄 감지 중: ${watchPath}`);
      }
    } else {
      console.warn(`⚠️  경로가 존재하지 않음: ${watchPath}`);
    }
  });
}

/**
 * 초기 SEO 파일 생성
 */
function initialGeneration() {
  console.log("🚀 초기 SEO 파일 생성...");
  updateSEOFiles();
}

/**
 * 정리 함수
 */
function cleanup() {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  console.log("\n👋 감시 종료");
  process.exit(0);
}

/**
 * 메인 함수
 */
function main() {
  console.log("🤖 콘텐츠 변경 감지기 시작");
  console.log("   Ctrl+C로 종료할 수 있습니다\n");

  // 초기 생성
  initialGeneration();

  // 감시 설정
  setupWatchers();

  // 종료 처리
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  console.log("\n✅ 감시 시작됨. 콘텐츠를 수정해보세요!");
}

// 직접 실행시에만 메인 함수 호출
if (require.main === module) {
  main();
}

module.exports = {
  updateSEOFiles,
  setupWatchers,
};
