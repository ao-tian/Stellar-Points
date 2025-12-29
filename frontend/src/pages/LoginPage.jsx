// Login Page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const LOGIN_BG = "/login-background.png";

export default function LoginPage() {
    const [utorid, setUtorid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const setAuth = useAuthStore((s) => s.setAuth);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const tokenRes = await fetch(`${API_BASE}/auth/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ utorid, password }),
            });
            const tokenBody = await tokenRes.json().catch(() => ({}));
            if (!tokenRes.ok) {
                throw new Error(tokenBody.error || 'Login failed');
            }
            const { token } = tokenBody;
            if (!token) throw new Error('Server did not return a token');
            // Get Current User with the Token
            const meRes = await fetch(`${API_BASE}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const meBody = await meRes.json().catch(() => ({}));
            if (!meRes.ok) {
                throw new Error(meBody.error || 'Failed to load user profile');
            }
            const user = meBody; // contains what users/me returns
            // Save in store
            setAuth(token, user);
            // Redirect Based on Role
            const role = String(user.role || '').toLowerCase();
            if (role === 'manager' || role === 'superuser') {
                navigate('/manager/users', { replace: true });
            } else if (role === 'cashier') {
                navigate('/cashier/transactions/new', { replace: true });
            } else {
                navigate('/me/points', { replace: true });
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Login error');
        } finally {
            setLoading(false);
        }
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
                        <h2 className="text-2xl font-semibold text-neutral">Welcome back</h2>
                        <p className="text-base text-neutral/70">
                            Sign in with your username to access your account.
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="form-control gap-2 mx-auto w-full max-w-xs">
                            <label htmlFor="utorid" className="block text-sm font-medium text-neutral/80">
                                Username
                            </label>
                            <input
                                id="utorid"
                                type="text"
                                value={utorid}
                                onChange={(e) => setUtorid(e.target.value)}
                                required
                                autoComplete="username"
                                className="input input-bordered input-lg text-center border-2 border-brand-200 focus:border-brand-500"
                                placeholder="e.g., super123"
                                data-cy="login-utorid"
                            />
                        </div>
                        <div className="form-control gap-2 mx-auto w-full max-w-xs">
                            <label htmlFor="password" className="block text-sm font-medium text-neutral/80">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="input input-bordered input-lg text-center border-2 border-brand-200 focus:border-brand-500"
                                placeholder="Your password"
                                data-cy="login-password"
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
                                className="btn btn-lg w-full max-w-xs font-medium transition-all bg-white text-black border-2 border-black hover:bg-black hover:text-white hover:border-white disabled:opacity-50 disabled:cursor-not-allowed px-6"
                                disabled={loading}
                                data-cy="login-submit"
                            >
                                {loading ? "Logging in…" : "Login"}
                            </button>
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-sm text-neutral/70">
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => navigate("/signup")}
                                        className="link link-primary font-medium"
                                    >
                                        Sign up
                                    </button>
                                </div>
                                <div className="text-sm text-neutral/70">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/forgot-password")}
                                        className="link link-primary font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
