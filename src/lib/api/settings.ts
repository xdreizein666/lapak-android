import { supabase, isConfigured, WebsiteSetting } from '../supabaseClient';

export const settingsApi = {
    // Get all settings
    getAll: async () => {
        if (!isConfigured) return [];

        const { data, error } = await supabase
            .from('website_settings')
            .select('*')
            .order('key');

        if (error) throw error;
        return data as WebsiteSetting[];
    },

    // Get settings by group
    getByGroup: async (group: string) => {
        if (!isConfigured) return [];

        const { data, error } = await supabase
            .from('website_settings')
            .select('*')
            .eq('group_name', group)
            .order('key');

        if (error) throw error;
        return data as WebsiteSetting[];
    },

    // Update a setting
    update: async (key: string, value: string) => {
        if (!isConfigured) return null;

        const { data, error } = await supabase
            .from('website_settings')
            .update({ value, updated_at: new Date().toISOString() })
            .eq('key', key)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data as WebsiteSetting;
    },

    // Update multiple settings
    updateMultiple: async (settings: { key: string; value: string }[]) => {
        if (!isConfigured) return null;

        const updates = settings.map(s =>
            supabase
                .from('website_settings')
                .update({ value: s.value, updated_at: new Date().toISOString() })
                .eq('key', s.key)
        );

        const results = await Promise.all(updates);
        const errors = results.filter(r => r.error).map(r => r.error);

        if (errors.length > 0) throw errors[0];
        return true;
    }
};
