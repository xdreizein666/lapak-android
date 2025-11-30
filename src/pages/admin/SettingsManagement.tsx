import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    Save,
    Settings,
    Globe,
    RefreshCw,
    Info,
    AlignLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '../../hooks/useSettings';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { HeroSlideEditor } from '../../components/admin/HeroSlideEditor';

export function SettingsManagement() {
    const navigate = useNavigate();
    const { settings, loading, updateSetting, refetch } = useSettings();
    const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize local state when settings are loaded
    useEffect(() => {
        if (settings.length > 0) {
            const initialSettings: Record<string, string> = {};
            settings.forEach(s => {
                initialSettings[s.key] = s.value;
            });
            setLocalSettings(initialSettings);
        }
    }, [settings]);

    const handleChange = (key: string, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleReset = () => {
        if (confirm('Reset perubahan yang belum disimpan?')) {
            const initialSettings: Record<string, string> = {};
            settings.forEach(s => {
                initialSettings[s.key] = s.value;
            });
            setLocalSettings(initialSettings);
            toast.success('Perubahan direset');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Find changed settings
            const changedSettings: { key: string; oldValue: string; newValue: string }[] = [];

            const promises = Object.keys(localSettings).map(async (key) => {
                const originalValue = settings.find(s => s.key === key)?.value || '';
                const newValue = localSettings[key];

                if (originalValue !== newValue) {
                    changedSettings.push({ key, oldValue: originalValue, newValue });
                    return updateSetting(key, newValue);
                }
                return Promise.resolve();
            });

            await Promise.all(promises);

            toast.success(`Pengaturan berhasil disimpan (${changedSettings.length} perubahan)`);
            refetch();
        } catch (error) {
            toast.error('Gagal menyimpan pengaturan');
            console.error('Save error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && settings.length === 0) {
        return (
            <div className="min-h-screen bg-muted/30 pt-20 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pt-20">
            <div className="max-w-4xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Dashboard</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-2">Homepage Settings</h1>
                            <p className="text-muted-foreground">
                                Konfigurasi informasi dan konten homepage
                            </p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl transition-all flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* About Section Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-2xl border border-border p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Info className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <h3>About Section</h3>
                                <p className="text-sm text-muted-foreground">
                                    Konten untuk halaman Tentang Kami
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* About Title */}
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2">
                                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                                    <span>Judul About</span>
                                </label>
                                <input
                                    type="text"
                                    value={localSettings['about_title'] || ''}
                                    onChange={(e) => handleChange('about_title', e.target.value)}
                                    placeholder="Judul About Section"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* About Description 1 */}
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2">
                                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                                    <span>Deskripsi Paragraf 1</span>
                                </label>
                                <textarea
                                    value={localSettings['about_description_1'] || ''}
                                    onChange={(e) => handleChange('about_description_1', e.target.value)}
                                    placeholder="Paragraf pertama..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* About Description 2 */}
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2">
                                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                                    <span>Deskripsi Paragraf 2</span>
                                </label>
                                <textarea
                                    value={localSettings['about_description_2'] || ''}
                                    onChange={(e) => handleChange('about_description_2', e.target.value)}
                                    placeholder="Paragraf kedua..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* About Image */}
                            <div>
                                <ImageUploader
                                    value={localSettings['about_image_url'] || ''}
                                    onChange={(url) => handleChange('about_image_url', url)}
                                    label="Gambar About Section"
                                    description="Upload gambar atau masukkan URL. Maksimal 5MB. Format: JPG, PNG, WebP"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Section Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-card rounded-2xl border border-border p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Settings className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <h3>Hero Section (Carousel)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Atur konten carousel di halaman utama (3 slides)
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((slideNum) => (
                                <HeroSlideEditor
                                    key={slideNum}
                                    slideNumber={slideNum}
                                    settings={localSettings}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* General Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-2xl border border-border p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Globe className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3>General Settings</h3>
                                <p className="text-sm text-muted-foreground">
                                    Pengaturan umum website
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <span>Judul Website</span>
                                </label>
                                <input
                                    type="text"
                                    value={localSettings['site_title'] || ''}
                                    onChange={(e) => handleChange('site_title', e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm mb-2">
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    <span>Tagline</span>
                                </label>
                                <input
                                    type="text"
                                    value={localSettings['site_tagline'] || ''}
                                    onChange={(e) => handleChange('site_tagline', e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-4 sticky bottom-6 z-10"
                    >
                        <div className="flex-1 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Save className="h-5 w-5" />
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}
