export interface ContentImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ContentSection {
  id: string;
  type: "text" | "image" | "hero" | "gallery" | "cta";
  title?: string;
  content: string | ContentImage | ContentImage[];
  order: number;
}

export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  sections: ContentSection[];
  createdAt: string;
  updatedAt: string;
}

export type SiteContent = {
  pages: ContentPage[];
};