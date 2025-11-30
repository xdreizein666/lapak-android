import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import type { BlogPost } from '../../lib/supabaseClient';

type BlogModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: Partial<BlogPost>) => Promise<void>;
    post?: BlogPost | null;
    mode: 'create' | 'edit';
};

export function BlogModal({ isOpen, onClose, onSubmit, post, mode }: BlogModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        image_url: '',
        author: 'Admin',
        status: 'draft' as 'draft' | 'published',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && post) {
            setFormData({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                category: post.category,
                image_url: post.image_url || '',
                author: post.author,
                status: post.status,
            });
        } else {
            setFormData({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                category: '',
                image_url: '',
                author: 'Admin',
                status: 'draft',
            });
        }
    }, [mode, post, isOpen]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validasi content tidak boleh kosong
            if (!formData.content || formData.content.trim() === '' || formData.content === '<p></p>') {
                throw new Error('Konten artikel tidak boleh kosong');
            }

            const submitData = {
                ...formData,
                published_at: formData.status === 'published' ? new Date().toISOString() : null,
            };
            await onSubmit(submitData);
            onClose();
        } catch (error: any) {
            console.error('Error submitting blog post:', error);
            // Show user-friendly error message
            const errorMessage = error?.message || 'Gagal menyimpan artikel. Silakan coba lagi.';
            alert(errorMessage); // Atau gunakan toast notification
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['Tutorial', 'Review', 'News', 'Tips & Tricks', 'Lainnya'];

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
                            className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header - Fixed */}
                            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                                <h3>{mode === 'create' ? 'Tulis Artikel' : 'Edit Artikel'}</h3>
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
                                            Judul Artikel <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            placeholder="Cara Root Android Terbaru 2024"
                                            required
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Slug (Auto-generated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="cara-root-android-terbaru-2024"
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Category & Author */}
                                    <div className="grid grid-cols-2 gap-3">
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

                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Author <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                placeholder="Admin"
                                                required
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Excerpt <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            placeholder="Ringkasan singkat artikel (1-2 kalimat)"
                                            rows={2}
                                            required
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Konten <span className="text-red-500">*</span>
                                        </label>
                                        <RichTextEditor
                                            value={formData.content}
                                            onChange={(value) => setFormData({ ...formData, content: value })}
                                            placeholder="Tulis konten artikel lengkap di sini..."
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Featured Image
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
                                                    value="draft"
                                                    checked={formData.status === 'draft'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                                                    className="w-4 h-4"
                                                />
                                                <span>Draft</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="published"
                                                    checked={formData.status === 'published'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                                                    className="w-4 h-4"
                                                />
                                                <span>Published</span>
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
                                        {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Publish' : 'Simpan'}
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
