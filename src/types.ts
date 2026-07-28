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
