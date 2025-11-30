import React from 'react';
import { motion } from 'motion/react';
import { FileText, AlertTriangle, Shield, CheckCircle, XCircle, Scale } from 'lucide-react';
import { Footer } from '../components/Footer';

export function TermsOfServicePage() {
  const sections = [
    {
      icon: FileText,
      title: '1. Penerimaan Syarat',
      content: [
        'Dengan mengakses dan menggunakan layanan Lapak Android, Anda setuju untuk terikat dengan syarat dan ketentuan ini.',
        'Jika Anda tidak setuju dengan syarat-syarat ini, harap tidak menggunakan layanan kami.',
        'Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja tanpa pemberitahuan sebelumnya.',
        'Penggunaan layanan setelah perubahan berarti Anda menerima syarat dan ketentuan yang telah diubah.',
      ],
    },
    {
      icon: Shield,
      title: '2. Layanan yang Kami Tawarkan',
      content: [
        'Root Android: Memberikan akses root pada smartphone Android Anda.',
        'Unlock Bootloader: Membuka bootloader device untuk instalasi custom ROM.',
        'Custom ROM Installation: Instalasi sistem operasi custom seperti LineageOS, Pixel Experience, dll.',
        'Custom Recovery: Instalasi TWRP atau custom recovery lainnya.',
        'Konsultasi dan Support: Bantuan teknis terkait modifikasi Android.',
      ],
    },
    {
      icon: AlertTriangle,
      title: '3. Risiko dan Tanggung Jawab',
      content: [
        'PENTING: Root dan modifikasi Android membawa risiko tertentu termasuk void warranty, bootloop, atau brick device.',
        'Anda memahami dan menerima semua risiko yang terkait dengan layanan modifikasi Android.',
        'Lapak Android tidak bertanggung jawab atas kerusakan hardware atau kehilangan data yang mungkin terjadi.',
        'Kami akan melakukan yang terbaik untuk memastikan proses berjalan lancar, namun tidak ada jaminan 100%.',
        'Backup data Anda sebelum menggunakan layanan kami adalah tanggung jawab Anda.',
      ],
    },
    {
      icon: CheckCircle,
      title: '4. Hak dan Kewajiban Pengguna',
      content: [
        'Anda harus memberikan informasi yang akurat tentang device Anda.',
        'Anda bertanggung jawab untuk backup semua data penting sebelum layanan dilakukan.',
        'Anda tidak boleh menggunakan layanan kami untuk tujuan ilegal atau melanggar hukum.',
        'Anda setuju untuk tidak menggugat Lapak Android atas segala kerugian yang timbul dari penggunaan layanan.',
        'Anda harus membayar biaya layanan sesuai dengan yang telah disepakati.',
      ],
    },
    {
      icon: XCircle,
      title: '5. Batasan Layanan',
      content: [
        'Kami berhak menolak layanan jika device dalam kondisi rusak atau tidak memenuhi syarat.',
        'Beberapa device mungkin tidak dapat di-root atau di-unlock karena limitasi teknis.',
        'Kami tidak bertanggung jawab atas aplikasi atau ROM pihak ketiga yang Anda install setelah layanan kami.',
        'Waktu pengerjaan dapat bervariasi tergantung kompleksitas dan kondisi device.',
        'Kami tidak menjamin compatibility sempurna dengan semua aplikasi setelah modifikasi.',
      ],
    },
    {
      icon: Scale,
      title: '6. Garansi dan Pengembalian Dana',
      content: [
        'Kami memberikan garansi terbatas untuk layanan kami (detail garansi akan dijelaskan saat konsultasi).',
        'Garansi tidak mencakup kerusakan akibat kesalahan pengguna setelah device dikembalikan.',
        'Pengembalian dana hanya dimungkinkan jika kami tidak dapat menyelesaikan layanan yang dijanjikan.',
        'Klaim garansi harus diajukan dalam periode yang telah ditentukan.',
        'Syarat dan ketentuan garansi spesifik akan diberikan bersama dengan invoice layanan.',
      ],
    },
  ];

  const prohibitedActions = [
    'Menggunakan layanan untuk tujuan ilegal atau melanggar hukum',
    'Melakukan reverse engineering atau mencoba menduplikasi metode kami',
    'Mengklaim layanan kami sebagai milik Anda',
    'Menyalahgunakan akses root untuk merugikan pihak lain',
    'Menggunakan device yang telah di-root untuk aktivitas penipuan',
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/10 rounded-3xl mb-6">
              <Scale className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="mb-6">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Terakhir diperbarui: 29 Januari 2025
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              Mohon baca syarat dan ketentuan ini dengan seksama sebelum menggunakan layanan Lapak Android.
              Dengan menggunakan layanan kami, Anda menyetujui semua syarat dan ketentuan yang berlaku.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-amber-500/10 border-y border-amber-500/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4 max-w-5xl mx-auto"
          >
            <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="mb-2 text-amber-600 dark:text-amber-400">Perhatian Penting</h4>
              <p className="text-muted-foreground">
                Modifikasi Android seperti root, unlock bootloader, dan instalasi custom ROM dapat membatalkan garansi device Anda
                dan berpotensi menyebabkan masalah teknis. Pastikan Anda memahami semua risiko sebelum melanjutkan.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3>{section.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-secondary rounded-full mt-2" />
                        <p className="text-muted-foreground leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}

            {/* Prohibited Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3>Tindakan yang Dilarang</h3>
              </div>
              <ul className="space-y-3">
                {prohibitedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{action}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8 border border-secondary/20"
            >
              <h3 className="mb-6">Informasi Legal</h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>Hukum yang Berlaku:</strong> Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai
                  dengan hukum Republik Indonesia.
                </p>
                <p className="leading-relaxed">
                  <strong>Penyelesaian Sengketa:</strong> Setiap sengketa yang timbul dari atau terkait dengan
                  layanan kami akan diselesaikan melalui mediasi terlebih dahulu. Jika mediasi gagal, sengketa
                  akan diselesaikan melalui arbitrase di Jakarta.
                </p>
                <p className="leading-relaxed">
                  <strong>Ketentuan Terpisah:</strong> Jika ada ketentuan dalam syarat ini yang dianggap tidak
                  berlaku atau tidak dapat dilaksanakan, ketentuan lainnya tetap berlaku penuh.
                </p>
                <p className="leading-relaxed">
                  <strong>Bahasa:</strong> Syarat dan ketentuan ini dibuat dalam Bahasa Indonesia. Jika ada
                  terjemahan dalam bahasa lain, versi Bahasa Indonesia yang akan berlaku.
                </p>
              </div>
            </motion.div>

            {/* Acceptance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4">Persetujuan</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Dengan menggunakan layanan Lapak Android, Anda menyatakan bahwa Anda telah membaca, memahami,
                dan menyetujui untuk terikat dengan syarat dan ketentuan ini.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/#contact"
                  className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Hubungi Kami
                </a>
                <a
                  href="/privacy-policy"
                  className="px-8 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors"
                >
                  Baca Privacy Policy
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
