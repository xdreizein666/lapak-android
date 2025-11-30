import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    MessageSquare,
    Trash2,
    Search,
    Mail,
    Phone,
    User,
    Calendar,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useContact } from '../../hooks/useContact';

export function MessagesManagement() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all');

    // Fetch data from Supabase
    const {
        messages,
        loading: messagesLoading,
        updateMessageStatus,
        deleteMessage,
    } = useContact({ autoFetch: true });

    // Handlers
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

    // Filter messages
    const filteredMessages = messages.filter((message) => {
        const matchesSearch =
            message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.message.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            message.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-muted/30 pt-20">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Dashboard</span>
                    </button>

                    <div>
                        <h1 className="mb-2">Contact Messages</h1>
                        <p className="text-muted-foreground">
                            Kelola semua pesan masuk dari form kontak
                        </p>
                    </div>
                </motion.div>

                {/* Statistics Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <div className="bg-card rounded-2xl p-6 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Total Messages</p>
                        <h3 className="text-3xl mb-1">{messages.length}</h3>
                        <p className="text-xs text-muted-foreground">All messages</p>
                    </div>

                    <div className="bg-card rounded-2xl p-6 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">New</p>
                        <h3 className="text-3xl mb-1 text-primary">
                            {messages.filter(m => m.status === 'new').length}
                        </h3>
                        <p className="text-xs text-muted-foreground">Unread messages</p>
                    </div>

                    <div className="bg-card rounded-2xl p-6 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Read</p>
                        <h3 className="text-3xl mb-1 text-amber-600">
                            {messages.filter(m => m.status === 'read').length}
                        </h3>
                        <p className="text-xs text-muted-foreground">Read messages</p>
                    </div>

                    <div className="bg-card rounded-2xl p-6 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Replied</p>
                        <h3 className="text-3xl mb-1 text-green-600">
                            {messages.filter(m => m.status === 'replied').length}
                        </h3>
                        <p className="text-xs text-muted-foreground">Responded</p>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 space-y-4"
                >
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search messages by name, email, brand, or content..."
                            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'all'
                                    ? 'bg-primary text-white'
                                    : 'bg-card border border-border hover:bg-muted'
                                }`}
                        >
                            All ({messages.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('new')}
                            className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'new'
                                    ? 'bg-primary text-white'
                                    : 'bg-card border border-border hover:bg-muted'
                                }`}
                        >
                            New ({messages.filter(m => m.status === 'new').length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('read')}
                            className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'read'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-card border border-border hover:bg-muted'
                                }`}
                        >
                            Read ({messages.filter(m => m.status === 'read').length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('replied')}
                            className={`px-4 py-2 rounded-xl transition-all ${filterStatus === 'replied'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-card border border-border hover:bg-muted'
                                }`}
                        >
                            Replied ({messages.filter(m => m.status === 'replied').length})
                        </button>
                    </div>
                </motion.div>

                {/* Messages List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    {messagesLoading ? (
                        <div className="text-center py-12 bg-card rounded-2xl border border-border">
                            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-muted-foreground">Loading messages...</p>
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="text-center py-12 bg-card rounded-2xl border border-border">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">
                                {searchQuery || filterStatus !== 'all' ? 'No messages found' : 'Belum ada pesan'}
                            </p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
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
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
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
                                        </div>

                                        {/* Contact Info */}
                                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <span>{message.email}</span>
                                            </div>
                                            {message.phone && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{message.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Brand */}
                                        <div className="mb-4">
                                            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-sm">
                                                {message.brand}
                                            </span>
                                        </div>

                                        {/* Message */}
                                        <div className="bg-muted/50 rounded-xl p-4 mb-4">
                                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {new Date(message.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 ml-4">
                                        <select
                                            value={message.status}
                                            onChange={(e) => handleMessageStatusChange(message.id, e.target.value as any)}
                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm min-w-[120px]"
                                        >
                                            <option value="new">New</option>
                                            <option value="read">Read</option>
                                            <option value="replied">Replied</option>
                                        </select>
                                        <button
                                            onClick={() => handleDeleteMessage(message.id)}
                                            className="px-3 py-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Summary */}
                {filteredMessages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-center text-sm text-muted-foreground"
                    >
                        Showing {filteredMessages.length} of {messages.length} messages
                        {(searchQuery || filterStatus !== 'all') && ` (filtered)`}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
