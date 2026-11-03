import type { CoordinateurLivreur, Pagination } from "@/lib/types";

/**
 * "Centre des ventes" — forme de GET /boutique/ventes
 * (BoutiqueController::ventes()). Le statut affiché découle du statut de la
 * commande côté backend (VenteBoutique::statutAffiche()) : un seul état de
 * référence, jamais recalculé ici.
 */
export type StatutVente = "en_cours" | "en_attente" | "livree" | "annulee";

/** Canal d'arrivée : commande saisie à la main, lien WhatsApp partagé, scan du QR de l'affiche. */
export type SourceVente = "manuelle" | "whatsapp" | "qr";

export type VenteBoutique = {
  id: number;
  commande_id: number;
  nom_produit: string | null;
  image: string | null;
  specs: string[];
  client: string;
  date: string;
  prix_vente: number;
  commission: number;
  source: SourceVente;
  statut: StatutVente;
};

/** Compteurs de l'en-tête et des filtres — calculés sur toutes les ventes, jamais sur la liste filtrée. */
export type StatsVentes = {
  commandes: number;
  produits: number;
  par_statut: Record<StatutVente, number>;
};

export type ReponseVentes = {
  stats: StatsVentes;
  ventes: Pagination<VenteBoutique>;
};

export const LIBELLE_STATUT_VENTE: Record<StatutVente, string> = {
  en_cours: "En cours",
  en_attente: "En attente",
  livree: "Livrée",
  annulee: "Annulée",
};

export const LIBELLE_SOURCE_VENTE: Record<SourceVente, string> = {
  manuelle: "Commande manuel",
  whatsapp: "Lien WhatsApp",
  qr: "Scan QR",
};

/** "Jeudi 17 janv. 2026" — jour de la semaine en toutes lettres, première lettre en majuscule. */
export function formaterDateVente(iso: string): string {
  const texte = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Un lien de vente partagé par le livreur — forme de GET /boutique/liens (BoutiqueController::liens()). */
export type LienVente = {
  id: number;
  code: string;
  url: string;
  produit_id: number;
  nom_produit: string;
  image: string | null;
  /** Le produit est toujours vendable : le lien peut encore aboutir à un achat. */
  actif: boolean;
  vues: number;
  commandes: number;
  par_statut: Record<StatutVente, number>;
  derniere_activite: string;
};

/** "à l'instant", "il y a 12 min", "il y a 2h", "il y a 3 j", puis la date complète au-delà d'un mois. */
export function depuisIl(iso: string, maintenant: number = Date.now()): string {
  const minutes = Math.floor((maintenant - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `il y a ${heures}h`;
  const jours = Math.floor(heures / 24);
  if (jours < 30) return `il y a ${jours} j`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

/** Page d'un lien de vente — forme de GET /boutique/liens/{id} (BoutiqueController::lien()). */
export type ReponseLien = {
  lien: LienVente;
  /** Commissions des commandes validées (en cours ou livrées) passées par ce lien. */
  gain_total: number;
  ventes: Pagination<VenteBoutique>;
};

/** "234.000" — le mockup écrit les montants des en-têtes avec des points plutôt que des espaces. */
export function formaterMontantPoints(montant: number): string {
  return new Intl.NumberFormat("fr-FR").format(montant).replace(/\s/g, ".");
}

/** Onglet "Profil" de la Boutique — forme de GET /boutique/profil (BoutiqueController::profil()). */
export type ProfilBoutique = {
  livreur: { nom: string; prenom: string | null; telephone: string; photo: string | null };
  stats: {
    produits_vendus: number;
    commandes_livrees: number;
    commandes_annulees: number;
    commission_totale: number;
  };
  /** Coordinateur qui gère ses missions — null tant qu'il n'en a aucune. */
  coordinateur: CoordinateurLivreur | null;
  lien: {
    url: string;
    commission_min: number | null;
    commission_max: number | null;
    clics: number;
    livrees: number;
  };
  affiche: { url_qr: string; scans: number; livrees: number };
};
