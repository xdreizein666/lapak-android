import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';

type SettingItem = {
    key: string;
    label: string;
    value: string;
    type: 'text' | 'email' | 'tel' | 'url';
    placeholder: string;
};

type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: SettingItem[]) => Promise<void>;
    initialSettings: SettingItem[];
};

export function SettingsModal({ isOpen, onClose, onSave, initialSettings }: SettingsModalProps) {
    const [settings, setSettings] = useState<SettingItem[]>(initialSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (key: string, value: string) => {
        setSettings((prev) =>
            prev.map((setting) =>
                setting.key === key ? { ...setting, value } : setting
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSave(settings);
            onClose();
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <div>
                                    <h2>Pengaturan Website</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Konfigurasi informasi website Anda
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {settings.map((setting) => (
                                    <div key={setting.key}>
                                        <label className="block text-sm mb-2">
                                            {setting.label}
                                        </label>
                                        <input
                                            type={setting.type}
                                            value={setting.value}
                                            onChange={(e) => handleChange(setting.key, e.target.value)}
                                            placeholder={setting.placeholder}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                ))}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Save className="h-5 w-5" />
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
