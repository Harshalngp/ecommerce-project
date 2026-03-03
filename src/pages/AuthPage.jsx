import { useState } from 'react';
import './AuthPage.css';
import { Link } from 'react-router';

export function AuthPage() {

    const [authMode, setAuthMode] = useState('login');

    const authUser = () => {
        setAuthMode(authMode == 'register' ? 'login' : 'register');
    }

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
                            <p className="form-subtitle">Enter your details to sign into your account.</p>
                            <form>
                                <div className="input-container">
                                    <label htmlFor="signin-email">Email</label>
                                    <input type="email" id="signin-email" placeholder="you@email.com" />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="signin-password">Password</label>
                                    <input type="password" id="signin-password" placeholder="******" />
                                </div>
                                <button type="submit" className="action-btn">Sign In</button>
                            </form>
                            <div className="switch-link">
                                New to SuperSimpleDev? <Link to="/" id="to-register" onClick={authUser}>Create an account</Link>
                            </div>
                        </div>
                    ) : (
                        <div id="register-form" className="auth-section">
                            <h2 className="form-title">Create Account</h2>
                            <p className="form-subtitle">Join us today for a seamless dev experience.</p>
                            <form>
                                <div className="input-container">
                                    <label htmlFor="reg-name">Your Name</label>
                                    <input type="text" id="reg-name" placeholder="First and last name" />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="reg-email">Email</label>
                                    <input type="email" id="reg-email" placeholder="you@email.com" />
                                </div>
                                <div className="input-container">
                                    <label htmlFor="reg-password">Password</label>
                                    <input type="password" id="reg-password" placeholder="At least 6 characters" />
                                </div>
                                <button type="submit" className="action-btn">Create Account</button>
                            </form>
                            <div className="switch-link">
                                Already have an account? <Link to="/" id="to-signin" onClick={authUser}>Sign In</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
