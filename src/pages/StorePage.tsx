import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    Search,
    SlidersHorizontal,
    Heart,
    Star,
    MapPin,
    Shield,
    Zap,
    X,
    Package,
    Smartphone
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { SEO } from '../components/SEO';
import { trackProductClick, trackSearch } from '../lib/ga4';

const conditions = ['Semua Kondisi', 'Like New', 'Excellent', 'Good'];

export function StorePage() {
    const navigate = useNavigate();
    const { products, loading } = useStore({ autoFetch: true });

    // Derive unique brands (categories) and locations from products
    const brands = ['Semua Brand', ...new Set(products.map(p => p.category))].sort();
    const locations = ['Semua Lokasi', ...new Set(products.map(p => p.location))].sort();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('Semua Brand');
    const [selectedCondition, setSelectedCondition] = useState('Semua Kondisi');
    const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('relevant');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}rb`;
        return num.toString();
    };

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
        );
    };

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBrand = selectedBrand === 'Semua Brand' || product.category === selectedBrand;
            const matchesCondition = selectedCondition === 'Semua Kondisi' || product.condition === selectedCondition;
            const matchesLocation = selectedLocation === 'Semua Lokasi' || product.location.includes(selectedLocation);

            const currentPrice = product.discount_price || product.price;
            const matchesPrice = currentPrice >= priceRange[0] && currentPrice <= priceRange[1];

            return matchesSearch && matchesBrand && matchesCondition && matchesLocation && matchesPrice;
        })
        .sort((a, b) => {
            const priceA = a.discount_price || a.price;
            const priceB = b.discount_price || b.price;

            switch (sortBy) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'rating': return b.rating - a.rating;
                case 'sold': return b.sold_count - a.sold_count;
                default: return 0;
            }
        });

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <SEO
                title="Toko Handphone Second Berkualitas - Lapak Android"
                description="Jual beli handphone second berkualitas, HP rooted, dan smartphone murah di Lapak Android. Bergaransi, gratis ongkir, dan terpercaya. Tersedia Samsung, Xiaomi, Oppo, dan brand lainnya."
                keywords="handphone second, hp bekas, smartphone murah, jual hp second, beli hp bekas, hp rooted, android second, lapak android store"
                canonicalUrl="/store"
                ogType="website"
            />
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Bergaransi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span>Aman & Terpercaya</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>Gratis Ongkir</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari handphone root impianmu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                            Cari
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg p-5 sticky top-32 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-lg">Filter</h3>
                                <button
                                    onClick={() => {
                                        setSelectedBrand('Semua Brand');
                                        setSelectedCondition('Semua Kondisi');
                                        setSelectedLocation('Semua Lokasi');
                                        setPriceRange([0, 10000000]);
                                    }}
                                    className="text-sm text-green-600 hover:text-green-700"
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-sm text-gray-700">Brand</h4>
                                <div className="space-y-2">
                                    {brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="brand"
                                                checked={selectedBrand === brand}
                                                onChange={() => setSelectedBrand(brand)}
                                                className="w-4 h-4 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm group-hover:text-green-600 transition-colors">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Condition Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-sm text-gray-700">Kondisi</h4>
                                <div className="space-y-2">
                                    {conditions.map((condition) => (
                                        <label key={condition} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="condition"
                                                checked={selectedCondition === condition}
                                                onChange={() => setSelectedCondition(condition)}
                                                className="w-4 h-4 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm group-hover:text-green-600 transition-colors">{condition}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-sm text-gray-700">Lokasi</h4>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-medium mb-3 text-sm text-gray-700">Rentang Harga</h4>
                                <div className="space-y-3">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPriceRange([0, 3000000])}
                                            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded hover:border-green-500 hover:text-green-600 transition-colors"
                                        >
                                            &lt; 3jt
                                        </button>
                                        <button
                                            onClick={() => setPriceRange([3000000, 5000000])}
                                            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded hover:border-green-500 hover:text-green-600 transition-colors"
                                        >
                                            3-5jt
                                        </button>
                                        <button
                                            onClick={() => setPriceRange([5000000, 10000000])}
                                            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded hover:border-green-500 hover:text-green-600 transition-colors"
                                        >
                                            &gt; 5jt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort & Filter Bar */}
                        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                                    >
                                        <SlidersHorizontal className="h-4 w-4" />
                                        <span className="text-sm">Filter</span>
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-900">{filteredProducts.length}</span> Produk
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">Urutkan:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                                    >
                                        <option value="relevant">Paling Sesuai</option>
                                        <option value="sold">Terlaris</option>
                                        <option value="price-low">Harga Terendah</option>
                                        <option value="price-high">Harga Tertinggi</option>
                                        <option value="rating">Rating Tertinggi</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500">Memuat produk...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => {
                                            trackProductClick(product.id, product.name, 'Store Page');
                                            navigate(`/product/${product.id}`);
                                        }}
                                        className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.stock_status === 'sold_out' ? 'opacity-50 grayscale' : ''
                                                        }`}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Smartphone className="h-12 w-12" />
                                                </div>
                                            )}

                                            {/* Sold Out Overlay */}
                                            {product.stock_status === 'sold_out' && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg transform rotate-[-15deg] shadow-xl">
                                                            SOLD OUT
                                                        </div>
                                                        <p className="text-white text-sm mt-2">Stok Habis</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Badges */}
                                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                {product.is_rooted && (
                                                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded flex items-center gap-1">
                                                        <Zap className="h-3 w-3" />
                                                        Rooted
                                                    </span>
                                                )}
                                                {product.stock_status === 'low_stock' && (
                                                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded">
                                                        Stok Terbatas
                                                    </span>
                                                )}
                                            </div>

                                            {/* Favorite */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(product.id);
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                                            >
                                                <Heart
                                                    className={`h-4 w-4 ${favorites.includes(product.id)
                                                        ? 'fill-red-500 text-red-500'
                                                        : 'text-gray-400'
                                                        }`}
                                                />
                                            </button>

                                            {/* Discount */}
                                            {product.discount_price && product.discount_price > 0 && (
                                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-yellow-400 text-xs font-bold rounded">
                                                    {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-3">
                                            {/* Product Name */}
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px]">
                                                {product.name}
                                            </h3>

                                            {/* Price */}
                                            <div className="mb-2">
                                                {product.discount_price && product.discount_price > 0 ? (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-xs font-medium">PROMO</span>
                                                            <span className="text-lg font-bold text-green-600">
                                                                {formatPrice(product.discount_price)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-3 py-1 bg-gray-500/10 text-gray-600 rounded-lg text-xs font-medium">Harga Asli</span>
                                                            <span className="text-xs text-gray-400 line-through">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Location & Sales */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate">{product.location}</span>
                                                </div>
                                                <span>{formatNumber(product.sold_count || 0)} terjual</span>
                                            </div>

                                            {/* Rating */}
                                            {/* <div className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{product.rating || 0}</span>
                                                <span className="text-xs text-gray-400">| {product.condition}</span>
                                            </div> */}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {!loading && filteredProducts.length === 0 && (
                            <div className="bg-white rounded-lg p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Search className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h3>
                                <p className="text-gray-600 mb-6">
                                    Coba ubah kata kunci atau filter pencarian Anda
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedBrand('Semua Brand');
                                        setSelectedCondition('Semua Kondisi');
                                        setSelectedLocation('Semua Lokasi');
                                        setPriceRange([0, 10000000]);
                                    }}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        onClick={() => setShowFilters(false)}
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween' }}
                            className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Filter</h3>
                                <button onClick={() => setShowFilters(false)}>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Same filters as desktop sidebar */}
                            <div className="space-y-6">
                                {/* Brand */}
                                <div>
                                    <h4 className="font-medium mb-3">Brand</h4>
                                    <div className="space-y-2">
                                        {brands.map((brand) => (
                                            <label key={brand} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="brand-mobile"
                                                    checked={selectedBrand === brand}
                                                    onChange={() => setSelectedBrand(brand)}
                                                    className="w-4 h-4 text-green-600"
                                                />
                                                <span className="text-sm">{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Condition */}
                                <div>
                                    <h4 className="font-medium mb-3">Kondisi</h4>
                                    <div className="space-y-2">
                                        {conditions.map((condition) => (
                                            <label key={condition} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="condition-mobile"
                                                    checked={selectedCondition === condition}
                                                    onChange={() => setSelectedCondition(condition)}
                                                    className="w-4 h-4 text-green-600"
                                                />
                                                <span className="text-sm">{condition}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Terapkan Filter
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
