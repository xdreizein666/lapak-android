import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Calendar, ExternalLink, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Footer } from '../components/Footer';
import { useProjects } from '../hooks/useProjects';
import { SEO } from '../components/SEO';

export function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any | null>(null); // Using any to simplify mapping for now

  const { projects, loading } = useProjects({ autoFetch: true });

  // Calculate categories dynamically
  const categories = ['Semua', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter((project) => {
    const matchCategory = selectedCategory === 'Semua' ||
      project.category === selectedCategory ||
      project.brand === selectedCategory; // Keep brand check if needed, though category is primary filter
    const matchSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <SEO
        title="Portfolio - Lapak Android | 100+ Project Root Android Berhasil"
        description="Lihat portfolio dan project root Android, custom ROM, dan modifikasi smartphone yang telah kami kerjakan. Lebih dari 100 project berhasil diselesaikan dengan tingkat kepuasan 99%."
        keywords="portfolio lapak android, project root android, hasil root android, custom rom project, portfolio modifikasi android"
        canonicalUrl="/portfolio"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
              Portfolio
            </div>
            <h1 className="mb-6">
              Project Terbaik Kami
            </h1>
            <p className="text-xl text-muted-foreground">
              Lihat berbagai project yang telah kami kerjakan dengan hasil yang memuaskan.
              Lebih dari 100+ project berhasil diselesaikan dengan tingkat kepuasan 99%.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-primary" />
              <span className="font-medium">Kategori:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">Tidak ada project yang ditemukan</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Menampilkan {filteredProjects.length} dari {projects.length} project
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      onClick={() => setSelectedProject(project)}
                      className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border group cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden aspect-video">
                        <ImageWithFallback
                          src={project.image_url || 'https://images.unsplash.com/photo-1598618826732-fb2fdf367775?w=1200&h=600&fit=crop'}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
                            Lihat Detail
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                            {project.brand}
                          </span>
                          <span className="px-3 py-1 bg-secondary text-white rounded-full text-sm">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl mb-2">{project.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 5 // Mock rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground'
                                  }`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(project.created_at)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl shadow-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative">
                <ImageWithFallback
                  src={selectedProject.image_url || 'https://images.unsplash.com/photo-1598618826732-fb2fdf367775?w=1200&h=600&fit=crop'}
                  alt={selectedProject.title}
                  className="w-full h-64 md:h-96 object-cover rounded-t-3xl"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-card rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-4 py-2 bg-primary text-white rounded-full">
                    {selectedProject.brand}
                  </span>
                  <span className="px-4 py-2 bg-secondary text-white rounded-full">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="mb-4">{selectedProject.title}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < 5 // Mock rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      ({selectedProject.views || 0} views)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    {formatDate(selectedProject.created_at)}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}