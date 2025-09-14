/**
 * 공통 리다이렉트 스크립트
 * SEO 봇은 그대로 두고, 실제 사용자만 메인 블로그로 리다이렉트
 */
(function() {
    'use strict';
    
    // 봇 감지 함수
    function isBot() {
        if (typeof navigator === 'undefined' || typeof window === 'undefined') {
            return true; // 서버 사이드 렌더링 환경
        }
        
        const userAgent = navigator.userAgent.toLowerCase();
        
        // 주요 검색엔진 및 소셜 크롤러 패턴
        const botPatterns = [
            /googlebot/i,
            /bingbot/i,
            /slurp/i,           // Yahoo
            /duckduckbot/i,     // DuckDuckGo
            /baiduspider/i,     // Baidu
            /yandexbot/i,       // Yandex
            /facebookexternalhit/i,
            /twitterbot/i,
            /linkedinbot/i,
            /whatsapp/i,
            /telegrambot/i,
            /applebot/i,
            /bot/i,
            /crawler/i,
            /spider/i,
            /crawling/i
        ];
        
        return botPatterns.some(pattern => pattern.test(userAgent));
    }
    
    // 현재 페이지에서 게시글 ID 추출
    function getPostId() {
        const pathname = window.location.pathname;
        const fileName = pathname.split('/').pop();
        
        if (fileName && fileName.endsWith('.html')) {
            return fileName.replace('.html', '');
        }
        
        return null;
    }
    
    // 메인 블로그 URL 생성
    function getMainBlogUrl() {
        const postId = getPostId();
        
        if (postId) {
            // 개별 게시글 페이지로 리다이렉트
            return `https://my-blog.github.io/post/${postId}`;
        } else {
            // 메인 페이지로 리다이렉트
            return 'https://my-blog.github.io';
        }
    }
    
    // 리다이렉트 실행
    function performRedirect() {
        if (!isBot()) {
            const targetUrl = getMainBlogUrl();
            
            // 즉시 리다이렉트 (replace 사용으로 히스토리에 남지 않음)
            window.location.replace(targetUrl);
        }
    }
    
    // DOM 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', performRedirect);
    } else {
        // 이미 로드된 경우 즉시 실행
        performRedirect();
    }
    
    // 디버깅용 (개발 환경에서만)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Contents Redirect Script');
        console.log('User Agent:', navigator.userAgent);
        console.log('Is Bot:', isBot());
        console.log('Target URL:', getMainBlogUrl());
    }
})();
