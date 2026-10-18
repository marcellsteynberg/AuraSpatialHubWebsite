/**
 * Editable content model for the Aura Spatial Hub site.
 * Each section's content is stored as a JSONB row in the `site_content` table
 * and surfaced to components via the ContentContext.
 *
 * The defaults below are also used as the seed in the Supabase migration and
 * as the fallback while content loads from the database.
 */

const PEXELS_VIDEO = 'https://videos.pexels.com/video-files';

export type MediaTransform = {
  x: number;
  y: number;
  zoom: number;
};

export const defaultTransform: MediaTransform = { x: 0, y: 0, zoom: 1 };

export type HeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  video: string;
  poster: string;
  mediaTransform?: MediaTransform;
  audioVolume?: number;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  stats: string;
  price: string;
  video: string;
  poster: string;
  image?: string;
  mediaTransform?: MediaTransform;
  audioVolume?: number;
};

export type ServicesContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  items: ServiceItem[];
};

export type ProjectItem = {
  id: string;
  name: string;
  location: string;
  service: string;
  image: string;
  video: string;
  span: 'tall' | 'wide' | 'normal';
  mediaTransform?: MediaTransform;
  audioVolume?: number;
};

export type PortfolioContent = {
  eyebrow: string;
  heading: string;
  items: ProjectItem[];
};

export type AboutStat = { figure: string; label: string };

export type AboutContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  image: string;
  video: string;
  statFigure: string;
  statLabel: string;
  stats: AboutStat[];
  mediaTransform?: MediaTransform;
};

export type WhyCard = {
  title: string;
  description: string;
  icon: string;
};

export type WhyContent = {
  eyebrow: string;
  heading: string;
  items: WhyCard[];
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  location: string;
};

export type TestimonialsContent = {
  eyebrow: string;
  heading: string;
  items: Testimonial[];
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  description: string;
  email: string;
  phone: string;
  phone2: string;
  instagram: string;
  tiktok: string;
};

export type LayoutContent = {
  positions: Record<string, { x: number; y: number }>;
};

export type TypographyPresetId =
  | 'editorial'
  | 'modern'
  | 'classic'
  | 'mono'
  | 'display';

export type TypographyContent = {
  preset: TypographyPresetId;
};

export type SiteContent = {
  hero: HeroContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  about: AboutContent;
  why: WhyContent;
  testimonials: TestimonialsContent;
  contact: ContactContent;
  layout: LayoutContent;
  typography: TypographyContent;
};

