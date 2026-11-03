/**
 * Portefeuille de commissions (Boutique) — formes de GET /boutique/portefeuille,
 * /boutique/portefeuille/commissions et /boutique/retraits
 * (PortefeuilleController). Les soldes sont recalculés côté backend depuis les
 * ventes et les demandes de retrait (services/PortefeuilleCommissions).
 */
export type ResumePortefeuille = {
  /** Commission retirable maintenant : gain total − retraits en attente ou payés. */
  disponible: number;
  /** Commissions des commandes validées par l'Admin/Coordinateur et non annulées. */
  gain_total: number;
  /** Commissions des ventes dont la commande n'est pas encore validée. */
  en_attente_validation: number;
  retrait_en_cours: number;
  retire: number;
  retrait_minimum: number;
};

export type StatutCommission = "acquise" | "en_attente" | "annulee";

export type CommissionPortefeuille = {
  id: number;
  nom_produit: string | null;
  client: string;
  date: string;
  montant: number;
  statut: StatutCommission;
};

export type StatutRetrait = "en_attente" | "valide" | "refuse" | "annule";

export type RetraitCommission = {
  id: number;
  montant: number;
  operateur: OperateurRetrait;
  telephone: string;
  statut: StatutRetrait;
  /** Référence du transfert, posée par l'Admin à la validation. */
  reference: string | null;
  /** Motif du refus. */
  remarque: string | null;
  created_at: string;
  traite_le: string | null;
};

/** Opérateurs acceptés par la demande de retrait (OPERATEURS_RETRAIT côté backend). */
export const OPERATEURS_RETRAIT = ["Orange", "Wave", "Mtn", "Moov"] as const;
export type OperateurRetrait = (typeof OPERATEURS_RETRAIT)[number];

/**
 * Logos des opérateurs (public/images). Wave est fourni en .jfif, format que
 * les navigateurs servent mal : logo-wave.jpg en est la copie convertie.
 */
export const LOGO_OPERATEUR: Record<OperateurRetrait, string> = {
  Orange: "/images/logo-oange.png",
  Wave: "/images/logo-wave.jpg",
  Mtn: "/images/mtn-mobile-money-logo.jpg",
  Moov: "/images/logo-moov.jpg",
};

/** Nom affiché d'un opérateur ("Mtn" est stocké ainsi côté backend, mais s'écrit MTN). */
export const NOM_OPERATEUR: Record<OperateurRetrait, string> = { Orange: "Orange", Wave: "Wave", Mtn: "MTN", Moov: "Moov" };

export const LIBELLE_STATUT_RETRAIT: Record<StatutRetrait, string> = {
  en_attente: "En attente",
  valide: "Validé",
  refuse: "Refusé",
  annule: "Annulé",
};

export const LIBELLE_STATUT_COMMISSION: Record<StatutCommission, string> = {
  acquise: "Acquise",
  en_attente: "En attente de validation",
  annulee: "Annulée",
};

/** Montants proposés en un tap dans la feuille de retrait. */
export const MONTANTS_SUGGERES = [1000, 5000, 10000, 25000, 50000] as const;
