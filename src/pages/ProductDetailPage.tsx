import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Heart,
    Star,
    MapPin,
    Shield,
    Zap,
    Package,
    MessageCircle,
    Share2,
    ChevronLeft,
    ChevronRight,
    Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import { storeApi } from '../lib/api/store';
import { Product } from '../lib/supabaseClient';
import { SEO } from '../components/SEO';
import { trackProductView, trackWhatsAppClick } from '../lib/ga4';

export function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await storeApi.getById(id);
                setProduct(data);
                // Track product view
                if (data) {
                    trackProductView(data.id, data.name);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Gagal memuat produk. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleWhatsAppOrder = () => {
        if (!product) return;

        // Track WhatsApp click
        trackWhatsAppClick(`Product Detail - ${product.name}`);

        // Format pesan WhatsApp
        const currentPrice = product.discount_price || product.price;
        const message = `Halo, saya tertarik dengan produk ini:\n\n*${product.name}*\nHarga: ${formatPrice(currentPrice)}\nJumlah: ${quantity} unit\n\nApakah masih tersedia?`;

        // Nomor WhatsApp 
        const phoneNumber = '6285283151990';

        // Encode message untuk URL
        const encodedMessage = encodeURIComponent(message);

        // Buka WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    const handleShare = () => {
        if (!product) return;

        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Lihat ${product.name} - ${formatPrice(product.discount_price || product.price)}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link berhasil disalin!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Memuat detail produk...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Produk Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-6">{error || 'Produk yang Anda cari mungkin sudah dihapus atau tidak tersedia.'}</p>
                    <button
                        onClick={() => navigate('/store')}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Kembali ke Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <SEO
                title={`${product.name} - Lapak Android`}
                description={`${product.description.substring(0, 155)}...`}
                keywords={`${product.name}, ${product.category}, ${product.condition}, handphone second, hp bekas, jual beli hp`}
                canonicalUrl={`/product/${product.id}`}
                ogType="product"
                ogImage={product.images && product.images.length > 0 ? product.images[0] : undefined}
            />
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <button onClick={() => navigate('/store')} className="hover:text-green-600 flex items-center gap-1">
                            <ChevronLeft className="h-4 w-4" />
                            Kembali ke Store
                        </button>
                        <span>/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6 mb-4">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        className={`w-full h-full object-cover ${product.stock_status === 'sold_out' ? 'opacity-50 grayscale' : ''
                                            }`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Smartphone className="h-24 w-24" />
                                    </div>
                                )}

                                {/* Sold Out Overlay */}
                                {product.stock_status === 'sold_out' && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-2xl transform rotate-[-15deg] shadow-2xl">
                                                SOLD OUT
                                            </div>
                                            <p className="text-white text-lg mt-3 font-medium">Stok Habis</p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {product.images && product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
                                            }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                                        >
                                            <ChevronLeft className="h-6 w-6 text-gray-800" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                                        >
                                            <ChevronRight className="h-6 w-6 text-gray-800" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Slider */}
                            {product.images && product.images.length > 1 && (
                                <div className="relative">
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                        {product.images.map((img: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all snap-start ${selectedImage === idx
                                                    ? 'border-green-500 ring-2 ring-green-500 ring-offset-2'
                                                    : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Description */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Detail Produk</h2>
                            <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-line text-gray-700">{product.description}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Purchase Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-24">
                            {/* Product Title */}
                            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

                            {/* Rating & Sold */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {product.stock_status === 'sold_out' && (
                                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                                            Sold Out
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-600 text-sm">{product.sold_count || 0} terjual</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {product.discount_price && product.discount_price > 0 ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-sm font-medium">PROMO</span>
                                            <div className="text-3xl font-bold text-green-600">
                                                {formatPrice(product.discount_price)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-gray-500/10 text-gray-600 rounded-lg text-sm font-medium">Harga Asli</span>
                                            <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-bold rounded">
                                                {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {formatPrice(product.price)}
                                    </div>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {product.is_rooted && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
                                        <Zap className="h-4 w-4" />
                                        Rooted
                                    </span>
                                )}

                                {product.stock_status === 'low_stock' && (
                                    <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
                                        Stok Terbatas
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                    {product.condition}
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                    {product.category}
                                </span>
                            </div>

                            {/* Location & Stock */}
                            <div className="space-y-3 mb-6 pb-6 border-b">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">Dikirim dari:</span>
                                    <span className="font-medium">{product.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">Stok:</span>
                                    {product.stock_status === 'sold_out' ? (
                                        <span className="font-medium text-red-600">Habis</span>
                                    ) : (
                                        <span className={`font-medium ${product.stock <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {product.stock} unit tersisa
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Shield className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600">Garansi:</span>
                                    <span className="font-medium">Garansi Toko</span>
                                </div>
                            </div>

                            {/* Quantity */}
                            {product.stock_status !== 'sold_out' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Jumlah</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                                            className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3 mb-6">
                                {product.stock_status === 'sold_out' ? (
                                    <button
                                        disabled
                                        className="w-full py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed font-medium flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Stok Habis
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleWhatsAppOrder}
                                        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Pesan via WhatsApp
                                    </button>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                        <span className="text-sm">Wishlist</span>
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="h-5 w-5 text-gray-600" />
                                        <span className="text-sm">Share</span>
                                    </button>
                                </div>
                            </div>

                            {/* Seller Info */}
                            {/* <div className="pt-6 border-t">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="font-medium">Lapak Android Official</div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span>4.9</span>
                                            <span className="text-gray-400">| Terpercaya</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="text-sm">Chat Penjual</span>
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
