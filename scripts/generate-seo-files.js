#!/usr/bin/env node

/**
 * 동적 SEO 파일 생성기
 * robots.txt와 sitemap.xml을 게시글 구조에 맞춰 자동 생성
 *
 * 사용법: node generate-seo-files.js
 */

const fs = require("fs");
const path = require("path");

// 설정
const CONFIG = {
  baseUrl: "https://jook1356.github.io/contents",
  outputDir: path.join(__dirname, ".."), // contents 폴더
  boardsDir: path.join(__dirname, "..", "boards"), // contents/boards
  author: "김동주",
  siteName: "김동주의 개발 블로그",
};

/**
 * 디렉토리 내의 모든 폴더를 재귀적으로 스캔
 */
function scanDirectory(dirPath, relativePath = "") {
  const items = [];

  if (!fs.existsSync(dirPath)) {
    return items;
  }

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !file.startsWith("_") &&
        !file.startsWith(".")
      ) {
        const currentRelativePath = path.join(relativePath, file);

        // 게시글 폴더인지 확인 (meta.json과 index.html이 있는지)
        const metaPath = path.join(fullPath, "meta.json");
        const indexPath = path.join(fullPath, "index.html");

        if (fs.existsSync(metaPath) && fs.existsSync(indexPath)) {
          // 게시글 폴더
          try {
            const metaContent = fs.readFileSync(metaPath, "utf8");
            const meta = JSON.parse(metaContent);

            items.push({
              type: "post",
              path: currentRelativePath,
              meta: meta,
              fullPath: fullPath,
            });
          } catch (error) {
            console.warn(
              `Warning: Failed to parse meta.json in ${fullPath}:`,
              error.message
            );
          }
        } else {
          // 보드 폴더
          items.push({
            type: "board",
            path: currentRelativePath,
            name: file,
            fullPath: fullPath,
          });

          // 하위 디렉토리도 스캔
          const subItems = scanDirectory(fullPath, currentRelativePath);
          items.push(...subItems);
        }
      }
    }
  } catch (error) {
    console.warn(
      `Warning: Failed to scan directory ${dirPath}:`,
      error.message
    );
  }

  return items;
}

/**
 * 게시글의 우선순위 계산
 */
function calculatePriority(meta) {
  let priority = 0.6; // 기본 우선순위

  // Featured 게시글
  if (meta.featured) {
    priority += 0.2;
  }

  // 최근 게시글 (3개월 이내)
  const publishedDate = new Date(meta.createdAt);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  if (publishedDate > threeMonthsAgo) {
    priority += 0.1;
  }

  // 난이도에 따른 조정
  switch (meta.difficulty) {
    case "Beginner":
      priority += 0.05;
      break;
    case "Advanced":
      priority += 0.1;
      break;
  }

  return Math.min(priority, 1.0).toFixed(1);
}

/**
 * 변경 빈도 계산
 */
function calculateChangeFreq(meta) {
  const publishedDate = new Date(meta.createdAt);
  const now = new Date();
  const daysSincePublished = (now - publishedDate) / (1000 * 60 * 60 * 24);

  if (daysSincePublished < 7) {
    return "daily";
  } else if (daysSincePublished < 30) {
    return "weekly";
  } else {
    return "monthly";
  }
}

/**
 * sitemap.xml 생성
 */
