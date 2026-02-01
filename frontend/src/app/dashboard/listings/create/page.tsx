"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
    ArrowLeft,
    Upload,
    X,
    Loader2,
    Package,
    DollarSign,
    MapPin,
    Tag,
    FileText,
    Sparkles,
    Image as ImageIcon,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";

const listingSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Please select a category"),
    condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
    price: z.number().positive("Price must be greater than 0"),
    locationId: z.string().min(1, "Please select a location"),
    isNegotiable: z.boolean().default(true),
});

type ListingForm = z.infer<typeof listingSchema>;

// Demo data - replace with API calls
const categories = [
    { id: "cat-1", name: "Electronics", slug: "electronics" },
    { id: "cat-2", name: "Fashion", slug: "fashion" },
    { id: "cat-3", name: "Furniture", slug: "furniture" },
    { id: "cat-4", name: "Vehicles", slug: "vehicles" },
    { id: "cat-5", name: "Real Estate", slug: "real-estate" },
    { id: "cat-6", name: "Services", slug: "services" },
];

const locations = [
    { id: "loc-1", state: "Lagos", lga: "Lagos Island" },
    { id: "loc-2", state: "Lagos", lga: "Victoria Island" },
    { id: "loc-3", state: "Abuja", lga: "Garki" },
    { id: "loc-4", state: "Rivers", lga: "Port Harcourt" },
    { id: "loc-5", state: "Oyo", lga: "Ibadan North" },
];

const conditions = [
    { value: "NEW", label: "Brand New", description: "Never used, in original packaging" },
    { value: "LIKE_NEW", label: "Like New", description: "Used briefly, excellent condition" },
    { value: "GOOD", label: "Good", description: "Used but well maintained" },
    { value: "FAIR", label: "Fair", description: "Shows some wear but functional" },
    { value: "POOR", label: "Poor", description: "Heavily used, may need repairs" },
];

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ListingForm>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            isNegotiable: true,
            condition: "GOOD",
        },
    });

    const selectedCondition = watch("condition");

    const onSubmit = async (data: ListingForm) => {
        setLoading(true);
        setError("");
        try {
            await listingsAPI.create(data);
            router.push("/dashboard/listings");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create listing");
        } finally {
            setLoading(false);
        }
    };

    // Simulated image upload - replace with actual upload logic
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // In production, upload to cloud storage and get URL
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages((prev) => [...prev, reader.result as string].slice(0, 6));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/listings"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to listings
                </Link>
                <h1 className="text-2xl font-bold text-white">Create New Listing</h1>
                <p className="text-gray-400 mt-1">
                    Fill in the details to list your item for sale
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Images */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary-400" />
                        Photos
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-white/5">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-lg text-white hover:bg-red-500 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {images.length < 6 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-primary-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                <Upload className="w-6 h-6 text-gray-500 mb-1" />
                                <span className="text-xs text-gray-500">Add</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Add up to 6 photos. First photo will be the cover.
                    </p>
                </div>

                {/* Basic Info */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-400" />
                        Basic Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                {...register("title")}
                                placeholder="e.g., iPhone 14 Pro Max 256GB"
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
                                placeholder="Describe your item in detail..."
                                rows={4}
                                className="input-field resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <select {...register("categoryId")} className="input-field">
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="text-red-400 text-sm mt-1">{errors.categoryId.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Condition */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary-400" />
                        Condition
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {conditions.map((cond) => (
                            <label
                                key={cond.value}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCondition === cond.value
                                        ? "bg-primary-500/10 border-primary-500/30"
                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    {...register("condition")}
                                    value={cond.value}
                                    className="hidden"
                                />
                                <p className="font-medium text-white text-sm">{cond.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{cond.description}</p>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary-400" />
                        Pricing
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Price (₦) *
                            </label>
                            <input
                                type="number"
                                {...register("price", { valueAsNumber: true })}
                                placeholder="0"
                                className="input-field"
                            />
                            {errors.price && (
                                <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                            )}
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("isNegotiable")}
                                className="w-5 h-5 rounded border-gray-600 bg-white/5 text-primary-500 focus:ring-primary-500/50"
                            />
                            <span className="text-gray-300">Price is negotiable</span>
                        </label>
                    </div>
                </div>

                {/* Location */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-400" />
                        Location
                    </h2>
                    <select {...register("locationId")} className="input-field">
                        <option value="">Select location</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {loc.lga}, {loc.state}
                            </option>
                        ))}
                    </select>
                    {errors.locationId && (
                        <p className="text-red-400 text-sm mt-1">{errors.locationId.message}</p>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Link
                        href="/dashboard/listings"
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
                                Publish Listing
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
