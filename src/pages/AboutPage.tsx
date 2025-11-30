import React from 'react';
import { motion } from 'motion/react';
import { Award, Target, Eye, Heart, Users, TrendingUp, Shield, Zap, CheckCircle, Star } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';

export function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Kepercayaan',
      description: 'Kami menjaga kepercayaan pelanggan dengan layanan profesional dan hasil terjamin',
    },
    {
      icon: Zap,
      title: 'Inovasi',
      description: 'Selalu mengikuti perkembangan teknologi terbaru untuk memberikan solusi terbaik',
    },
    {
      icon: Heart,
      title: 'Dedikasi',
      description: 'Berkomitmen memberikan layanan terbaik dengan fokus pada kepuasan pelanggan',
    },
    {
      icon: Users,
      title: 'Kolaborasi',
      description: 'Bekerja sama dengan komunitas untuk terus berkembang dan berinovasi',
    },
  ];

  const milestones = [
    { year: '2020', title: 'Berdiri', description: 'Lapak Android didirikan di Tangerang Selatan' },
    { year: '2020', title: '50+ Pelanggan', description: 'Mencapai 50 pelanggan puas' },
    { year: '2021', title: 'Ekspansi', description: 'Membuka layanan aplikasi mod dan tools untuk driver ojol seluruh Indonesia' },
    { year: '2022', title: '2000+ Members', description: 'Mencapai 2000 lebih member aktif di seluruh Indonesia' },
    { year: '2023', title: '100+ Pelanggan', description: 'Mencapai 100 lebih pelanggan puas dalam layanan jasa root Android' },
    { year: '2025', title: 'Market Leader', description: 'Menjadi pemimpin pasar jasa root Android di Tangerang Selatan' },
  ];

  const team = [
    {
      name: 'Ahmad Rizki',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      description: 'Expert Android Developer dengan 8 tahun pengalaman',
    },
    {
      name: 'Budi Santoso',
      role: 'Lead Technician',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      description: 'Spesialis Custom ROM dan Recovery',
    },
    {
      name: 'Citra Dewi',
      role: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      description: 'Memastikan kepuasan setiap pelanggan',
    },
    {
      name: 'Doni Pratama',
      role: 'Senior Technician',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      description: 'Expert dalam troubleshooting complex issues',
    },
  ];

  const stats = [
    { icon: Users, value: '100+', label: 'Pelanggan Puas' },
    { icon: Award, value: '5+', label: 'Tahun Pengalaman' },
    { icon: TrendingUp, value: '99%', label: 'Success Rate' },
    { icon: Star, value: '4.9/5', label: 'Rating' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <SEO
        title="Tentang Kami - Lapak Android | Spesialis Jasa Root Android Terpercaya"
        description="Lapak Android adalah penyedia jasa modifikasi Android, root, unlock bootloader, dan instalasi custom ROM terpercaya di Indonesia. Telah melayani ratusan pelanggan dengan tingkat kepuasan 99%."
        keywords="tentang lapak android, profil lapak android, jasa root android terpercaya, modifikasi android, custom rom, unlock bootloader"
        canonicalUrl="/about"
      />
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
              Tentang Kami
            </div>
            <h1 className="mb-6">
              Spesialis Jasa Root Android Terpercaya di Indonesia khususnya di Jabodatabek
            </h1>
            <p className="text-xl text-muted-foreground">
              Lapak Android adalah penyedia jasa yang berfokus pada layanan modifikasi Android,
              root, unlock bootloader, dan instalasi custom ROM. Kami telah melayani ratusan pelanggan
              dengan tingkat kepuasan 99%.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-semibold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card p-8 md:p-12 rounded-3xl shadow-lg border border-border"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-2xl mb-6">
                <Eye className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="mb-6">Visi Kami</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Menjadi penyedia layanan modifikasi Android terkemuka di Indonesia yang dikenal
                dengan kualitas, profesionalisme, dan inovasi dalam memberikan solusi teknologi
                terbaik untuk setiap pelanggan.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card p-8 md:p-12 rounded-3xl shadow-lg border border-border"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-6">Misi Kami</h2>
              <ul className="space-y-4">
                {[
                  'Memberikan layanan root dan custom ROM berkualitas tinggi',
                  'Menjaga kepuasan dan kepercayaan pelanggan',
                  'Terus berinovasi mengikuti perkembangan teknologi',
                  'Membangun komunitas Android yang solid',
                ].map((mission, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-lg">{mission}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Nilai-Nilai Kami</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nilai-nilai yang menjadi fondasi dalam setiap layanan kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="mb-3">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Perjalanan Kami</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Milestone penting dalam perjalanan Lapak Android
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-8 pb-12 border-l-2 border-primary last:pb-0"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full border-4 border-background" />
                <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
                  <div className="text-primary font-semibold mb-2">{milestone.year}</div>
                  <h4 className="mb-2">{milestone.title}</h4>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Tim Kami</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bertemu dengan para ahli yang berdedikasi untuk memberikan layanan terbaik
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden group"
              >
                <div className="relative overflow-hidden aspect-square">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="mb-1">{member.name}</h4>
                  <div className="text-primary mb-3">{member.role}</div>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
