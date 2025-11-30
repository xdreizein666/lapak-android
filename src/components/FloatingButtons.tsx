import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { trackWhatsAppClick } from '../lib/ga4';

export function FloatingButtons() {
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const whatsappNumber = '6285283151990';
  const whatsappMessage = 'Halo, saya tertarik dengan layanan Lapak Android';

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('Floating Button');
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-40"
      >
        <AnimatePresence>
          {showWhatsApp && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 right-0 w-80 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              <div className="bg-[#25D366] p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <div>
                      <h6 className="text-white">Lapak Android</h6>
                      <p className="text-xs text-white/80">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWhatsApp(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    Halo! 👋 Ada yang bisa kami bantu tentang layanan root Android atau custom ROM?
                  </p>
                </div>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#20BA5A] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat via WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowWhatsApp(!showWhatsApp)}
          className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative"
        >
          {showWhatsApp ? (
            <X className="h-7 w-7" />
          ) : (
            <MessageCircle className="h-7 w-7" />
          )}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </motion.button>
      </motion.div>
    </>
  );
}