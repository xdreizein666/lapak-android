import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { Project } from '../../lib/supabaseClient';

type ProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (project: Partial<Project>) => Promise<void>;
    project?: Project | null;
    mode: 'create' | 'edit';
};

export function ProjectModal({ isOpen, onClose, onSubmit, project, mode }: ProjectModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        category: '',
        description: '',
        image_url: '',
        status: 'ongoing' as 'ongoing' | 'completed',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && project) {
            setFormData({
                title: project.title,
                brand: project.brand,
                category: project.category,
                description: project.description,
                image_url: project.image_url || '',
                status: project.status,
            });
        } else {
            setFormData({
                title: '',
                brand: '',
                category: '',
                description: '',
                image_url: '',
                status: 'ongoing',
            });
        }
    }, [mode, project, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const brands = ['Xiaomi', 'Samsung', 'Oppo', 'Vivo', 'Realme', 'Google', 'OnePlus', 'Asus', 'Lainnya'];
    const categories = ['Root Android', 'Custom ROM', 'Unlock Bootloader', 'Aplikasi', 'Lainnya'];

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

                    {/* Modal - Smaller size with max-height */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header - Fixed */}
                            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                                <h3>{mode === 'create' ? 'Tambah Project' : 'Edit Project'}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Form - Scrollable */}
                            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                                <div className="p-4 space-y-3">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Judul Project <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Root Xiaomi Redmi Note 12 Pro"
                                            required
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Brand & Category */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Brand <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Pilih Brand</option>
                                                {brands.map((brand) => (
                                                    <option key={brand} value={brand}>
                                                        {brand}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Kategori <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Deskripsi <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Deskripsi project..."
                                            rows={3}
                                            required
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Gambar Project
                                        </label>
                                        <ImageUploader
                                            value={formData.image_url}
                                            onChange={(url) => setFormData({ ...formData, image_url: url })}
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="ongoing"
                                                    checked={formData.status === 'ongoing'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ongoing' | 'completed' })}
                                                    className="w-4 h-4"
                                                />
                                                <span>Ongoing</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="completed"
                                                    checked={formData.status === 'completed'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ongoing' | 'completed' })}
                                                    className="w-4 h-4"
                                                />
                                                <span>Completed</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - Fixed at bottom */}
                                <div className="flex gap-2 p-4 border-t border-border bg-muted/30">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Tambah' : 'Simpan'}
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
