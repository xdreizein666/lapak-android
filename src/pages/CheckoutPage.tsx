import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    MapPin,
    Edit,
    ChevronRight,
    Truck,
    Package,
    CreditCard,
    Shield,
    AlertCircle,
    Check
} from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

const shippingMethods = [
    { id: 'jne-reg', name: 'JNE Regular', price: 15000, estimate: '2-3 hari' },
    { id: 'jne-yes', name: 'JNE YES', price: 25000, estimate: '1-2 hari' },
    { id: 'jnt-reg', name: 'J&T Regular', price: 12000, estimate: '2-4 hari' },
    { id: 'jnt-express', name: 'J&T Express', price: 20000, estimate: '1-2 hari' },
    { id: 'sicepat', name: 'SiCepat Halu', price: 18000, estimate: '1-3 hari' },
];

export function CheckoutPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedShipping, setSelectedShipping] = useState('jne-reg');
    const [useInsurance, setUseInsurance] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        name: 'John Doe',
        phone: '08123456789',
        address: 'Jl. Sudirman No. 123',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12190'
    });

    useEffect(() => {
        // Load dari localStorage
        const checkout = JSON.parse(localStorage.getItem('checkout') || '[]');
        if (checkout.length === 0) {
            toast.error('Keranjang kosong!');
            navigate('/store');
        } else {
            setCartItems(checkout);
        }
    }, [navigate]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingMethods.find(m => m.id === selectedShipping)?.price || 0;
    const insuranceCost = useInsurance ? Math.ceil(subtotal * 0.005) : 0; // 0.5% dari subtotal
    const total = subtotal + shippingCost + insuranceCost;

    const handleProceedToPayment = () => {
        // Simpan data checkout
        const orderData = {
            items: cartItems,
            shipping: shippingAddress,
            shippingMethod: shippingMethods.find(m => m.id === selectedShipping),
            useInsurance,
            subtotal,
            shippingCost,
            insuranceCost,
            total,
            orderDate: new Date().toISOString()
        };

        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        navigate('/payment');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Checkout</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-green-600" />
                                    <h2 className="text-lg font-semibold">Alamat Pengiriman</h2>
                                </div>
                                <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                                    <Edit className="h-4 w-4" />
                                    Ubah
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="font-medium">{shippingAddress.name}</div>
                                        <div className="text-sm text-gray-600">{shippingAddress.phone}</div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                        Utama
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
                                </p>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Produk Dipesan</h2>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium mb-1">{item.name}</h3>
                                            <div className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</div>
                                            <div className="font-semibold text-green-600">
                                                {formatPrice(item.price)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Truck className="h-5 w-5 text-green-600" />
                                <h2 className="text-lg font-semibold">Pilih Pengiriman</h2>
                            </div>

                            <div className="space-y-3">
                                {shippingMethods.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedShipping === method.id
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={method.id}
                                                checked={selectedShipping === method.id}
                                                onChange={(e) => setSelectedShipping(e.target.value)}
                                                className="w-4 h-4 text-green-600"
                                            />
                                            <div>
                                                <div className="font-medium">{method.name}</div>
                                                <div className="text-sm text-gray-600">Estimasi: {method.estimate}</div>
                                            </div>
                                        </div>
                                        <div className="font-semibold">{formatPrice(method.price)}</div>
                                    </label>
                                ))}
                            </div>

                            {/* Insurance Option */}
                            <div className="mt-4 pt-4 border-t">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={useInsurance}
                                            onChange={(e) => setUseInsurance(e.target.checked)}
                                            className="w-4 h-4 text-green-600 rounded"
                                        />
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-green-600" />
                                                Asuransi Pengiriman
                                            </div>
                                            <div className="text-sm text-gray-600">Proteksi untuk barang Anda</div>
                                        </div>
                                    </div>
                                    <div className="font-semibold">{formatPrice(insuranceCost)}</div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4">Ringkasan Belanja</h2>

                            <div className="space-y-3 mb-4 pb-4 border-b">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal Produk</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Ongkos Kirim</span>
                                    <span className="font-medium">{formatPrice(shippingCost)}</span>
                                </div>
                                {useInsurance && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Asuransi</span>
                                        <span className="font-medium">{formatPrice(insuranceCost)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-2xl font-bold text-green-600">{formatPrice(total)}</span>
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <CreditCard className="h-5 w-5" />
                                Pilih Pembayaran
                            </button>

                            {/* Info */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex gap-2">
                                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-900">
                                        <div className="font-medium mb-1">Informasi Penting</div>
                                        <ul className="space-y-1 text-blue-800">
                                            <li>• Pastikan alamat pengiriman sudah benar</li>
                                            <li>• Pesanan akan diproses setelah pembayaran</li>
                                            <li>• Garansi berlaku sesuai ketentuan</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-xs text-gray-600">Pembayaran Aman</div>
                                    </div>
                                    <div>
                                        <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-xs text-gray-600">Packing Rapi</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
