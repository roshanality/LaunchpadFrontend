/**
 * SEO Configuration for KG Launchpad
 * Centralized metadata for all pages and canonical URLs
 */

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://kgplaunchpad.com';
const SITE_NAME = 'KG Launchpad';
const SITE_DESCRIPTION = 'KG Launchpad connects students with mentors, projects, courses, and startup opportunities. Join India\'s premier entrepreneurial ecosystem.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const TWITTER_HANDLE = '@KGLaunchpad';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
}

export const seoConfig: Record<string, SEOMetadata> = {
  // Public Pages
  home: {
    title: `${SITE_NAME} - Connect, Learn, Launch`,
    description: SITE_DESCRIPTION,
    keywords: 'entrepreneurship, mentorship, startup, projects, courses, education, alumni network',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  about: {
    title: `About ${SITE_NAME} - Our Mission & Vision`,
    description: 'Learn about KG Launchpad, a platform designed to nurture entrepreneurs, connect mentors with founders, and create opportunities for students.',
    keywords: 'about us, mission, vision, entrepreneurial ecosystem',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  team: {
    title: `Team - ${SITE_NAME}`,
    description: 'Meet the talented team behind KG Launchpad driving innovation and impact.',
    keywords: 'team, founders, leadership',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  privacyPolicy: {
    title: `Privacy Policy - ${SITE_NAME}`,
    description: 'Our privacy policy explains how we collect and use your personal information.',
    keywords: 'privacy, data protection, terms',
    type: 'website',
  },
  termsOfService: {
    title: `Terms of Service - ${SITE_NAME}`,
    description: 'Read our terms of service to understand your rights and responsibilities on our platform.',
    keywords: 'terms, conditions, legal',
    type: 'website',
  },

  // Authentication
  login: {
    title: `Login - ${SITE_NAME}`,
    description: 'Login to your KG Launchpad account to access projects, courses, and mentorship opportunities.',
    keywords: 'login, sign in, authentication',
  },
  register: {
    title: `Register - ${SITE_NAME}`,
    description: 'Join KG Launchpad and start your entrepreneurial journey today.',
    keywords: 'register, signup, join',
  },

  // Projects
  projects: {
    title: `Student Projects - ${SITE_NAME}`,
    description: 'Explore innovative student projects, collaborate, and showcase your ideas on KG Launchpad.',
    keywords: 'projects, student projects, collaboration, innovation',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  projectDetail: {
    title: 'Project Details',
    description: 'Explore this creative student project and join the team.',
    type: 'article',
  },

  // LaunchPad (Services/Consultation)
  launchpad: {
    title: `Consulting Services - ${SITE_NAME}`,
    description: 'Get expert consulting services from mentors and experts. Find services for your startup journey.',
    keywords: 'consulting, mentorship, services, expert advice',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  serviceDetail: {
    title: 'Consulting Service',
    description: 'Discover this expert consulting service to accelerate your startup.',
    type: 'article',
  },

  // LaunchDeck (Pitches)
  launchdeck: {
    title: `Startup Pitches - ${SITE_NAME}`,
    description: 'Explore startup pitches, connect with founders, and find investment opportunities.',
    keywords: 'pitches, startups, investment, entrepreneurs, founders',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  pitchDetail: {
    title: 'Startup Pitch',
    description: 'Check out this innovative startup pitch and investment opportunity.',
    type: 'article',
  },

  // Blogs
  blogs: {
    title: `Blog - ${SITE_NAME}`,
    description: 'Read insights, stories, and tips from entrepreneurs and mentors in the KG Launchpad community.',
    keywords: 'blog, articles, insights, stories, entrepreneurship',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  blogDetail: {
    title: 'Blog Post',
    description: 'Discover insights and stories from the KG Launchpad community.',
    type: 'article',
  },

  // Courses
  courses: {
    title: `Online Courses - ${SITE_NAME}`,
    description: 'Learn from industry experts with our curated courses on entrepreneurship, business, and technology.',
    keywords: 'courses, learning, education, entrepreneurship courses, business courses',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  courseDetail: {
    title: 'Course Details',
    description: 'Explore this comprehensive course and start learning today.',
    type: 'article',
  },

  // Events
  events: {
    title: `Events & Networking - ${SITE_NAME}`,
    description: 'Discover and attend networking events, workshops, and conferences in the entrepreneurial ecosystem.',
    keywords: 'events, workshops, networking, conferences, webinars',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  eventDetail: {
    title: 'Event Details',
    description: 'Register for this upcoming event and connect with like-minded entrepreneurs.',
    type: 'article',
  },

  // Mentorship
  mentors: {
    title: `Find Mentors - ${SITE_NAME}`,
    description: 'Connect with experienced mentors who can guide your entrepreneurial journey.',
    keywords: 'mentorship, mentors, guidance, advice',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  alumniConnect: {
    title: `Alumni Network - ${SITE_NAME}`,
    description: 'Join the KG Launchpad alumni community and expand your professional network.',
    keywords: 'alumni, network, community, connections',
    image: DEFAULT_IMAGE,
    type: 'website',
  },

  // Resources
  resources: {
    title: `Resources - ${SITE_NAME}`,
    description: 'Access valuable resources, tools, and guides for your entrepreneurial journey.',
    keywords: 'resources, tools, guides, downloads',
    image: DEFAULT_IMAGE,
    type: 'website',
  },

  // Support
  support: {
    title: `Support Center - ${SITE_NAME}`,
    description: 'Get help and support from our team. Submit service requests and track your issues.',
    keywords: 'support, help, contact, service requests',
  },

  // User Profile
  profile: {
    title: 'User Profile',
    description: 'View user profile and achievements on KG Launchpad.',
    type: 'profile',
  },

  // Admin Pages (not indexed)
  admin: {
    title: `Admin Dashboard - ${SITE_NAME}`,
    description: 'Admin panel for managing users and content.',
    keywords: 'admin, management, dashboard',
  },
};

/**
 * Get SEO metadata for a page
 */
export function getSeoMetadata(page: string, overrides?: Partial<SEOMetadata>): SEOMetadata {
  const baseMeta = seoConfig[page] || {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  };

  return {
    ...baseMeta,
    image: baseMeta.image || DEFAULT_IMAGE,
    ...overrides,
  };
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(pathname: string): string {
  return `${SITE_URL}${pathname}`;
}

/**
 * Get Open Graph tags
 */
export interface OpenGraphTags {
  'og:title': string;
  'og:description': string;
  'og:image': string;
  'og:url': string;
  'og:type': string;
  'og:site_name': string;
}

export function getOpenGraphTags(meta: SEOMetadata, pathname: string): OpenGraphTags {
  return {
    'og:title': meta.title,
    'og:description': meta.description,
    'og:image': meta.image || DEFAULT_IMAGE,
    'og:url': getCanonicalUrl(pathname),
    'og:type': meta.type || 'website',
    'og:site_name': SITE_NAME,
  };
}

/**
 * Get Twitter Card tags
 */
export interface TwitterCardTags {
  'twitter:card': 'summary_large_image' | 'summary';
  'twitter:title': string;
  'twitter:description': string;
  'twitter:image': string;
  'twitter:creator': string;
}

export function getTwitterCardTags(meta: SEOMetadata): TwitterCardTags {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
    'twitter:image': meta.image || DEFAULT_IMAGE,
    'twitter:creator': TWITTER_HANDLE,
  };
}

/**
 * Site metadata constants
 */
export const SITE_METADATA = {
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  image: DEFAULT_IMAGE,
  twitter: TWITTER_HANDLE,
};
