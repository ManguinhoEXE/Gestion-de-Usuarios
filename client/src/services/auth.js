import http from '../api/http';

export async function register(email, password) {
  const { data } = await http.post('/auth/register', { email, password });
  if (data?.token) localStorage.setItem('token', data.token);
  return data;
}

export async function login(email, password) {
  const { data } = await http.post('/auth/login', { email, password });
  return data;
}

export async function me() {
  const { data } = await http.get('/auth/me');
  return data;
}

export async function logout() {
  await http.post('/auth/logout');
}