function generateSitemap(items) {
  const posts = items.filter(
    (item) => item.type === "post" && item.meta.published
  );
  const boards = items.filter((item) => item.type === "board");

  // 보드별로 그룹화
  const boardGroups = {};
  posts.forEach((post) => {
    const boardName = post.path.replace(/\\/g, "/").split("/")[0];
    if (!boardGroups[boardName]) {
      boardGroups[boardName] = [];
    }
    boardGroups[boardName].push(post);
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 메인 페이지 -->
  <url>
    <loc>${CONFIG.baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 보드별 페이지 -->
  <url>
    <loc>${CONFIG.baseUrl}/boards/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  // 각 보드 페이지 추가
  const uniqueBoards = [...new Set(boards.map((board) => board.name))];
  uniqueBoards.forEach((boardName) => {
    const boardPosts = boardGroups[boardName] || [];
    const lastModified =
      boardPosts.length > 0
        ? Math.max(
            ...boardPosts.map((post) => new Date(post.meta.updatedAt).getTime())
          )
        : Date.now();

    xml += `
  <url>
    <loc>${CONFIG.baseUrl}/boards/${boardName}/</loc>
    <lastmod>${new Date(lastModified).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Featured 게시글들 먼저 (높은 우선순위)
  const featuredPosts = posts.filter((post) => post.meta.featured);
  featuredPosts.forEach((post) => {
    const lastmod = new Date(post.meta.updatedAt).toISOString().split("T")[0];
    const priority = calculatePriority(post.meta);
    const changefreq = calculateChangeFreq(post.meta);

    xml += `
  <!-- Featured: ${post.meta.title} -->
  <url>
    <loc>${CONFIG.baseUrl}/boards/${post.path.replace(/\\/g, "/")}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  // 일반 게시글들
  const regularPosts = posts.filter((post) => !post.meta.featured);
  regularPosts.forEach((post) => {
    const lastmod = new Date(post.meta.updatedAt).toISOString().split("T")[0];
    const priority = calculatePriority(post.meta);
    const changefreq = calculateChangeFreq(post.meta);

    xml += `
  <url>
    <loc>${CONFIG.baseUrl}/boards/${post.path.replace(/\\/g, "/")}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

/**
 * robots.txt 생성
 */
function generateRobots(items) {
  const boards = [
    ...new Set(
      items.filter((item) => item.type === "board").map((board) => board.name)
    ),
  ];

  let robots = `# ${CONFIG.siteName} - Contents Repository
# ${CONFIG.baseUrl}/

User-agent: *
Allow: /

# 검색엔진에 더 나은 크롤링 환경 제공
# Allow specific important directories
Allow: /boards/`;

  // 각 보드별 Allow 추가
  boards.forEach((boardName) => {
    robots += `
Allow: /boards/${boardName}/`;
  });

  robots += `

# 성능을 위해 리다이렉트 스크립트는 크롤링하지 않음
Disallow: /redirect.js

# 템플릿 파일들은 크롤링 제외
Disallow: /templates/

# 설정 파일들 제외
Disallow: /_config.json
Disallow: /*/_config.json

# Sitemap 위치 명시
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# 크롤링 딜레이 (서버 부하 방지)
Crawl-delay: 1`;

  return robots;
}

/**
 * 메인 실행 함수
 */
function main() {
  console.log("🤖 SEO 파일 생성기 시작...");
  console.log(`📁 스캔 디렉토리: ${CONFIG.boardsDir}`);

  // 디렉토리 스캔
  const items = scanDirectory(CONFIG.boardsDir);

  const posts = items.filter(
    (item) => item.type === "post" && item.meta.published
  );
  const boards = [
    ...new Set(
      items.filter((item) => item.type === "board").map((board) => board.name)
    ),
  ];

  console.log(`📊 발견된 항목:`);
  console.log(`   - 보드: ${boards.length}개 (${boards.join(", ")})`);
  console.log(`   - 게시글: ${posts.length}개 (발행됨)`);
  console.log(
    `   - Featured: ${posts.filter((p) => p.meta.featured).length}개`
  );

  // sitemap.xml 생성
  const sitemapContent = generateSitemap(items);
  const sitemapPath = path.join(CONFIG.outputDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemapContent, "utf8");
  console.log(`✅ sitemap.xml 생성 완료: ${sitemapPath}`);

  // robots.txt 생성
  const robotsContent = generateRobots(items);
  const robotsPath = path.join(CONFIG.outputDir, "robots.txt");
  fs.writeFileSync(robotsPath, robotsContent, "utf8");
  console.log(`✅ robots.txt 생성 완료: ${robotsPath}`);

  console.log("🎉 SEO 파일 생성 완료!");
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = {
  scanDirectory,
  generateSitemap,
  generateRobots,
  calculatePriority,
  calculateChangeFreq,
};
