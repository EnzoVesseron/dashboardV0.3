"use client";

import { useState } from "react";
import { useContent } from "@/hooks/use-content";
import { useSite } from "@/lib/site-context";
import { ContentSection } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionEditor } from "@/components/content/section-editor";
import { FileText, Image, LayoutTemplate, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function PageContentPage() {
  const { currentSite } = useSite();
  const params = useParams();
  const router = useRouter();
  const { pages, isLoading, error, updateSection } = useContent();
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);

  const page = pages.find(p => p.id === params.pageId);

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

  if (error || !page) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Contenu</h1>
          <p className="text-destructive">{error || "Page non trouvée"}</p>
        </div>
      </div>
    );
  }

  const handleSectionUpdate = async (updates: Partial<ContentSection>) => {
    if (!selectedSection) return;
    await updateSection(page.id, selectedSection.id, updates);
    setSelectedSection(null);
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "gallery":
        return <LayoutTemplate className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/content"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{page.title}</h1>
        <p className="text-muted-foreground">
          Gérez le contenu de cette page
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {page.sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    {getSectionIcon(section.type)}
                    <span>{section.title || `Section ${section.type}`}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Type: {section.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Ordre: {section.order}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSection(section)}
                      >
                        Modifier
                      </Button>
                    </div>

                    {section.type === "gallery" && Array.isArray(section.content) && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {section.content.map((image, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "image" && typeof section.content === "object" && "url" in section.content && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted mt-4">
                        <img
                          src={section.content.url}
                          alt={section.content.alt}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {selectedSection && (
        <SectionEditor
          section={selectedSection}
          onSave={handleSectionUpdate}
          onClose={() => setSelectedSection(null)}
          open={true}
        />
      )}
    </div>
  );
}