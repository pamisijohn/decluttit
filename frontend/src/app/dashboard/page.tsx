"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import {
    Package,
    Search,
    MessageSquare,
    CreditCard,
    TrendingUp,
    Eye,
    Plus,
    ArrowRight,
    Sparkles,
    ShoppingBag,
    Clock,
    CheckCircle2,
} from "lucide-react";

// Stat card component
function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    color,
}: {
    icon: any;
    label: string;
    value: string | number;
    trend?: string;
    color: string;
}) {
    return (
        <div className="glass-card p-5 group hover:border-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-xs text-neon-400 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}

// Quick action button
function QuickAction({
    icon: Icon,
    label,
    href,
    color,
}: {
    icon: any;
    label: string;
    href: string;
    color: string;
}) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-3 p-5 glass-card hover:border-white/10 transition-all duration-300 group"
        >
            <div className={`p-4 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {label}
            </span>
        </Link>
    );
}

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [greeting, setGreeting] = useState("Hello");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    // Demo data - replace with actual API calls
    const stats = {
        activeListings: 5,
        activeRequests: 3,
        pendingTransactions: 2,
        totalViews: 234,
        unreadMessages: 4,
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">
                        {greeting}, {user?.fullName?.split(" ")[0] || "there"}! 👋
                    </h1>
                    <p className="text-gray-400">
                        Here&apos;s what&apos;s happening with your marketplace today.
                    </p>
                </div>
                <Link
                    href="/dashboard/listings/create"
                    className="btn-primary flex items-center gap-2 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    Create Listing
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Package}
                    label="Active Listings"
                    value={stats.activeListings}
                    color="bg-gradient-to-br from-primary-500 to-primary-600"
                />
                <StatCard
                    icon={Search}
                    label="Active Requests"
                    value={stats.activeRequests}
                    color="bg-gradient-to-br from-accent-500 to-accent-600"
                />
                <StatCard
                    icon={CreditCard}
                    label="Pending Transactions"
                    value={stats.pendingTransactions}
                    trend="+2"
                    color="bg-gradient-to-br from-neon-500 to-neon-600"
                />
                <StatCard
                    icon={Eye}
                    label="Total Views"
                    value={stats.totalViews}
                    trend="+18%"
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickAction
                        icon={Plus}
                        label="New Listing"
                        href="/dashboard/listings/create"
                        color="bg-gradient-to-br from-primary-500 to-primary-600"
                    />
                    <QuickAction
                        icon={Search}
                        label="New Request"
                        href="/dashboard/requests/create"
                        color="bg-gradient-to-br from-accent-500 to-accent-600"
                    />
                    <QuickAction
                        icon={ShoppingBag}
                        label="Browse Items"
                        href="/browse"
                        color="bg-gradient-to-br from-neon-500 to-neon-600"
                    />
                    <QuickAction
                        icon={MessageSquare}
                        label="Messages"
                        href="/dashboard/messages"
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                </div>
            </div>

            {/* Recent Activity & Pending Actions */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Listings */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Your Listings</h3>
                        <Link
                            href="/dashboard/listings"
                            className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {/* Empty state */}
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 mb-4">No listings yet</p>
                            <Link
                                href="/dashboard/listings/create"
                                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium"
                            >
                                <Sparkles className="w-4 h-4" />
                                Create your first listing
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Pending Transactions */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Pending Actions</h3>
                        <Link
                            href="/dashboard/transactions"
                            className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {/* Empty state */}
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 mb-2">All caught up!</p>
                            <p className="text-sm text-gray-500">No pending actions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="glass-card p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-primary-500/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-500/20 rounded-xl">
                        <Sparkles className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                            Pro Tip: Complete your profile 💡
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                            Users with complete profiles get 3x more responses. Add a profile photo
                            and verify your phone number to build trust.
                        </p>
                        <Link
                            href="/dashboard/settings"
                            className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                        >
                            Complete your profile →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
