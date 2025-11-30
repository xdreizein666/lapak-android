import { supabase, type ContactMessage } from '../supabaseClient';

export const contactApi = {
    // Get all contact messages with optional status filter
    async getAll(filters?: { status?: string }) {
        let query = supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as ContactMessage[];
    },

    // Create new contact message
    async create(message: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) {
        const { data, error } = await supabase
            .from('contact_messages')
            .insert([{ ...message, status: 'new' }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create message (check RLS policies)');
        return data as ContactMessage;
    },

    // Update message status
    async updateStatus(id: string, status: 'new' | 'read' | 'replied') {
        const { data, error } = await supabase
            .from('contact_messages')
            .update({ status })
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Message not found or permission denied (check RLS policies)');
        return data as ContactMessage;
    },

    // Delete message
    async delete(id: string) {
        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get unread count
    async getUnreadCount() {
        const { count, error } = await supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new');

        if (error) throw error;
        return count || 0;
    }
};
