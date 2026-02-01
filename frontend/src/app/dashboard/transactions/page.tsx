"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CreditCard,
    Package,
    Clock,
    TruckIcon,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { transactionsAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface Transaction {
    id: string;
    amount: number;
    platformFee?: number;
    status: string;
    createdAt: string;
    paidAt?: string;
    listing?: {
        id: string;
        title: string;
        photos: { url: string }[];
    };
    buyer: { id: string; fullName: string };
    seller: { id: string; fullName: string };
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    PENDING: { icon: Clock, color: "text-yellow-400 bg-yellow-500/20", label: "Pending Payment" },
    ESCROWED: { icon: CreditCard, color: "text-primary-400 bg-primary-500/20", label: "Payment Held" },
    SHIPPED: { icon: TruckIcon, color: "text-accent-400 bg-accent-500/20", label: "Shipped" },
    RECEIVED: { icon: Package, color: "text-purple-400 bg-purple-500/20", label: "Received" },
    RELEASED: { icon: CheckCircle2, color: "text-neon-400 bg-neon-500/20", label: "Completed" },
    DISPUTED: { icon: AlertCircle, color: "text-red-400 bg-red-500/20", label: "Disputed" },
    REFUNDED: { icon: CreditCard, color: "text-gray-400 bg-gray-500/20", label: "Refunded" },
    CANCELLED: { icon: AlertCircle, color: "text-gray-400 bg-gray-500/20", label: "Cancelled" },
};

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const { user } = useAuthStore();

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const response = await transactionsAPI.getAll();
            setTransactions(response.data.transactions || []);
        } catch (error) {
            console.error("Failed to load transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter((tx) => {
        if (filter === "all") return true;
        if (filter === "buying") return tx.buyer.id === user?.id;
        if (filter === "selling") return tx.seller.id === user?.id;
        return tx.status === filter;
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
            <div>
                <h1 className="text-2xl font-bold text-white">Transactions</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Track your purchases and sales
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { label: "All", value: "all" },
                    { label: "Buying", value: "buying" },
                    { label: "Selling", value: "selling" },
                    { label: "Pending", value: "PENDING" },
                    { label: "In Progress", value: "ESCROWED" },
                    { label: "Completed", value: "RELEASED" },
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

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No transactions yet
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                        Your purchases and sales will appear here.
                    </p>
                    <Link
                        href="/browse"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Package className="w-4 h-4" />
                        Browse Listings
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTransactions.map((tx) => {
                        const status = statusConfig[tx.status] || statusConfig.PENDING;
                        const StatusIcon = status.icon;
                        const isBuyer = tx.buyer.id === user?.id;

                        return (
                            <Link
                                key={tx.id}
                                href={`/dashboard/transactions/${tx.id}`}
                                className="glass-card p-5 hover:border-white/10 transition-all block"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Image */}
                                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                                        {tx.listing?.photos?.[0] ? (
                                            <img
                                                src={tx.listing.photos[0].url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {isBuyer ? "Buying" : "Selling"}
                                            </span>
                                        </div>

                                        <h3 className="font-semibold text-white mb-1 truncate">
                                            {tx.listing?.title || "Transaction"}
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-bold text-primary-400">
                                                {formatPrice(tx.amount)}
                                            </p>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(tx.createdAt)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-400 mt-1">
                                            {isBuyer ? `Seller: ${tx.seller.fullName}` : `Buyer: ${tx.buyer.fullName}`}
                                        </p>
                                    </div>

                                    <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
