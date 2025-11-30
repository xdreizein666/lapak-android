import ReactGA from 'react-ga4';

// GA4 Measurement ID - Use environment variable with fallback
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-HG1LZGQPT4';

// Initialize GA4
export const initGA = () => {
    try {
        // Check if GA is already loaded from gtag.js
        if (typeof window !== 'undefined' && (window as any).gtag) {
            console.log('GA4 gtag.js already loaded from index.html');
        }

        // Initialize react-ga4
        ReactGA.initialize(GA_MEASUREMENT_ID, {
            gaOptions: {
                siteSpeedSampleRate: 100,
            },
            gtagOptions: {
                send_page_view: false, // We'll handle page views manually
            },
        });
        console.log('GA4 initialized successfully with ID:', GA_MEASUREMENT_ID);
    } catch (error) {
        console.error('GA4 initialization error:', error);
    }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
    try {
        // Don't track admin pages
        if (path.startsWith('/admin')) {
            return;
        }

        ReactGA.send({
            hitType: 'pageview',
            page: path,
            title: title || document.title,
        });

        console.log('GA4 Page View:', path, title);
    } catch (error) {
        console.error('GA4 page view tracking error:', error);
    }
};

// Track custom events
export const trackEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number
) => {
    try {
        ReactGA.event({
            category,
            action,
            label,
            value,
        });

        console.log('GA4 Event:', { category, action, label, value });
    } catch (error) {
        console.error('GA4 event tracking error:', error);
    }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
    trackEvent('Button', 'Click', `${buttonName}${location ? ` - ${location}` : ''}`);
};

// Track form submissions
export const trackFormSubmit = (formName: string) => {
    trackEvent('Form', 'Submit', formName);
};

// Track product views
export const trackProductView = (productId: string, productName: string) => {
    trackEvent('Product', 'View', `${productName} (ID: ${productId})`);
};

// Track product clicks
export const trackProductClick = (productId: string, productName: string, location: string) => {
    trackEvent('Product', 'Click', `${productName} - ${location}`, parseInt(productId));
};

// Track WhatsApp button clicks
export const trackWhatsAppClick = (context: string) => {
    trackEvent('WhatsApp', 'Click', context);
};

// Track social media clicks
export const trackSocialClick = (platform: string, action: string = 'Click') => {
    trackEvent('Social Media', action, platform);
};

// Track blog post views
export const trackBlogView = (postId: string, postTitle: string) => {
    trackEvent('Blog', 'View', `${postTitle} (ID: ${postId})`);
};

// Track portfolio/project views
export const trackProjectView = (projectId: string, projectTitle: string) => {
    trackEvent('Portfolio', 'View', `${projectTitle} (ID: ${projectId})`);
};

// Track downloads
export const trackDownload = (fileName: string) => {
    trackEvent('Download', 'Click', fileName);
};

// Track external links
export const trackExternalLink = (url: string, linkText?: string) => {
    trackEvent('External Link', 'Click', linkText || url);
};

// Track search
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
    trackEvent('Search', 'Query', searchTerm, resultsCount);
};

// Track filter usage
export const trackFilter = (filterType: string, filterValue: string) => {
    trackEvent('Filter', 'Apply', `${filterType}: ${filterValue}`);
};

// Track cart actions (if you implement cart in the future)
export const trackAddToCart = (productId: string, productName: string) => {
    trackEvent('Cart', 'Add', `${productName} (ID: ${productId})`);
};

// Track navigation
export const trackNavigation = (destination: string, source?: string) => {
    trackEvent('Navigation', 'Click', `${destination}${source ? ` from ${source}` : ''}`);
};

// Track video plays (if you have videos)
export const trackVideoPlay = (videoTitle: string) => {
    trackEvent('Video', 'Play', videoTitle);
};

// Track scroll depth
export const trackScrollDepth = (depth: number, page: string) => {
    trackEvent('Scroll', 'Depth', page, depth);
};

// Track time on page
export const trackTimeOnPage = (page: string, seconds: number) => {
    trackEvent('Engagement', 'Time on Page', page, seconds);
};

// Track errors
export const trackError = (errorMessage: string, errorLocation?: string) => {
    trackEvent('Error', 'Occurred', `${errorMessage}${errorLocation ? ` - ${errorLocation}` : ''}`);
};
