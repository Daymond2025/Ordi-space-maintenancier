export type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

export function formaterPrix(prix: string | number): string {
  const nombre = typeof prix === "string" ? parseFloat(prix) : prix;
  return new Intl.NumberFormat("fr-FR").format(nombre);
}

export function formaterDateHeure(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso.replace(" ", "T")));
}

/** "Aujourd'hui à 10:15" / "Hier à 09:15" / "sam 17 jan 26, à 10:15" — listes triées par activité récente. */
export function formaterDateRelative(iso: string): string {
  const date = new Date(iso.replace(" ", "T"));
  const heure = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);

  const debutJour = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffJours = Math.round((debutJour(new Date()) - debutJour(date)) / 86_400_000);

  if (diffJours === 0) return `Aujourd'hui à ${heure}`;
  if (diffJours === 1) return `Hier à ${heure}`;

  const jour = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "2-digit" }).format(date);
  return `${jour}, à ${heure}`;
}

/** "8 Mois" / "2 Ans" — écran "Mes infos", à partir de User.created_at. */
export function formaterAnciennete(createdAtIso: string): string {
  const debut = new Date(createdAtIso.replace(" ", "T"));
  const mois = Math.max(
    0,
    (Date.now() - debut.getTime()) / (30.44 * 86_400_000) // 30.44 j/mois en moyenne — assez précis pour cet affichage
  );
  const moisEntiers = Math.floor(mois);

  if (moisEntiers < 12) return `${moisEntiers} Mois`;
  const ans = Math.floor(moisEntiers / 12);
  return `${ans} An${ans > 1 ? "s" : ""}`;
}

/** "+2250711623197" → "+225 07 11 62 31 97" ; tout autre format est laissé tel quel. */
export function formaterTelephone(brut: string): string {
  const chiffres = brut.replace(/[^\d+]/g, "");
  const correspondance = /^\+225(\d{10})$/.exec(chiffres);
  if (!correspondance) return brut;
  return `+225 ${correspondance[1].replace(/(\d{2})(?=\d)/g, "$1 ")}`;
}

// --- SAV / interventions (app Maintenancier) -----------------------------

export type StatutDemandeSav = "en_attente" | "planifiee" | "en_cours" | "resolue" | "cloturee";
export type StatutIntervention = "planifiee" | "en_cours" | "terminee" | "annulee";
/** rendez_vous.statut_rdv — badges de l'accueil (Demande / Confirmé / Reporter / Refusé / Terminée). */
export type StatutRdv = "demande" | "confirme" | "reporte" | "refuse" | "termine";
/** Statut affiché : celui du rendez-vous, plus "annule" (dérivé d'une intervention annulée, pas stocké sur le rendez-vous). */
export type StatutAffiche = StatutRdv | "annule";
export type NiveauGravite = "faible" | "moyenne" | "critique";

export type ClientResume = {
  user_id: number;
  user: { id: number; nom: string; prenom: string | null; telephone: string | null; photo: string | null };
  /** Chargé uniquement par GET /sav/demandes/{id} (écran détail du rendez-vous). */
  adresses?: { id: number; rue: string | null; ville: string | null; localite: { id: number; nom: string } | null }[];
};

export type ProduitResume = {
  id: number;
  nom_produit: string;
  images?: { url_image: string }[];
  categorie?: { id: number; nom_categorie: string } | null;
};

export type GarantieAvecProduit = {
  id: number;
  date_debut: string;
  date_fin: string;
  type_garantie: string;
  ligne_commande?: { produit?: ProduitResume | null } | null;
};

export type TechnicienResume = {
  user_id: number;
  specialite: string | null;
  user: { id: number; nom: string; prenom: string | null; telephone: string | null };
};

export type Intervention = {
  id: number;
  rendez_vous_id: number;
  technicien_id: number;
  diagnostic: string | null;
  /** Problèmes cochés dans la liste de l'écran "Diagnostic technique". */
  problemes: string[] | null;
  /** Précision libre ("Ou décrivez le problème ici"). */
  probleme_identifie: string | null;
  cause_panne: string | null;
  niveau_gravite: NiveauGravite | null;
  duree_estimee_minutes: number | null;
  reparation_effectuee: string | null;
  /** Écran "Marquer terminé". */
  prestations: string[] | null;
  pieces_remplacees: string[] | null;
  date_fin: string | null;
  duree_reelle_minutes: number | null;
  note_fin: string | null;
  statut_intervention: StatutIntervention;
  cout: string | number | null;
  /** Mis à jour à chaque enregistrement — le début réel de l'intervention est `created_at` (création au diagnostic). */
  date_intervention: string | null;
  created_at: string;
};

export type RendezVous = {
  id: number;
  demande_sav_id: number;
  technicien_id: number | null;
  date_rdv: string;
  lieu: string | null;
  statut_rdv: StatutRdv;
  technicien?: TechnicienResume | null;
  demande_sav?: DemandeSav;
  intervention: Intervention | null;
};

/** Forme renvoyée par GET /sav/demandes (DemandeSavController) — demande de panne d'un client. */
export type DemandeSav = {
  id: number;
  client_id: number;
  garantie_id: number | null;
  description_probleme: string;
  statut_demande: StatutDemandeSav;
  date_demande: string;
  client: ClientResume;
  garantie: GarantieAvecProduit | null;
  rendez_vous: RendezVous[];
};

/** Sous-ensemble utile de MoiController::profil() pour le rôle Technicien. */
export type ProfilTechnicien = {
  nom: string;
  prenom: string | null;
  telephone: string | null;
  email: string | null;
  photo: string | null;
  specialite: string | null;
  /** Bascule "En ligne" de l'accueil — voir PATCH /moi/disponibilite. */
  disponible: boolean;
  /** Présent uniquement si une mission livreur lui a déjà été liée — null en pratique pour un technicien. */
  coordinateur?: CoordinateurLivreur | null;
  created_at: string;
};

/** Fiche d'un coordinateur (Coordinateur::fichePourLivreur()) — réutilisée telle quelle, voir CarteCoordinateur. */
export type CoordinateurLivreur = {
  nom: string;
  photo: string | null;
  telephone: string | null;
  whatsapp_url: string | null;
  adresse: string | null;
  horaires: string | null;
  zone_couverte: string | null;
};

/** Support Ordi'Space, numéro fixé par l'Admin (GET /support). `telephone` est null tant qu'il n'est pas réglé. */
export type SupportOrdiSpace = {
  nom: string;
  telephone: string | null;
  whatsapp_url: string | null;
};

/** Forme renvoyée par GET /moi/notifications (NotificationOrdispace). */
export type NotificationUtilisateur = {
  id: number;
  type_notification: string;
  titre: string | null;
  contenu: string;
  lu: boolean;
  date_envoi: string;
};

// --- Boutique d'affiliation (identique à l'app Livreur, BoutiqueController élargi) --

/** Fiche d'un fournisseur pour le vendeur boutique (Fournisseur::fichePourLivreur()) — jamais de données financières. */
export type FournisseurLivreur = {
  user_id: number;
  nom_entreprise: string | null;
  nom_gerant: string | null;
  telephone: string | null;
  whatsapp_url: string | null;
  contact_pro: string | null;
  adresse: string | null;
  horaires: string | null;
  zone_couverte: string | null;
  lien_maps: string | null;
  photo: string | null;
};
