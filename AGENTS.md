# AGENTS.md - k6 Load Testing Repository

## Overview
A Docker-based load testing environment with k6, Grafana, InfluxDB, and a NestJS backend API.

## Quick Start
```bash
# Start all services (API, InfluxDB, Grafana, k6)
docker compose up -d --build

# View logs
docker compose logs -f
```

## Services & Ports
| Service   | Port | URL                          |
|-----------|------|------------------------------|
| API       | 3002 | http://localhost:3002       |
| Grafana   | 3000 | http://localhost:3000       |
| InfluxDB  | 8086 | http://localhost:8086       |

## Credentials
- **Grafana**: `admin` / `admin123`
- **Test User**: `admin@yalect.com` / `Password@123`

## Running Tests

### Inside Docker (default)
k6 runs automatically on `docker compose up`. The test script is `auth-flow.js`.

### Manual k6 runs
```bash
# Run once
docker compose run --rm k6 run /scripts/auth-flow.js

# Custom VUs and duration
docker compose run --rm k6 run --vus 20 --duration 30s /scripts/auth-flow.js

# Run locally (requires API running)
docker run --rm -i --add-host=host.docker.internal:host-gateway \
  -v $(pwd):/scripts grafana/k6 run /scripts/auth-flow.js
```

## NestJS App (app/)

```bash
cd app

# Install deps
npm install

# Seed database with default user
npm run seed

# Dev server (port 3002)
npm run start:dev

# Build
npm run build
npm start
```

## k6 Test Script
- `auth-flow.js` - Tests login + protected `/users/me` endpoint
- Uses `http://api:3002` (Docker network) inside containers
- Uses `http://localhost:3002` when running locally

## Grafana Dashboard
1. Open http://localhost:3000
2. Go to Dashboards → k6 Load Testing Results
3. Wait for InfluxDB to populate (~1-2 min after test starts)

## Troubleshooting
- Database not seeded? Run `npm run seed` in `app/` then `docker compose up -d --build api`
- No Grafana data? Wait for InfluxDB initialization or restart: `docker compose restart`
- Database locked? Delete `app/app.db` and re-run `npm run seed`
- API not responding? Check health: `curl http://localhost:3002`
