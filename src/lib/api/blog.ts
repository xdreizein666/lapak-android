import { supabase, type BlogPost } from '../supabaseClient';

export const blogApi = {
    // Get all blog posts with optional filters
    async getAll(filters?: { category?: string; status?: string; limit?: number }) {
        let query = supabase
            .from('blog_posts')
            .select('*')
            .order('published_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }
        if (filters?.status) {
            query = query.eq('status', filters.status);
        } else {
            // By default, only show published posts for public
            query = query.eq('status', 'published');
        }
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as BlogPost[];
    },

    // Get single blog post by ID
    async getById(id: string) {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Blog post not found');
        return data as BlogPost;
    },

    // Get blog post by slug
    async getBySlug(slug: string) {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Blog post not found');
        return data as BlogPost;
    },

    // Create new blog post
    async create(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>) {
        const { data, error } = await supabase
            .from('blog_posts')
            .insert([post])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create blog post (check RLS policies)');
        return data as BlogPost;
    },

    // Update blog post
    async update(id: string, updates: Partial<BlogPost>) {
        const { data, error } = await supabase
            .from('blog_posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Blog post not found or permission denied (check RLS policies)');
        return data as BlogPost;
    },

    // Delete blog post
    async delete(id: string) {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Increment views
    async incrementViews(id: string) {
        const { error } = await supabase.rpc('increment_blog_views', {
            blog_id: id,
        });

        if (error) throw error;
    },

    // Get total views for all blog posts
    async getTotalViews() {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('views');

        if (error) throw error;
        return data.reduce((sum, post) => sum + (post.views || 0), 0);
    },

    // Get recent posts
    async getRecent(limit: number = 6) {
        return this.getAll({ status: 'published', limit });
    },
};
