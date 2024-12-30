// src/components/shared/SEO.tsx
import { Helmet } from "react-helmet-async";

// Define the type for the component props
interface SEOProps {
	title: string; // The title of the page, displayed in the browser tab and search engines
	description: string; // A brief summary of the page content for search engine snippets
	keywords: string; // A comma-separated list of keywords relevant to the page content
}

// Functional component for injecting SEO metadata
const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => (
	<Helmet>
		{/* Page Title */}
		<title>{title}</title>
		{/* Meta tag for description (used in search engine snippets) */}
		<meta name="description" content={description} />
		{/* Meta tag for keywords (provides additional context for search engines) */}
		<meta name="keywords" content={keywords} />
		{/* Viewport meta tag to ensure proper rendering on mobile devices */}
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		{/* Character encoding for the document */}
		<meta charSet="utf-8" />

		{/* Open Graph Meta Tags for social media sharing */}
		{/* Defines the title shown on platforms like Facebook or LinkedIn */}
		<meta property="og:title" content={title} />
		{/* Provides the description used in the preview card on social platforms */}
		<meta property="og:description" content={description} />
		{/* Specifies the type of content (e.g., "website", "article") */}
		<meta property="og:type" content="website" />
		{/* Specifies the locale/language of the page (e.g., "en_US" for English - United States) */}
		<meta property="og:locale" content="en_US" />

		{/* Twitter Meta Tags for better link previews on Twitter */}
		{/* Specifies the type of Twitter card (e.g., summary or summary_large_image) */}
		<meta name="twitter:card" content="summary_large_image" />
		{/* Title displayed on the Twitter card */}
		<meta name="twitter:title" content={title} />
		{/* Description displayed on the Twitter card */}
		<meta name="twitter:description" content={description} />
	</Helmet>
);

export default SEO;
