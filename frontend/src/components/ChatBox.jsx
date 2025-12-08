import { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, onSendMessage, currentUserId }) => {
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            onSendMessage(inputMessage.trim());
            setInputMessage("");
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Double tick icon for "has seen"
    const SeenTicks = ({ hasSeen }) => (
        <span className={`ml-1 ${hasSeen ? "text-blue-400" : "text-gray-400"}`}>
            ✓✓
        </span>
    );

    return (
        <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwnMessage = msg.fromUser._id === currentUserId;
                        const senderName = msg.fromUser.isAdmin ? "Admin" : msg.fromUser.fullName;

                        return (
                            <div
                                key={msg._id || index}
                                className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
                            >
                                {/* Sender name */}
                                <span className={`text-xs mb-1 ${isOwnMessage ? "text-purple-300" : "text-gray-400"}`}>
                                    {isOwnMessage ? "You" : senderName}
                                </span>

                                {/* Message bubble */}
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${isOwnMessage
                                            ? "bg-purple-600 text-white rounded-br-sm"
                                            : "bg-white/10 text-gray-200 rounded-bl-sm"
                                        }`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                    <div
                                        className={`flex items-center gap-1 mt-1 ${isOwnMessage ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <span className="text-xs opacity-70">
                                            {formatTime(msg.createdAt)}
                                        </span>
                                        {/* Show double ticks only for own messages */}
                                        {isOwnMessage && <SeenTicks hasSeen={msg.hasSeen} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form
                onSubmit={handleSubmit}
                className="border-t border-white/10 p-4 flex gap-3"
            >
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
