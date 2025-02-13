"use client";

import { useState } from "react";
import { ContentSection, ContentImage } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";

interface SectionEditorProps {
  section: ContentSection;
  onSave: (updates: Partial<ContentSection>) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

const imageSchema = z.object({
  url: z.string().url("URL invalide"),
  alt: z.string().min(1, "Le texte alternatif est requis"),
  width: z.number().optional(),
  height: z.number().optional(),
});

const sectionSchema = z.object({
  title: z.string().optional(),
  content: z.union([
    z.string(),
    imageSchema,
    z.array(imageSchema),
  ]),
});

export function SectionEditor({ section, onSave, onClose, open }: SectionEditorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: section.title,
      content: section.content,
    },
  });

  const handleSubmit = async (values: z.infer<typeof sectionSchema>) => {
    try {
      setIsLoading(true);
      await onSave(values);
      onClose();
    } catch (error) {
      console.error("Error saving section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    const currentContent = form.getValues("content") as ContentImage[];
    form.setValue("content", [
      ...currentContent,
      { url: "", alt: "", width: undefined, height: undefined }
    ]);
  };

  const removeImage = (index: number) => {
    const currentContent = form.getValues("content") as ContentImage[];
    form.setValue("content", currentContent.filter((_, i) => i !== index));
  };

  const renderContentField = () => {
    switch (section.type) {
      case "text":
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={10}
                    placeholder="Entrez votre contenu ici..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "image":
        return (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="content.url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de l'image</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content.alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texte alternatif</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Description de l'image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-center">
              {form.watch("content.url") && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={form.watch("content.url")}
                    alt={form.watch("content.alt") || "Aperçu"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "gallery":
        const images = form.watch("content") as ContentImage[];
        return (
          <div className="space-y-8">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={addImage}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter une image
              </Button>
            </div>
            
            {images.map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-8 p-4 border rounded-lg relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground z-10"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`content.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image {index + 1}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`content.${index}.alt`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texte alternatif</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Description de l'image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-center">
                  {form.watch(`content.${index}.url`) && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={form.watch(`content.${index}.url`)}
                        alt={form.watch(`content.${index}.alt`) || "Aperçu"}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Modifier la section</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Titre de la section" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderContentField()}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}