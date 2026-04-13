import http from 'k6/http';
import { check } from 'k6';

  // "password": "Password@123",
  // "name": "yalect",
  // "logo_id": "https://organizationlogourl.com",
  // "email": "admin@yalect.com",
export default function () {
  // Step 1: Login
  const loginRes = http.post('http://host.docker.internal:3002/v1/auth/login', JSON.stringify({
    email: 'admin@yalect.com',
    password: 'Password@123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  // console.log(loginRes)
  const token = loginRes.json('access_token');

  check(loginRes, {
    'login success': (r) => r.status === 201,
    'token received': () => token !== undefined,
  });

  // Step 2: Call protected route
  const profileRes = http.get('http://host.docker.internal:3002/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  check(profileRes, {
    'profile fetched': (r) => r.status === 200,
  });
}