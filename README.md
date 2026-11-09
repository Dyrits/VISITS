# Visits

A visit counter web application with Node.js, Express and Redis, running with Docker Compose.

## About The Project

The application displays the number of visits and increments the counter on each request. The counter is stored in Redis. The app listens on port 8081 and is exposed on port 4001 through Docker Compose.

### Course

Udemy - Docker and Kubernetes: The Complete Guide (per the repository's original description).

### Built With

- Node.js
- Express
- Redis
- Docker / Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Running

```sh
docker-compose up
```

Open [http://localhost:4001](http://localhost:4001).

## Dependency validation

Node.js 26 LTS is pinned in the app image. `npm ci` installs the committed lockfile. Redis 3.1.2 preserves this course's callback API and removes the Redis 2 advisory; this is not a migration to the latest Redis client API.

With Node.js 26, a local `redis-server` and `redis-cli` installed:

```sh
npm ci
npm test
```

The test starts its own temporary Redis process on localhost:6379, with persistence disabled, and the app on port 8081. Both ports must be free. It maps the Docker-only `redis-server` hostname to localhost in the test process, verifies five sequential visits plus stored value, and stops both processes. Override binary paths with `REDIS_SERVER_BIN` and `REDIS_CLI_BIN` if needed. No external Redis data is used.

Baseline and updated dependencies passed this HTTP fixture on Node 26 with Redis 6.0.16. The updated npm audit returned zero findings. A real Docker Compose build/run has not been verified. The Redis server image remains the original floating `redis` image; no server-version upgrade or production deployment is claimed. The tutorial still resets the counter on each app start and does a non-atomic read/write increment, so concurrent requests can lose updates. Those behaviors are unchanged.

## License

No license file is present in this repository.
