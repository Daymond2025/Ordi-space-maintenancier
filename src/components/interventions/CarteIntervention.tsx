import Image from "next/image";
import Link from "next/link";
import type { DemandeSav } from "@/lib/types";
import { CheckIcon, CloseIcon, HorlogeIcon, OutilsIcon, UserIcon } from "@/components/icons";
import { DEGRADE_BLEU, SERVICES_COURTS, illustration, nomClient, statutEtDate } from "@/lib/rendezVous";

export type EtatIntervention = "en_cours" | "en_attente" | "terminee" | "annulee";

export const ETATS_INTERVENTION: Record<
  EtatIntervention,
  { label: string; pastille: React.CSSProperties; classe: string; rond: React.CSSProperties; Icone: typeof OutilsIcon }
> = {
  en_cours: { label: "En cours", pastille: { background: DEGRADE_BLEU }, classe: "text-white", rond: { background: DEGRADE_BLEU }, Icone: OutilsIcon },
  terminee: {
    label: "Terminée",
    pastille: { background: "#E4F8EA" },
    classe: "text-[#12963F]",
    rond: { background: "linear-gradient(135deg, #0B8F3A 0%, #35C55B 100%)" },
    Icone: CheckIcon,
  },
  en_attente: {
    label: "En attente",
    pastille: { background: "#FFEBD3" },
    classe: "text-[#F59300]",
    rond: { background: "linear-gradient(135deg, #FFB547 0%, #FF8A00 100%)" },
    Icone: HorlogeIcon,
  },
  annulee: {
    label: "Annulée",
    pastille: { background: "#FFE4E9" },
    classe: "text-[#D3102F]",
    rond: { background: "linear-gradient(135deg, #A3102E 0%, #FF2A4F 100%)" },
    Icone: CloseIcon,
  },
};

/**
 * Une intervention = un rendez-vous accepté par le technicien : en attente
 * tant que le diagnostic n'est pas commencé (ou après "Mise en attente"),
 * en cours ensuite, terminée une fois la demande résolue, ou annulée. Les
 * demandes pas encore acceptées (ou refusées) restent sur l'accueil.
 */
export function etatIntervention(demande: DemandeSav): EtatIntervention | null {
  const { statut } = statutEtDate(demande);
  if (statut === "annule") return "annulee";
  if (statut === "termine") return "terminee";
  if (demande.statut_demande === "en_cours") return "en_cours";
  return statut === "confirme" || statut === "reporte" ? "en_attente" : null;
}

/** Problèmes cochés au diagnostic (puces des cartes "En cours"). */
export function problemesIdentifies(demande: DemandeSav): string[] {
  return statutEtDate(demande).rdv?.intervention?.problemes ?? [];
}

/** Carte de l'onglet "Intervention" — réutilisée telle quelle en en-tête de l'écran intervention en cours. */
export function CarteIntervention({
  demande,
  etat,
  href,
  avecProblemes = etat === "en_cours",
}: {
  demande: DemandeSav;
  etat: EtatIntervention;
  href?: string;
  /** Puces des problèmes à la place des services — par défaut seulement "En cours" (liste), forcé sur l'écran d'une intervention terminée. */
  avecProblemes?: boolean;
}) {
  const client = demande.client?.user;
  const image = illustration(demande);
  const style = ETATS_INTERVENTION[etat];
  const listeProblemes = avecProblemes ? problemesIdentifies(demande).slice(0, 3) : [];
  const enListe = Boolean(href);

  const contenu = (
    <>
      <span className="relative flex h-[70px] w-[76px] shrink-0 items-center justify-center rounded-[10px] bg-[#EEF1F6]">
        {image ? <Image src={image} alt="" width={62} height={62} className="h-[52px] w-[56px] -translate-x-1 -translate-y-1 object-contain" /> : null}
        <span className="absolute -bottom-1.5 -right-1.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-white text-white" style={style.rond}>
          <style.Icone className="h-[18px] w-[18px]" />
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-6 min-w-0 items-center gap-1.5 rounded-[6px] bg-[#F1F2F4] px-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2B2B2B] text-white">
              {client?.photo ? <Image src={client.photo} alt="" width={16} height={16} className="h-full w-full object-cover" /> : <UserIcon className="h-2.5 w-2.5" />}
            </span>
            <span className="truncate text-[11px] font-bold uppercase text-[#111111]">{nomClient(demande)}</span>
          </span>
          {enListe ? (
            <span className={`flex h-6 w-[86px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${style.classe}`} style={style.pastille}>
              {style.label}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 truncate text-[11px] font-bold text-[#111111]">{demande.garantie?.ligne_commande?.produit?.nom_produit ?? "Appareil non précisé"}</p>

        {listeProblemes.length > 0 ? (
          <div className="mt-2 flex gap-1.5 overflow-hidden">
            {listeProblemes.map((p) => (
              <span key={p} title={p} className="min-w-0 max-w-[110px] truncate rounded-full border border-[#DCDFE4] bg-white px-2 py-0.5 text-[7px] text-[#2B2B2B]">
                {p}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 truncate text-[9px] text-[#2B2B2B]">{SERVICES_COURTS}</p>
        )}
      </div>
    </>
  );

  const classe = "flex items-center gap-3 rounded-[16px] bg-white p-[10px]";
  const ombre = { boxShadow: "0px 10px 24px rgba(0, 119, 255, 0.10)" };

  return href ? (
    <Link href={href} className={classe} style={ombre}>
      {contenu}
    </Link>
  ) : (
    <div className={classe} style={ombre}>
      {contenu}
    </div>
  );
}
