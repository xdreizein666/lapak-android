import { supabase, type Product } from '../supabaseClient';

export const storeApi = {
    // Get all products with optional filters
    async getAll(filters?: { category?: string; condition?: string; limit?: number }) {
        let query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }
        if (filters?.condition) {
            query = query.eq('condition', filters.condition);
        }
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as Product[];
    },

    // Get single product by ID
    async getById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Product not found');
        return data as Product;
    },

    // Create new product
    async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'sold_count' | 'rating'>) {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                ...product,
                sold_count: 0,
                rating: 0
            }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create product (check RLS policies)');
        return data as Product;
    },

    // Update product
    async update(id: string, updates: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Product not found or permission denied (check RLS policies)');
        return data as Product;
    },

    // Delete product
    async delete(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
