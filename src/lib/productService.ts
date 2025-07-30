import axios from 'axios';
import { api } from './auth';

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: string;
    originalPrice?: string;
    discountedPrice?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductData {
    name: string;
    description?: string;
    price: string;
    originalPrice?: string;
    discountedPrice?: string;
    image: File;
}

export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    discountedPrice?: string;
    image?: File;
}

export interface ProductsResponse {
    success: boolean;
    products: Product[];
}

export interface ProductResponse {
    success: boolean;
    product: Product;
}

export interface CreateProductResponse {
    success: boolean;
    message: string;
    product: Product;
}

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/api/v1/product');
        return response.data.products;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch products');
    }
};

export const getProductById = async (id: string): Promise<Product> => {
    try {
        const response = await api.get(`/api/v1/product/${id}`);
        return response.data.product;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch product');
    }
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('price', data.price);
        if (data.originalPrice) formData.append('originalPrice', data.originalPrice);
        if (data.discountedPrice) formData.append('discountedPrice', data.discountedPrice);
        formData.append('image', data.image);

        const response = await api.post('/api/v1/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.product;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to create product');
    }
};

export const updateProduct = async (id: string, data: UpdateProductData): Promise<Product> => {
    try {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.price) formData.append('price', data.price);
        if (data.originalPrice !== undefined) formData.append('originalPrice', data.originalPrice);
        if (data.discountedPrice !== undefined) formData.append('discountedPrice', data.discountedPrice);
        if (data.image) formData.append('image', data.image);

        const response = await api.patch(`/api/v1/product/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.product;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to update product');
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/v1/product/${id}`);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to delete product');
    }
}; 