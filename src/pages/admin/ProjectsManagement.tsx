import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Search,
    FolderKanban,
    Eye,
    Package,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProjects } from '../../hooks/useProjects';
import { ProjectModal } from '../../components/admin/ProjectModal';
import type { Project } from '../../lib/supabaseClient';

export function ProjectsManagement() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBrand, setFilterBrand] = useState<string>('all');

    const {
        projects,
        loading,
        createProject,
        updateProject,
        deleteProject,
        refetch
    } = useProjects({ autoFetch: true });

    const [projectModal, setProjectModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        project: Project | null;
    }>({ isOpen: false, mode: 'create', project: null });

    const handleAddProject = () => {
        setProjectModal({ isOpen: true, mode: 'create', project: null });
    };

    const handleEditProject = (project: Project) => {
        setProjectModal({ isOpen: true, mode: 'edit', project });
    };

    const handleDeleteProject = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus project ini?')) {
            try {
                await deleteProject(id);
                toast.success('Project berhasil dihapus');
            } catch (error) {
                toast.error('Gagal menghapus project');
                console.error(error);
            }
        }
    };

    const handleProjectSubmit = async (data: Partial<Project>) => {
        try {
            if (projectModal.mode === 'create') {
                await createProject(data as any);
                toast.success('Project berhasil ditambahkan');
            } else if (projectModal.project) {
                await updateProject(projectModal.project.id, data);
                toast.success('Project berhasil diupdate');
            }
            refetch();
        } catch (error) {
            toast.error('Terjadi kesalahan');
            console.error(error);
            throw error;
        }
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBrand =
            filterBrand === 'all' ||
            project.brand === filterBrand;

        return matchesSearch && matchesBrand;
    });

    const brands = ['all', ...new Set(projects.map(p => p.brand))];

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
                            <h1 className="text-2xl md:text-3xl font-bold mb-1">Projects Management</h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola portfolio dan project showcase
                            </p>
                        </div>
                        <button
                            onClick={handleAddProject}
                            className="px-4 py-2 md:px-6 md:py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm md:text-base"
                        >
                            <Plus className="h-4 w-4 md:h-5 md:w-5" />
                            <span>Tambah Project</span>
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
                        { label: 'Total Projects', value: projects.length, color: 'text-foreground' },
                        { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'text-green-600' },
                        { label: 'Ongoing', value: projects.filter(p => p.status === 'ongoing').length, color: 'text-amber-600' },
                        { label: 'Total Views', value: projects.reduce((sum, p) => sum + (p.views || 0), 0), color: 'text-blue-600' },
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
                                placeholder="Cari project..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <select
                            value={filterBrand}
                            onChange={(e) => setFilterBrand(e.target.value)}
                            className="px-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {brands.map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand === 'all' ? 'Semua Brand' : brand}
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
                            <p className="text-sm text-muted-foreground">Memuat projects...</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                {searchQuery || filterBrand !== 'all' ? 'Tidak ada project yang ditemukan' : 'Belum ada project'}
                            </p>
                            {!searchQuery && filterBrand === 'all' && (
                                <button
                                    onClick={handleAddProject}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                                >
                                    Tambah Project Pertama
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="px-4 py-3 font-medium">Project</th>
                                        <th className="px-4 py-3 font-medium hidden md:table-cell">Brand</th>
                                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Kategori</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Views</th>
                                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 hidden sm:block">
                                                        {project.image_url ? (
                                                            <img
                                                                src={project.image_url}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FolderKanban className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 max-w-xs">
                                                        <p className="font-medium text-sm line-clamp-1">{project.title}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 md:hidden">
                                                            {project.brand}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm hidden md:table-cell">
                                                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                                    {project.brand}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                                                {project.category}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${project.status === 'completed'
                                                    ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                                                    : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                                                    }`}>
                                                    {project.status === 'completed' ? 'Selesai' : 'Ongoing'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    <span>{project.views || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditProject(project)}
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
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
                    {filteredProjects.length > 0 && (
                        <div className="px-4 py-3 border-t border-border bg-muted/30">
                            <p className="text-xs text-muted-foreground text-center">
                                Menampilkan {filteredProjects.length} dari {projects.length} projects
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            <ProjectModal
                isOpen={projectModal.isOpen}
                onClose={() => setProjectModal({ isOpen: false, mode: 'create', project: null })}
                onSubmit={handleProjectSubmit}
                project={projectModal.project}
                mode={projectModal.mode}
            />
        </div>
    );
}
