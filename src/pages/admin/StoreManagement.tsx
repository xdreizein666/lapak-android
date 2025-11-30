import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Search,
    ShoppingBag,
    Filter,
    MoreVertical,
    Eye,
    Package,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../hooks/useStore';
import { StoreModal } from '../../components/admin/StoreModal';
import type { Product } from '../../lib/supabaseClient';

export function StoreManagement() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    const {
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        refetch
    } = useStore({ autoFetch: true });

    const [storeModal, setStoreModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        product: Product | null;
    }>({ isOpen: false, mode: 'create', product: null });

    const handleAddProduct = () => {
        setStoreModal({ isOpen: true, mode: 'create', product: null });
    };

    const handleEditProduct = (product: Product) => {
        setStoreModal({ isOpen: true, mode: 'edit', product });
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await deleteProduct(id);
                toast.success('Produk berhasil dihapus');
            } catch (error) {
                toast.error('Gagal menghapus produk');
                console.error(error);
            }
        }
    };

    const handleProductSubmit = async (data: Partial<Product>) => {
        try {
            if (storeModal.mode === 'create') {
                await createProduct(data as any);
                toast.success('Produk berhasil ditambahkan');
            } else if (storeModal.product) {
                await updateProduct(storeModal.product.id, data);
                toast.success('Produk berhasil diupdate');
            }
            refetch();
        } catch (error) {
            toast.error('Terjadi kesalahan');
            console.error(error);
            throw error;
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            filterCategory === 'all' ||
            product.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(products.map(p => p.category))];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-muted/30 pt-20">
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-1">Store Management</h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola katalog produk dan stok barang
                            </p>
                        </div>
                        <button
                            onClick={handleAddProduct}
                            className="px-4 py-2 md:px-6 md:py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm md:text-base"
                        >
                            <Plus className="h-4 w-4 md:h-5 md:w-5" />
                            <span>Tambah Produk</span>
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
                >
                    {[
                        { label: 'Total Produk', value: products.length, color: 'text-foreground' },
                        { label: 'Total Stock', value: products.reduce((sum, p) => sum + (p.stock || 0), 0), color: 'text-blue-600' },
                        { label: 'Low Stock', value: products.filter(p => p.stock < 3).length, color: 'text-amber-600' },
                        { label: 'Terjual', value: products.reduce((sum, p) => sum + (p.sold_count || 0), 0), color: 'text-green-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card rounded-xl p-4 md:p-5 border border-border">
                            <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                            <h3 className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                        </div>
                    ))}
                </motion.div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-xl border border-border p-4 mb-4"
                >
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari produk..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'Semua Kategori' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                >
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-sm text-muted-foreground">Memuat produk...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                {searchQuery || filterCategory !== 'all' ? 'Tidak ada produk yang ditemukan' : 'Belum ada produk'}
                            </p>
                            {!searchQuery && filterCategory === 'all' && (
                                <button
                                    onClick={handleAddProduct}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                                >
                                    Tambah Produk Pertama
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="px-4 py-3 font-medium">Produk</th>
                                        <th className="px-4 py-3 font-medium hidden md:table-cell">Kategori</th>
                                        <th className="px-4 py-3 font-medium">Harga</th>
                                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Stock</th>
                                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Terjual</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm truncate">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground md:hidden">{product.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm hidden md:table-cell">
                                                <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    {product.discount_price && product.discount_price > 0 ? (
                                                        <>
                                                            <p className="text-sm font-medium text-green-600">{formatPrice(product.discount_price)}</p>
                                                            <p className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${product.stock > 5
                                                    ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                                                    : product.stock > 0
                                                        ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                                                        : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                                                    }`}>
                                                    {product.stock} unit
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                                                {product.sold_count || 0}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    {filteredProducts.length > 0 && (
                        <div className="px-4 py-3 border-t border-border bg-muted/30">
                            <p className="text-xs text-muted-foreground text-center">
                                Menampilkan {filteredProducts.length} dari {products.length} produk
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            <StoreModal
                isOpen={storeModal.isOpen}
                onClose={() => setStoreModal({ isOpen: false, mode: 'create', product: null })}
                onSubmit={handleProductSubmit}
                product={storeModal.product}
                mode={storeModal.mode}
            />
        </div>
    );
}
