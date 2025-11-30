import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Search,
    FileText,
    Eye,
    Calendar,
    User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useBlog } from '../../hooks/useBlog';
import { BlogModal } from '../../components/admin/BlogModal';
import type { BlogPost } from '../../lib/supabaseClient';

export function BlogManagement() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

    const {
        posts,
        loading: postsLoading,
        createPost,
        updatePost,
        deletePost,
        refetch: refetchPosts
    } = useBlog({ status: undefined, autoFetch: true });

    const [blogModal, setBlogModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        post: BlogPost | null;
    }>({ isOpen: false, mode: 'create', post: null });

    const handleAddBlog = () => {
        setBlogModal({ isOpen: true, mode: 'create', post: null });
    };

    const handleEditBlog = (post: BlogPost) => {
        setBlogModal({ isOpen: true, mode: 'edit', post });
    };

    const handleDeleteBlog = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            try {
                await deletePost(id);
                toast.success('Artikel berhasil dihapus');
            } catch (error) {
                toast.error('Gagal menghapus artikel');
                console.error(error);
            }
        }
    };

    const handleBlogSubmit = async (data: Partial<BlogPost>) => {
        try {
            if (blogModal.mode === 'create') {
                await createPost(data as any);
                toast.success('Artikel berhasil ditambahkan');
            } else if (blogModal.post) {
                await updatePost(blogModal.post.id, data);
                toast.success('Artikel berhasil diupdate');
            }
            refetchPosts();
        } catch (error) {
            toast.error('Terjadi kesalahan');
            console.error(error);
            throw error;
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            post.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

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
                            <h1 className="text-2xl md:text-3xl font-bold mb-1">Blog Management</h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola semua artikel dan konten blog
                            </p>
                        </div>
                        <button
                            onClick={handleAddBlog}
                            className="px-4 py-2 md:px-6 md:py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm md:text-base"
                        >
                            <Plus className="h-4 w-4 md:h-5 md:w-5" />
                            <span>Tulis Artikel</span>
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
                        { label: 'Total Artikel', value: posts.length, color: 'text-foreground' },
                        { label: 'Published', value: posts.filter(p => p.status === 'published').length, color: 'text-green-600' },
                        { label: 'Draft', value: posts.filter(p => p.status === 'draft').length, color: 'text-amber-600' },
                        { label: 'Total Views', value: posts.reduce((sum, p) => sum + (p.views || 0), 0), color: 'text-blue-600' },
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
                                placeholder="Cari artikel..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'published', 'draft'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 text-sm rounded-lg transition-all ${filterStatus === status
                                        ? status === 'published'
                                            ? 'bg-green-600 text-white'
                                            : status === 'draft'
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-primary text-white'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    {status === 'all' ? 'Semua' : status === 'published' ? 'Published' : 'Draft'}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                >
                    {postsLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-sm text-muted-foreground">Memuat artikel...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                {searchQuery || filterStatus !== 'all' ? 'Tidak ada artikel yang ditemukan' : 'Belum ada artikel'}
                            </p>
                            {!searchQuery && filterStatus === 'all' && (
                                <button
                                    onClick={handleAddBlog}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                                >
                                    Tulis Artikel Pertama
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="px-4 py-3 font-medium">Artikel</th>
                                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Kategori</th>
                                        <th className="px-4 py-3 font-medium hidden md:table-cell">Penulis</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Views</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredPosts.map((post) => (
                                        <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 hidden sm:block">
                                                        {post.image_url ? (
                                                            <img
                                                                src={post.image_url}
                                                                alt={post.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FileText className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 max-w-xs">
                                                        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 lg:hidden">
                                                            {post.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm hidden lg:table-cell">
                                                <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                                                {post.author}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${post.status === 'published'
                                                    ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                                                    : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                                                    }`}>
                                                    {post.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    <span>{post.views || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditBlog(post)}
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBlog(post.id)}
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
                    {filteredPosts.length > 0 && (
                        <div className="px-4 py-3 border-t border-border bg-muted/30">
                            <p className="text-xs text-muted-foreground text-center">
                                Menampilkan {filteredPosts.length} dari {posts.length} artikel
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            <BlogModal
                isOpen={blogModal.isOpen}
                onClose={() => setBlogModal({ isOpen: false, mode: 'create', post: null })}
                onSubmit={handleBlogSubmit}
                post={blogModal.post}
                mode={blogModal.mode}
            />
        </div>
    );
}
