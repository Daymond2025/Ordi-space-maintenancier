/** Copié de Cordinateur_App_Web/src/lib/statuts.ts — libellés/couleurs de statut_commande, communs à tout le suivi. */
export const LIBELLES_STATUT: Record<string, string> = {
  en_attente: "En attente",
  validee: "Validée",
  en_preparation: "En attente de livraison",
  en_livraison: "Livraison en cours",
  livree: "Livrée",
  annulee: "Annulée",
  reportee: "Reportée",
  client_injoignable: "Client injoignable",
  numero_incorrect: "Numéro incorrect",
};

export const COULEUR_TEXTE_STATUT: Record<string, string> = {
  en_attente: "text-[color:var(--brand-blue-end)]",
  validee: "text-[color:var(--brand-blue-end)]",
  en_preparation: "text-[color:var(--brand-blue-end)]",
  en_livraison: "text-[color:var(--brand-blue-end)]",
  livree: "text-green-600",
  annulee: "text-rose-500",
  reportee: "text-orange-500",
  client_injoignable: "text-[color:var(--brand-blue-end)]",
  numero_incorrect: "text-[color:var(--brand-blue-end)]",
};
