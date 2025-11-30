import React from 'react';
import { motion } from 'motion/react';

// Import brand logos
import xiaomiLogo from '../assets/Xiaomi_logo.png';
import samsungLogo from '../assets/samsung-logo.png';
import huaweiLogo from '../assets/Huawei-Logo.png';
import oppoLogo from '../assets/OPPO_Logo.png';
import vivoLogo from '../assets/Vivo_Logo.png';
import realmeLogo from '../assets/Realme-logo.png';
import asusLogo from '../assets/asus-logo.png';
import pocoLogo from '../assets/Poco_logo.png';
import iphoneLogo from '../assets/iPhone-logo.png';

const brands = [
  { logo: xiaomiLogo },
  { logo: samsungLogo },
  { logo: huaweiLogo },
  { logo: oppoLogo },
  { logo: vivoLogo },
  { logo: realmeLogo },
  { logo: asusLogo },
  { logo: pocoLogo },
  { logo: iphoneLogo },
];

export function BrandSlider() {
  return (
    <section className="py-16 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-4">Brand yang Kami Support</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kami melayani berbagai brand smartphone terkemuka dengan layanan profesional dan terpercaya
          </p>
        </motion.div>
      </div>

      {/* First Row - Moving Right */}
      <div className="relative mb-8">
        <motion.div
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
          className="flex gap-8"
        >
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <div
              key={`brand-right-${index}`}
              className="flex-shrink-0 w-48 h-32 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center gap-3 border border-border group hover:border-primary p-4"
            >
              <div className="h-12 flex items-center justify-center w-full">
                <img
                  src={brand.logo}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second Row - Moving Left */}
      <div className="relative">
        <motion.div
          animate={{
            x: [-1920, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
          className="flex gap-8"
        >
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <div
              key={`brand-left-${index}`}
              className="flex-shrink-0 w-48 h-32 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center gap-3 border border-border group hover:border-secondary p-4"
            >
              <div className="h-12 flex items-center justify-center w-full">
                <img
                  src={brand.logo}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
