"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteSwitcher } from "@/components/site-switcher";
import { UserProfile } from "@/components/user-profile";
import { usePlugins } from "@/lib/plugins-context";
import { useSite } from "@/lib/site-context";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Menu,
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from "lucide-react";

const getNavItems = (isPluginEnabled: (siteId: string, pluginId: string) => boolean, siteId: string) => {
  const items = [
    {
      title: "Vue d'ensemble",
      href: "/dashboard",
      icon: LayoutDashboard,
      always: true,
    },
    {
      title: "Statistiques",
      href: "/dashboard/stats",
      icon: BarChart3,
      pluginId: "stats",
    },
    {
      title: "Contenu",
      href: "/dashboard/content",
      icon: FileText,
      pluginId: "content",
    },
    {
      title: "Actualités",
      href: "/dashboard/news",
      icon: Newspaper,
      pluginId: "news",
    },
    {
      title: "Utilisateurs",
      href: "/dashboard/users",
      icon: Users,
      always: true,
    },
    {
      title: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
      always: true,
    },
  ];

  return items;
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { isPluginEnabled } = usePlugins();
  const { currentSite } = useSite();
  
  const navItems = getNavItems(isPluginEnabled, currentSite.id).filter(
    item => item.always || (item.pluginId && isPluginEnabled(currentSite.id, item.pluginId))
  );

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-gradient-to-b from-background to-muted/30 border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Hauteur fixe de 56px (14*4) pour correspondre à la navbar */}
      <div className={cn(
        "flex h-14 items-center border-b px-4",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 hover:bg-muted"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "hover:bg-muted",
                  isCollapsed && "justify-center px-2",
                  !isActive && "hover:translate-x-1"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  isActive && "animate-pulse"
                )} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className={cn(
          "flex items-center justify-center"
        )}>
          {!isCollapsed && <ThemeToggle />}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute left-4 top-4"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <Sidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Hauteur fixe de 56px (14*4) pour la navbar */}
        <div className="flex h-14 items-center justify-between gap-4 px-4 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <SiteSwitcher />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <main className="h-full p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}