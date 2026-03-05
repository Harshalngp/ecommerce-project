import axios from 'axios';

const STORAGE_TOKEN = 'token';
const STORAGE_USER = 'user';

export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(STORAGE_TOKEN, token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(STORAGE_TOKEN);
  }
}

export function saveUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_USER);
  }
}

export function getSavedToken() {
  return localStorage.getItem(STORAGE_TOKEN);
}

export function getSavedUser() {
  const u = localStorage.getItem(STORAGE_USER);
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch (e) {
    console.warn('failed to parse stored user', e);
    return null;
  }
}

export async function login(credentials) {
  try {
    // backend expects { usernameOrEmail, password }
    // callers often pass { email, password } so translate here
    const payload = {
      usernameOrEmail: credentials.usernameOrEmail || credentials.email || credentials.username,
      password: credentials.password
    };

    const { data } = await axios.post('/api/UserAuth/login', payload);
    setAuthToken(data.token);
    saveUser(data.user);
    return data;
  } catch (err) {
    // rethrow with consistent shape for caller
    if (err.response) {
      // server responded with a status code
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(message);
    }
    throw err;
  }
}

export async function register(payload) {
  try {
    // backend expects { username, email, password }
    // the UI calls this with { name, email, password }
    const body = {
      username: payload.username || payload.name,
      email: payload.email,
      password: payload.password
    };

    const { data } = await axios.post('/api/UserAuth/register', body);
    setAuthToken(data.token);
    saveUser(data.user);
    return data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(message);
    }
    throw err;
  }
}

export function logout() {
  setAuthToken(null);
  saveUser(null);
}
