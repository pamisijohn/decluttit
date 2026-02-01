"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    MessageSquare,
    Search,
    Loader2,
    Circle,
    ChevronRight,
} from "lucide-react";
import { chatAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface Conversation {
    id: string;
    lastMessageAt: string;
    buyer: { id: string; fullName: string; profilePhotoUrl?: string };
    seller: { id: string; fullName: string; profilePhotoUrl?: string };
    messages: { content: string; createdAt: string; senderId: string }[];
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuthStore();

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const response = await chatAPI.getConversations();
            setConversations(response.data.conversations || []);
        } catch (error) {
            console.error("Failed to load conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
        } else if (days === 1) {
            return "Yesterday";
        } else if (days < 7) {
            return date.toLocaleDateString("en-NG", { weekday: "short" });
        } else {
            return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
        }
    };

    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery) return true;
        const otherUser = conv.buyer.id === user?.id ? conv.seller : conv.buyer;
        return otherUser.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Chat with buyers and sellers
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
            </div>

            {/* Conversations List */}
            {filteredConversations.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No messages yet
                    </h3>
                    <p className="text-gray-400 max-w-sm mx-auto">
                        When you start a transaction, you'll be able to chat with the other party here.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredConversations.map((conv) => {
                        const otherUser = conv.buyer.id === user?.id ? conv.seller : conv.buyer;
                        const lastMessage = conv.messages[0];
                        const isMyMessage = lastMessage?.senderId === user?.id;

                        return (
                            <Link
                                key={conv.id}
                                href={`/dashboard/messages/${conv.id}`}
                                className="flex items-center gap-4 p-4 glass-card hover:border-white/10 transition-all"
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center">
                                        {otherUser.profilePhotoUrl ? (
                                            <img
                                                src={otherUser.profilePhotoUrl}
                                                alt=""
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-bold text-lg">
                                                {otherUser.fullName.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    {/* Online indicator - demo */}
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-neon-500 border-2 border-dark-400 rounded-full" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-white truncate">
                                            {otherUser.fullName}
                                        </h3>
                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                            {formatTime(conv.lastMessageAt)}
                                        </span>
                                    </div>
                                    {lastMessage && (
                                        <p className="text-sm text-gray-400 truncate">
                                            {isMyMessage && <span className="text-gray-500">You: </span>}
                                            {lastMessage.content}
                                        </p>
                                    )}
                                </div>

                                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
