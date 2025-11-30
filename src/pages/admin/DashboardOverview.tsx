import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    FolderOpen,
    FileText,
    MessageSquare,
    Settings,
    Eye,
    TrendingUp,
    Activity,
    Radio,
    BarChart3,
    LogOut,
    ArrowRight,
    CheckCircle,
    Clock,
    ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { useBlog } from '../../hooks/useBlog';
import { useContact } from '../../hooks/useContact';
import { useStore } from '../../hooks/useStore';
import { RealTimeCounter } from '../../components/admin/RealTimeCounter';

export function DashboardOverview() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Fetch data from Supabase
    const { projects, loading: projectsLoading } = useProjects({ autoFetch: true });
    const { posts, loading: postsLoading } = useBlog({ status: undefined, autoFetch: true });
    const { products } = useStore({ autoFetch: true });
    const { messages, loading: messagesLoading } = useContact({ autoFetch: true });

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Berhasil logout');
    };

    // Statistics
    const stats = [
        {
            icon: FolderOpen,
            label: 'Total Projects',
            value: projects.length,
            change: `${projects.filter(p => p.status === 'completed').length} completed`,
            color: 'text-primary bg-primary/10',
            link: '/admin/projects',
        },
        {
            icon: FileText,
            label: 'Blog Posts',
            value: posts.filter(p => p.status === 'published').length,
            change: `${posts.filter(p => p.status === 'draft').length} draft`,
            color: 'text-secondary bg-secondary/10',
            link: '/admin/blog',
        },
        {
            icon: MessageSquare,
            label: 'New Messages',
            value: messages.filter(m => m.status === 'new').length,
            change: `${messages.length} total`,
            color: 'text-accent bg-accent/10',
            link: '/admin/messages',
        },
        {
            icon: ShoppingBag,
            label: 'Total Products',
            value: products.length,
            change: `${products.filter(p => p.stock > 0).length} in stock`,
            color: 'text-green-600 bg-green-600/10',
            link: '/admin/store',
        },
        {
            icon: Eye,
            label: 'Total Views',
            value: projects.reduce((sum, p) => sum + (p.views || 0), 0) + posts.reduce((sum, p) => sum + (p.views || 0), 0),
            change: 'All time',
            color: 'text-blue-600 bg-blue-600/10',
            link: '#',
        },
    ];

    const quickActions = [
        {
            icon: FolderOpen,
            title: 'Manage Projects',
            description: 'View, add, edit, or delete projects',
            color: 'bg-primary/10 hover:bg-primary/20 text-primary',
            link: '/admin/projects',
        },
        {
            icon: FileText,
            title: 'Manage Blog',
            description: 'Write and publish articles',
            color: 'bg-secondary/10 hover:bg-secondary/20 text-secondary',
            link: '/admin/blog',
        },
        {
            icon: MessageSquare,
            title: 'View Messages',
            description: 'Check and respond to messages',
            color: 'bg-accent/10 hover:bg-accent/20 text-accent',
            link: '/admin/messages',
        },
        {
            icon: ShoppingBag,
            title: 'Manage Store',
            description: 'Manage products and stock',
            color: 'bg-green-600/10 hover:bg-green-600/20 text-green-600',
            link: '/admin/store',
        },
        {
            icon: Settings,
            title: 'Settings',
            description: 'Configure website settings',
            color: 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-600',
            link: '/admin/settings',
        },
    ];

    // Recent projects
    const recentProjects = projects.slice(0, 5);

    // Recent posts
    const recentPosts = posts.slice(0, 5);

    // Recent messages
    const recentMessages = messages.slice(0, 5);

    return (
        <div className="min-h-screen bg-muted/30 pt-20">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <h1 className="mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Selamat datang! Kelola konten website Lapak Android
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => stat.link !== '#' && navigate(stat.link)}
                                className={`bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all ${stat.link !== '#' ? 'cursor-pointer' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    {stat.link !== '#' && <ArrowRight className="h-5 w-5 text-muted-foreground" />}
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
                    className="bg-card rounded-2xl p-6 border border-border mb-8"
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

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Activity className="h-5 w-5 text-accent" />
                        </div>
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <motion.button
                                    key={action.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    onClick={() => navigate(action.link)}
                                    className={`p-6 ${action.color} rounded-xl transition-all text-left group`}
                                >
                                    <Icon className="h-6 w-6 mb-3" />
                                    <p className="font-medium mb-1">{action.title}</p>
                                    <p className="text-xs opacity-80">{action.description}</p>
                                    <ArrowRight className="h-4 w-4 mt-3 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Projects */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-card rounded-2xl p-6 border border-border"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4>Recent Projects</h4>
                            <button
                                onClick={() => navigate('/admin/projects')}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {projectsLoading ? (
                                <p className="text-sm text-muted-foreground">Loading...</p>
                            ) : recentProjects.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No projects yet</p>
                            ) : (
                                recentProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => navigate('/admin/projects')}
                                    >
                                        {project.image_url ? (
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                                                <FolderOpen className="h-5 w-5 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{project.title}</p>
                                            <p className="text-xs text-muted-foreground">{project.brand}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Blog Posts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-card rounded-2xl p-6 border border-border"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4>Recent Articles</h4>
                            <button
                                onClick={() => navigate('/admin/blog')}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {postsLoading ? (
                                <p className="text-sm text-muted-foreground">Loading...</p>
                            ) : recentPosts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No articles yet</p>
                            ) : (
                                recentPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => navigate('/admin/blog')}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm truncate">{post.title}</p>
                                                {post.status === 'published' ? (
                                                    <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                                ) : (
                                                    <Clock className="h-3 w-3 text-amber-600 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{post.category}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Messages */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-card rounded-2xl p-6 border border-border"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4>Recent Messages</h4>
                            <button
                                onClick={() => navigate('/admin/messages')}
                                className="text-sm text-primary hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {messagesLoading ? (
                                <p className="text-sm text-muted-foreground">Loading...</p>
                            ) : recentMessages.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No messages yet</p>
                            ) : (
                                recentMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => navigate('/admin/messages')}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-medium">{message.name}</p>
                                            {message.status === 'new' && (
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {message.message}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
