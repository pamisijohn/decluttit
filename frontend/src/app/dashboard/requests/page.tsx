"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Clock,
    Tag,
    MapPin,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { requestsAPI } from "@/lib/api";

interface BuyerRequest {
    id: string;
    title: string;
    description?: string;
    minPrice?: number;
    maxPrice?: number;
    preferredCondition?: string;
    status: "ACTIVE" | "MATCHED" | "EXPIRED" | "CANCELLED";
    radiusKm: number;
    expiresAt?: string;
    createdAt: string;
    category?: { name: string };
    location?: { state: string; lga: string };
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<BuyerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const response = await requestsAPI.getMyRequests();
            setRequests(response.data.requests || []);
        } catch (error) {
            console.error("Failed to load requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        ACTIVE: "bg-neon-500/20 text-neon-400 border-neon-500/30",
        MATCHED: "bg-primary-500/20 text-primary-400 border-primary-500/30",
        EXPIRED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const filteredRequests = requests.filter((req) => {
        if (filter === "all") return true;
        return req.status === filter;
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
        });
    };

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Requests</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Tell sellers what you're looking for
                    </p>
                </div>
                <Link
                    href="/dashboard/requests/create"
                    className="btn-primary flex items-center gap-2 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    New Request
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { label: "All", value: "all" },
                    { label: "Active", value: "ACTIVE" },
                    { label: "Matched", value: "MATCHED" },
                    { label: "Expired", value: "EXPIRED" },
                ].map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setFilter(item.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === item.value
                                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Search className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No requests yet
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                        Let sellers know what you're looking for and get matched instantly!
                    </p>
                    <Link
                        href="/dashboard/requests/create"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Your First Request
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className="glass-card p-5 hover:border-white/10 transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[request.status]
                                                }`}
                                        >
                                            {request.status}
                                        </span>
                                        {request.category && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Tag className="w-3 h-3" />
                                                {request.category.name}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {request.title}
                                    </h3>

                                    {request.description && (
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                            {request.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                        {(request.minPrice || request.maxPrice) && (
                                            <span className="text-primary-400 font-medium">
                                                {request.minPrice && request.maxPrice
                                                    ? `${formatPrice(request.minPrice)} - ${formatPrice(request.maxPrice)}`
                                                    : request.minPrice
                                                        ? `Min: ${formatPrice(request.minPrice)}`
                                                        : `Max: ${formatPrice(request.maxPrice!)}`}
                                            </span>
                                        )}
                                        {request.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {request.location.lga}, {request.location.state}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatDate(request.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={`/dashboard/requests/${request.id}`}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    View
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
