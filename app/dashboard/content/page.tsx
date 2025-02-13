"use client";

import React, { useState } from "react";
import { useContent } from "@/hooks/use-content";
import { useSite } from "@/lib/site-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Settings, Eye, Pencil, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionEditor } from "@/components/content/section-editor";
import { ContentSection } from "@/types/content";

export default function ContentPage() {
  const { currentSite } = useSite();
  const { pages, isLoading, error, updateSection } = useContent();
  const [selectedSection, setSelectedSection] = useState<{
    pageId: string;
    section: ContentSection;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Contenu</h1>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Contenu</h1>
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  const handleSectionUpdate = async (updates: Partial<ContentSection>) => {
    if (!selectedSection) return;
    await updateSection(selectedSection.pageId, selectedSection.section.id, updates);
    setSelectedSection(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contenu</h1>
        <p className="text-muted-foreground">
          Gérez le contenu de {currentSite.name}
        </p>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Pages du site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Rechercher une page..."
                    className="max-w-sm"
                  />
                </div>

                <Accordion type="multiple" className="space-y-4">
                  {pages.map((page) => (
                    <AccordionItem 
                      key={page.id} 
                      value={page.id}
                      className="border rounded-lg"
                    >
                      <div className="flex items-center px-4">
                        <AccordionTrigger className="flex-1 hover:no-underline py-4">
                          <div className="flex items-center gap-6">
                            <span className="font-medium">{page.title}</span>
                            <span className="text-sm text-muted-foreground">{page.slug}</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(page.updatedAt), "Pp", { locale: fr })}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/${page.slug}`, "_blank")}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Aperçu</span>
                          </Button>
                        </div>
                      </div>
                      <AccordionContent>
                        <div className="space-y-1 py-2">
                          {page.sections.map((section) => (
                            <div 
                              key={section.id}
                              className="flex items-center gap-2 py-2 px-6 hover:bg-accent rounded-md group"
                            >
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm">
                                    {section.title || `Section ${section.type}`}
                                  </span>
                                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">
                                    {section.type}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setSelectedSection({ pageId: page.id, section })}
                                >
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configuration des options de contenu
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedSection && (
        <SectionEditor
          section={selectedSection.section}
          onSave={handleSectionUpdate}
          onClose={() => setSelectedSection(null)}
          open={true}
        />
      )}
    </div>
  );
}