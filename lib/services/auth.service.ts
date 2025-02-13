import { User } from "@/types/user";

// Mock des utilisateurs invités pour le développement
const mockInvitedUsers = [
  {
    email: "invited@example.com",
    name: "Invited User",
    isAdmin: false,
    siteIds: ["1"]
  },
  {
    email: "invited2@example.com",
    name: "Invited User 2",
    isAdmin: true,
    siteIds: ["2"]
  }
];

// Mock de l'utilisateur connecté pour le développement
const mockUser = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  isSuperAdmin: true,
  isAdmin: true,
  siteIds: ["1", "2", "3"],
  createdAt: new Date().toISOString(),
  theme: "light"
};

export const AuthService = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // En développement, vérifier les identifiants statiques
    if (email === "admin@example.com" && password === "password123") {
      return { success: true, user: mockUser };
    }

    return { success: false, error: "Identifiants invalides" };
  },
  
  checkInvitedUser: async (email: string): Promise<{ exists: boolean; error?: string }> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    const invitedUser = mockInvitedUsers.find(user => user.email === email);
    return { exists: !!invitedUser };
  },

  setFirstPassword: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    const invitedUser = mockInvitedUsers.find(user => user.email === email);
    if (!invitedUser) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    // Simuler la création du mot de passe
    return { success: true };
  },
  
  getCurrentUser: () => mockUser,
  
  logout: async () => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    window.location.href = "/login";
  },
  
  hasAccessToSite: (user: User, siteId: string): boolean => {
    if (user.isSuperAdmin) return true;
    return user.siteIds.includes(siteId);
  }
};