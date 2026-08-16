import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    BookOpen,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { signup } = useApp();
    const navigate = useNavigate();

    const validateForm = () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulating network
            const success = await signup(name, email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            {/* Right Side: Visual (Swapped for Signup) */}
            <div className="hidden lg:block relative w-0 flex-1 bg-gray-900 overflow-hidden order-2 h-screen">
                <div className="absolute inset-0 bg-gradient-to-bl from-teal-600 to-emerald-600 opacity-90 transition-opacity duration-500"></div>
                <img
                    className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Group study"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 p-20 z-10 text-white animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Join the future
                        <br />
                        of learning.
                    </h1>
                    <ul className="space-y-4 text-xl text-teal-100">
                        <li className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6" /> Track
                            assignments effortlessly
                        </li>
                        <li className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6" /> Visualize your
                            progress
                        </li>
                        <li className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6" /> Master your
                            schedule
                        </li>
                    </ul>
                </div>
            </div>

            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-20 xl:px-24 relative overflow-hidden order-1 h-screen">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl z-0 pointer-events-none"></div>

                <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            StudyHub
                        </span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                            Create a free account
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Start your journey to better grades today
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input pl-9 w-full h-10 text-sm transition-all focus:ring-2 focus:ring-teal-500/20"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-9 w-full h-10 text-sm transition-all focus:ring-2 focus:ring-teal-500/20"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
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
                                        className="input pl-9 pr-8 w-full h-10 text-sm transition-all focus:ring-2 focus:ring-teal-500/20"
                                        placeholder="Password"
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

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                    </div>
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="input pl-9 pr-8 w-full h-10 text-sm transition-all focus:ring-2 focus:ring-teal-500/20"
                                        placeholder="Confirm"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-3 w-3" />
                                        ) : (
                                            <Eye className="h-3 w-3" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="agree-terms"
                                type="checkbox"
                                required
                                className="mt-0.5 h-3.5 w-3.5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="agree-terms"
                                className="ml-2 block text-xs text-gray-600 dark:text-gray-400"
                            >
                                I agree to the{' '}
                                <button
                                    type="button"
                                    className="font-semibold text-teal-600 hover:text-teal-500"
                                >
                                    Terms
                                </button>{' '}
                                and{' '}
                                <button
                                    type="button"
                                    className="font-semibold text-teal-600 hover:text-teal-500"
                                >
                                    Privacy Policy
                                </button>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-2.5 text-sm font-bold bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group border-none text-white h-10"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account{' '}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-teal-600 hover:text-teal-500 transition-colors"
                        >
                            Sign in securely
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
