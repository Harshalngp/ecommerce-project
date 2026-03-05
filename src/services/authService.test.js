import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as authService from './authService';

vi.mock('axios');

describe('authService helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    axios.post.mockReset();
  });

  it('stores token and user on login and sends correct payload', async () => {
    const token = 'abc';
    const user = { id: 'u1' };
    axios.post.mockResolvedValue({ data: { token, user } });

    const credentials = { email: 'x', password: 'y' };
    const result = await authService.login(credentials);

    expect(axios.post).toHaveBeenCalledWith('/api/UserAuth/login', {
      usernameOrEmail: 'x',
      password: 'y'
    });

    expect(result.token).toBe(token);
    expect(localStorage.getItem('token')).toBe(token);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
    expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
  });

  it('stores token and user on register and maps name to username', async () => {
    const token = 'def';
    const user = { id: 'u2' };
    axios.post.mockResolvedValue({ data: { token, user } });

    const payload = { name: 'Tester', email: 't@test.com', password: '1234' };
    const result = await authService.register(payload);

    expect(axios.post).toHaveBeenCalledWith('/api/UserAuth/register', {
      username: 'Tester',
      email: 't@test.com',
      password: '1234'
    });

    expect(result.token).toBe(token);
    expect(localStorage.getItem('token')).toBe(token);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
    expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
  });

  it('clears storage on logout', () => {
    localStorage.setItem('token', '123');
    localStorage.setItem('user', JSON.stringify({}));
    authService.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });
});