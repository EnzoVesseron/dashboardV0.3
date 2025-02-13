import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { NewsService } from "@/lib/services/news.service";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    
    if (!siteId) {
      return NextResponse.json({ error: "Site ID is required" }, { status: 400 });
    }

    const articles = await NewsService.getArticles(siteId);
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { siteId, article } = await request.json();
    if (!siteId || !article) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const newArticle = await NewsService.createArticle(siteId, article);
    return NextResponse.json({ article: newArticle });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}