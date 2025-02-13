import { useState, useEffect } from "react";
import { NewsService } from "@/lib/services/news.service";
import { useSite } from "@/lib/site-context";
import { NewsArticle } from "@/types/news";

export function useNews() {
  const { currentSite } = useSite();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await NewsService.getArticles(currentSite.id);
        setArticles(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Erreur lors du chargement des articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentSite.id]);

  const createArticle = async (article: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newArticle = await NewsService.createArticle(currentSite.id, article);
      setArticles(prev => [...prev, newArticle]);
      return newArticle;
    } catch (err) {
      console.error("Error creating article:", err);
      return null;
    }
  };

  const updateArticle = async (articleId: string, updates: Partial<NewsArticle>) => {
    try {
      const success = await NewsService.updateArticle(currentSite.id, articleId, updates);
      if (success) {
        const updatedArticles = await NewsService.getArticles(currentSite.id);
        setArticles(updatedArticles);
      }
      return success;
    } catch (err) {
      console.error("Error updating article:", err);
      return false;
    }
  };

  const deleteArticle = async (articleId: string) => {
    try {
      const success = await NewsService.deleteArticle(currentSite.id, articleId);
      if (success) {
        setArticles(prev => prev.filter(a => a.id !== articleId));
      }
      return success;
    } catch (err) {
      console.error("Error deleting article:", err);
      return false;
    }
  };

  return {
    articles,
    isLoading,
    error,
    createArticle,
    updateArticle,
    deleteArticle
  };
}