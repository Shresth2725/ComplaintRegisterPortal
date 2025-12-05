import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // New Complaint Form State
    const [formData, setFormData] = useState({
        description: '',
        city: '',
        state: '',
        landmark: '',
        latitude: '',
        longitude: '',
        image: null
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile Form State
    const [profileData, setProfileData] = useState({
        fullName: '',
        address: '',
        profilePic: null,
        previewUrl: null
    });

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setProfileData({
                fullName: parsedUser.fullName || '',
                address: parsedUser.address || '',
                profilePic: null,
                previewUrl: parsedUser.profilePic || null
            });
        } else {
            // navigate('/login'); // Uncomment to enforce login
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await API.get('/complaint/get-complaints');
            if (res.data.success) {
                setComplaints(res.data.complaints);
            }
        } catch (err) {
            console.error("Failed to fetch complaints", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleProfileFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData({
                ...profileData,
                profilePic: file,
                previewUrl: URL.createObjectURL(file)
            });
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('fullName', profileData.fullName);
        data.append('address', profileData.address);
        if (profileData.profilePic) {
            data.append('profilePic', profileData.profilePic);
        }

        try {
            const res = await API.post('/auth/update', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                const updatedUser = res.data.user;
                setUser(updatedUser);
                localStorage.setItem('userData', JSON.stringify(updatedUser));
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    });
                    setMessage({ type: 'success', text: 'Location fetched successfully!' });
                },
                (error) => {
                    setMessage({ type: 'error', text: 'Unable to retrieve your location' });
                }
            );
        } else {
            setMessage({ type: 'error', text: 'Geolocation is not supported by your browser' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('description', formData.description);
        data.append('city', formData.city);
        data.append('state', formData.state);
        data.append('landmark', formData.landmark);
        data.append('latitude', formData.latitude);
        data.append('longitude', formData.longitude);
        if (formData.image) {
            data.append('imageUrl', formData.image);
        }

        try {
            const res = await API.post('/complaint/create-complaint', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Complaint registered successfully!' });
                setFormData({
                    description: '',
                    city: '',
                    state: '',
                    landmark: '',
                    latitude: '',
                    longitude: '',
                    image: null
                });
                fetchComplaints(); // Refresh list
                setActiveTab('my-complaints');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to register complaint' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const renderOverview = () => {
        const total = complaints.length;
        const resolved = complaints.filter(c => c.status === 'resolved').length;
        const pending = complaints.filter(c => c.status !== 'resolved').length;

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Complaints</h3>
                    <p className="text-4xl font-bold text-white mt-2">{total}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-green-400 text-sm font-medium uppercase tracking-wider">Resolved</h3>
                    <p className="text-4xl font-bold text-white mt-2">{resolved}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-yellow-400 text-sm font-medium uppercase tracking-wider">Pending</h3>
                    <p className="text-4xl font-bold text-white mt-2">{pending}</p>
                </div>
            </div>
        );
    };

    const renderMyComplaints = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">My Complaints</h2>
            {loading ? (
                <p className="text-gray-400">Loading complaints...</p>
            ) : complaints.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400">No complaints found. Start by creating one!</p>
                    <button
                        onClick={() => setActiveTab('new-complaint')}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Create New Complaint
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.status === 'resolved' ? 'bg-green-500/20 text-green-300' :
                                            complaint.status === 'in progress' ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                            {complaint.status.toUpperCase()}
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{complaint.description}</h3>
                                    <p className="text-gray-400 text-sm mb-2">
                                        📍 {complaint.landmark}, {complaint.city}, {complaint.state}
                                    </p>
                                </div>
                                {complaint.imageUrl && (
                                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                                        <img
                                            src={complaint.imageUrl}
                                            alt="Complaint"
                                            className="w-full h-full object-cover rounded-lg border border-white/10"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderNewComplaint = () => (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Register New Complaint</h2>

            {message.text && activeTab === 'new-complaint' && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/30' :
                    'bg-red-500/20 text-red-200 border border-red-500/30'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Describe your issue in detail..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Landmark</label>
                    <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Latitude</label>
                        <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-not-allowed opacity-70"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Longitude</label>
                        <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-not-allowed opacity-70"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={getLocation}
                    className="w-full py-2 px-4 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2"
                >
                    📍 Get Current Location
                </button>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Evidence Image</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitLoading ? 'Submitting...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );

    const renderProfile = () => (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

            {message.text && activeTab === 'profile' && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/30' :
                    'bg-red-500/20 text-red-200 border border-red-500/30'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-3xl overflow-hidden mb-4 border-2 border-purple-500/50">
                        {profileData.previewUrl ? (
                            <img src={profileData.previewUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.fullName?.charAt(0) || 'U'
                        )}
                    </div>
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        Change Photo
                        <input
                            type="file"
                            onChange={handleProfileFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileInputChange}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Address</label>
                    <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileInputChange}
                        required
                        rows="3"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Dashboard
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        📊 Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('my-complaints')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'my-complaints' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        📝 My Complaints
                    </button>
                    <button
                        onClick={() => setActiveTab('new-complaint')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'new-complaint' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        ➕ New Complaint
                    </button>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full mb-4 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                        🚪 Logout
                    </button>
                    <div
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'profile' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold overflow-hidden">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.fullName?.charAt(0) || 'U'
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20">
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <h1 className="text-sm font-bold text-white">Dashboard</h1>
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab('overview')} className="p-2 text-gray-400 hover:text-white">📊</button>
                        <button onClick={() => setActiveTab('my-complaints')} className="p-2 text-gray-400 hover:text-white">📝</button>
                        <button onClick={() => setActiveTab('new-complaint')} className="p-2 text-gray-400 hover:text-white">➕</button>
                        <button onClick={() => setActiveTab('profile')} className="p-2 text-gray-400 hover:text-white">👤</button>
                    </div>
                </div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'my-complaints' && renderMyComplaints()}
                    {activeTab === 'new-complaint' && renderNewComplaint()}
                    {activeTab === 'profile' && renderProfile()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
