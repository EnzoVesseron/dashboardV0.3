import { SiteContent, ContentPage, ContentSection } from "@/types/content";

// Mock du contenu initial
const mockContent: Record<string, SiteContent> = {
  "1": {
    pages: [
      {
        id: "home",
        title: "Accueil",
        slug: "/",
        description: "Page d'accueil du site",
        sections: [
          {
            id: "hero",
            type: "hero",
            title: "Bienvenue sur notre site",
            content: "Découvrez nos services et solutions innovantes",
            order: 0
          },
          {
            id: "about",
            type: "text",
            title: "À propos",
            content: "Nous sommes une entreprise leader dans notre domaine...",
            order: 1
          },
          {
            id: "services",
            type: "gallery",
            title: "Nos services",
            content: [
              {
                url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
                alt: "Service 1",
                width: 800,
                height: 600
              },
              {
                url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
                alt: "Service 2",
                width: 800,
                height: 600
              }
            ],
            order: 2
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
};

export const ContentService = {
  getPages: async (siteId: string): Promise<ContentPage[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockContent[siteId]?.pages || [];
  },

  getPage: async (siteId: string, pageId: string): Promise<ContentPage | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockContent[siteId]?.pages.find(p => p.id === pageId) || null;
  },

  updateSection: async (
    siteId: string,
    pageId: string,
    sectionId: string,
    updates: Partial<ContentSection>
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const page = mockContent[siteId]?.pages.find(p => p.id === pageId);
    if (!page) return false;

    const sectionIndex = page.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return false;

    page.sections[sectionIndex] = {
      ...page.sections[sectionIndex],
      ...updates,
    };
    page.updatedAt = new Date().toISOString();

    return true;
  },

  createPage: async (siteId: string, page: Omit<ContentPage, "id" | "createdAt" | "updatedAt">): Promise<ContentPage> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPage: ContentPage = {
      ...page,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!mockContent[siteId]) {
      mockContent[siteId] = { pages: [] };
    }

    mockContent[siteId].pages.push(newPage);
    return newPage;
  },

  updatePage: async (siteId: string, pageId: string, updates: Partial<ContentPage>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pageIndex = mockContent[siteId]?.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return false;

    mockContent[siteId].pages[pageIndex] = {
      ...mockContent[siteId].pages[pageIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return true;
  },

  deletePage: async (siteId: string, pageId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pages = mockContent[siteId]?.pages;
    if (!pages) return false;

    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return false;

    pages.splice(pageIndex, 1);
    return true;
  }
};