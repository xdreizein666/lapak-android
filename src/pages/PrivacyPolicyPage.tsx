import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, AlertCircle, Mail } from 'lucide-react';
import { Footer } from '../components/Footer';

export function PrivacyPolicyPage() {
  const sections = [
    {
      icon: FileText,
      title: '1. Informasi yang Kami Kumpulkan',
      content: [
        'Informasi Pribadi: Nama, alamat email, nomor telepon yang Anda berikan saat menghubungi kami atau menggunakan layanan kami.',
        'Informasi Device: Model smartphone, brand, versi Android, dan informasi teknis lainnya yang diperlukan untuk layanan kami.',
        'Data Penggunaan: Informasi tentang bagaimana Anda menggunakan website kami, termasuk halaman yang dikunjungi dan waktu akses.',
        'Cookies: Kami menggunakan cookies untuk meningkatkan pengalaman pengguna di website kami.',
      ],
    },
    {
      icon: Lock,
      title: '2. Bagaimana Kami Menggunakan Informasi Anda',
      content: [
        'Menyediakan dan meningkatkan layanan root dan custom ROM Android.',
        'Berkomunikasi dengan Anda mengenai layanan, update, dan informasi penting lainnya.',
        'Mengirimkan newsletter dan promosi (dengan persetujuan Anda).',
        'Menganalisis penggunaan website untuk meningkatkan user experience.',
        'Mematuhi kewajiban hukum dan melindungi hak-hak kami.',
      ],
    },
    {
      icon: Shield,
      title: '3. Keamanan Data',
      content: [
        'Kami mengimplementasikan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda.',
        'Data Anda disimpan di server yang aman dengan enkripsi.',
        'Akses ke data pribadi dibatasi hanya untuk karyawan yang memerlukan akses tersebut untuk melakukan tugas mereka.',
        'Kami melakukan review keamanan secara berkala untuk memastikan perlindungan data yang optimal.',
      ],
    },
    {
      icon: Eye,
      title: '4. Berbagi Informasi',
      content: [
        'Kami TIDAK menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.',
        'Kami mungkin berbagi informasi dengan penyedia layanan pihak ketiga yang membantu operasional bisnis kami (seperti hosting, email service).',
        'Informasi dapat dibagikan jika diwajibkan oleh hukum atau untuk melindungi hak dan keamanan kami.',
      ],
    },
    {
      icon: AlertCircle,
      title: '5. Hak Anda',
      content: [
        'Akses: Anda berhak untuk meminta salinan data pribadi yang kami simpan tentang Anda.',
        'Koreksi: Anda dapat meminta kami untuk memperbaiki data yang tidak akurat.',
        'Penghapusan: Anda dapat meminta penghapusan data pribadi Anda dalam kondisi tertentu.',
        'Penarikan Persetujuan: Anda dapat menarik persetujuan Anda untuk pemrosesan data kapan saja.',
        'Portabilitas Data: Anda berhak menerima data pribadi Anda dalam format yang terstruktur.',
      ],
    },
    {
      icon: Mail,
      title: '6. Cookies dan Teknologi Pelacakan',
      content: [
        'Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman Anda.',
        'Cookies membantu kami mengingat preferensi Anda dan memahami bagaimana Anda menggunakan website kami.',
        'Anda dapat mengatur browser Anda untuk menolak cookies, namun beberapa fitur website mungkin tidak berfungsi dengan baik.',
        'Kami menggunakan Google Analytics untuk analisis website dengan data yang dianonimkan.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-6">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Terakhir diperbarui: 29 Januari 2025
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              Lapak Android menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.
              Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
            </p>
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
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3>{section.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                        <p className="text-muted-foreground leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}

            {/* Additional Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20"
            >
              <h3 className="mb-6">Informasi Tambahan</h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>Layanan Pihak Ketiga:</strong> Website kami mungkin mengandung link ke website pihak ketiga.
                  Kami tidak bertanggung jawab atas praktik privasi website tersebut.
                </p>
                <p className="leading-relaxed">
                  <strong>Perubahan Kebijakan:</strong> Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu.
                  Perubahan akan diposting di halaman ini dengan tanggal pembaruan yang baru.
                </p>
                <p className="leading-relaxed">
                  <strong>Anak-anak:</strong> Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun.
                  Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
