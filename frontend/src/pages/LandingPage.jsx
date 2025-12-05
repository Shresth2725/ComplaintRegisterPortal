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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    ComplaintPortal
                </div>
                <div className="space-x-4 flex items-center">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg shadow-purple-500/30">
                                Go to Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg shadow-purple-500/30">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    Voice Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Concerns</span>
                    <br />
                    Get Them <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Resolved</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
                    A seamless platform to register complaints, track their status, and ensure your voice is heard by the right authorities. Fast, transparent, and secure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    {isLoggedIn ? (
                        <Link to="/dashboard" className="px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-xl">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/signup" className="px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-xl">
                                Register Complaint
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-transform transform hover:scale-105 backdrop-blur-sm">
                                Track Status
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-white/10">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 text-2xl">
                                🚀
                            </div>
                            <h3 className="text-xl font-bold mb-3">Quick Registration</h3>
                            <p className="text-gray-400">
                                File your complaints in seconds with our intuitive and user-friendly interface. No complex forms.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all hover:bg-white/10">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-2xl">
                                👁️
                            </div>
                            <h3 className="text-xl font-bold mb-3">Real-time Tracking</h3>
                            <p className="text-gray-400">
                                Stay updated with real-time status changes. Know exactly when your complaint is being processed.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all hover:bg-white/10">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6 text-2xl">
                                🔒
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                            <p className="text-gray-400">
                                Your data is encrypted and secure. We prioritize your privacy and ensure confidential handling.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Complaint Register Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
