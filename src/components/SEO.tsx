import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import type { SEOMetadata } from '../config/seoConfig';
import { getSeoMetadata, getOpenGraphTags, getTwitterCardTags, getCanonicalUrl } from '../config/seoConfig';

interface SEOProps {
  page?: string;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

/**
 * SEO Component - Use this in any page to set meta tags dynamically
 * Example usage:
 * <SEO page="projects" title="My Custom Title" />
 * or
 * <SEO title="Project Name" description="Custom description" />
 */
export const SEO: React.FC<SEOProps> = ({
  page,
  title,
  description,
  keywords,
  image,
  type,
  publishedTime,
  modifiedTime,
  author,
}) => {
  const location = useLocation();

  // Get base metadata
  let meta: SEOMetadata;
  if (page) {
    meta = getSeoMetadata(page);
  } else {
    meta = {
      title: title || 'KG Launchpad',
      description: description || 'Connect, Learn, Launch',
      keywords: keywords,
      image: image,
      type: type,
    };
  }

  // Override with provided props
  if (title) meta.title = title;
  if (description) meta.description = description;
  if (keywords) meta.keywords = keywords;
  if (image) meta.image = image;
  if (type) meta.type = type;

  const canonicalUrl = getCanonicalUrl(location.pathname);
  const ogTags = getOpenGraphTags(meta, location.pathname);
  const twitterTags = getTwitterCardTags(meta);

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTags['og:title']} />
      <meta property="og:description" content={ogTags['og:description']} />
      <meta property="og:image" content={ogTags['og:image']} />
      <meta property="og:url" content={ogTags['og:url']} />
      <meta property="og:type" content={ogTags['og:type']} />
      <meta property="og:site_name" content={ogTags['og:site_name']} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterTags['twitter:card']} />
      <meta name="twitter:title" content={twitterTags['twitter:title']} />
      <meta name="twitter:description" content={twitterTags['twitter:description']} />
      <meta name="twitter:image" content={twitterTags['twitter:image']} />
      <meta name="twitter:creator" content={twitterTags['twitter:creator']} />

      {/* Article specific tags */}
      {meta.type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {meta.type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {meta.type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
};

export default SEO;
