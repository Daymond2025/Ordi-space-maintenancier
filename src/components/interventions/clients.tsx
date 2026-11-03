import Image from "next/image";
import Link from "next/link";
import type { DemandeSav } from "@/lib/types";
import { UserIcon } from "@/components/icons";
import { etatIntervention, type EtatIntervention } from "@/components/interventions/CarteIntervention";
import { achete, illustration, nomClient, versDate } from "@/lib/rendezVous";

/** Un client du technicien pour un appareil donné (une garantie) — "Mes clients" / "Profil clients". */
export type FicheClient = {
  cle: string;
  /** Demande la plus récente : client et appareil affichés. */
  reference: DemandeSav;
  interventions: { demande: DemandeSav; etat: EtatIntervention }[];
};

export function cleClient(demande: DemandeSav): string {
  return `${demande.client_id}-${demande.garantie_id ?? 0}`;
}

/**
 * Clients avec au moins une intervention (rendez-vous accepté) — une fiche
 * par client et par appareil, la plus récemment active en premier.
 */
export function fichesClients(demandes: DemandeSav[]): FicheClient[] {
  const fiches = new Map<string, FicheClient>();

  [...demandes]
    .sort((a, b) => (b.date_demande ?? "").localeCompare(a.date_demande ?? ""))
    .forEach((demande) => {
      const etat = etatIntervention(demande);
      if (!etat) return;
      const cle = cleClient(demande);
      const fiche = fiches.get(cle) ?? { cle, reference: demande, interventions: [] };
      fiche.interventions.push({ demande, etat });
      fiches.set(cle, fiche);
    });

  return [...fiches.values()];
}

function garantieExpiree(dateFin: string): boolean {
  return versDate(dateFin).getTime() < Date.now();
}

function BouclierPlein(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M12 2.5 4.5 5.3v6.3c0 5 3.4 8.6 7.5 9.9 4.1-1.3 7.5-4.9 7.5-9.9V5.3Z" />
      <path d="m8.8 12 2.2 2.2 4.3-4.5" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Carte client + appareil (achat, garantie) — en tête de "Profil clients", et ligne de la liste "Mes clients". */
export function CarteAppareilClient({ demande, href }: { demande: DemandeSav; href?: string }) {
  const client = demande.client?.user;
  const image = illustration(demande);
  const garantie = demande.garantie;

  const contenu = (
    <>
      <span className="flex h-[70px] w-[76px] shrink-0 items-center justify-center rounded-[10px] bg-[#EEF1F6]">
        {image ? <Image src={image} alt="" width={62} height={62} className="h-[52px] w-[60px] object-contain" /> : null}
      </span>

      <div className="min-w-0 flex-1">
        <span className="inline-flex h-6 max-w-full items-center gap-1.5 rounded-[6px] bg-[#F1F2F4] px-1.5">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2B2B2B] text-white">
            {client?.photo ? <Image src={client.photo} alt="" width={16} height={16} className="h-full w-full object-cover" /> : <UserIcon className="h-2.5 w-2.5" />}
          </span>
          <span className="truncate text-[11px] font-bold uppercase text-[#111111]">{nomClient(demande)}</span>
        </span>

        <p className="mt-1.5 truncate text-[11px] font-bold text-[#111111]">{garantie?.ligne_commande?.produit?.nom_produit ?? "Appareil non précisé"}</p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="truncate text-[10px] text-[#555555]">{garantie ? achete(garantie.date_debut) : "Achat non lié"}</p>
          {garantie ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#F3F4F6] px-2 py-1 text-[10px] text-[#2B2B2B]">
              <BouclierPlein className="h-3.5 w-3.5 text-[#111827]" />
              {garantieExpiree(garantie.date_fin) ? "Garantie expirée" : "Sous garantie"}
            </span>
          ) : null}
        </div>
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

/** Lien d'une carte d'intervention : en attente sans diagnostic → détail du rendez-vous, sinon suivi de l'intervention. */
export function lienIntervention(demande: DemandeSav, etat: EtatIntervention): string {
  const sansDiagnostic = !demande.rendez_vous?.some((rdv) => rdv.intervention);
  return etat === "en_attente" && sansDiagnostic ? `/rendez-vous/${demande.id}` : `/rendez-vous/${demande.id}/intervention`;
}
