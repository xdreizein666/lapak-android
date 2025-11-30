import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Zap, Shield, Wrench } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

// Icon mapping
const iconMap = {
  Zap,
  Shield,
  Wrench,
};

export function HeroSection() {
  const { getSettingValue, loading } = useSettings('hero');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  // Build slides from settings
  const slides = useMemo(() => {
    const slideData = [];

    for (let i = 1; i <= 3; i++) {
      const title = getSettingValue(`hero_slide${i}_title`);
      const subtitle = getSettingValue(`hero_slide${i}_subtitle`);
      const image = getSettingValue(`hero_slide${i}_image`);
      const iconName = getSettingValue(`hero_slide${i}_icon`, 'Zap');
      const color = getSettingValue(`hero_slide${i}_color`, 'from-green-500 to-emerald-600');

      // Only add slide if it has at least a title
      if (title) {
        slideData.push({
          title,
          subtitle,
          image,
          icon: iconMap[iconName as keyof typeof iconMap] || Zap,
          color,
        });
      }
    }

    // Fallback to default if no slides
    if (slideData.length === 0) {
      return [
        {
          title: 'Ahli Root & Custom ROM Android',
          subtitle: 'Tingkatkan performa smartphone Anda dengan layanan root dan custom ROM terpercaya',
          image: 'https://images.unsplash.com/photo-1598618826732-fb2fdf367775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmRyb2lkJTIwc21hcnRwaG9uZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzNzI4MTgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          icon: Zap,
          color: 'from-green-500 to-emerald-600',
        },
      ];
    }

    return slideData;
  }, [getSettingValue]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <section id="home" className="relative h-screen min-h-[600px] overflow-hidden pt-16 md:pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </section>
    );
  }

  const CurrentIcon = slides[currentSlide]?.icon || Zap;

  return (
    <section id="home" className="relative h-screen min-h-[600px] overflow-hidden pt-16 md:pt-20">
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/50 z-10" />
          <img
            src={slides[currentSlide]?.image || ''}
            alt={slides[currentSlide]?.title || ''}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`inline-block p-4 rounded-2xl bg-gradient-to-r ${slides[currentSlide]?.color || 'from-green-500 to-emerald-600'}`}
              >
                <CurrentIcon className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="text-foreground">
                {slides[currentSlide]?.title || ''}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                {slides[currentSlide]?.subtitle || ''}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Hubungi Kami
                </motion.a>
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-card text-foreground rounded-xl hover:bg-muted transition-colors duration-300 border-2 border-border"
                >
                  Lihat Proyek
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <div className="absolute z-30 inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="pointer-events-auto p-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="pointer-events-auto p-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </div>
      )}

      {/* Slide Indicators - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <div className="absolute z-30 bottom-8 left-0 right-0 flex justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-12 bg-primary' : 'w-2 bg-muted-foreground/50'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

