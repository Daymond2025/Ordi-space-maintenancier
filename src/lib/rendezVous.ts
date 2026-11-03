import type { DemandeSav, RendezVous, StatutAffiche } from "@/lib/types";

/** Mêmes services que les points de maintenance côté client (App_Mobile, service/maintenance/data.ts). */
export const SERVICES = ["Reparation", "Installation de logiciel", "Conseil"];
export const SERVICES_COURTS = "Reparation • Installation • Conseil";

export const DEGRADE_HEADER = "linear-gradient(120deg, #0866FF 0%, #00B4FF 100%)";
export const DEGRADE_BLEU = "linear-gradient(135deg, #0A6CFF 0%, #00B4FF 100%)";

export const MOIS_COURTS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
export const MOIS_BADGE = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export const versDate = (iso: string) => new Date(iso.replace(" ", "T"));

export function debutJour(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function estAujourdhui(d: Date): boolean {
  return debutJour(d) === debutJour(new Date());
}

export function dernierRendezVous(demande: DemandeSav): RendezVous | null {
  return [...(demande.rendez_vous ?? [])].sort((a, b) => b.id - a.id)[0] ?? null;
}

/**
 * Le dernier rendez-vous donne le statut et la date ; sans rendez-vous,
 * c'est une "Demande" datée de sa déclaration. Une intervention annulée
 * prime sur tout ; sinon une demande résolue/clôturée est "Terminée".
 */
export function statutEtDate(demande: DemandeSav): { statut: StatutAffiche; date: Date; rdv: RendezVous | null } {
  const rdv = dernierRendezVous(demande);
  const annulee = rdv?.intervention?.statut_intervention === "annulee";
  const terminee = demande.statut_demande === "resolue" || demande.statut_demande === "cloturee";

  return {
    rdv,
    statut: annulee ? "annule" : terminee ? "termine" : (rdv?.statut_rdv ?? "demande"),
    date: versDate(rdv?.date_rdv ?? demande.date_demande),
  };
}

/** Portable par défaut ; ordinateur de bureau si la catégorie/le nom du produit l'indique. Aucun produit lié → null. */
export function illustration(demande: DemandeSav): string | null {
  const produit = demande.garantie?.ligne_commande?.produit;
  if (!produit) return null;
  const texte = `${produit.categorie?.nom_categorie ?? ""} ${produit.nom_produit}`.toLowerCase();
  return /bureau|desktop|fixe|tour|unit[ée] centrale|all[- ]?in[- ]?one|imac/.test(texte)
    ? "/images/ordi-maintenance2.png"
    : "/images/ordi-maintenance1.png";
}

/** "+2250759028545" → "+225 0759028545" (format des maquettes). */
export function telephoneCarte(brut: string): string {
  const correspondance = /^\+225(\d{10})$/.exec(brut.replace(/[^\d+]/g, ""));
  return correspondance ? `+225 ${correspondance[1]}` : brut;
}

export function heure(d: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(d);
}

export function jourDeuxChiffres(d: Date): string {
  return String(d.getDate()).padStart(2, "0");
}

const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Jeudi 10 / Janvier / 2026". */
export function dateLongue(d: Date): string {
  const jourSemaine = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(d);
  const mois = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(d);
  return `${majuscule(jourSemaine)} ${jourDeuxChiffres(d)} / ${majuscule(mois)} / ${d.getFullYear()}`;
}

/** Choix "Temps estimé d'intervention" (minutes). */
export const DUREES_INTERVENTION = [
  { minutes: 30, label: "30 minutes" },
  { minutes: 60, label: "1 heure" },
  { minutes: 120, label: "2 heures" },
  { minutes: 180, label: "3 heures" },
  { minutes: 240, label: "4 heures" },
  { minutes: 480, label: "1 journée" },
  { minutes: 960, label: "2 jours" },
  { minutes: 2400, label: "5 jours" },
];

export function libelleDuree(minutes: number): string {
  const connue = DUREES_INTERVENTION.find((d) => d.minutes === minutes);
  if (connue) return connue.label;
  return minutes < 60 ? `${minutes} minutes` : `${Math.round(minutes / 60)} heures`;
}

/** "Acheté il y a 13 jours" — à partir du début de garantie (= date de livraison). */
export function achete(dateDebut: string): string {
  const jours = Math.max(0, Math.floor((Date.now() - versDate(dateDebut).getTime()) / 86_400_000));
  if (jours === 0) return "Acheté aujourd'hui";
  if (jours === 1) return "Acheté hier";
  if (jours < 60) return `Acheté il y a ${jours} jours`;
  return `Acheté il y a ${Math.floor(jours / 30)} mois`;
}

export function nomClient(demande: DemandeSav): string {
  const client = demande.client?.user;
  return client ? `${client.nom}${client.prenom ? ` ${client.prenom}` : ""}` : "Client";
}
