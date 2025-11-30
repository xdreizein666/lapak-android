import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useSettings } from '../hooks/useSettings';

const stats = [
  { icon: Users, label: 'Pelanggan Puas', value: '100+' },
  { icon: Award, label: 'Tahun Pengalaman', value: '5+' },
  { icon: TrendingUp, label: 'Tingkat Keberhasilan', value: '99%' },
  { icon: CheckCircle, label: 'Project Selesai', value: '100+' },
];

const features = [
  'Teknisi berpengalaman',
  'Garansi layanan untuk setiap pekerjaan',
  'Proses cepat dan aman',
  'Harga terjangkau dan transparan',
  'Support after-sales 24/7',
  'Menggunakan tools original dan terupdate',
];

export function AboutSection() {
  const { getSettingValue } = useSettings('about');

  const title = getSettingValue('about_title');
  const description1 = getSettingValue('about_description_1');
  const description2 = getSettingValue('about_description_2');
  const imageUrl = getSettingValue('about_image_url');


  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-4"
              >
                Tentang Kami
              </motion.div>
              <h2 className="mb-6">
                {title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {description1}
              </p>
              <p className="text-muted-foreground">
                {description2}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-semibold text-2xl text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={imageUrl}
                alt="Lapak Android Team"
                className="w-full h-auto aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
