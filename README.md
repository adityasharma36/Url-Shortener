# URL Shortener Backend

A Node.js + TypeScript URL shortener service built with Express, tRPC, MongoDB, Redis, and Zod validation.

## Overview

This project turns long URLs into compact short links and resolves them back to their original destinations. The application stores short URL metadata in MongoDB, uses Redis for fast lookups and counter generation, and exposes the main API via tRPC under the `/trpc` route.

## Tech Stack

- Node.js
- TypeScript
- Express
- tRPC
- MongoDB + Mongoose
- Redis
- Zod
- Pino + pino-pretty + pino-roll
- dotenv

## Project Structure

```bash
node-ts-backend-template/
├── logs/
├── src/
│   ├── app.ts
│   ├── configs/
│   │   ├── db.config.ts
│   │   ├── index.ts
│   │   ├── logger.config.ts
│   │   └── redis.config.ts
│   ├── controllers/
│   │   └── url.controller.ts
│   ├── db/
│   │   └── models/
│   │       └── url.model.ts
│   ├── dtos/
│   │   └── createUrl.dto.ts
│   ├── middlewares/
│   │   └── error.middleware.ts
│   ├── repositories/
│   │   ├── cache.repository.ts
│   │   └── url.repository.ts
│   ├── routers/
│   │   ├── trpc/
│   │   │   ├── context.ts
│   │   │   ├── index.ts
│   │   │   └── url.ts
│   │   └── v1/
│   │       ├── index.router.ts
│   │       └── test.router.ts
│   ├── services/
│   │   └── url.service.ts
│   ├── utils/
│   │   ├── Errors/
│   │   │   └── app.error.ts
│   │   └── helpers/
│   │       └── base62.helper.ts
│   ├── validators/
│   │   ├── index.ts
│   │   └── test.validator.ts
│   └── app.ts
├── .env
├── package.json
├── tsconfig.json
├── README.md
└── logs/
```

## Core Features

### URL shortening

The main logic lives in [src/services/url.service.ts](src/services/url.service.ts). It:

- reads the next ID from Redis
- converts it to a Base62 short code
- saves the mapping in MongoDB
- stores the original URL in Redis with a 24-hour TTL
- returns the generated short URL

### URL resolution

The service resolves a short code by checking Redis first, then MongoDB if the cache misses. Each successful lookup increments the URL click counter.

### Click tracking

The Mongo schema in [src/db/models/url.model.ts](src/db/models/url.model.ts) stores:

- `originalUrl`
- `shortUrl`
- `click`
- `createdAt`
- `updatedAt`

### Caching

[src/repositories/cache.repository.ts](src/repositories/cache.repository.ts) manages Redis operations:

- counter generation with `INCR`
- short code to original URL mapping
- TTL-based cache expiry

### Logging and errors

- [src/configs/logger.config.ts](src/configs/logger.config.ts) sets up structured logging with Pino and daily log rotation.
- [src/middlewares/error.middleware.ts](src/middlewares/error.middleware.ts) catches and formats application errors.
- [src/utils/Errors/app.error.ts](src/utils/Errors/app.error.ts) contains the custom error classes.

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
LOG_LEVEL=info
MONGO_URL=mongodb://localhost:27017/url-shortener
REDIS_URL=redis://localhost:6379
REDIS_COUNTER_KEY=url:counter
BASE_URL=http://localhost:3000
```

### Variable meanings

- `PORT`: server port
- `LOG_LEVEL`: log level used by Pino
- `MONGO_URL`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `REDIS_COUNTER_KEY`: Redis key used to generate incrementing short IDs
- `BASE_URL`: base URL used when building short links

## Installation

```bash
npm install
```

## Run the Project

```bash
npm run dev
```

This starts TypeScript in watch mode and runs the app with Nodemon.

## Runtime Startup

The app boots in [src/app.ts](src/app.ts) and does the following:

1. parses JSON request bodies with a 1 MB limit
2. enables request logging via `pino-http`
3. registers the tRPC middleware at `/trpc`
4. mounts the v1 router at `/api/v1`
5. connects to MongoDB and Redis on startup
6. attaches the global error handler

## API Surface

The core business API is exposed through tRPC procedures, not a custom REST controller layer.

### `url.create`

Procedure type: mutation

Input:

```ts
{
  orginalUrl: "https://example.com/very/long/url"
}
```

The field name is currently spelled `orginalUrl` in the code, not `originalUrl`.

Example response:

```json
{
  "id": "64b7d0f5c9...",
  "shortUrl": "2FZ",
  "originalUrl": "https://example.com/very/long/url",
  "fullUrl": "http://localhost:3000/2FZ",
  "createdAt": "2026-09-29T12:00:00.000Z",
  "updatedAt": "2026-09-29T12:00:00.000Z"
}
```

### `url.getOriginalUrl`

Procedure type: query

Input:

```ts
{
  shortUrl: "2FZ"
}
```

Example response:

```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "2FZ"
}
```

## Legacy Placeholder Route

A sample Express route remains in [src/routers/v1/test.router.ts](src/routers/v1/test.router.ts):

- `GET /api/v1/`

It validates a body schema and returns:

```json
{
  "success": true
}
```

This is a demonstration endpoint and not the main URL shortener flow.

## Notes

- Redis is used for both short-code generation and fast cache lookups.
- MongoDB is the source of truth for persisted URL records.
- The process uses a Base62 encoder from [src/utils/helpers/base62.helper.ts](src/utils/helpers/base62.helper.ts).
- The app is designed to be extended with additional endpoints or a REST wrapper around the tRPC router.

## Scripts

Current scripts in [package.json](package.json):

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "npx tsc --watch & nodemon dist/app.js"
  }
}
```

There is no production build script currently configured beyond the TypeScript watch/dev flow.
