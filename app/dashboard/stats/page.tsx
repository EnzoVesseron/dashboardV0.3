"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { DeviceStats } from "@/components/dashboard/device-stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { Eye, Clock, Globe2, ArrowUpRight, Repeat2 } from "lucide-react";
import { useSite } from "@/lib/site-context";
import { useEffect, useState } from "react";

// Multiplicateurs de données par site pour la simulation
const siteMultipliers: Record<string, number> = {
  "1": 1,    // Site Principal
  "2": 0.6,  // Blog
  "3": 0.8,  // E-commerce
};

interface Stats {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{ path: string; views: number; name: string; }>;
}

export default function StatsPage() {
  const { currentSite } = useSite();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const multiplier = siteMultipliers[currentSite.id] || 1;

    setStats({
      pageViews: Math.floor(2350 * multiplier),
      uniqueVisitors: Math.floor(1850 * multiplier),
      avgSessionDuration: `${Math.floor(2 + Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      bounceRate: `${Math.floor(45 + Math.random() * 15)}%`,
      topPages: [
        { path: "/", views: Math.floor(800 * multiplier), name: "Accueil" },
        { path: "/contact", views: Math.floor(450 * multiplier), name: "Contact" },
        { path: "/about", views: Math.floor(350 * multiplier), name: "À propos" },
        { path: "/services", views: Math.floor(300 * multiplier), name: "Services" },
      ],
    });
  }, [currentSite.id]);

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Statistiques</h1>
          <p className="text-muted-foreground">
            Chargement des statistiques...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground">
          Analyse détaillée des performances de {currentSite.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pages vues"
          value={stats.pageViews.toLocaleString()}
          icon={Eye}
          trend={{
            value: "+18%",
            isPositive: true,
            label: "depuis la semaine dernière"
          }}
        />

        <StatCard
          title="Visiteurs uniques"
          value={stats.uniqueVisitors.toLocaleString()}
          icon={ArrowUpRight}
          trend={{
            value: "+12%",
            isPositive: true,
            label: "depuis la semaine dernière"
          }}
        />

        <StatCard
          title="Durée moyenne de session"
          value={stats.avgSessionDuration}
          icon={Clock}
          trend={{
            value: "+15s",
            isPositive: true,
            label: "depuis la semaine dernière"
          }}
        />

        <StatCard
          title="Taux de rebond"
          value={stats.bounceRate}
          icon={Repeat2}
          trend={{
            value: "-2%",
            isPositive: true,
            label: "depuis la semaine dernière"
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Vue d'ensemble des visites</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Pages les plus visitées</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPages.map((page) => (
                <div key={page.path} className="flex items-center">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm font-medium">{page.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {page.views.toLocaleString()} vues
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Répartition par appareils</CardTitle>
          <Globe2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <DeviceStats />
        </CardContent>
      </Card>
    </div>
  );
}