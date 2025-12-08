import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setIsLoggedIn(false);
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans flex flex-col transition-colors">
            {/* Navbar */}
            <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                ComplaintPortal
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/dashboard" className="text-slate-600 hover:text-blue-700 font-medium px-3 py-2 rounded-md transition-colors">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-md font-medium transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium px-3 py-2 rounded-md transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-colors">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-white dark:bg-slate-900 flex-grow flex items-center justify-center transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                        Institutional <span className="text-blue-700 dark:text-blue-500">Complaint Resolution</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        A dedicated platform for students and staff to voice concerns, track progress, and ensure a transparent resolution process.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        {isLoggedIn ? (
                            <Link to="/dashboard" className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 transition-colors">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 transition-colors">
                                    File a Complaint
                                </Link>
                                <Link to="/login" className="px-8 py-3 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 border border-blue-700 dark:border-blue-500 font-semibold rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Track Status
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How It Works</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Simple, transparent, and effective complaint management.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center justify-center mb-6 text-xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Register Complaint</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Submit your concern with necessary details. Our system ensures it reaches the right department immediately.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center justify-center mb-6 text-xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Track Progress</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Monitor the status of your complaint in real-time. Receive updates as administrators review and act on it.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center justify-center mb-6 text-xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Resolution</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Get a timely resolution. We prioritize transparency and fairness in addressing all registered issues.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-black text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; {new Date().getFullYear()} Complaint Register Portal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
