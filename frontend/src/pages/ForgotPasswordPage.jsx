// Forgot Password Page
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const LOGIN_BG = "/login-background.png";

export default function ForgotPasswordPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState('');

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const trimmedUsername = username.trim();
            const trimmedEmail = email.trim();
            
            if (!trimmedUsername) {
                throw new Error('Username is required');
            }
            
            if (!trimmedEmail) {
                throw new Error('Email is required');
            }
            
            const res = await fetch(`${API_BASE}/auth/resets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ utorid: trimmedUsername, email: trimmedEmail }),
            });
            
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(body.error || `Request failed: ${res.status} ${res.statusText}`);
            }
            
            setResetToken(body.resetToken);
            setSuccess(true);
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err.message || 'Failed to request password reset. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (success && resetToken) {
        return (
            <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${LOGIN_BG})` }}
            >
                <div className="min-h-screen bg-white/80 px-4 py-10 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-6 rounded-3xl border border-base-200/70 bg-white/95 p-8 shadow-xl">
                        <div className="text-center space-y-4">
                            <h1 
                                className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight"
                                style={{
                                    backgroundImage: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #4f46e5 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                StellarPoints
                            </h1>
                            <h2 className="text-2xl font-semibold text-neutral">Reset Token Generated</h2>
                            <p className="text-base text-neutral/70">
                                Your password reset token has been generated. Use it to reset your password.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="alert alert-info">
                                <div className="text-sm">
                                    <p className="font-semibold mb-2">Your reset token:</p>
                                    <p className="font-mono text-xs break-all bg-base-200 p-2 rounded">{resetToken}</p>
                                    <p className="mt-2 text-xs">Copy this token and use it on the reset password page.</p>
                                </div>
                            </div>
                            <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                                <p className="text-xs font-semibold text-neutral/80 mb-2">Why is a reset token required?</p>
                                <ul className="text-xs text-neutral/70 space-y-1 list-disc list-inside">
                                    <li>Prevents unauthorized password resets by requiring proof of account ownership</li>
                                    <li>Token expires after 1 hour for security</li>
                                    <li>One-time use only - token is invalidated after password reset</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                                    className="btn w-full font-medium transition-all bg-white text-black border-2 border-black hover:bg-black hover:text-white hover:border-white px-6"
                                >
                                    Go to Reset Password
                                </button>
                                <Link
                                    to="/login"
                                    className="btn w-full font-medium transition-all bg-white text-black border-2 border-black hover:bg-black hover:text-white hover:border-white px-6"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${LOGIN_BG})` }}
        >
            <div className="min-h-screen bg-white/80 px-4 py-10 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-full max-w-md space-y-6 rounded-3xl border border-base-200/70 bg-white/95 p-8 shadow-xl">
                    <div className="text-center space-y-4">
                        <h1 
                            className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #4f46e5 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            StellarPoints
                        </h1>
                        <h2 className="text-2xl font-semibold text-neutral">Forgot Password</h2>
                        <p className="text-base text-neutral/70">
                            Enter your username and email to receive a password reset token.
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="form-control gap-2 mx-auto w-full max-w-xs">
                            <label htmlFor="username" className="block text-sm font-medium text-neutral/80">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                className="input input-bordered input-lg text-center border-2 border-brand-200 focus:border-brand-500"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="form-control gap-2 mx-auto w-full max-w-xs">
                            <label htmlFor="email" className="block text-sm font-medium text-neutral/80">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="input input-bordered input-lg text-center border-2 border-brand-200 focus:border-brand-500"
                                placeholder="Enter your email"
                            />
                        </div>
                        {error && (
                            <div className="alert alert-error text-sm">
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="pt-2 flex flex-col items-center gap-3">
                            <button
                                type="submit"
                                className="btn btn-lg w-full max-w-xs border-0 bg-brand-500 text-white hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-200"
                                disabled={loading}
                            >
                                {loading ? "Requesting…" : "Request Reset Token"}
                            </button>
                            <div className="text-sm text-neutral/70">
                                Remember your password?{" "}
                                <Link to="/login" className="link link-primary font-medium">
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

