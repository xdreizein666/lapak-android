import { useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../lib/api/settings';
import type { WebsiteSetting } from '../lib/supabaseClient';
import { toast } from 'sonner';

export function useSettings(group?: string) {
    const [settings, setSettings] = useState<WebsiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (group) {
                data = await settingsApi.getByGroup(group);
            } else {
                data = await settingsApi.getAll();
            }
            setSettings(data || []);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [group]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSetting = async (key: string, value: string) => {
        try {
            await settingsApi.update(key, value);

            // Update local state
            setSettings(prev =>
                prev.map(s => s.key === key ? { ...s, value } : s)
            );

            return true;
        } catch (err) {
            console.error('Error updating setting:', err);
            toast.error('Gagal mengupdate pengaturan');
            throw err;
        }
    };

    const getSettingValue = (key: string, defaultValue: string = '') => {
        const setting = settings.find(s => s.key === key);
        return setting ? setting.value : defaultValue;
    };

    return {
        settings,
        loading,
        error,
        updateSetting,
        getSettingValue,
        refetch: fetchSettings
    };
}
