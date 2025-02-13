"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    setIsLoading(true);
    timeout = setTimeout(() => setIsLoading(false), 300); // Réduit à 300ms pour une meilleure réactivité
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/50 backdrop-blur-[1px] transition-all">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin">
            <svg
              className="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3V6M12 18V21M6 12H3M21 12H18M18.364 5.636L16.243 7.757M7.757 16.243L5.636 18.364M18.364 18.364L16.243 16.243M7.757 7.757L5.636 5.636"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    </div>
  );
}