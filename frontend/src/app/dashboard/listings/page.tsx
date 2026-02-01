"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Package,
    Eye,
    Edit2,
    Trash2,
    MoreVertical,
    Search,
    Filter,
    Loader2,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";

interface Listing {
    id: string;
    title: string;
    price: number;
    status: "ACTIVE" | "PENDING" | "SOLD" | "HIDDEN";
    condition: string;
    viewCount: number;
    createdAt: string;
    photos: { url: string }[];
    category?: { name: string };
}

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        try {
            const response = await listingsAPI.getMyListings();
            setListings(response.data.listings || []);
        } catch (error) {
            console.error("Failed to load listings:", error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        ACTIVE: "bg-neon-500/20 text-neon-400 border-neon-500/30",
        PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        SOLD: "bg-primary-500/20 text-primary-400 border-primary-500/30",
        HIDDEN: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    const filteredListings = listings.filter((listing) => {
        if (filter === "all") return true;
        return listing.status === filter;
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
            year: "numeric",
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
                    <h1 className="text-2xl font-bold text-white">My Listings</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage your items for sale
                    </p>
                </div>
                <Link
                    href="/dashboard/listings/create"
                    className="btn-primary flex items-center gap-2 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    New Listing
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { label: "All", value: "all" },
                    { label: "Active", value: "ACTIVE" },
                    { label: "Pending", value: "PENDING" },
                    { label: "Sold", value: "SOLD" },
                    { label: "Hidden", value: "HIDDEN" },
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

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No listings yet
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                        Start selling by creating your first listing. It only takes a minute!
                    </p>
                    <Link
                        href="/dashboard/listings/create"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredListings.map((listing) => (
                        <div
                            key={listing.id}
                            className="glass-card overflow-hidden group hover:border-white/10 transition-all"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] bg-white/5">
                                {listing.photos?.[0] ? (
                                    <img
                                        src={listing.photos[0].url}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-12 h-12 text-gray-600" />
                                    </div>
                                )}
                                {/* Status badge */}
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[listing.status]
                                            }`}
                                    >
                                        {listing.status}
                                    </span>
                                </div>
                                {/* Quick actions */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-1">
                                        <Link
                                            href={`/dashboard/listings/${listing.id}`}
                                            className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-white mb-1 truncate">
                                    {listing.title}
                                </h3>
                                <p className="text-lg font-bold text-primary-400 mb-2">
                                    {formatPrice(listing.price)}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {listing.viewCount} views
                                    </span>
                                    <span>{formatDate(listing.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
