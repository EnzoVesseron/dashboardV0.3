"use client";

import { useState, useEffect } from "react";
import { useNews } from "@/hooks/use-news";
import { useSite } from "@/lib/site-context";
import { NewsArticle } from "@/types/news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/news/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const articleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  isPublished: z.boolean(),
  // Champs cachés mais toujours requis pour le fonctionnement
  slug: z.string().min(1, "Le slug est requis"),
  excerpt: z.string().min(1, "L'extrait est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  coverImage: z.object({
    url: z.string().url("URL invalide"),
    alt: z.string().min(1, "Le texte alternatif est requis"),
  }).optional(),
});

export default function ArticleEditorPage() {
  const { currentSite } = useSite();
  const params = useParams();
  const router = useRouter();
  const { articles, isLoading, error, updateArticle, createArticle } = useNews();
  const [isSaving, setIsSaving] = useState(false);

  const isNew = params.articleId === "new";
  const article = isNew ? null : articles.find(a => a.id === params.articleId);

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      isPublished: article?.isPublished || false,
      // Valeurs par défaut pour les champs cachés
      slug: article?.slug || "",
      excerpt: article?.excerpt || "",
      category: article?.category || "Non catégorisé",
      coverImage: article?.coverImage,
    },
  });

  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    try {
      setIsSaving(true);
      // Générer automatiquement le slug à partir du titre
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Utiliser le début du contenu comme extrait
      const excerpt = values.content
        .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
        .slice(0, 150) // Prendre les 150 premiers caractères
        .trim() + '...';

      const dataToSave = {
        ...values,
        slug,
        excerpt,
      };

      if (isNew) {
        const newArticle = await createArticle({
          ...dataToSave,
          author: {
            id: "1", // TODO: Use real user ID
            name: "Admin User", // TODO: Use real user name
          },
        });
        if (newArticle) {
          router.push("/dashboard/news");
        }
      } else if (article) {
        const success = await updateArticle(article.id, dataToSave);
        if (success) {
          router.push("/dashboard/news");
        }
      }
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Actualités</h1>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || (!isNew && !article)) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Actualités</h1>
          <p className="text-destructive">{error || "Article non trouvé"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/news"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Titre de l'article" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="published">Publier l'article</Label>
                      <p className="text-sm text-muted-foreground">
                        L'article sera visible sur le site
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="published"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu de l'article</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/news")}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}