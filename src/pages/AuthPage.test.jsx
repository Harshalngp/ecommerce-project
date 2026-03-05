import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import axios from 'axios';
import { AuthProvider } from '../context/AuthContext';
import { AuthPage } from './AuthPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

vi.mock('axios');

function renderWithRouter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<div>HOME</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('AuthPage', () => {
  beforeEach(() => {
    localStorage.clear();
    axios.post.mockReset();
  });

  it('submits login form, stores token and navigates', async () => {
    const fakeToken = 'faketoken123';
    const fakeUser = { id: '1', email: 'test@test.com' };
    axios.post.mockResolvedValue({ data: { token: fakeToken, user: fakeUser } });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(screen.getByText('HOME')).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith('/api/UserAuth/login', {
      usernameOrEmail: 'test@test.com',
      password: 'secret'
    });
  });

  it('submits register form, stores token and navigates', async () => {
    const fakeToken = 'newtoken456';
    const fakeUser = { id: '2', email: 'new@test.com' };
    axios.post.mockResolvedValue({ data: { token: fakeToken, user: fakeUser } });

    renderWithRouter();
    // flip to register
    fireEvent.click(screen.getByText(/create an account/i));

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'NewUser' } });
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(screen.getByText('HOME')).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith('/api/UserAuth/register', {
      username: 'NewUser',
      fullName: 'New User',
      email: 'new@test.com',
      password: 'password'
    });
  });

  it('shows error when login fails', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'bad creds' } } });

    renderWithRouter();
    fireEvent.change(screen.getByLabelText(/username or email/i), { target: { value: 'x' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'y' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/bad creds/i)).toBeInTheDocument();
  });

  it('protects routes when not logged in', async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<div>LOGIN</div>} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <div>HOME</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('LOGIN')).toBeInTheDocument();
  });
});