export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  iconUrl?: string;
  date?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  readTime?: string;
  content?: string;
  url?: string;
  iconUrl?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'video' | 'audio' | string;
  platform: string;
  url: string;
  description?: string;
  date?: string;
  thumbnailUrl?: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt?: any;
}

export interface VisualItem {
  id: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  date?: string;
  createdAt?: any;
}

export interface ITProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Full-Stack' | 'Frontend' | 'Backend & API' | 'AI & Machine Learning' | 'DevOps & Cloud' | 'Mobile App' | string;
  status: 'in_progress' | 'completed';
  progressPercentage?: number;
  techStack: string[];
  features?: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  timeline?: string;
  architectureSummary?: string;
  featured?: boolean;
  createdAt?: any;
}
