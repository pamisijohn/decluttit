"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import {
    Bell,
    Menu,
    X,
    Search,
    LayoutDashboard,
    Package,
    MessageSquare,
    CreditCard,
    Settings,
    LogOut,
    ShoppingBag,
    Sparkles,
    Shield,
} from "lucide-react";

const mobileNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Listings", href: "/dashboard/listings", icon: Package },
    { name: "Requests", href: "/dashboard/requests", icon: Search },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
    { name: "Browse", href: "/browse", icon: ShoppingBag },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Dashboard";
        if (pathname.includes("/listings/create")) return "Create Listing";
        if (pathname.includes("/listings")) return "My Listings";
        if (pathname.includes("/requests/create")) return "Create Request";
        if (pathname.includes("/requests")) return "My Requests";
        if (pathname.includes("/messages")) return "Messages";
        if (pathname.includes("/transactions")) return "Transactions";
        if (pathname.includes("/settings")) return "Settings";
        return "Dashboard";
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-dark-400/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Page title */}
                    <h1 className="text-xl font-bold text-white lg:block">
                        {getPageTitle()}
                    </h1>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Search (desktop) */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
                        </button>

                        {/* User avatar (desktop) */}
                        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-white/10">
                            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu panel */}
                    <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-dark-400 shadow-xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-black text-lg">D</span>
                                </div>
                                <span className="text-xl font-bold text-white">DECLUTTIT</span>
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-white rounded-xl"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Create button */}
                        <div className="p-4">
                            <Link
                                href="/dashboard/listings/create"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl"
                            >
                                <Sparkles className="w-4 h-4" />
                                Create Listing
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                            {mobileNav.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
                      ${active
                                                ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }
                    `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User section */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-white">{user?.fullName || "User"}</p>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-primary-400" />
                                        <span className="text-xs text-gray-400">{user?.verificationLevel || "Basic"}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                className="flex items-center justify-center gap-2 w-full py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
