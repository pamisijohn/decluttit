"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import {
    LayoutDashboard,
    Package,
    Search,
    MessageSquare,
    CreditCard,
    Settings,
    LogOut,
    X,
    ShoppingBag,
    Sparkles,
    Shield,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Listings", href: "/dashboard/listings", icon: Package },
    { name: "My Requests", href: "/dashboard/requests", icon: Search },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
];

const secondaryNav = [
    { name: "Browse", href: "/browse", icon: ShoppingBag },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-dark-400/50 backdrop-blur-xl border-r border-white/5 pt-5 pb-4 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center px-6 mb-8">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                                    <span className="text-white font-black text-lg">D</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-500 rounded-full animate-pulse" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                DECLUTTIT
                            </span>
                        </Link>
                    </div>

                    {/* Quick Action */}
                    <div className="px-4 mb-6">
                        <Link
                            href="/dashboard/listings/create"
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow"
                        >
                            <Sparkles className="w-4 h-4" />
                            Create Listing
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 px-3 space-y-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                            Main
                        </div>
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                                            ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${active ? "text-primary-400" : ""}`} />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 mt-6">
                            Other
                        </div>
                        {secondaryNav.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                                            ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${active ? "text-primary-400" : ""}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="px-3 mt-auto">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {user?.fullName || "User"}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-primary-400" />
                                        <span className="text-xs text-gray-400">
                                            {user?.verificationLevel || "Basic"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center justify-center gap-2 w-full py-2 px-3 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
