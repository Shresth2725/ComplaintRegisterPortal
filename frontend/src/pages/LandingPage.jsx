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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-400/10 blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="fixed w-full z-50 transition-all duration-300 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Complaint<span className="text-blue-600 dark:text-blue-500">Portal</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-4">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/dashboard" className="hidden sm:block text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium px-3 py-2 text-sm transition-colors">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hidden sm:block text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium px-3 py-2 text-sm transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none">
                        {/* Subtle grid pattern could go here if we had SVG assets, using CSS border instead for technical feel */}
                        <div className="w-full h-full border border-slate-200 dark:border-slate-800 rounded-3xl transform rotate-3 scale-110" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            System Operational
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 max-w-4xl mx-auto leading-tight">
                        Resolve Conflicts with <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200">
                            Unmatched Transparency
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                        An institutional-grade platform designed to streamline grievance redressal.
                        We bridge the gap between administrators and students with a focus on speed and accountability.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                        {isLoggedIn ? (
                            <Link to="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                                Access Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                                    File a Complaint
                                </Link>
                                <Link to="/login" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1">
                                    Track Existing Status
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="relative z-10 py-24 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                title: "Encrypted Submission",
                                desc: "Your complaints are securely logged and protected with industry-standard encryption protocols.",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                )
                            },
                            {
                                title: "Real-time Tracking",
                                desc: "Monitor resolution progress via a dedicated dashboard with live status updates and timestamps.",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )
                            },
                            {
                                title: "Admin Resolution",
                                desc: "Direct channel to verified administrators ensuring your concerns reach the right authority.",
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} ComplaintPortal. System v1.0.0
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-sm transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-sm transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-sm transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
