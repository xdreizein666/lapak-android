import { useState, useEffect } from 'react';
import { contactApi } from '../lib/api/contact';
import { type ContactMessage, isConfigured } from '../lib/supabaseClient';

type UseContactOptions = {
    status?: string;
    autoFetch?: boolean;
};

// Mock data untuk fallback
const mockMessages: ContactMessage[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+62 812-3456-7890',
        brand: 'Xiaomi',
        message: 'Saya ingin root Xiaomi Redmi Note 12 Pro saya. Berapa biayanya?',
        status: 'new',
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+62 813-4567-8901',
        brand: 'Samsung',
        message: 'Apakah ada garansi jika unlock bootloader gagal?',
        status: 'read',
        created_at: new Date(Date.now() - 86400000).toISOString(),
    },
];

export function useContact(options: UseContactOptions = {}) {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { status, autoFetch = true } = options;

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!isConfigured) {
                // Use mock data if Supabase not configured
                console.warn('Using mock data - Supabase not configured');
                let filtered = [...mockMessages];
                if (status) filtered = filtered.filter(m => m.status === status);
                setMessages(filtered);
                setLoading(false);
                return;
            }

            const data = await contactApi.getAll({ status });
            setMessages(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching contact messages:', err);
            // Fallback to mock data on error
            setMessages(mockMessages);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchMessages();
        }
    }, [status, autoFetch]);

    const createMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => {
        try {
            const newMessage = await contactApi.create(message);
            setMessages((prev) => [newMessage, ...prev]);
            return newMessage;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updateMessageStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
        try {
            const updated = await contactApi.updateStatus(id, status);
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? updated : m))
            );
            return updated;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            await contactApi.delete(id);
            setMessages((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        messages,
        loading,
        error,
        refetch: fetchMessages,
        createMessage,
        updateMessageStatus,
        deleteMessage,
    };
}