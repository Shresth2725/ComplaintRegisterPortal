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
        <span className={`ml-1 ${hasSeen ? "text-blue-300" : "text-white/70"}`}>
            ✓✓
        </span>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
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
                                <span className={`text-xs mb-1 font-medium ${isOwnMessage ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                                    {isOwnMessage ? "You" : senderName}
                                </span>

                                {/* Message bubble */}
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${isOwnMessage
                                        ? "bg-blue-600 text-white rounded-br-sm"
                                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm"
                                        }`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                    <div
                                        className={`flex items-center gap-1 mt-1 ${isOwnMessage ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <span className={`text-[10px] ${isOwnMessage ? "text-blue-100/80" : "text-slate-400"}`}>
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
                className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex gap-3 transition-colors"
            >
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors shadow-sm"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
