import { useState, useEffect } from 'react';
import { projectsApi } from '../lib/api/projects';
import { type Project, isConfigured } from '../lib/supabaseClient';

type UseProjectsOptions = {
    brand?: string;
    category?: string;
    status?: string;
    autoFetch?: boolean;
};

// Mock data untuk fallback
const mockProjects: Project[] = [
    {
        id: '1',
        title: 'Root Xiaomi Redmi Note 12 Pro',
        brand: 'Xiaomi',
        category: 'Root Android',
        description: 'Root lengkap dengan Magisk terbaru, unlock bootloader, dan instalasi custom recovery TWRP',
        image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        status: 'completed',
        views: 245,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Custom ROM Samsung Galaxy A54',
        brand: 'Samsung',
        category: 'Custom ROM',
        description: 'Instalasi Pixel Experience ROM terbaru dengan GApps dan optimasi performa maksimal',
        image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        status: 'completed',
        views: 189,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export function useProjects(options: UseProjectsOptions = {}) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { brand, category, status, autoFetch = true } = options;

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!isConfigured) {
                // Use mock data if Supabase not configured
                console.warn('Using mock data - Supabase not configured');
                let filtered = [...mockProjects];
                if (brand) filtered = filtered.filter(p => p.brand === brand);
                if (category) filtered = filtered.filter(p => p.category === category);
                if (status) filtered = filtered.filter(p => p.status === status);
                setProjects(filtered);
                setLoading(false);
                return;
            }

            const data = await projectsApi.getAll({ brand, category, status });
            setProjects(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching projects:', err);
            // Fallback to mock data on error
            setProjects(mockProjects);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchProjects();
        }
    }, [brand, category, status, autoFetch]);

    const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
        try {
            const newProject = await projectsApi.create(project);
            setProjects((prev) => [newProject, ...prev]);
            return newProject;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        try {
            const updatedProject = await projectsApi.update(id, updates);
            setProjects((prev) =>
                prev.map((p) => (p.id === id ? updatedProject : p))
            );
            return updatedProject;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await projectsApi.delete(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        projects,
        loading,
        error,
        refetch: fetchProjects,
        createProject,
        updateProject,
        deleteProject,
    };
}