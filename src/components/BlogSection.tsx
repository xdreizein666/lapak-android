import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useBlog } from '../hooks/useBlog';

export function BlogSection() {
  const navigate = useNavigate();
  const { posts, loading } = useBlog({ status: 'published', limit: 6, autoFetch: true });

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper to calculate read time (rough estimate)
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit`;
  };

  const handlePostClick = (slug: string) => {
    navigate(`/blog?post=${slug}`);
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Or show a message
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section id="blog" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full mb-4">
            Blog & Artikel
          </div>
          <h2 className="mb-4">Tips & Tutorial Android</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Baca artikel dan tutorial terbaru seputar root Android, custom ROM, dan tips optimasi smartphone
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="grid lg:grid-cols-2 gap-8 bg-card rounded-3xl overflow-hidden shadow-xl border border-border hover:shadow-2xl transition-shadow duration-300">
              <div className="relative overflow-hidden aspect-video lg:aspect-auto cursor-pointer" onClick={() => handlePostClick(featuredPost.slug)}>
                <ImageWithFallback
                  src={featuredPost.image_url || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800'}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-4 py-2 bg-primary text-white rounded-full">
                  Featured
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(featuredPost.published_at || featuredPost.created_at)}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {calculateReadTime(featuredPost.content || '')}
                  </span>
                </div>
                <h3 className="mb-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handlePostClick(featuredPost.slug)}>{featuredPost.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => handlePostClick(featuredPost.slug)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 self-start"
                >
                  Baca Selengkapnya
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handlePostClick(post.slug)}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border group cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <ImageWithFallback
                  src={post.image_url || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white rounded-lg text-sm">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {calculateReadTime(post.content || '')}
                  </span>
                </div>

                <h4 className="group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h4>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-primary pt-2"
                >
                  Baca Artikel
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/blog')}
            className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Lihat Semua Artikel
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
