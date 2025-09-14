# Node.js 모범 사례 2024

> Node.js 개발 시 반드시 알아야 할 실무 검증된 모범 사례들

## 🎯 개요

Node.js는 현재 가장 인기 있는 서버 사이드 JavaScript 런타임입니다. 하지만 제대로 된 모범 사례를 따르지 않으면 성능, 보안, 유지보수성에서 문제가 발생할 수 있습니다. 이 가이드에서는 2024년 기준으로 Node.js 개발 시 반드시 알아야 할 모범 사례들을 정리했습니다.

## 🏗️ 프로젝트 구조

### 1. 계층화된 아키텍처

비즈니스 로직과 API 라우트를 분리하여 테스트 가능하고 유지보수하기 쉬운 구조를 만드세요.

```
src/
├── controllers/     # API 컨트롤러
├── services/        # 비즈니스 로직
├── models/          # 데이터 모델
├── middleware/      # 미들웨어
├── routes/          # 라우트 정의
├── utils/           # 유틸리티 함수
├── config/          # 설정 파일
└── tests/           # 테스트 파일
```

### 2. 환경 변수 관리

민감한 정보는 절대 코드에 하드코딩하지 말고 환경 변수를 사용하세요.

```javascript
// config/database.js
const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'myapp_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

## 🔒 보안

### 1. 입력 검증 및 살균

모든 사용자 입력을 검증하고 살균하여 인젝션 공격을 방지하세요.

```javascript
const Joi = require('joi');
const validator = require('validator');

// 스키마 정의
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).required()
});

// 미들웨어
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details
    });
  }
  
  // XSS 방지를 위한 HTML 이스케이프
  req.body.name = validator.escape(req.body.name);
  
  next();
};
```

### 2. 인증 및 인가

JWT를 사용한 안전한 인증 시스템을 구현하세요.

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 비밀번호 해싱
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// JWT 토큰 생성
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h',
      issuer: 'myapp',
      audience: 'myapp-users'
    }
  );
};

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

### 3. 보안 헤더 설정

Helmet을 사용하여 보안 헤더를 자동으로 설정하세요.

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100개 요청
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## ⚡ 성능 최적화

### 1. 비동기 처리 최적화

Promise와 async/await를 올바르게 사용하여 성능을 최적화하세요.

```javascript
// ❌ 순차 처리 (느림)
const getUserData = async (userId) => {
  const user = await User.findById(userId);
  const posts = await Post.findByUserId(userId);
  const comments = await Comment.findByUserId(userId);
  
  return { user, posts, comments };
};

// ✅ 병렬 처리 (빠름)
const getUserData = async (userId) => {
  const [user, posts, comments] = await Promise.all([
    User.findById(userId),
    Post.findByUserId(userId),
    Comment.findByUserId(userId)
  ]);
  
  return { user, posts, comments };
};
```

### 2. 데이터베이스 최적화

연결 풀링과 쿼리 최적화를 통해 데이터베이스 성능을 향상시키세요.

```javascript
// 연결 풀 설정
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// 인덱스 활용
const getUserPosts = async (userId, limit = 10, offset = 0) => {
  const query = `
    SELECT p.*, u.username 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = $1 
    ORDER BY p.created_at DESC 
    LIMIT $2 OFFSET $3
  `;
  
  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
};
```

### 3. 캐싱 전략

Redis를 사용한 효과적인 캐싱 전략을 구현하세요.

```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// 캐시 미들웨어
const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // 응답을 캐시하기 위해 res.json을 오버라이드
      const originalJson = res.json;
      res.json = function(data) {
        client.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};
```

## 🐛 에러 처리

### 1. 중앙화된 에러 처리

모든 에러를 중앙에서 처리하여 일관된 에러 응답을 제공하세요.

```javascript
// 커스텀 에러 클래스
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 글로벌 에러 핸들러
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // 프로덕션에서는 상세 에러 정보 숨김
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

app.use(globalErrorHandler);
```

### 2. 비동기 에러 처리

async/await 함수의 에러를 자동으로 처리하는 래퍼를 사용하세요.

```javascript
// 비동기 에러 캐치 래퍼
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// 사용 예시
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});
```

## 📊 로깅 및 모니터링

### 1. 구조화된 로깅

Winston을 사용하여 구조화된 로그를 작성하세요.

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'myapp' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 사용 예시
logger.info('User logged in', { 
  userId: user.id, 
  ip: req.ip,
  userAgent: req.get('User-Agent')
});
```

## 🧪 테스트

### 1. 단위 테스트

Jest를 사용하여 비즈니스 로직을 테스트하세요.

```javascript
// services/userService.test.js
const userService = require('./userService');
const User = require('../models/User');

jest.mock('../models/User');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const mockUser = { id: 1, ...userData };
      User.create.mockResolvedValue(mockUser);
      
      const result = await userService.createUser(userData);
      
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });
  });
});
```

### 2. 통합 테스트

Supertest를 사용하여 API 엔드포인트를 테스트하세요.

```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../app');

describe('Authentication', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });
  });
});
```

## 🚀 배포 및 운영

### 1. 프로세스 관리

PM2를 사용하여 프로덕션에서 Node.js 애플리케이션을 관리하세요.

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'myapp',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 2. 헬스 체크

애플리케이션 상태를 모니터링할 수 있는 헬스 체크 엔드포인트를 구현하세요.

```javascript
// routes/health.js
const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: 'OK',
      redis: 'OK'
    }
  };
  
  try {
    // 데이터베이스 연결 확인
    await pool.query('SELECT 1');
    
    // Redis 연결 확인
    await client.ping();
    
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'ERROR';
    healthcheck.checks.database = error.message;
    res.status(503).json(healthcheck);
  }
});

module.exports = router;
```

## 📝 마무리

이 가이드에서 소개한 모범 사례들을 따르면 더 안전하고 성능이 좋으며 유지보수하기 쉬운 Node.js 애플리케이션을 개발할 수 있습니다. 중요한 것은 이러한 원칙들을 프로젝트 초기부터 적용하는 것입니다.

지속적인 학습과 코드 리뷰를 통해 더 나은 Node.js 개발자가 되어보세요! 🚀