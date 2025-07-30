'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Product, CreateProductData, UpdateProductData } from '@/lib/productService';
import { ImageIcon, X, Upload } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
    product?: Product;
    onSubmit: (data: CreateProductData | UpdateProductData, isUpdate: boolean) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, loading = false }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        originalPrice: product?.originalPrice || '',
        discountedPrice: product?.discountedPrice || ''
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.imageUrl ? `${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}` : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Product name is required');
            return;
        }

        if (!formData.price.trim()) {
            toast.error('Product price is required');
            return;
        }

        if (!product && !selectedImage) {
            toast.error('Product image is required');
            return;
        }

        try {
            if (product) {
                const updateData: UpdateProductData = {
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    originalPrice: formData.originalPrice || undefined,
                    discountedPrice: formData.discountedPrice || undefined
                };
                if (selectedImage) {
                    updateData.image = selectedImage;
                }
                await onSubmit(updateData, true);
            } else {
                if (!selectedImage) {
                    toast.error('Product image is required');
                    return;
                }
                const createData: CreateProductData = {
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    originalPrice: formData.originalPrice || undefined,
                    discountedPrice: formData.discountedPrice || undefined,
                    image: selectedImage
                };
                await onSubmit(createData, false);
            }
        } catch (error) {
            console.error("ProductForm onSubmit error:", error);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label className="text-sm font-medium text-white mb-3 block">Product Image</Label>
                <div className="space-y-4">
                    {imagePreview ? (
                        <div className="relative inline-block">
                            <div className="relative overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800">
                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                    className="h-32 w-32 object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors shadow-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={triggerFileInput}
                            className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50 hover:bg-gray-800 hover:border-gray-500 flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
                        >
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-400 text-center px-2">Click to upload</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={triggerFileInput}
                            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {imagePreview ? 'Change Image' : 'Upload Image'}
                        </Button>
                        <p className="text-xs text-gray-400">
                            {product ? 'Leave empty to keep current image' : 'Upload a product image (required)'}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <Label htmlFor="name" className="text-sm font-medium text-white mb-2 block">
                    Product Name *
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-800 min-h-12 text-lg border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Enter product name"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description" className="text-sm font-medium text-white mb-2 block">
                    Description
                </Label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 rounded-md bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors resize-none"
                    placeholder="Enter product description"
                />
            </div>

            <div className="space-y-4">
                <Label className="text-sm font-medium text-white">Pricing Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="price" className="text-xs font-medium text-gray-300 mb-1 block">
                            Current Price *
                        </Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="originalPrice" className="text-xs font-medium text-gray-300 mb-1 block">
                            Original Price
                        </Label>
                        <Input
                            id="originalPrice"
                            name="originalPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-500 focus:ring-yellow-500/20"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <Label htmlFor="discountedPrice" className="text-xs font-medium text-gray-300 mb-1 block">
                            Discounted Price
                        </Label>
                        <Input
                            id="discountedPrice"
                            name="discountedPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.discountedPrice}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400">
                    Set both original and discounted price to show discount badge
                </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                >
                    {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    );
}