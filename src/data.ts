import { PortfolioItem, BlogPost } from './types';

export const portfolioData: PortfolioItem[] = [
  {
    id: '1',
    title: 'Minimalist E-commerce',
    category: 'Web Design',
    imageUrl: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A clean and intuitive e-commerce platform.'
  },
  {
    id: '2',
    title: 'Fintech Dashboard',
    category: 'UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A comprehensive dashboard for financial analytics.'
  },
  {
    id: '3',
    title: 'Brand Identity',
    category: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Modern brand identity for a tech startup.'
  },
  {
    id: '4',
    title: 'Travel App',
    category: 'Mobile App',
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Mobile application for travel planning.'
  },
  {
    id: '5',
    title: 'Photography Portfolio',
    category: 'Web Design',
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A visual-first portfolio for a photographer.'
  },
  {
    id: '6',
    title: 'Smart Home Interface',
    category: 'UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Control panel interface for smart home devices.'
  }
];

export const blogData: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Minimalism in Web Design',
    excerpt: 'Exploring how less can be more when designing user interfaces and experiences.',
    date: 'Oct 12, 2026',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Understanding Color Theory in UI',
    excerpt: 'A deep dive into how colors affect user psychology and behavior in digital products.',
    date: 'Sep 28, 2026',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Building Accessible React Applications',
    excerpt: 'Practical tips and techniques for making your React apps usable by everyone.',
    date: 'Sep 15, 2026',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'The Future of Frontend Development',
    excerpt: 'Predictions and trends shaping the landscape of web development in the coming years.',
    date: 'Aug 30, 2026',
    readTime: '8 min read'
  }
];
