"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, ApiRequestError } from "@/lib/api";

export type Utilisateur = {
  id: number;
  nom: string;
  prenom: string | null;
  email: string | null;
  type_utilisateur: string;
  roles: string[];
  permissions: string[];
};

type SessionResult = { user: Utilisateur; token: string };

type DemandeOtpResultat = { compteExistant: boolean; userId?: number; codeDebug?: string };

type AuthContextValue = {
  user: Utilisateur | null;
  token: string | null;
  pret: boolean;
  demanderOtp: (telephone: string) => Promise<DemandeOtpResultat>;
  verifierOtp: (userId: number, code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STOCKAGE_CLE = "ordispace.maintenancier.session";
const NOM_APPAREIL = "maintenancier-web";
const ROLES_AUTORISES = ["technicien_maintenance"];

const AuthContext = createContext<AuthContextValue | null>(null);

function accesRefuseSiRoleInvalide(user: Utilisateur) {
  if (!ROLES_AUTORISES.includes(user.type_utilisateur)) {
    throw new ApiRequestError(
      { code: "ACCES_REFUSE", message: "Ce compte n'a pas accès à l'espace Maintenancier." },
      403
    );
  }
}

/**
 * Auth technicien — connexion par téléphone + OTP WhatsApp UNIQUEMENT, pas
 * d'auto-inscription : le compte est créé par l'Admin (voir
 * Admin\UtilisateurController::provisionner(), roles_provisionnes_par_admin()
 * côté backend). Contrairement aux autres apps (Fournisseur/Commercial/
 * Livreur), il n'y a donc ni register(), ni inscrireParTelephone(), ni
 * fallback e-mail/mot de passe à porter ici.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pret, setPret] = useState(false);

  // Lecture localStorage nécessairement différée à after-mount (useEffect) :
  // le rendu serveur n'a pas accès à localStorage, donc le premier rendu
  // client doit rester identique à celui du serveur (session absente) pour
  // éviter une erreur d'hydratation — le flag `pret` distingue "pas encore
  // vérifié" de "vérifié, pas de session". Même pattern que les autres apps.
  useEffect(() => {
    const brut = localStorage.getItem(STOCKAGE_CLE);
    if (brut) {
      try {
        const session = JSON.parse(brut) as SessionResult;
        // Lecture unique de localStorage après montage (impossible côté
        // serveur) : aucune autre façon d'hydrater la session que ce setState direct.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(session.user);
        setToken(session.token);
      } catch {
        localStorage.removeItem(STOCKAGE_CLE);
      }
    }
    setPret(true);
  }, []);

  function memoriser(session: SessionResult) {
    setUser(session.user);
    setToken(session.token);
    localStorage.setItem(STOCKAGE_CLE, JSON.stringify(session));
  }

  /** Étape 1 — voir Api\Auth\TelephoneAuthController::demanderOtp(). compteExistant: false => aucun technicien à ce numéro, contacter l'Admin. */
  async function demanderOtp(telephone: string): Promise<DemandeOtpResultat> {
    const reponse = await apiFetch<{ compte_existant: boolean; user_id?: number; code_debug?: string }>(
      "/auth/telephone/otp",
      { method: "POST", body: { telephone, type_utilisateur: "technicien_maintenance" } }
    );

    return { compteExistant: reponse.compte_existant, userId: reponse.user_id, codeDebug: reponse.code_debug };
  }

  /** Étape 2 — code reçu par WhatsApp (AuthController::verifyOtp(), générique à tout utilisateur). */
  async function verifierOtp(userId: number, code: string) {
    const reponse = await apiFetch<SessionResult>("/auth/verify-otp", {
      method: "POST",
      body: { user_id: userId, code, device_name: NOM_APPAREIL },
    });

    accesRefuseSiRoleInvalide(reponse.user);
    memoriser(reponse);
  }

  async function logout() {
    if (token) {
      await apiFetch("/auth/logout", { method: "POST", token }).catch(() => {});
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(STOCKAGE_CLE);
  }

  return (
    <AuthContext.Provider value={{ user, token, pret, demanderOtp, verifierOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé sous <AuthProvider>.");
  return context;
}
