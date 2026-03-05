import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './AuthPage.css';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
    const [authMode, setAuthMode] = useState('login');
    // formData keys are chosen to match the API models exactly
    const [formData, setFormData] = useState({
        // login fields
        usernameOrEmail: '',
        password: '',
        // register fields
        username: '',
        email: '',
        fullName: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login, register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const authUser = () => {
        setAuthMode(authMode === 'register' ? 'login' : 'register');
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // if we somehow arrive while already logged in, send straight to home
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (authMode === 'login') {
                await login({
                    usernameOrEmail: formData.usernameOrEmail,
                    password: formData.password
                });
            } else {
                await register({
                    username: formData.username,
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                });
            }
            navigate('/home');
        } catch (err) {
            console.error(err);
            // authService throws plain Error with message when server returns 500/401
            setError(err.message || err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-wrapper">
            <div className="split-container">

                <div className="hero-pane">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="brand-large">SuperSimpleDev</h1>
                        <p className="hero-tagline">Start your simple dev journey with us. Simple. Powerful.</p>
                        <div className="graphic-placeholder">
                            <div className="abstract-shape"></div>
                        </div>
                    </div>
                </div>

                <div className="form-pane">

                    {authMode === 'login' ? (
                        <div id="signin-form" className="auth-section">
                            <h2 className="form-title">Welcome Back</h2>
                            <p className="form-subtitle">Enter your username or email and password.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="input-container">
                                    <label htmlFor="login-usernameOrEmail">Username or Email</label>
                                    <input
                                        type="text"
                                        name="usernameOrEmail"
                                        id="login-usernameOrEmail"
                                        placeholder="username or email"
                                        value={formData.usernameOrEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="login-password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="login-password"
                                        placeholder="******"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="action-btn" disabled={loading}>
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>
                            {error && <div className="form-error">{error}</div>}
                            <div className="switch-link">
                                New to SuperSimpleDev?{' '}
                                <button type="button" className="link-button" id="to-register" onClick={authUser}>
                                    Create an account
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div id="register-form" className="auth-section">
                            <h2 className="form-title">Create Account</h2>
                            <p className="form-subtitle">Join us today for a seamless dev experience.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="input-container">
                                    <label htmlFor="reg-username">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="reg-username"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="reg-fullName">Full name (optional)</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="reg-fullName"
                                        placeholder="First and last name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="reg-email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="reg-email"
                                        placeholder="you@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="reg-password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="reg-password"
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="action-btn" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </form>
                            {error && <div className="form-error">{error}</div>}
                            <div className="switch-link">
                                Already have an account?{' '}
                                <button type="button" className="link-button" id="to-signin" onClick={authUser}>
                                    Sign In
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
