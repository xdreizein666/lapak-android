import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadApi } from '../../lib/api/upload';
import { toast } from 'sonner';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    description?: string;
}

export function ImageUploader({ value, onChange, label, description }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5MB');
            return;
        }

        try {
            setUploading(true);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Supabase
            const { url } = await uploadApi.uploadImage(file, 'images', 'about');
            onChange(url);
            setPreview(url);
            toast.success('Gambar berhasil diupload');
        } catch (error: any) {
            console.error('Upload error:', error);

            // Provide more specific error messages
            let errorMessage = 'Gagal mengupload gambar';

            if (error.message) {
                if (error.message.includes('406')) {
                    errorMessage = 'Error 406: Bucket storage belum dikonfigurasi dengan benar. Periksa SUPABASE_STORAGE_SETUP.md';
                } else if (error.message.includes('Invalid file type')) {
                    errorMessage = error.message;
                } else if (error.message.includes('not configured')) {
                    errorMessage = 'Supabase belum dikonfigurasi';
                } else {
                    errorMessage = `Upload gagal: ${error.message}`;
                }
            }

            toast.error(errorMessage, {
                duration: 5000,
                description: 'Periksa console browser (F12) untuk detail error'
            });
            setPreview(value); // Reset to original
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{label}</span>
                </label>
            )}

            <div className="flex gap-4 items-start">
                {/* Preview */}
                {preview && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0 group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Upload Button */}
                <div className="flex-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full px-4 py-3 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Mengupload...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="h-5 w-5" />
                                <span>Upload Gambar</span>
                            </>
                        )}
                    </button>

                    {description && (
                        <p className="text-xs text-muted-foreground mt-2">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* URL Input (fallback) */}
            <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                    Atau masukkan URL gambar:
                </label>
                <input
                    type="url"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setPreview(e.target.value);
                    }}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
            </div>
        </div>
    );
}
