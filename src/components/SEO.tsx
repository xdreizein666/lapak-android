import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
}

export function SEO({
    title = 'Lapak Android - Jasa Root Android Terpercaya & Handphone Second Berkualitas',
    description = 'Lapak Android menyediakan jasa root Android profesional, handphone second berkualitas, dan layanan IT terpercaya. Gratis ongkir, bergaransi, dan aman. Hubungi kami sekarang!',
    keywords = 'jasa root android, root android, handphone second, hp bekas, smartphone murah, custom ROM, android rooting, jual beli hp, lapak android, service android',
    ogImage = 'https://lapakandroid.my.id/og-image.jpg',
    ogType = 'website',
    canonicalUrl,
    noIndex = false
}: SEOProps) {
    const siteUrl = 'https://lapakandroid.my.id';
    const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Robots */}
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Lapak Android" />
            <meta property="og:locale" content="id_ID" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
}
