'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Product, getProducts, createProduct, updateProduct, deleteProduct, CreateProductData, UpdateProductData } from '@/lib/productService';
import ProductForm from '@/components/ProductForm';
import {
    Package,
    Plus,
    Edit3,
    Trash2,
    ImageIcon,
    Loader2,
    ShoppingBag,
    Percent
} from 'lucide-react';
import Image from 'next/image';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: CreateProductData | UpdateProductData, isUpdate: boolean) => {
        try {
            setFormLoading(true);

            if (isUpdate) {
                if (!editingProduct) return;
                const updatedProduct = await updateProduct(editingProduct.id, data as UpdateProductData);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
                toast.success('Product updated successfully!');
                setEditingProduct(null);
            } else {
                const newProduct = await createProduct(data as CreateProductData);
                setProducts(prev => [newProduct, ...prev]);
                toast.success('Product created successfully!');
            }

            setShowForm(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isUpdate ? 'update' : 'create'} product`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            setDeletingId(id);
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success('Product deleted successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(parseFloat(price));
    };

    const getDiscountPercentage = (originalPrice: string, discountedPrice: string) => {
        const original = parseFloat(originalPrice);
        const discounted = parseFloat(discountedPrice);
        return Math.round(((original - discounted) / original) * 100);
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
                            <p className="text-gray-400">Loading products...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center space-x-3">
                                <Package className="w-8 h-8 text-blue-400" />
                                <span>Products</span>
                            </h1>
                            <p className="mt-2 text-gray-400">Manage your product catalog</p>
                        </div>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="bg-gray-900 border-gray-800 max-w-2xl w-full max-h-[90vh] hide-scrollbar overflow-y-auto">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                    {editingProduct ? (
                                        <>
                                            <Edit3 className="w-5 h-5 text-blue-400" />
                                            <span>Edit Product</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5 text-green-400" />
                                            <span>Add New Product</span>
                                        </>
                                    )}
                                </h2>
                                <ProductForm
                                    product={editingProduct || undefined}
                                    onSubmit={handleSubmit}
                                    onCancel={handleCancel}
                                    loading={formLoading}
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {products.length === 0 ? (
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                        <CardContent className="text-center py-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
                            <p className="text-gray-400 mb-6">Get started by adding your first product to your catalog</p>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Product
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Card key={product.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden hover:border-gray-700 transition-all duration-200 group">
                                <div className="aspect-square bg-gray-800 relative overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <div className="text-center">
                                                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-sm">No Image</p>
                                            </div>
                                        </div>
                                    )}

                                    {product.originalPrice && product.discountedPrice && (
                                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 px-2 py-1">
                                            <Percent className="w-3 h-3 mr-1" />
                                            -{getDiscountPercentage(product.originalPrice, product.discountedPrice)}%
                                        </Badge>
                                    )}
                                </div>

                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                        {product.name}
                                    </h3>

                                    {product.description && (
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="mb-4">
                                        {product.originalPrice && product.discountedPrice ? (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-bold text-white flex items-center">
                                                    {formatPrice(product.discountedPrice).replace('$', '')}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through">
                                                    {formatPrice(product.originalPrice)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-bold text-white flex items-center">
                                                {formatPrice(product.price).replace('$', '')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => handleEdit(product)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-blue-900/20 border-blue-800 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300"
                                        >
                                            <Edit3 className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            variant="outline"
                                            size="sm"
                                            disabled={deletingId === product.id}
                                            className="flex-1 bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40 hover:text-red-300 disabled:opacity-50"
                                        >
                                            {deletingId === product.id ? (
                                                <>
                                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}