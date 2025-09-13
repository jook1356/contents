# Node.js 베스트 프랙티스

> Node.js 애플리케이션 개발 시 반드시 알아야 할 베스트 프랙티스들을 정리했습니다.

## 프로젝트 구조

### 기본 폴더 구조

```
project/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── app.js
├── tests/
├── config/
├── package.json
└── README.md
```

## 에러 처리

### 전역 에러 핸들러

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

### 비동기 에러 처리

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 사용 예시
app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
  })
);
```

## 보안

### 환경 변수 관리

```javascript
// config/database.js
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
};
```

### 입력 검증

```javascript
const joi = require("joi");

const userSchema = joi.object({
  name: joi.string().min(2).max(50).required(),
  email: joi.string().email().required(),
  age: joi.number().integer().min(18).max(100),
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
```

## 성능 최적화

### 데이터베이스 연결 풀링

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 캐싱

```javascript
const redis = require("redis");
const client = redis.createClient();

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      res.sendResponse = res.json;
      res.json = (body) => {
        client.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
```

## 테스팅

### Jest를 이용한 단위 테스트

```javascript
// tests/user.test.js
const request = require("supertest");
const app = require("../src/app");

describe("User API", () => {
  test("GET /users should return users list", async () => {
    const response = await request(app).get("/users").expect(200);

    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBe(true);
  });
});
```

## 결론

Node.js 개발 시 이러한 베스트 프랙티스들을 따르면 더 안정적이고 확장 가능한 애플리케이션을 만들 수 있습니다.

## 참고 자료

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
