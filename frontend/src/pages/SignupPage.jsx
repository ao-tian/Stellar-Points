// Signup Page
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const LOGIN_BG = "/login-background.png";

export default function SignupPage() {
    const [utorid, setUtorid] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Trim and validate inputs
            const trimmedUtorid = utorid.trim();
            const trimmedName = name.trim();
            const trimmedEmail = email.trim().toLowerCase();
            
            if (!trimmedUtorid || !trimmedName || !trimmedEmail || !password) {
                throw new Error('All fields are required');
            }
            
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            if (password.length < 8 || password.length > 20) {
                throw new Error('Password must be 8-20 characters long');
            }
            
            const res = await fetch(`${API_BASE}/users/public`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    utorid: trimmedUtorid, 
                    name: trimmedName, 
                    email: trimmedEmail,
                    password: password
                }),
            });
            
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(body.error || `Signup failed: ${res.status} ${res.statusText}`);
            }
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'Signup error. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${LOGIN_BG})` }}
            >
                <div className="min-h-screen bg-white/80 px-4 py-10 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-6 rounded-3xl border border-base-200/70 bg-white/95 p-8 shadow-xl text-center">
                        <div className="text-6xl mb-4">✓</div>
                        <h2 className="text-2xl font-semibold text-neutral">Account Created!</h2>
                        <p className="text-base text-neutral/70">
                            Your account has been created successfully. Redirecting to login...
                        </p>
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
                        <h2 className="text-2xl font-semibold text-neutral">Create Account</h2>
                        <p className="text-base text-neutral/70">
                            Sign up with your username and email address.
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
                                placeholder="e.g., johndoe123"
                                pattern="[A-Za-z0-9_-]{3,30}"
                                title="3-30 characters (letters, numbers, underscores, hyphens)"
                            />
                        </div>
                        <div className="form-control gap-2 mx-auto w-full max-w-xs">
                            <label htmlFor="name" className="block text-sm font-medium text-neutral/80">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                                className="input input-bordered input-lg text-center border-2 border-brand-200 focus:border-brand-500"
                                placeholder="Your full name"
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
                                placeholder="your.email@example.com"
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
                                autoComplete="new-password"
                                className="input input-bordered input-lg text-center border-2 border-brand-200 focus:border-brand-500"
                                placeholder="8-20 characters"
                                minLength={8}
                                maxLength={20}
                            />
                            <p className="text-xs text-neutral/60 mt-1">
                                Must contain uppercase, lowercase, number, and special character
                            </p>
                        </div>
                        <div className="form-control gap-2 mx-auto w-full max-w-xs">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral/80">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                className="input input-bordered input-lg text-center border-2 border-brand-200 focus:border-brand-500"
                                placeholder="Re-enter password"
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
                            >
                                {loading ? "Creating account…" : "Sign up"}
                            </button>
                            <div className="text-sm text-neutral/70">
                                Already have an account?{" "}
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

