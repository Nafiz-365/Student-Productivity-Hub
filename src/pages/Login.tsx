import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    BookOpen,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle,
} from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useApp();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulate network delay for better UX
            await new Promise((resolve) => setTimeout(resolve, 800));
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-20 xl:px-24 relative h-screen">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl z-0 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl z-0 pointer-events-none"></div>

                <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            StudyHub
                        </span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                            Welcome back
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Please enter your details to sign in
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Email address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        autoComplete="email"
                                        name="email"
                                        className="input pl-9 w-full h-10 text-sm transition-all focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="current-password"
                                        name="password"
                                        className="input pl-9 pr-8 w-full h-10 text-sm transition-all focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-3 w-3" />
                                        ) : (
                                            <Eye className="h-3 w-3" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-xs text-gray-600 dark:text-gray-400 cursor-pointer"
                            >
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-2.5 text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group h-10"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in{' '}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            Sign up for free
                        </Link>
                    </p>

                    {/* Demo Banner */}
                    <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/50 flex gap-3">
                        <div className="mt-0.5">
                            <CheckCircle className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                                Demo Access
                            </p>
                            <p className="text-[10px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                                Use any email/password combo to test the premium
                                features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Visual */}
            <div className="hidden lg:block relative w-0 flex-1 bg-gray-900 overflow-hidden h-screen">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600 opacity-90 transition-opacity duration-500"></div>
                <img
                    className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Students studying"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 p-20 z-10 text-white animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Master your studies.
                        <br />
                        Achieve your goals.
                    </h1>
                    <p className="text-xl text-blue-100 max-w-lg leading-relaxed">
                        Join thousands of students organizing their academic
                        life with StudyHub's premium productivity tools.
                    </p>

                    <div className="mt-10 flex gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-12 h-12 rounded-full border-2 border-blue-600 bg-gray-800 overflow-hidden"
                                >
                                    <img
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="User"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex text-yellow-400 gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-white">
                                Trusted by 10,000+ students
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
