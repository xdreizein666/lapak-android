import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Shield, Wrench } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface HeroSlideEditorProps {
    slideNumber: number;
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const iconOptions = [
    { value: 'Zap', label: 'Zap (Lightning)', icon: Zap },
    { value: 'Shield', label: 'Shield (Security)', icon: Shield },
    { value: 'Wrench', label: 'Wrench (Tools)', icon: Wrench },
];

const colorOptions = [
    { value: 'from-green-500 to-emerald-600', label: 'Green', preview: 'bg-gradient-to-r from-green-500 to-emerald-600' },
    { value: 'from-blue-500 to-cyan-600', label: 'Blue', preview: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
    { value: 'from-amber-500 to-orange-600', label: 'Orange', preview: 'bg-gradient-to-r from-amber-500 to-orange-600' },
    { value: 'from-purple-500 to-pink-600', label: 'Purple', preview: 'bg-gradient-to-r from-purple-500 to-pink-600' },
    { value: 'from-red-500 to-rose-600', label: 'Red', preview: 'bg-gradient-to-r from-red-500 to-rose-600' },
];

export function HeroSlideEditor({ slideNumber, settings, onChange }: HeroSlideEditorProps) {
    const [isExpanded, setIsExpanded] = useState(slideNumber === 1);

    const prefix = `hero_slide${slideNumber}`;
    const title = settings[`${prefix}_title`] || '';
    const subtitle = settings[`${prefix}_subtitle`] || '';
    const image = settings[`${prefix}_image`] || '';
    const icon = settings[`${prefix}_icon`] || 'Zap';
    const color = settings[`${prefix}_color`] || 'from-green-500 to-emerald-600';

    return (
        <div className="border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
                        {React.createElement(iconOptions.find(opt => opt.value === icon)?.icon || Zap, {
                            className: "h-5 w-5 text-white"
                        })}
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold">Slide {slideNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                            {title || `Slide ${slideNumber} - Belum diisi`}
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 space-y-5 bg-card">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Judul Slide</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => onChange(`${prefix}_title`, e.target.value)}
                            placeholder="Contoh: Ahli Root & Custom ROM Android"
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Subtitle</label>
                        <textarea
                            value={subtitle}
                            onChange={(e) => onChange(`${prefix}_subtitle`, e.target.value)}
                            placeholder="Deskripsi singkat untuk slide ini..."
                            rows={3}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <ImageUploader
                            value={image}
                            onChange={(url) => onChange(`${prefix}_image`, url)}
                            label="Gambar Background"
                            description="Upload gambar atau masukkan URL. Maksimal 5MB. Rekomendasi: 1920x1080px"
                        />
                    </div>

                    {/* Icon Selection */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Icon</label>
                        <div className="grid grid-cols-3 gap-3">
                            {iconOptions.map((opt) => {
                                const IconComponent = opt.icon;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => onChange(`${prefix}_icon`, opt.value)}
                                        className={`p-4 border-2 rounded-xl transition-all ${icon === opt.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <IconComponent className="h-6 w-6 mx-auto mb-2" />
                                        <p className="text-xs text-center">{opt.label}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Warna Icon</label>
                        <div className="grid grid-cols-5 gap-3">
                            {colorOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => onChange(`${prefix}_color`, opt.value)}
                                    className={`relative h-12 rounded-xl transition-all ${opt.preview} ${color === opt.value
                                        ? 'ring-2 ring-offset-2 ring-primary'
                                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-primary/50'
                                        }`}
                                    title={opt.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
