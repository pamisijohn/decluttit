"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Package,
    MapPin,
    Star,
    Shield,
    ChevronDown,
    Loader2,
    X,
    SlidersHorizontal,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";

interface Listing {
    id: string;
    title: string;
    price: number;
    condition: string;
    isNegotiable: boolean;
    viewCount: number;
    createdAt: string;
    photos: { url: string }[];
    category?: { name: string };
    location?: { state: string; lga: string };
    seller: {
        id: string;
        fullName: string;
        trustScore: number;
        verificationLevel: string;
    };
}

const categories = [
    { id: "", name: "All Categories" },
    { id: "cat-1", name: "Electronics" },
    { id: "cat-2", name: "Fashion" },
    { id: "cat-3", name: "Furniture" },
    { id: "cat-4", name: "Vehicles" },
    { id: "cat-5", name: "Real Estate" },
];

const conditions = [
    { value: "", label: "Any Condition" },
    { value: "NEW", label: "Brand New" },
    { value: "LIKE_NEW", label: "Like New" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" },
];

export default function BrowsePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        condition: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    useEffect(() => {
        loadListings();
    }, [filters]);

    const loadListings = async () => {
        try {
            setLoading(true);
            const params: any = {
                ...filters,
                search: searchQuery || undefined,
            };
            // Clean undefined values
            Object.keys(params).forEach(key => !params[key] && delete params[key]);

            const response = await listingsAPI.getAll(params);
            setListings(response.data.listings || []);
        } catch (error) {
            console.error("Failed to load listings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadListings();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const conditionColors: Record<string, string> = {
        NEW: "bg-neon-500/20 text-neon-400",
        LIKE_NEW: "bg-primary-500/20 text-primary-400",
        GOOD: "bg-accent-500/20 text-accent-400",
        FAIR: "bg-yellow-500/20 text-yellow-400",
        POOR: "bg-gray-500/20 text-gray-400",
    };

    return (
        <div className="min-h-screen bg-dark-500 mesh-bg">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-dark-400/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black">D</span>
                            </div>
                        </Link>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for anything..."
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                />
                            </div>
                        </form>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-3 rounded-xl border transition-all ${showFilters
                                    ? "bg-primary-500/20 border-primary-500/30 text-primary-400"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>

                        <Link
                            href="/login"
                            className="btn-primary hidden sm:inline-flex"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 animate-fade-in">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="input-field"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Condition</label>
                                    <select
                                        value={filters.condition}
                                        onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                                        className="input-field"
                                    >
                                        {conditions.map((cond) => (
                                            <option key={cond.value} value={cond.value}>{cond.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Min Price</label>
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                        placeholder="₦0"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Max Price</label>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                        placeholder="No limit"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setFilters({ category: "", condition: "", minPrice: "", maxPrice: "", sortBy: "createdAt", sortOrder: "desc" })}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Clear filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                            <Package className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            No listings found
                        </h3>
                        <p className="text-gray-400">
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {listings.map((listing) => (
                            <Link
                                key={listing.id}
                                href={`/listings/${listing.id}`}
                                className="glass-card overflow-hidden group hover:border-white/10 transition-all"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] bg-white/5">
                                    {listing.photos?.[0] ? (
                                        <img
                                            src={listing.photos[0].url}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-600" />
                                        </div>
                                    )}
                                    {/* Condition badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${conditionColors[listing.condition] || conditionColors.GOOD}`}>
                                            {listing.condition.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-primary-400 transition-colors">
                                        {listing.title}
                                    </h3>
                                    <p className="text-xl font-bold text-primary-400 mb-2">
                                        {formatPrice(listing.price)}
                                        {listing.isNegotiable && (
                                            <span className="text-xs text-gray-500 font-normal ml-2">Negotiable</span>
                                        )}
                                    </p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-gray-400">
                                            {listing.location && (
                                                <>
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate max-w-[100px]">{listing.location.lga}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {listing.seller.verificationLevel !== "BASIC" && (
                                                <Shield className="w-3 h-3 text-primary-400" />
                                            )}
                                            <span className="text-gray-500 text-xs">
                                                {listing.seller.fullName.split(" ")[0]}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
