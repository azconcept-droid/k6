# k6 Load Testing with Grafana Dashboard

This setup provides a complete load testing environment with real-time monitoring.

## Services

- **API**: NestJS application (port 3002)
- **InfluxDB**: Time-series database for metrics (port 8086)
- **Grafana**: Dashboard for visualization (port 3000)
- **k6**: Load testing tool

## Getting Started

1. **Start all services**:
   ```bash
   docker compose up -d --build
   ```

2. **Wait for services to be ready** (about 1-2 minutes):
   ```bash
   docker compose logs -f
   ```

3. **Access Grafana Dashboard**:
   - Open: http://localhost:3000
   - Username: `admin`
   - Password: `admin123`

4. **View k6 Dashboard**:
   - In Grafana, go to "Dashboards" → "k6 Load Testing Results"
   - The dashboard will show real-time metrics during test execution

## Running Load Tests

The k6 test will run automatically when you start the services. To run additional tests:

```bash
# Run once
docker compose run --rm k6 run /scripts/auth-flow.js

# Run with custom options
docker compose run --rm k6 run --vus 20 --duration 30s /scripts/auth-flow.js
```

## Dashboard Panels

- **HTTP Request Rate**: Shows requests per second
- **HTTP Request Duration**: 50th and 95th percentile response times
- **Virtual Users**: Number of active virtual users
- **HTTP Status Codes**: Distribution of response codes
- **Checks**: Success rates of custom checks

## Stopping Services

```bash
docker compose down
```

## Troubleshooting

- If Grafana shows no data, wait a few minutes for InfluxDB to initialize
- Check service logs: `docker compose logs <service-name>`
- Restart services: `docker compose restart`