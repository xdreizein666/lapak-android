import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Package,
    DollarSign,
    AlertCircle,
    Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../hooks/useStore';
import { Product } from '../../lib/supabaseClient';

export function ProductsManagement() {
    const { products, loading, createProduct, updateProduct, deleteProduct, refetch } = useStore({ autoFetch: true });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStockStatus, setFilterStockStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        discount_price: 0,
        images: [''],
        category: '',
        condition: 'Like New' as 'Like New' | 'Excellent' | 'Good',
        stock: 0,
        stock_status: 'available' as 'available' | 'low_stock' | 'sold_out',
        is_rooted: false,
        location: '',
    });

    // Get unique categories
    const categories = Array.from(new Set(products.map(p => p.category))).sort();

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        const matchesStockStatus = filterStockStatus === 'all' || product.stock_status === filterStockStatus;
        return matchesSearch && matchesCategory && matchesStockStatus;
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                discount_price: product.discount_price || 0,
                images: product.images,
                category: product.category,
                condition: product.condition,
                stock: product.stock,
                stock_status: product.stock_status,
                is_rooted: product.is_rooted,
                location: product.location,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                discount_price: 0,
                images: [''],
                category: '',
                condition: 'Like New',
                stock: 0,
                stock_status: 'available',
                is_rooted: false,
                location: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                toast.success('Produk berhasil diupdate!');
            } else {
                await createProduct(formData);
                toast.success('Produk berhasil ditambahkan!');
            }
            handleCloseModal();
            refetch();
        } catch (error) {
            toast.error('Gagal menyimpan produk');
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await deleteProduct(id);
                toast.success('Produk berhasil dihapus!');
                refetch();
            } catch (error) {
                toast.error('Gagal menghapus produk');
                console.error('Error deleting product:', error);
            }
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStockStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Tersedia</span>;
            case 'low_stock':
                return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">Stok Terbatas</span>;
            case 'sold_out':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Sold Out</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Manajemen Produk</h1>
                <p className="text-muted-foreground">Kelola produk toko Anda</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-card rounded-lg p-4 mb-6 shadow-sm border">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filterStockStatus}
                            onChange={(e) => setFilterStockStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">Semua Status</option>
                            <option value="available">Tersedia</option>
                            <option value="low_stock">Stok Terbatas</option>
                            <option value="sold_out">Sold Out</option>
                        </select>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Produk
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Produk</p>
                            <p className="text-2xl font-bold">{products.length}</p>
                        </div>
                        <Package className="h-8 w-8 text-primary/50" />
                    </div>
                </div>

                <div className="bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Tersedia</p>
                            <p className="text-2xl font-bold text-green-600">
                                {products.filter(p => p.stock_status === 'available').length}
                            </p>
                        </div>
                        <Check className="h-8 w-8 text-green-500/50" />
                    </div>
                </div>

                <div className="bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Stok Terbatas</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {products.filter(p => p.stock_status === 'low_stock').length}
                            </p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-orange-500/50" />
                    </div>
                </div>

                <div className="bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Sold Out</p>
                            <p className="text-2xl font-bold text-red-600">
                                {products.filter(p => p.stock_status === 'sold_out').length}
                            </p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-500/50" />
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">Produk</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Kategori</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Harga</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Stok</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Memuat produk...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada produk ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {product.images && product.images[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                        <Package className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">{product.condition}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm">{product.category}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{formatPrice(product.discount_price || product.price)}</p>
                                            {product.discount_price && (
                                                <p className="text-xs text-muted-foreground line-through">
                                                    {formatPrice(product.price)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-medium ${product.stock === 0 ? 'text-red-600' :
                                                product.stock <= 3 ? 'text-orange-600' :
                                                    'text-green-600'
                                                }`}>
                                                {product.stock} unit
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStockStatusBadge(product.stock_status)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nama Produk *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Harga *</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Harga Diskon</label>
                                        <input
                                            type="number"
                                            value={formData.discount_price}
                                            onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Kategori *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Kondisi *</label>
                                        <select
                                            required
                                            value={formData.condition}
                                            onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="Like New">Like New</option>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Good">Good</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Stok *</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) => {
                                                const stock = Number(e.target.value);
                                                let stock_status: 'available' | 'low_stock' | 'sold_out' = 'available';
                                                if (stock === 0) stock_status = 'sold_out';
                                                else if (stock <= 3) stock_status = 'low_stock';
                                                setFormData({ ...formData, stock, stock_status });
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Status Stok</label>
                                        <select
                                            value={formData.stock_status}
                                            onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="available">Tersedia</option>
                                            <option value="low_stock">Stok Terbatas</option>
                                            <option value="sold_out">Sold Out</option>
                                        </select>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Otomatis berubah saat stok diubah
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Lokasi *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">URL Gambar (satu per baris)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.images.join('\n')}
                                        onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(url => url.trim()) })}
                                        placeholder="https://example.com/image1.jpg"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_rooted}
                                            onChange={(e) => setFormData({ ...formData, is_rooted: e.target.checked })}
                                            className="w-4 h-4 text-primary focus:ring-primary rounded"
                                        />
                                        <span className="text-sm font-medium">Rooted</span>
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        {editingProduct ? 'Update' : 'Tambah'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
