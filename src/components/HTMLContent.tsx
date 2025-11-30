import DOMPurify from 'dompurify';

interface HTMLContentProps {
    content: string;
    className?: string;
}

/**
 * Component untuk menampilkan HTML content dari Rich Text Editor dengan aman
 * Menggunakan DOMPurify untuk sanitize HTML dan mencegah XSS attacks
 */
export function HTMLContent({ content, className = '' }: HTMLContentProps) {
    // Sanitize HTML untuk keamanan
    const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'img',
            'span', 'div', 'sub', 'sup'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel',
            'width', 'height'
        ]
    });

    return (
        <>
            <div
                className={`html-content prose prose-lg max-w-none ${className}`}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <style>{`
                .html-content p {
                    margin-bottom: 1.25em;
                    line-height: 1.75;
                }
                
                .html-content p:last-child {
                    margin-bottom: 0;
                }
                
                .html-content h1 {
                    font-size: 2.25em;
                    font-weight: 800;
                    line-height: 1.1;
                    margin-top: 0;
                    margin-bottom: 0.8em;
                }
                
                .html-content h2 {
                    font-size: 1.875em;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-top: 1.5em;
                    margin-bottom: 0.75em;
                }
                
                .html-content h3 {
                    font-size: 1.5em;
                    font-weight: 600;
                    line-height: 1.3;
                    margin-top: 1.25em;
                    margin-bottom: 0.5em;
                }
                
                .html-content ul,
                .html-content ol {
                    margin-top: 1.25em;
                    margin-bottom: 1.25em;
                    padding-left: 1.625em;
                }
                
                .html-content li {
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                }
                
                .html-content blockquote {
                    margin-top: 1.5em;
                    margin-bottom: 1.5em;
                    padding-left: 1em;
                    border-left: 4px solid hsl(var(--primary));
                    font-style: italic;
                    color: hsl(var(--muted-foreground));
                }
                
                .html-content code {
                    background: hsl(var(--muted));
                    padding: 0.2em 0.4em;
                    border-radius: 0.25em;
                    font-size: 0.875em;
                    font-family: 'Courier New', monospace;
                }
                
                .html-content pre {
                    background: hsl(var(--muted));
                    padding: 1em;
                    border-radius: 0.5em;
                    overflow-x: auto;
                    margin-top: 1.5em;
                    margin-bottom: 1.5em;
                }
                
                .html-content pre code {
                    background: none;
                    padding: 0;
                }
                
                .html-content a {
                    color: hsl(var(--primary));
                    text-decoration: underline;
                }
                
                .html-content a:hover {
                    opacity: 0.8;
                }
                
                .html-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5em;
                    margin-top: 1.5em;
                    margin-bottom: 1.5em;
                }
                
                .html-content strong {
                    font-weight: 600;
                }
                
                .html-content em {
                    font-style: italic;
                }
            `}</style>
        </>
    );
}
