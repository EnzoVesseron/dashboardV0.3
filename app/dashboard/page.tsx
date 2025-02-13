"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, TrendingUp, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre tableau de bord
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Utilisateurs totaux"
          value="1,234"
          icon={Users}
          trend={{
            value: "+12%",
            isPositive: true,
            label: "depuis le mois dernier"
          }}
        />

        <StatCard
          title="Taux de conversion"
          value="2.4%"
          icon={TrendingUp}
          trend={{
            value: "+0.3%",
            isPositive: true,
            label: "depuis la semaine dernière"
          }}
        />

        <StatCard
          title="Pages vues"
          value="45,781"
          icon={Activity}
          trend={{
            value: "+8%",
            isPositive: true,
            label: "depuis hier"
          }}
        />

        <StatCard
          title="Temps moyen"
          value="2m 13s"
          icon={Activity}
          trend={{
            value: "+15s",
            isPositive: true,
            label: "par session"
          }}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Nombre de visiteurs</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}