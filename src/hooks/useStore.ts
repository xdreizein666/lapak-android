import { useState, useEffect } from 'react';
import { storeApi } from '../lib/api/store';
import { type Product, isConfigured } from '../lib/supabaseClient';

type UseStoreOptions = {
    category?: string;
    condition?: string;
    limit?: number;
    autoFetch?: boolean;
};

// Mock data for fallback
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Samsung Galaxy S21 Ultra 5G',
        description: 'Flagship Samsung dengan kamera 108MP dan layar 120Hz.',
        price: 8500000,
        discount_price: 8200000,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
        category: 'Samsung',
        condition: 'Like New',
        stock: 5,
        stock_status: 'available',
        is_rooted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: 'Jakarta',
        sold_count: 12,
        rating: 4.8
    },
    {
        id: '2',
        name: 'Google Pixel 6 Pro',
        description: 'Pengalaman Android murni dengan kamera terbaik.',
        price: 6800000,
        images: ['https://images.unsplash.com/photo-1635870723802-e88d76ae324e?w=800'],
        category: 'Google',
        condition: 'Excellent',
        stock: 3,
        stock_status: 'low_stock',
        is_rooted: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: 'Bandung',
        sold_count: 8,
        rating: 4.9
    },
];

export function useStore(options: UseStoreOptions = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { category, condition, limit, autoFetch = true } = options;

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!isConfigured) {
                // Use mock data if Supabase not configured
                console.warn('Using mock data - Supabase not configured');
                let filtered = [...mockProducts];
                if (category) filtered = filtered.filter(p => p.category === category);
                if (condition) filtered = filtered.filter(p => p.condition === condition);
                if (limit) filtered = filtered.slice(0, limit);
                setProducts(filtered);
                setLoading(false);
                return;
            }

            const data = await storeApi.getAll({ category, condition, limit });
            setProducts(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching products:', err);
            // Fallback to mock data on error
            setProducts(mockProducts);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchProducts();
        }
    }, [category, condition, limit, autoFetch]);

    const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'sold_count' | 'rating'>) => {
        try {
            const newProduct = await storeApi.create(product);
            setProducts((prev) => [newProduct, ...prev]);
            return newProduct;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            const updatedProduct = await storeApi.update(id, updates);
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? updatedProduct : p))
            );
            return updatedProduct;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await storeApi.delete(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}
