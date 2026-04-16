import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const loginSuccessRate = new Rate('login_success_rate');
const profileFetchRate = new Rate('profile_fetch_rate');
const loginDuration = new Trend('login_duration');
const profileDuration = new Trend('profile_duration');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users over 30s
    { duration: '1m', target: 10 },   // Stay at 10 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    login_success_rate: ['rate>0.95'], // Login success rate should be >95%
    profile_fetch_rate: ['rate>0.95'], // Profile fetch success rate should be >95%
  },
};

export default function () {
  // Step 1: Login
  const loginStart = new Date().getTime();
  const loginRes = http.post('http://api:3002/v1/auth/login', JSON.stringify({
    email: 'admin@yalect.com',
    password: 'Password@123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginEnd = new Date().getTime();
  loginDuration.add(loginEnd - loginStart);

  const loginSuccess = check(loginRes, {
    'login status is 201': (r) => r.status === 201,
    'login response time < 500ms': (r) => r.timings.duration < 500,
    'login has access_token': (r) => r.json('access_token') !== undefined,
  });

  loginSuccessRate.add(loginSuccess);

  const token = loginRes.json('access_token');

  // Step 2: Call protected route
  if (token) {
    const profileStart = new Date().getTime();
    const profileRes = http.get('http://api:3002/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profileEnd = new Date().getTime();
    profileDuration.add(profileEnd - profileStart);

    const profileSuccess = check(profileRes, {
      'profile status is 200': (r) => r.status === 200,
      'profile response time < 500ms': (r) => r.timings.duration < 500,
      'profile has user data': (r) => r.json() !== undefined,
    });

    profileFetchRate.add(profileSuccess);
  }

  // Simulate user think time
  sleep(Math.random() * 2 + 1); // Sleep between 1-3 seconds
}