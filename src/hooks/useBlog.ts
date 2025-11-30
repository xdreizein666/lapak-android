import { useState, useEffect } from 'react';
import { blogApi } from '../lib/api/blog';
import { type BlogPost, isConfigured } from '../lib/supabaseClient';

type UseBlogOptions = {
    category?: string;
    status?: string;
    limit?: number;
    autoFetch?: boolean;
};

// Mock data untuk fallback (hanya digunakan jika Supabase tidak configured)
const mockPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Panduan Lengkap Root Android 2024',
        slug: 'panduan-lengkap-root-android-2024',
        excerpt: 'Pelajari cara root Android dengan aman dan mudah menggunakan Magisk terbaru.',
        content: 'Root Android adalah proses mendapatkan akses superuser...',
        category: 'Tutorial',
        image_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
        author: 'Admin',
        status: 'published',
        views: 1234,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Custom ROM Terbaik 2024',
        slug: 'custom-rom-terbaik-2024',
        excerpt: 'Daftar custom ROM Android terbaik tahun 2024 dengan fitur lengkap.',
        content: 'Custom ROM memberikan pengalaman Android yang lebih baik...',
        category: 'Review',
        image_url: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800',
        author: 'Admin',
        status: 'published',
        views: 876,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
    },
];

export function useBlog(options: UseBlogOptions = {}) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { category, status, limit, autoFetch = true } = options;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!isConfigured) {
                // Use mock data if Supabase not configured
                console.warn('Using mock data - Supabase not configured');
                let filtered = [...mockPosts];
                if (category) filtered = filtered.filter(p => p.category === category);
                if (status) filtered = filtered.filter(p => p.status === status);
                if (limit) filtered = filtered.slice(0, limit);
                setPosts(filtered);
                setLoading(false);
                return;
            }

            const data = await blogApi.getAll({ category, status, limit });
            setPosts(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching blog posts:', err);
            // IMPORTANT: Don't use mock data if Supabase IS configured
            // Mock data has string IDs '1', '2' but database uses UUID
            if (!isConfigured) {
                setPosts(mockPosts);
            } else {
                setPosts([]); // Empty array - create new blog posts instead
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchPosts();
        }
    }, [category, status, limit, autoFetch]);

    const createPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
        try {
            const newPost = await blogApi.create(post);
            setPosts((prev) => [newPost, ...prev]);
            return newPost;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updatePost = async (id: string, updates: Partial<BlogPost>) => {
        try {
            const updatedPost = await blogApi.update(id, updates);
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? updatedPost : p))
            );
            return updatedPost;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const deletePost = async (id: string) => {
        try {
            await blogApi.delete(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        posts,
        loading,
        error,
        refetch: fetchPosts,
        createPost,
        updatePost,
        deletePost,
    };
}