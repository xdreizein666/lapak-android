import { supabase, isConfigured } from '../supabaseClient';

export const uploadApi = {
    // Upload image to Supabase Storage
    uploadImage: async (file: File, bucket: string = 'images', folder: string = 'about') => {
        if (!isConfigured) {
            throw new Error('Supabase is not configured');
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            throw new Error(`Invalid file type: ${file.type}. Allowed types: JPG, PNG, WebP, GIF`);
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload file with explicit content type
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type // Explicitly set content type
            });

        if (error) {
            console.error('Upload error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return {
            path: data.path,
            url: publicUrl
        };
    },

    // Delete image from Supabase Storage
    deleteImage: async (path: string, bucket: string = 'images') => {
        if (!isConfigured) return;

        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    }
};
