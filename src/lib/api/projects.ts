import { supabase, type Project } from '../supabaseClient';

export const projectsApi = {
    // Get all projects with optional filters
    async getAll(filters?: { brand?: string; category?: string; status?: string }) {
        let query = supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.brand) {
            query = query.eq('brand', filters.brand);
        }
        if (filters?.category) {
            query = query.eq('category', filters.category);
        }
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as Project[];
    },

    // Get single project by ID
    async getById(id: string) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Project not found');
        return data as Project;
    },

    // Create new project
    async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'views'>) {
        const { data, error } = await supabase
            .from('projects')
            .insert([project])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create project (check RLS policies)');
        return data as Project;
    },

    // Update project
    async update(id: string, updates: Partial<Project>) {
        const { data, error } = await supabase
            .from('projects')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Project not found or permission denied (check RLS policies)');
        return data as Project;
    },

    // Delete project
    async delete(id: string) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Increment views
    async incrementViews(id: string) {
        const { error } = await supabase.rpc('increment_project_views', {
            project_id: id,
        });

        if (error) throw error;
    },

    // Get total views for all projects
    async getTotalViews() {
        const { data, error } = await supabase
            .from('projects')
            .select('views');

        if (error) throw error;
        return data.reduce((sum, project) => sum + (project.views || 0), 0);
    },
};
