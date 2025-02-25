import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

// Mock de l'utilisateur pour le développement
const mockUser = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  theme: "light",
  isSuperAdmin: true,
  isAdmin: true,
  siteIds: ["1", "2", "3"]
};

export const dynamic = 'force-dynamic';

export async function logUser(email: string, password: string) {
  try {
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    console.log('node env', process.env.NODE_ENV)

    // En développement, vérifier les identifiants statiques
    if (process.env.NODE_ENV === "development") {
      if (email === "admin@example.com" && password === "password123") {
        const token = await new SignJWT({ 
          userId: mockUser.id,
          email: mockUser.email,
          isSuperAdmin: mockUser.isSuperAdmin,
          isAdmin: mockUser.isAdmin
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("24h")
          .sign(JWT_SECRET);

        const response = NextResponse.json(
          { 
            success: true,
            user: {
              id: mockUser.id,
              email: mockUser.email,
              name: mockUser.name,
              theme: mockUser.theme
            }
          },
          { status: 200 }
        );

        response.cookies.set("token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 86400,
          path: "/"
        });

        return response;
      }
    }

    return NextResponse.json(
      { error: "Identifiants invalides" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}