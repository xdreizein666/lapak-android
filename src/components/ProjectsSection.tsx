import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Star, Calendar, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProjects } from '../hooks/useProjects';

const brands = ['Semua', 'Xiaomi', 'Samsung', 'Huawei', 'OPPO', 'Realme', 'OnePlus'];

export function ProjectsSection() {
  const [selectedBrand, setSelectedBrand] = useState('Semua');
  const { projects, loading } = useProjects({ autoFetch: true });
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Filter projects based on brand
  const filteredProjects = selectedBrand === 'Semua'
    ? projects
    : projects.filter((project) => project.brand === selectedBrand);

  // Only show 3 projects in the home page section
  const displayedProjects = filteredProjects.slice(0, 3);

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <section id="projects" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full mb-4">
            Portfolio Kami
          </div>
          <h2 className="mb-4">Project Terbaik Kami</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Lihat berbagai project yang telah kami kerjakan dengan hasil yang memuaskan
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${selectedBrand === brand
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-card text-foreground hover:bg-muted border border-border'
                }`}
            >
              {brand}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBrand}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayedProjects.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Belum ada project untuk kategori ini.
                </div>
              ) : (
                displayedProjects.map((project, index) => (
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
                        >
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
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-muted text-foreground rounded-lg text-sm">
                          {project.category}
                        </span>
                        {project.status === 'completed' && (
                          <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-sm">
                            Selesai
                          </span>
                        )}
                      </div>

                      {/* Rating (Mocked for now as it's not in DB) */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 // Mocking 5 star for all for now
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {project.views || 0} views
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View All Projects Button */}
        {!loading && displayedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Link
              to="/portfolio"
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Lihat Semua Project
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        )}

        {/* Project Detail Modal - Moved outside the loop */}
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
      </div>
    </section>
  );
}