export const typographyPresets: {
  id: TypographyPresetId;
  label: string;
  description: string;
}[] = [
  {
    id: 'editorial',
    label: 'Editorial (Default)',
    description: 'Playfair Display headings + Inter body — the original luxury magazine feel.',
  },
  {
    id: 'modern',
    label: 'Modern Sans',
    description: 'Inter for everything — clean, minimal, tech-forward.',
  },
  {
    id: 'classic',
    label: 'Classic Serif',
    description: 'Cormorant Garamond throughout — refined, old-world, gallery-like.',
  },
  {
    id: 'mono',
    label: 'Monospace',
    description: 'JetBrains Mono headings + Inter body — architectural / technical drawing feel.',
  },
  {
    id: 'display',
    label: 'Bold Display',
    description: 'Playfair Display Black headings, oversized & high-contrast — statement-making.',
  },
];

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: 'Luxury Real Estate Visualization',
    title: 'Aura Spatial Hub',
    subtitle: 'Firm-Level Architectural Precision for Real Estate.',
    primaryCta: 'View Portfolio',
    secondaryCta: 'Book Consultation',
    video: `${PEXELS_VIDEO}/5305710/5305710-uhd_3840_2160_30fps.mp4`,
    poster:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  services: {
    eyebrow: 'What We Do',
    heading: 'A complete visual language for every property.',
    intro:
      "Four disciplines, one standard of precision. Each service is delivered by a dedicated team and crafted to the brand standard of the world's finest listings.",
    items: [
      {
        id: 'photos',
        title: 'Professional Photographs',
        description:
          "Editorial-grade property photography — every angle, every light source, captured to the standard of the world's finest listings.",
        stats: '',
        price: 'From R950',
        video: `${PEXELS_VIDEO}/4129273/4129273-uhd_2560_1440_30fps.mp4`,
        poster:
          '/images/professional-photos/Photo_1785528655898_(1).jpg',
      },
      {
        id: 'cinematic',
        title: 'Cinematic Video',
        description:
          'Aerial drones, gimbal-grade interiors, and colour-graded editing craft a film that sells a lifestyle — not just a property.',
        stats: '',
        price: 'From R800',
        video: 'https://res.cloudinary.com/avf9jgif/video/upload/v1789220384/Social.mp4',
        poster:
          'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1280',
      },
      {
        id: 'floorplans',
        title: 'Floorplans',
        description:
          'Architecturally precise plans drafted to firm standards — millimetre-accurate, legible, and presentation-ready for the most discerning listings.',
        stats: '',
        price: 'From R1000',
        video: 'https://res.cloudinary.com/axx2kz5y/image/upload/v1792072261/Website_Floor_PLan.jpg',
        poster:
          'https://res.cloudinary.com/axx2kz5y/image/upload/v1792072261/Website_Floor_PLan.jpg',
        image:
          'https://res.cloudinary.com/axx2kz5y/image/upload/v1792072261/Website_Floor_PLan.jpg',
      },
      {
        id: 'walkthroughs',
        title: '360 Walkthroughs',
        description:
          'Matterport-grade immersive walkthroughs that let qualified buyers navigate every room from anywhere — measured, branded, and seamless.',
        stats: '',
        price: 'From R1200',
        video: `${PEXELS_VIDEO}/4434267/4434267-hd_1920_1080_30fps.mp4`,
        poster:
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1280',
      },
    ],
  },
  portfolio: {
    eyebrow: 'Selected Work',
    heading: 'Properties we have rendered unforgettable.',
    items: [
      {
        id: 'p1',
        name: 'Casa Serena',
        location: 'Marbella, Spain',
        service: 'Cinematic Video',
        image:
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/4108608/4108608-uhd_2560_1440_30fps.mp4`,
        span: 'tall',
      },
      {
        id: 'p2',
        name: 'The Pavilion',
        location: 'Beverly Hills, CA',
        service: '360 Walkthrough',
        image:
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/4434267/4434267-hd_1920_1080_30fps.mp4`,
        span: 'normal',
      },
      {
        id: 'p3',
        name: 'Maison Lumière',
        location: "Côte d'Azur, France",
        service: 'Virtual Staging',
        image:
          'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/4108608/4108608-uhd_2560_1440_30fps.mp4`,
        span: 'wide',
      },
      {
        id: 'p4',
        name: 'Villa Aurelia',
        location: 'Lake Como, Italy',
        service: 'Cinematic Video',
        image:
          'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/7578452/7578452-hd_1920_1080_30fps.mp4`,
        span: 'normal',
      },
      {
        id: 'p5',
        name: 'The Atelier',
        location: 'Tribeca, New York',
        service: 'Fixer Upper Vision',
        image:
          'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/3195750/3195750-uhd_2560_1440_30fps.mp4`,
        span: 'tall',
      },
      {
        id: 'p6',
        name: 'Skyhouse One',
        location: 'Singapore',
        service: 'Floorplans',
        image:
          'https://images.pexels.com/photos/6538833/pexels-photo-6538833.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/5305710/5305710-uhd_3840_2160_30fps.mp4`,
        span: 'normal',
      },
      {
        id: 'p7',
        name: 'Cliffside Manor',
        location: 'Big Sur, California',
        service: 'Cinematic Video',
        image:
          'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/4108608/4108608-uhd_2560_1440_30fps.mp4`,
        span: 'wide',
      },
      {
        id: 'p8',
        name: 'Penthouse Nord',
        location: 'Copenhagen, Denmark',
        service: 'Virtual Staging',
        image:
          'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1280',
        video: `${PEXELS_VIDEO}/4108608/4108608-uhd_2560_1440_30fps.mp4`,
        span: 'normal',
      },
    ],
  },
  about: {
    eyebrow: 'The Studio',
    heading: 'Precision is a discipline, not a finish.',
    paragraphs: [
      'Aura Spatial Hub was founded on a simple conviction: that the visual presentation of a property should be held to the same exacting standard as the architecture itself.',
      'We are a collective of architects, cinematographers, and visual strategists. Every floorplan is drafted to firm tolerances. Every frame is colour-graded for the light it will be seen in. Every walkthrough is measured to the millimetre.',
      'From a modest penthouse to a nine-figure estate, our work gives buyers the feeling of being there — and gives agents a presentation worthy of the asking price.',
    ],
    image:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: `${PEXELS_VIDEO}/2795580/2795580-uhd_2560_1440_30fps.mp4`,
    statFigure: '12+',
    statLabel: 'Years crafting the visual language of luxury real estate.',
    stats: [
      { figure: '480+', label: 'Properties Visualised' },
      { figure: '38', label: 'Countries Served' },
      { figure: '4d', label: 'Avg. Turnaround' },
    ],
  },
  why: {
    eyebrow: 'Why Aura',
    heading: 'The standard our clients are held to.',
    items: [
      {
        title: 'Photorealistic Rendering',
        description:
          'Indistinguishable from photography — down to the grain of the stone and the fall of light.',
        icon: 'Aperture',
      },
      {
        title: 'Fast Turnaround',
        description: 'From brief to delivery in days, not weeks. Dedicated production teams per project.',
        icon: 'Zap',
      },
      {
        title: 'Luxury Marketing',
        description:
          "Every asset crafted to match the brand standard of the world's finest listings.",
        icon: 'Crown',
      },
      {
        title: 'Architectural Accuracy',
        description: 'Drawings drafted to firm standards — precise, legible, and presentation-ready.',
        icon: 'Compass',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Client Voices',
    heading: "Trusted by the world's finest agencies.",
    items: [
      {
        quote:
          'Aura Spatial Hub transformed an empty concrete shell into the most captivating listing we have ever marketed. The offers came within four days.',
        name: 'Isabelle Moreau',
        title: 'Principal, Moreau Estates',
        location: "Côte d'Azur",
      },
      {
        quote:
          'Their cinematic work is genuinely on another level. Our clients felt the property before they ever stepped foot inside it.',
        name: 'James Whitfield',
        title: 'Director, Whitfield & Co.',
        location: 'London',
      },
      {
        quote:
          'The architectural accuracy of the floorplans is extraordinary. Every dimension was exact. A truly professional operation.',
        name: 'Sofia Bianchi',
        title: 'Founding Partner, Studio Bianchi',
        location: 'Milan',
      },
      {
        quote:
          'We engaged Aura for a nine-figure listing. The Matterport walkthrough alone closed the deal with an overseas buyer who never visited in person.',
        name: 'Daniel Hartmann',
        title: 'Head of Luxury Division, Hartmann Realty',
        location: 'New York',
      },
    ],
  },
  contact: {
    eyebrow: 'Begin a Project',
    heading: "Let's craft something worthy of the address.",
    description:
      'Share the details of your listing and our studio will respond within one business day with a tailored proposal.',
    email: 'auraspatialhub@gmail.com',
    phone: '0837044202',
    phone2: '0647516090',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
  },
  layout: {
    positions: {},
  },
  typography: {
    preset: 'editorial',
  },
};

/** Ordered list of section keys for the admin panel navigation. */
export const sectionKeys = [
  'hero',
  'services',
  'portfolio',
  'about',
  'why',
  'testimonials',
  'contact',
  'layout',
  'typography',
] as const;

export type SectionKey = (typeof sectionKeys)[number];

export const sectionLabels: Record<SectionKey, string> = {
  hero: 'Hero',
  services: 'Services',
  portfolio: 'Portfolio',
  about: 'About',
  why: 'Why Aura',
  testimonials: 'Testimonials',
  contact: 'Contact',
  layout: 'Layout / Move',
  typography: 'Typography',
};
