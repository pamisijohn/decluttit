"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
    ArrowLeft,
    Loader2,
    Search,
    DollarSign,
    MapPin,
    Tag,
    Clock,
    Sparkles,
} from "lucide-react";
import { requestsAPI } from "@/lib/api";

const requestSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    minPrice: z.number().positive().optional().or(z.literal("")),
    maxPrice: z.number().positive().optional().or(z.literal("")),
    preferredCondition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]).optional(),
    locationId: z.string().optional(),
    radiusKm: z.number().min(1).max(500).default(50),
});

type RequestForm = z.infer<typeof requestSchema>;

// Demo data - replace with API calls
const categories = [
    { id: "cat-1", name: "Electronics" },
    { id: "cat-2", name: "Fashion" },
    { id: "cat-3", name: "Furniture" },
    { id: "cat-4", name: "Vehicles" },
    { id: "cat-5", name: "Real Estate" },
    { id: "cat-6", name: "Services" },
];

const locations = [
    { id: "loc-1", state: "Lagos", lga: "Lagos Island" },
    { id: "loc-2", state: "Lagos", lga: "Victoria Island" },
    { id: "loc-3", state: "Abuja", lga: "Garki" },
    { id: "loc-4", state: "Rivers", lga: "Port Harcourt" },
    { id: "loc-5", state: "Oyo", lga: "Ibadan North" },
];

const conditions = [
    { value: "NEW", label: "Brand New" },
    { value: "LIKE_NEW", label: "Like New" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" },
    { value: "POOR", label: "Any Condition" },
];

export default function CreateRequestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RequestForm>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            radiusKm: 50,
        },
    });

    const selectedCondition = watch("preferredCondition");
    const radiusKm = watch("radiusKm");

    const onSubmit = async (data: RequestForm) => {
        setLoading(true);
        setError("");
        try {
            const submitData = {
                ...data,
                minPrice: data.minPrice ? Number(data.minPrice) : undefined,
                maxPrice: data.maxPrice ? Number(data.maxPrice) : undefined,
            };
            await requestsAPI.create(submitData);
            router.push("/dashboard/requests");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/requests"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to requests
                </Link>
                <h1 className="text-2xl font-bold text-white">Create Buyer Request</h1>
                <p className="text-gray-400 mt-1">
                    Tell sellers what you're looking for and get matched
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* What are you looking for */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-primary-400" />
                        What are you looking for?
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                {...register("title")}
                                placeholder="e.g., Looking for iPhone 14 Pro"
                                className="input-field"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                placeholder="Describe what you're looking for in detail..."
                                rows={4}
                                className="input-field resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category
                            </label>
                            <select {...register("categoryId")} className="input-field">
                                <option value="">Any category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Condition Preference */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary-400" />
                        Preferred Condition
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {conditions.map((cond) => (
                            <label
                                key={cond.value}
                                className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${selectedCondition === cond.value
                                        ? "bg-primary-500/20 border-primary-500/30 text-primary-400"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                    } border`}
                            >
                                <input
                                    type="radio"
                                    {...register("preferredCondition")}
                                    value={cond.value}
                                    className="hidden"
                                />
                                {cond.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Budget */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary-400" />
                        Budget Range
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Minimum (₦)
                            </label>
                            <input
                                type="number"
                                {...register("minPrice", { valueAsNumber: true })}
                                placeholder="0"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Maximum (₦)
                            </label>
                            <input
                                type="number"
                                {...register("maxPrice", { valueAsNumber: true })}
                                placeholder="No limit"
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-400" />
                        Location Preference
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Preferred Area
                            </label>
                            <select {...register("locationId")} className="input-field">
                                <option value="">Anywhere in Nigeria</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.lga}, {loc.state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Search Radius: {radiusKm}km
                            </label>
                            <input
                                type="range"
                                {...register("radiusKm", { valueAsNumber: true })}
                                min="5"
                                max="500"
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-primary"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>5km</span>
                                <span>500km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Link
                        href="/dashboard/requests"
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Submit Request
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
