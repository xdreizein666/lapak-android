import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, Instagram, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang', href: '/about' },
    { name: 'Project', href: '/portfolio' },
    { name: 'Artikel', href: '/blog' },
    { name: 'Kontak', href: '/#contact' },
  ];

  const services = [
    'Root Android',
    'Unlock Bootloader',
    'Custom ROM',
    'Custom Recovery',
    'Install Magisk',
    'Debloat System',
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold">Lapak Android</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Spesialis jasa root, unlock bootloader, dan instalasi custom ROM terpercaya. Melayani semua brand smartphone dengan profesional.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/lapakandroid"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover:bg-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@lapakandroid.com"
                className="p-2 bg-muted hover:bg-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+6285283151990"
                className="p-2 bg-muted hover:bg-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="mb-4">Quick Links</h6>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h6 className="mb-4">Layanan Kami</h6>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h6 className="mb-4">Kontak</h6>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                <span>Jl. Pd. Kacang Prima, East Pondok Kacang, Pondok Aren, South Tangerang, 15226</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="tel:+6285283151990" className="hover:text-primary transition-colors">
                  +62 852-8315-1990
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="mailto:info@lapakandroid.my.id" className="hover:text-primary transition-colors">
                  info@lapakandroid.my.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Lapak Android. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}