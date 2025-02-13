import { useState, useEffect } from "react";
import { ContentService } from "@/lib/services/content.service";
import { useSite } from "@/lib/site-context";
import { ContentPage, ContentSection } from "@/types/content";

export function useContent() {
  const { currentSite } = useSite();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true);
      try {
        const data = await ContentService.getPages(currentSite.id);
        setPages(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError("Erreur lors du chargement des pages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [currentSite.id]);

  const updateSection = async (
    pageId: string,
    sectionId: string,
    updates: Partial<ContentSection>
  ) => {
    try {
      const success = await ContentService.updateSection(
        currentSite.id,
        pageId,
        sectionId,
        updates
      );
      if (success) {
        // Recharger les pages pour avoir les données à jour
        const updatedPages = await ContentService.getPages(currentSite.id);
        setPages(updatedPages);
      }
      return success;
    } catch (err) {
      console.error("Error updating section:", err);
      return false;
    }
  };

  const createPage = async (page: Omit<ContentPage, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newPage = await ContentService.createPage(currentSite.id, page);
      setPages(prev => [...prev, newPage]);
      return newPage;
    } catch (err) {
      console.error("Error creating page:", err);
      return null;
    }
  };

  const updatePage = async (pageId: string, updates: Partial<ContentPage>) => {
    try {
      const success = await ContentService.updatePage(currentSite.id, pageId, updates);
      if (success) {
        const updatedPages = await ContentService.getPages(currentSite.id);
        setPages(updatedPages);
      }
      return success;
    } catch (err) {
      console.error("Error updating page:", err);
      return false;
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      const success = await ContentService.deletePage(currentSite.id, pageId);
      if (success) {
        setPages(prev => prev.filter(p => p.id !== pageId));
      }
      return success;
    } catch (err) {
      console.error("Error deleting page:", err);
      return false;
    }
  };

  return {
    pages,
    isLoading,
    error,
    updateSection,
    createPage,
    updatePage,
    deletePage
  };
}