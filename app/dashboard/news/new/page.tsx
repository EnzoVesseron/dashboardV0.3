"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/news/new");
  }, [router]);

  return null;
}