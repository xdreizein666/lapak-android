import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  TrendingUp,
  Activity,
  Radio,
  BarChart3,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { useBlog } from '../../hooks/useBlog';
import { useContact } from '../../hooks/useContact';
import { RealTimeCounter } from './RealTimeCounter';
import { ProjectModal } from './ProjectModal';
import { BlogModal } from './BlogModal';
import { SettingsModal } from './SettingsModal';
import type { Project, BlogPost } from '../../lib/supabaseClient';

type TabType = 'overview' | 'projects' | 'blog' | 'contact' | 'settings';

export function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from Supabase
  const {
    projects,
    loading: projectsLoading,
    createProject,
    updateProject,
    deleteProject,
    refetch: refetchProjects
  } = useProjects({ autoFetch: true });

  const {
    posts,
    loading: postsLoading,
    createPost,
    updatePost,
    deletePost,
    refetch: refetchPosts
  } = useBlog({ status: undefined, autoFetch: true }); // Get all including drafts

  const {
    messages,
    loading: messagesLoading,
    updateMessageStatus,
    deleteMessage,
    refetch: refetchMessages
  } = useContact({ autoFetch: true });

  // Modal states
  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    project: Project | null;
  }>({ isOpen: false, mode: 'create', project: null });

  const [blogModal, setBlogModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    post: BlogPost | null;
  }>({ isOpen: false, mode: 'create', post: null });

  const [settingsModal, setSettingsModal] = useState(false);

  // Website settings
  const [websiteSettings, setWebsiteSettings] = useState([
    { key: 'site_title', label: 'Judul Website', value: 'Lapak Android', type: 'text' as const, placeholder: 'Lapak Android' },
    { key: 'site_tagline', label: 'Tagline', value: 'Spesialis Root & Custom ROM', type: 'text' as const, placeholder: 'Spesialis Root & Custom ROM' },
    { key: 'whatsapp_number', label: 'Nomor WhatsApp', value: '+6281234567890', type: 'tel' as const, placeholder: '+6281234567890' },
    { key: 'email', label: 'Email Kontak', value: 'info@lapakandroid.com', type: 'email' as const, placeholder: 'info@lapakandroid.com' },
    { key: 'address', label: 'Alamat', value: 'Jakarta, Indonesia', type: 'text' as const, placeholder: 'Jakarta, Indonesia' },
    { key: 'facebook_url', label: 'Facebook URL', value: 'https://facebook.com/lapakandroid', type: 'url' as const, placeholder: 'https://facebook.com/...' },
    { key: 'instagram_url', label: 'Instagram URL', value: 'https://instagram.com/lapakandroid', type: 'url' as const, placeholder: 'https://instagram.com/...' },
    { key: 'twitter_url', label: 'Twitter URL', value: 'https://twitter.com/lapakandroid', type: 'url' as const, placeholder: 'https://twitter.com/...' },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Berhasil logout');
  };

  // Project handlers
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
      refetchProjects();
    } catch (error) {
      toast.error('Terjadi kesalahan');
      console.error(error);
      throw error;
    }
  };

  // Blog handlers
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

  // Message handlers
  const handleDeleteMessage = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      try {
        await deleteMessage(id);
        toast.success('Pesan berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus pesan');
        console.error(error);
      }
    }
  };

  const handleMessageStatusChange = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      await updateMessageStatus(id, status);
      toast.success('Status pesan diupdate');
    } catch (error) {
      toast.error('Gagal update status');
      console.error(error);
    }
  };

  // Settings handler
  const handleSaveSettings = async (settings: typeof websiteSettings) => {
    try {
      setWebsiteSettings(settings);
      toast.success('Pengaturan berhasil disimpan');
      // TODO: Save to Supabase website_settings table
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan');
      console.error(error);
      throw error;
    }
  };

  // Statistics
  const stats = [
    {
      icon: FolderOpen,
      label: 'Total Projects',
      value: projects.length,
      change: `${projects.filter(p => p.status === 'completed').length} completed`,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: FileText,
      label: 'Blog Posts',
      value: posts.filter(p => p.status === 'published').length,
      change: `${posts.filter(p => p.status === 'draft').length} draft`,
      color: 'text-secondary bg-secondary/10',
    },
    {
      icon: MessageSquare,
      label: 'New Messages',
      value: messages.filter(m => m.status === 'new').length,
      change: `${messages.length} total`,
      color: 'text-accent bg-accent/10',
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: projects.reduce((sum, p) => sum + (p.views || 0), 0) + posts.reduce((sum, p) => sum + (p.views || 0), 0),
      change: 'All time',
      color: 'text-blue-600 bg-blue-600/10',
    },
  ];

  const tabs = [
    { id: 'overview' as TabType, name: 'Overview', icon: LayoutDashboard },
    { id: 'projects' as TabType, name: 'Projects', icon: FolderOpen },
    { id: 'blog' as TabType, name: 'Blog', icon: FileText },
    { id: 'contact' as TabType, name: 'Messages', icon: MessageSquare },
    { id: 'settings' as TabType, name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-card border-r border-border min-h-screen sticky top-20 p-6 hidden lg:block"
        >
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-foreground hover:bg-muted'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Kelola konten website Lapak Android
              </p>
            </motion.div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl ${stat.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        <h3 className="text-3xl mb-1">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Real-time Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Radio className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3>Live Real-Time Metrics</h3>
                      <p className="text-sm text-muted-foreground">
                        Views counter dengan animasi increment otomatis
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <h4>Total Blog Views</h4>
                      </div>
                      <RealTimeCounter
                        endValue={posts.reduce((sum, p) => sum + (p.views || 0), 0)}
                        duration={3000}
                        className="text-4xl text-primary"
                      />
                    </div>

                    <div className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-6 w-6 text-secondary" />
                        <h4>Portfolio Views</h4>
                      </div>
                      <RealTimeCounter
                        endValue={projects.reduce((sum, p) => sum + (p.views || 0), 0)}
                        duration={3000}
                        className="text-4xl text-secondary"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Activity className="h-5 w-5 text-accent" />
                    </div>
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={handleAddProject}
                      className="p-4 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors text-left"
                    >
                      <Plus className="h-5 w-5 text-primary mb-2" />
                      <p className="font-medium">Add Project</p>
                      <p className="text-xs text-muted-foreground">Tambah project baru</p>
                    </button>
                    <button
                      onClick={handleAddBlog}
                      className="p-4 bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-colors text-left"
                    >
                      <Plus className="h-5 w-5 text-secondary mb-2" />
                      <p className="font-medium">Add Article</p>
                      <p className="text-xs text-muted-foreground">Tulis artikel baru</p>
                    </button>
                    <button
                      onClick={() => setSettingsModal(true)}
                      className="p-4 bg-accent/10 hover:bg-accent/20 rounded-xl transition-colors text-left"
                    >
                      <Settings className="h-5 w-5 text-accent mb-2" />
                      <p className="font-medium">Settings</p>
                      <p className="text-xs text-muted-foreground">Atur konfigurasi</p>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2>Projects Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {projects.length} total projects
                    </p>
                  </div>
                  <button
                    onClick={handleAddProject}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Project
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Projects List */}
                {projectsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-muted-foreground mt-4">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Belum ada project</p>
                    <button
                      onClick={handleAddProject}
                      className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
                    >
                      Tambah Project Pertama
                    </button>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th className="text-left p-4">Title</th>
                            <th className="text-left p-4">Brand</th>
                            <th className="text-left p-4">Category</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Views</th>
                            <th className="text-right p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter((project) =>
                              project.title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((project) => (
                              <tr
                                key={project.id}
                                className="border-b border-border hover:bg-muted/30 transition-colors"
                              >
                                <td className="p-4">
                                  <p className="font-medium">{project.title}</p>
                                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                                    {project.description}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                                    {project.brand}
                                  </span>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {project.category}
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-3 py-1 rounded-lg text-sm ${project.status === 'completed'
                                      ? 'bg-green-500/10 text-green-600'
                                      : 'bg-amber-500/10 text-amber-600'
                                      }`}
                                  >
                                    {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span>{project.views || 0}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditProject(project)}
                                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 rounded-lg transition-colors"
                                      title="Delete"
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
                  </div>
                )}
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2>Blog Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {posts.filter(p => p.status === 'published').length} published, {posts.filter(p => p.status === 'draft').length} draft
                    </p>
                  </div>
                  <button
                    onClick={handleAddBlog}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Article
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Blog Posts Grid */}
                {postsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-muted-foreground mt-4">Loading articles...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Belum ada artikel</p>
                    <button
                      onClick={handleAddBlog}
                      className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
                    >
                      Tulis Artikel Pertama
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts
                      .filter((post) =>
                        post.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-xs">
                                {post.category}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-lg text-xs ${post.status === 'published'
                                  ? 'bg-green-500/10 text-green-600'
                                  : 'bg-amber-500/10 text-amber-600'
                                  }`}
                              >
                                {post.status === 'published' ? (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Published</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Draft</span>
                                  </div>
                                )}
                              </span>
                            </div>
                            <h4 className="mb-2 line-clamp-2">{post.title}</h4>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Eye className="h-4 w-4" />
                                <span>{post.views || 0} views</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditBlog(post)}
                                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(post.id)}
                                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Messages Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2>Contact Messages</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {messages.filter(m => m.status === 'new').length} new messages
                  </p>
                </div>

                {/* Messages List */}
                {messagesLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-muted-foreground mt-4">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Belum ada pesan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-card rounded-2xl border p-6 ${message.status === 'new'
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-border'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4>{message.name}</h4>
                              <span
                                className={`px-3 py-1 rounded-lg text-xs ${message.status === 'new'
                                  ? 'bg-primary/10 text-primary'
                                  : message.status === 'read'
                                    ? 'bg-amber-500/10 text-amber-600'
                                    : 'bg-green-500/10 text-green-600'
                                  }`}
                              >
                                {message.status === 'new' && 'New'}
                                {message.status === 'read' && 'Read'}
                                {message.status === 'replied' && 'Replied'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                            {message.phone && (
                              <p className="text-sm text-muted-foreground">{message.phone}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={message.status}
                              onChange={(e) => handleMessageStatusChange(message.id, e.target.value as any)}
                              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                            </select>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-4">
                          <p className="text-sm mb-2">
                            <strong>Brand:</strong> {message.brand}
                          </p>
                          <p className="text-sm">
                            <strong>Message:</strong>
                          </p>
                          <p className="text-sm mt-2">{message.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          {new Date(message.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2>Website Settings</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Konfigurasi informasi website Anda
                  </p>
                </div>

                {/* Settings Card */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="space-y-6">
                    {websiteSettings.map((setting) => (
                      <div key={setting.key}>
                        <label className="block text-sm mb-2">{setting.label}</label>
                        <input
                          type={setting.type}
                          value={setting.value}
                          onChange={(e) => {
                            setWebsiteSettings((prev) =>
                              prev.map((s) =>
                                s.key === setting.key ? { ...s, value: e.target.value } : s
                              )
                            );
                          }}
                          placeholder={setting.placeholder}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <button
                      onClick={() => handleSaveSettings(websiteSettings)}
                      className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Simpan Pengaturan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModal.isOpen}
        onClose={() => setProjectModal({ isOpen: false, mode: 'create', project: null })}
        onSubmit={handleProjectSubmit}
        project={projectModal.project}
        mode={projectModal.mode}
      />

      <BlogModal
        isOpen={blogModal.isOpen}
        onClose={() => setBlogModal({ isOpen: false, mode: 'create', post: null })}
        onSubmit={handleBlogSubmit}
        post={blogModal.post}
        mode={blogModal.mode}
      />

      <SettingsModal
        isOpen={settingsModal}
        onClose={() => setSettingsModal(false)}
        onSave={handleSaveSettings}
        initialSettings={websiteSettings}
      />
    </div>
  );
}
