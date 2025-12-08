import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import socket, { connectSocket, disconnectSocket } from "../utils/socket";
import ChatBox from "../components/ChatBox";

const ComplaintChat = () => {
    const { complaintId } = useParams();
    const [messages, setMessages] = useState([]);
    const [complaint, setComplaint] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch complaint and current user info
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get complaint data
                const complaintRes = await API.get(`/complaint/get-complaint-data/${complaintId}`);
                setComplaint(complaintRes.data.complaint);

                // Get current user data
                const userRes = await API.get("/auth/check-auth");
                setCurrentUser(userRes.data.user);

                // Fetch chat history
                const messagesRes = await API.get(`/messages/${complaintId}`);
                setMessages(messagesRes.data.messages || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load chat data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [complaintId]);

    // Setup socket connection
    useEffect(() => {
        if (!currentUser || !complaintId) return;

        // Connect socket
        connectSocket();

        // Join complaint room
        socket.emit("joinComplaint", complaintId);

        // Mark messages as seen when joining
        socket.emit("markSeen", { complaintId });

        // Listen for new messages
        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
            // Mark as seen immediately if we receive a new message while in chat
            socket.emit("markSeen", { complaintId });
        });

        // Listen for messages being seen
        socket.on("messagesSeen", ({ seenBy }) => {
            // Update hasSeen for messages we sent to the user who just saw them
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.fromUser._id === currentUser._id && msg.toUser?._id === seenBy
                        ? { ...msg, hasSeen: true }
                        : msg
                )
            );
        });

        // Cleanup on unmount
        return () => {
            socket.off("newMessage");
            socket.off("messagesSeen");
            disconnectSocket();
        };
    }, [currentUser, complaintId]);

    const handleSendMessage = (message) => {
        if (!complaint || !currentUser) return;

        // Determine recipient
        const toUser = currentUser.isAdmin ? complaint.user._id : complaint.user._id;

        socket.emit("sendMessage", {
            complaintId,
            toUser,
            message,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">Loading chat...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col transition-colors">
            {/* Header */}
            <div className="mb-4">
                <Link
                    to={currentUser?.isAdmin ? `/admin/complaint-overview/${complaintId}` : `/complaint-overview/${complaintId}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium text-lg transition-colors"
                >
                    ← View Complaint
                </Link>
                <h1 className="text-2xl mt-2 font-bold text-slate-900 dark:text-white">
                    Chat - {complaint?.description?.slice(0, 50)}...
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {currentUser?.isAdmin ? "Chatting with User" : "Chatting with Admin"}
                </p>
            </div>

            {/* Chat Box */}
            <div className="flex-1 min-h-0">
                <div className="h-[calc(100vh-200px)]">
                    <ChatBox
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        currentUserId={currentUser?._id}
                    />
                </div>
            </div>
        </div>
    );
};

export default ComplaintChat;
