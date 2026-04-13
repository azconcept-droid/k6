# NestJS K6 Load Testing Application

A NestJS backend application providing authentication and user profile endpoints for load testing with k6.

## Features

- **Authentication**: JWT-based login endpoint that returns access tokens
- **Protected Routes**: JWT-protected endpoints that require Bearer token authentication
- **SQLite Database**: Lightweight database for user storage
- **Password Hashing**: Secure password hashing with bcrypt

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── auth.controller.ts # Login endpoint
│   ├── auth.service.ts    # Authentication logic
│   ├── jwt.strategy.ts    # JWT strategy for Passport
│   └── auth.module.ts     # Auth module definition
├── users/                 # Users module
│   ├── users.controller.ts # User endpoints (GET /me)
│   ├── users.service.ts    # User service
│   └── users.module.ts     # Users module definition
├── database/              # Database entities
│   └── user.entity.ts      # User entity
├── app.module.ts          # Root module with TypeORM configuration
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── main.ts                # Application entry point
└── seed.ts                # Database seeding script
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## Setup & Running

### 1. Initialize Database with Default User

```bash
npm run seed
```

This creates a default user with credentials:
- Email: `admin@yalect.com`
- Password: `Password@123`

### 2. Start the Development Server

```bash
npm run start:dev
```

The application will start on `http://localhost:3002`

### 3. Start Production Server

```bash
npm run build
npm start
```

## API Endpoints

### Login

**POST** `/v1/auth/login`

Request body:
```json
{
  "email": "admin@yalect.com",
  "password": "Password@123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User Profile

**GET** `/users/me`

Headers:
- `Authorization: Bearer <access_token>`

Response:
```json
{
  "id": 1,
  "email": "admin@yalect.com",
  "name": "yalect"
}
```

## K6 Load Testing

Use the provided k6 script (`../auth-flow.js`) to load test this application:

```bash
k6 run auth-flow.js
```

The script will:
1. Authenticate with the login endpoint
2. Extract the access token
3. Use the token to fetch the current user profile
4. Perform checks to verify the responses

## Configuration

### JWT Secret

Currently set to `'your-secret-key'` in `src/auth/auth.module.ts`. Change this to a secure random string in production.

### Database

SQLite database is stored in `app.db` in the project root. To reset the database, delete the `app.db` file and run the seed script again.

## Dependencies

- **@nestjs/common**: NestJS core module
- **@nestjs/core**: NestJS foundation
- **@nestjs/jwt**: JWT token generation and validation
- **@nestjs/passport**: Passport.js integration
- **@nestjs/platform-express**: Express.js adapter
- **@nestjs/typeorm**: TypeORM integration
- **typeorm**: ORM for database operations
- **sqlite3**: SQLite database driver
- **passport-jwt**: JWT strategy for Passport
- **bcrypt**: Password hashing library
- **class-validator**: DTO validation
- **class-transformer**: DTO transformation

## Development

### Watch Mode

```bash
npm run start:dev
```

### Testing

```bash
npm test
```

## Troubleshooting

### Database already exists error
If you get an error that the default user already exists, the database file exists. Delete `app.db` and run `npm run seed` again.

### JWT validation errors
Ensure you're sending the Bearer token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

### Port already in use
By default, the app runs on port 3002. You can change this in `src/main.ts`.

## License

ISC


curl -X POST http://localhost:3002/v1/auth/login   -H "Content-Type: application/json" \
  -d '{"email":"admin@yalect.com","password":"Password@123"}'


TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moriafund.com","password":"Password@123"}' | grep -oP '"access_token":"\K[^"]+') && \
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN"

docker run --rm -i \
  --add-host=host.docker.internal:host-gateway \
  -v $(pwd):/scripts \
  grafana/k6 run /scripts/auth-flow.js

docker run --rm -i \
  -v $(pwd):/scripts \
  grafana/k6 run \
  --vus 100 --duration 30s \
  /scripts/login-test.js