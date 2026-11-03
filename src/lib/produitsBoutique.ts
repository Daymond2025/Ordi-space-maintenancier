/**
 * "Boutique" — types alignés sur la vraie forme de GET /produits (public,
 * voir ProduitController::index()/show()) et non plus des données
 * d'illustration : seuls les produits avec un `commission_apporteur`
 * renseigné sont proposés à la revente par le livreur. Le livreur a rejoint
 * le maintenancier comme "apporteur d'affaire" (retour du PDG) : plus de
 * commission de revente qui lui soit propre, c'est la même commission_apporteur
 * que tout autre apporteur — voir VenteBoutique::enregistrer() côté backend.
 */
export type ImageProduit = {
  id: number;
  url_image: string;
  ordre_affichage: number;
};

export type EtatProduit = "neuf" | "quasi_neuf" | "occasion" | "reconditionne";

export const LIBELLE_ETAT_PRODUIT: Record<EtatProduit, string> = {
  neuf: "Neuf",
  quasi_neuf: "Quasi neuf",
  occasion: "Occasion",
  reconditionne: "Reconditionné",
};

export type FraisLivraisonProduit = {
  id: number;
  montant: string;
  localite: { id: number; nom: string } | null;
};

export type ProduitBoutique = {
  id: number;
  nom_produit: string;
  description: string | null;
  prix_vente: string | null;
  prix_barre: string | null;
  pourcentage_reduction: number | null;
  commission_apporteur: string | null;
  etat_produit: EtatProduit | null;
  quantite_stock: number;
  duree_garantie_mois: number | null;
  processeur: string | null;
  memoire_ram: string | null;
  stockage: string | null;
  taille: string | null;
  systeme_exploitation: string | null;
  carte_graphique: string | null;
  couleur: string | null;
  cadeaux: string[] | null;
  categorie: { id: number; nom_categorie: string } | null;
  images: ImageProduit[];
  frais_livraison: FraisLivraisonProduit[];
};

/** Résumé compact des specs principales — "Core i5 • 8 Go DDR4 • 256 Go SSD". */
export function resumerSpecs(produit: ProduitBoutique): string[] {
  return [produit.processeur, produit.memoire_ram, produit.stockage].filter((v): v is string => Boolean(v));
}

/** Regroupement des catégories réelles sous les 3 onglets de l'écran "Boutique". */
export function categorieBoutique(nomCategorie: string | undefined): "ordinateurs" | "accessoires" | "logiciels" | "autre" {
  if (!nomCategorie) return "autre";
  if (["Ordinateurs portables", "Ordinateur bureau"].includes(nomCategorie)) return "ordinateurs";
  if (["Accessoires", "Souris", "Sacs pc", "Chargeur"].includes(nomCategorie)) return "accessoires";
  if (nomCategorie === "Logiciels") return "logiciels";
  return "autre";
}
