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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Technical Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear_gradient(to_right,#80808012_1px,transparent_1px),linear_gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed w-full z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">C</div>
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
                                        className="text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hidden sm:block text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium px-3 py-2 text-sm transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="text-sm bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-8 animate-fade-in-up">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                    Live System v2.0
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                                Resolve with <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                                        Authority
                                    </span>
                                    <span className="absolute bottom-2 left-0 w-full h-4 bg-blue-200/50 dark:bg-blue-800/50 -z-0 rotate-[-1deg]"></span>
                                </span>
                            </h1>

                            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                                The institutional standard for grievance redressal.
                                Secure, transparent, and direct access to administration.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {isLoggedIn ? (
                                    <Link to="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02]">
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02]">
                                            File Complaint
                                        </Link>
                                        <Link to="/login" className="px-8 py-4 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all hover:scale-[1.02]">
                                            Check Status
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Visual Content (Mockup) */}
                        <div className="flex-1 w-full relative perspective-1000 hidden md:block">
                            {/* Floating Elements */}
                            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/30 rounded-full blur-[80px] -z-10 animate-pulse"></div>
                            <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] -z-10"></div>

                            <div className="relative transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-y-[-5deg] hover:rotate-x-[0deg] transition-transform duration-500 ease-out preserve-3d">
                                {/* Glass Card Mockup */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                            <div>
                                                <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                                                <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">Resolved</div>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        <div className="h-2.5 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        <div className="h-2.5 w-4/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-20 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                        <div className="h-20 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -right-8 -bottom-8 bg-blue-600 text-white p-4 rounded-xl shadow-lg animate-bounce">
                                    <div className="font-bold text-lg">24h</div>
                                    <div className="text-xs opacity-90">Avg. Resolution</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bento Grid Features */}
            <section className="relative z-10 py-24 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Platform Capabilities</h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">Everything you need to manage grievances effectively.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        {/* Feature 1: Large Span */}
                        <div className="md:col-span-4 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Military-Grade Encryption</h3>
                            <p className="text-slate-600 dark:text-slate-400">All complaint data is encrypted at rest and in transit. Your identity and grievance details are protected by advanced security protocols ensuring complete confidentiality.</p>
                        </div>

                        {/* Feature 2: Tall */}
                        <div className="md:col-span-2 md:row-span-2 p-8 rounded-3xl bg-blue-600 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-white">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
                                    <p className="text-blue-100">Instant notifications via email and dashboard as your complaint moves through stages.</p>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/20">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-bold">3x</span>
                                        <span className="text-sm opacity-90">Faster Resolution</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Admin Direct</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Escalate directly to verificed administrators for urgent grievances.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Visual insights on resolution times and category breakdown.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-slate-900 font-bold text-xs">C</div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">ComplaintPortal &copy; 2025</p>
                    </div>
                    <div className="flex gap-8 text-sm font-medium">
                        <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
                        <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
