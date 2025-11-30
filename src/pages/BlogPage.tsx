import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Calendar, Clock, Tag, TrendingUp, X, Eye, Filter } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Footer } from '../components/Footer';
import { HTMLContent } from '../components/HTMLContent';
import { useBlog } from '../hooks/useBlog';
import { blogApi } from '../lib/api/blog';
import { SEO } from '../components/SEO';
import { trackBlogView } from '../lib/ga4';

export function BlogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const { posts, loading } = useBlog({ status: 'published', autoFetch: true });

  // Auto-open article from URL parameter
  useEffect(() => {
    const postSlug = searchParams.get('post');
    if (postSlug && posts.length > 0) {
      const post = posts.find(p => p.slug === postSlug);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, [searchParams, posts]);

  // Increment views when article is opened
  useEffect(() => {
    if (selectedPost?.id) {
      // Track blog view with GA4
      trackBlogView(selectedPost.id, selectedPost.title);

      // Increment views in background
      blogApi.incrementViews(selectedPost.id).catch(err => {
        console.error('Failed to increment views:', err);
        // Don't show error to user, just log it
      });
    }
  }, [selectedPost?.id]);

  // Handle article click - navigate with slug
  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    navigate(`/blog?post=${post.slug}`);
  };

  // Handle closing article - remove slug from URL
  const handleClosePost = () => {
    setSelectedPost(null);
    navigate('/blog');
  };

  // Calculate categories dynamically
  const categories = [
    { name: 'Semua', count: posts.length },
    ...Array.from(new Set(posts.map(p => p.category))).map(cat => ({
      name: cat,
      count: posts.filter(p => p.category === cat).length
    }))
  ];

  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredPosts = posts.slice(0, 2);
  const popularPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper to calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit`;
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <SEO
        title="Blog & Artikel - Lapak Android | Tutorial Root Android & Tips Smartphone"
        description="Baca artikel, tutorial, dan tips seputar root Android, custom ROM, optimasi smartphone, dan review gadget terbaru dari Lapak Android. Panduan lengkap dari para ahli."
        keywords="blog android, tutorial root android, tips android, custom rom, review hp, artikel smartphone, panduan modifikasi android"
        canonicalUrl="/blog"
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full mb-6 shadow-lg"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Blog & Artikel Terbaru</span>
            </motion.div>

            <h1 className="mb-6">
              Tips, Tutorial & Review Android
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Panduan lengkap Root Android, Custom ROM, dan Optimasi Smartphone Android Anda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="sticky top-16 z-30 bg-card/95 backdrop-blur-xl border-y border-border shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari artikel, tutorial, tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedCategory === category.name
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted hover:bg-muted/80'
                    }`}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.name ? 'bg-white/20' : 'bg-background'
                    }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && !searchQuery && selectedCategory === 'Semua' && (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8">Artikel Pilihan</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => handlePostClick(post)}
                      className="group relative bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-border"
                    >
                      <div className="relative h-80">
                        <ImageWithFallback
                          src={post.image_url || 'https://images.unsplash.com/photo-1598618826732-fb2fdf367775?w=1200&h=600&fit=crop'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      </div>

                      <div className="absolute bottom-0 p-8 w-full">
                        <span className="inline-block px-3 py-1.5 bg-primary text-white rounded-lg text-sm mb-4">
                          {post.category}
                        </span>
                        <h3 className="text-2xl mb-3 text-white">{post.title}</h3>
                        <p className="text-white/80 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-white/90">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {calculateReadTime(post.content || '')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {(post.views || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main Content */}
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Articles */}
                <div className="lg:col-span-2">
                  <p className="mb-6 text-muted-foreground">
                    Menampilkan <span className="font-semibold text-foreground">{filteredPosts.length}</span> artikel
                  </p>

                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handlePostClick(post)}
                        className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer border border-border"
                      >
                        <div className="grid md:grid-cols-5 gap-6">
                          <div className="md:col-span-2 relative overflow-hidden aspect-video md:aspect-auto">
                            <ImageWithFallback
                              src={post.image_url || 'https://images.unsplash.com/photo-1611396000732-f8c9a933424f?w=1200&h=600&fit=crop'}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1.5 bg-primary/90 text-white rounded-lg text-sm">
                                {post.category}
                              </span>
                            </div>
                          </div>

                          <div className="md:col-span-3 p-6">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.published_at || post.created_at)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {calculateReadTime(post.content || '')}
                              </span>
                            </div>

                            <h3 className="mb-3 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>

                            <p className="text-muted-foreground line-clamp-2 mb-4">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {post.author ? post.author.charAt(0) : 'A'}
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{post.author || 'Admin'}</div>
                                  <div className="text-xs text-muted-foreground">Author</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Eye className="h-4 w-4" />
                                  {(post.views || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Popular Posts */}
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sticky top-32">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h4>Artikel Populer</h4>
                    </div>

                    <div className="space-y-5">
                      {popularPosts.map((post, index) => (
                        <div
                          key={post.id}
                          onClick={() => handlePostClick(post)}
                          className="group cursor-pointer flex gap-4"
                        >
                          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h6 className="mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h6>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {(post.views || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Article Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 overflow-y-auto"
            onClick={handleClosePost}
          >
            <button
              onClick={handleClosePost}
              className="fixed top-24 right-8 p-3 bg-card rounded-full shadow-lg z-50"
            >
              <X className="h-6 w-6" />
            </button>

            <article
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl mx-auto px-4 py-24"
            >
              <div className="relative h-96 rounded-3xl overflow-hidden mb-12">
                <ImageWithFallback
                  src={selectedPost.image_url || 'https://images.unsplash.com/photo-1598618826732-fb2fdf367775?w=1200&h=600&fit=crop'}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-12">
                <span className="inline-block px-4 py-2 bg-primary text-white rounded-xl mb-6">
                  {selectedPost.category}
                </span>
                <h1 className="mb-6">{selectedPost.title}</h1>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {selectedPost.author ? selectedPost.author.charAt(0) : 'A'}
                    </div>
                    <div>
                      <div className="font-medium">{selectedPost.author || 'Admin'}</div>
                      <div className="text-sm text-muted-foreground">Author</div>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedPost.published_at || selectedPost.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {calculateReadTime(selectedPost.content || '')}
                    </span>
                  </div>
                </div>

                <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6">
                  {selectedPost.excerpt}
                </p>
              </div>

              <div className="prose prose-lg max-w-none mb-12">
                {selectedPost.content ? (
                  <HTMLContent content={selectedPost.content} />
                ) : (
                  <p className="text-muted-foreground">No content available.</p>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-4">Tags</h5>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-xl flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    {selectedPost.category}
                  </span>
                </div>
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}