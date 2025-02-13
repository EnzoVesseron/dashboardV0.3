import { NewsArticle } from "@/types/news";

// Mock des articles d'actualités
const mockArticles: Record<string, NewsArticle[]> = {
  "1": [
    {
      id: "1",
      title: "Lancement de notre nouveau site",
      slug: "lancement-nouveau-site",
      content: "Nous sommes ravis de vous présenter notre nouveau site web...",
      excerpt: "Découvrez notre nouvelle plateforme en ligne",
      category: "Entreprise",
      coverImage: {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        alt: "Lancement du site"
      },
      isPublished: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: "1",
        name: "Admin User"
      }
    },
    {
      id: "2",
      title: "Nouveaux services disponibles",
      slug: "nouveaux-services",
      content: "Nous élargissons notre gamme de services...",
      excerpt: "De nouvelles offres pour mieux vous servir",
      category: "Services",
      isPublished: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      author: {
        id: "2",
        name: "John Doe"
      }
    }
  ]
};

export const NewsService = {
  getArticles: async (siteId: string): Promise<NewsArticle[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockArticles[siteId] || [];
  },

  getArticle: async (siteId: string, articleId: string): Promise<NewsArticle | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockArticles[siteId]?.find(a => a.id === articleId) || null;
  },

  createArticle: async (siteId: string, article: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">): Promise<NewsArticle> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newArticle: NewsArticle = {
      ...article,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!mockArticles[siteId]) {
      mockArticles[siteId] = [];
    }

    mockArticles[siteId].push(newArticle);
    return newArticle;
  },

  updateArticle: async (siteId: string, articleId: string, updates: Partial<NewsArticle>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const articleIndex = mockArticles[siteId]?.findIndex(a => a.id === articleId);
    if (articleIndex === -1) return false;

    mockArticles[siteId][articleIndex] = {
      ...mockArticles[siteId][articleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return true;
  },

  deleteArticle: async (siteId: string, articleId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const articles = mockArticles[siteId];
    if (!articles) return false;

    const articleIndex = articles.findIndex(a => a.id === articleId);
    if (articleIndex === -1) return false;

    articles.splice(articleIndex, 1);
    return true;
  }
};