# NestJS Application for K6 Load Testing

This is a NestJS backend application providing authentication and user profile endpoints for load testing with k6.

## Project Setup Status

- [x] Verify copilot-instructions.md file created
- [x] Project requirements clarified (NestJS with Auth endpoints)
- [ ] Scaffold the project
- [ ] Install dependencies
- [ ] Create authentication endpoints
- [ ] Set up database
- [ ] Create and run dev task
- [ ] Launch the project
- [ ] Documentation complete

## Project Details

**Framework**: NestJS  
**Purpose**: Provide auth endpoints for k6 load testing  
**Required Endpoints**:
- POST `/v1/auth/login` - Returns access token
- GET `/users/me` - Protected endpoint requiring Bearer token
