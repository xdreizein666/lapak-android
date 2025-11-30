import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined';

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Types for database tables
export type Project = {
    id: string;
    title: string;
    brand: string;
    category: string;
    description: string;
    image_url: string;
    status: 'completed' | 'ongoing';
    created_at: string;
    updated_at: string;
    views: number;
};

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image_url: string;
    author: string;
    status: 'published' | 'draft';
    views: number;
    created_at: string;
    updated_at: string;
    published_at: string | null;
};

export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    phone: string;
    brand: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    created_at: string;
};

export type AdminUser = {
    id: string;
    username: string;
    password_hash: string;
    email: string;
    created_at: string;
    last_login: string | null;
};

export type ViewsCounter = {
    id: string;
    content_type: 'blog' | 'portfolio';
    content_id: string;
    views: number;
    last_viewed: string;
};

export type WebsiteSetting = {
    id: string;
    key: string;
    value: string;
    type: 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'image';
    label: string;
    description?: string;
    group_name: string;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_price?: number;
    images: string[];
    category: string;
    condition: 'Like New' | 'Excellent' | 'Good';
    stock: number;
    stock_status: 'available' | 'low_stock' | 'sold_out';
    is_rooted: boolean;
    created_at: string;
    updated_at: string;
    location: string;
    sold_count: number;
    rating: number;
};

