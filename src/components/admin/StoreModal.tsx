import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { Product } from '../../lib/supabaseClient';

type StoreModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Partial<Product>) => Promise<void>;
    product?: Product | null;
    mode: 'create' | 'edit';
};

export function StoreModal({ isOpen, onClose, onSubmit, product, mode }: StoreModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        discount_price: 0,
        images: [] as string[],
        category: '',
        condition: 'Like New' as 'Like New' | 'Excellent' | 'Good',
        stock: 1,
        stock_status: 'available' as 'available' | 'low_stock' | 'sold_out',
        is_rooted: false,
        location: 'Jakarta',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                discount_price: product.discount_price || 0,
                images: product.images || [],
                category: product.category,
                condition: product.condition,
                stock: product.stock,
                stock_status: product.stock_status || 'available',
                is_rooted: product.is_rooted,
                location: product.location,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                discount_price: 0,
                images: [],
                category: '',
                condition: 'Like New',
                stock: 1,
                stock_status: 'available',
                is_rooted: false,
                location: 'Jakarta',
            });
        }
    }, [mode, product, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Realme', 'Asus', 'Sony', 'Lainnya'];
    const conditions = ['Like New', 'Excellent', 'Good'];

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
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                                <h3>{mode === 'create' ? 'Tambah Produk' : 'Edit Produk'}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                                <div className="p-4 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Nama Produk <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Samsung Galaxy S21 Ultra 5G"
                                            required
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Category & Condition */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Brand/Kategori <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Pilih Brand</option>
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Kondisi <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.condition}
                                                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                                                required
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                {conditions.map((cond) => (
                                                    <option key={cond} value={cond}>{cond}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Price & Discount */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Harga (Rp) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Harga Diskon (Opsional)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.discount_price}
                                                onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
                                                min="0"
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock & Stock Status */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Stok <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.stock}
                                                onChange={(e) => {
                                                    const stock = Number(e.target.value);
                                                    let stock_status: 'available' | 'low_stock' | 'sold_out' = 'available';
                                                    if (stock === 0) stock_status = 'sold_out';
                                                    else if (stock <= 3) stock_status = 'low_stock';
                                                    setFormData({ ...formData, stock, stock_status });
                                                }}
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1.5">
                                                Status Stok
                                            </label>
                                            <select
                                                value={formData.stock_status}
                                                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="available">Tersedia</option>
                                                <option value="low_stock">Stok Terbatas</option>
                                                <option value="sold_out">Sold Out</option>
                                            </select>
                                            <p className="text-xs text-muted-foreground mt-1">Otomatis berubah saat stok diubah</p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Lokasi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                            placeholder="Jakarta"
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Deskripsi <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Deskripsi lengkap produk..."
                                            rows={4}
                                            required
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm mb-1.5">
                                            Gambar Produk
                                        </label>
                                        <ImageUploader
                                            value={formData.images[0] || ''}
                                            onChange={(url) => setFormData({ ...formData, images: url ? [url] : [] })}
                                            description="Upload gambar utama produk"
                                        />
                                    </div>

                                    {/* Options */}
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_rooted}
                                                onChange={(e) => setFormData({ ...formData, is_rooted: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span>Sudah Root / Custom ROM?</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Actions */}
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
                                        {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Tambah Produk' : 'Simpan Perubahan'}
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
