"use client";

import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground">
            <svg
              className={cn(
                "mr-1 h-3 w-3",
                trend.isPositive ? "text-emerald-500" : "text-red-500",
                "fill-current"
              )}
              viewBox="0 0 24 24"
            >
              {trend.isPositive ? (
                <path d="M13.0001 5.67578L18.0001 10.6758V8.67578H20.0001V14.6758H14.0001V12.6758H16.0001L13.0001 9.67578L9.00012 13.6758L3.29297 7.96863L4.70718 6.55441L9.00012 10.8474L13.0001 5.67578Z" />
              ) : (
                <path d="M13.0001 18.3242L18.0001 13.3242V15.3242H20.0001V9.32422H14.0001V11.3242H16.0001L13.0001 14.3242L9.00012 10.3242L3.29297 16.0314L4.70718 17.4456L9.00012 13.1526L13.0001 18.3242Z" />
              )}
            </svg>
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-emerald-500" : "text-red-500"
            )}>
              {trend.value}
            </span>
            <span className="ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}