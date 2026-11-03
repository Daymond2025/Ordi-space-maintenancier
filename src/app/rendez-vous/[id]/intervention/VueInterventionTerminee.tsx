"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DemandeSav, Intervention } from "@/lib/types";
import { CalendrierIcon, ChevronLeftIcon, HorlogeIcon } from "@/components/icons";
import { CarteIntervention } from "@/components/interventions/CarteIntervention";
import { Carte, CarteCoordonneesClient, CarteDateRendezVous, CarteMotif, OMBRE_CARTE, Puces, RecapDiagnostic } from "@/components/interventions/blocs";
import { DEGRADE_BLEU, DEGRADE_HEADER, MOIS_COURTS, heure, jourDeuxChiffres, libelleDuree, versDate } from "@/lib/rendezVous";

type Onglet = "intervention" | "diagnostic" | "rdv";

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: "intervention", label: "Infos intervention" },
  { id: "diagnostic", label: "Info diagnostic" },
  { id: "rdv", label: "Infos RDV" },
];

function LigneHoraire({ libelle, iso }: { libelle: string; iso: string | null }) {
  const date = iso ? versDate(iso) : null;

  return (
    <div className="flex h-[38px] items-center gap-2 rounded-[8px] border border-[#E3E6EB] pl-3 pr-1.5">
      <span className="flex-1 text-[13px] text-[#3A3A3A]">{libelle}</span>
      {date ? (
        <>
          <span className="flex h-[28px] items-center gap-1.5 rounded-[4px] bg-[#F3F4F6] px-2.5 text-[9px] text-[#111111]">
            <CalendrierIcon className="h-4 w-4" />
            {jourDeuxChiffres(date)} / {MOIS_COURTS[date.getMonth()]} / {date.getFullYear()}
          </span>
          <span className="flex h-[28px] w-[68px] items-center gap-1.5 rounded-[4px] bg-[#F3F4F6] px-2 text-[9px] text-[#111111]">
            <HorlogeIcon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-center">{heure(date)}</span>
          </span>
        </>
      ) : (
        <span className="pr-2 text-[11px] text-brand-muted">—</span>
      )}
    </div>
  );
}

/** Durée saisie à la fin, sinon écart entre le début (création au diagnostic) et la fin. */
function duree(intervention: Intervention): string {
  if (intervention.duree_reelle_minutes) return libelleDuree(intervention.duree_reelle_minutes);
  if (!intervention.date_fin) return "—";
  const minutes = Math.max(0, Math.round((versDate(intervention.date_fin).getTime() - versDate(intervention.created_at).getTime()) / 60_000));
  if (minutes < 60) return `${minutes} minutes`;
  const heures = Math.floor(minutes / 60);
  const reste = minutes % 60;
  return reste ? `${heures} h ${String(reste).padStart(2, "0")}` : `${heures} heure${heures > 1 ? "s" : ""}`;
}

/**
 * Écran d'une intervention terminée ("Maintenance / Terminée") — 3 onglets :
 * fin d'intervention, diagnostic, rendez-vous. Lecture seule.
 */
export function VueInterventionTerminee({ demande, intervention }: { demande: DemandeSav; intervention: Intervention }) {
  const router = useRouter();
  const [onglet, setOnglet] = useState<Onglet>("intervention");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-[14px] pb-[56px] pt-[13px]" style={{ background: DEGRADE_HEADER }}>
        <div className="flex items-start gap-[11px]">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/25 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="-mt-1">
            <h1 className="text-xl font-bold leading-tight text-white">Maintenance</h1>
            <span className="mt-1 inline-flex h-[19px] items-center rounded-full bg-[#E4F8EA] px-3 text-[10px] font-semibold text-[#12963F]">Terminée</span>
          </div>
        </div>

        <div className="mt-[18px]">
          <CarteIntervention demande={demande} etat="terminee" avecProblemes />
        </div>
      </div>

      <div className="relative -mt-[32px] rounded-t-[30px] bg-white px-[16px] pb-10 pt-[14px]">
        <div className="flex h-[52px] items-center rounded-full bg-[#E3EEFF] p-[6px]" role="tablist">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={onglet === o.id}
              onClick={() => setOnglet(o.id)}
              className={`h-full flex-1 rounded-full text-[12px] transition-colors ${onglet === o.id ? "font-medium text-white" : "text-[#111111]"}`}
              style={onglet === o.id ? { background: DEGRADE_BLEU, boxShadow: "0px 6px 12px rgba(0, 119, 255, 0.30)" } : undefined}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-[22px] flex flex-col gap-[22px]">
          {onglet === "intervention" ? (
            <>
              <Carte titre="Prestations réalisées" className="px-[22px] pb-6 pt-5">
                {intervention.prestations?.length ? <Puces valeurs={intervention.prestations} /> : <p className="text-[11px] text-brand-muted">Non renseignées</p>}
              </Carte>

              <Carte titre="Pièces remplacées" className="px-[22px] pb-6 pt-5">
                {intervention.pieces_remplacees?.length ? <Puces valeurs={intervention.pieces_remplacees} /> : <p className="text-[11px] text-brand-muted">Aucune pièce remplacée</p>}
              </Carte>

              <Carte titre="Date et heure de fin" className="px-[22px] pb-10 pt-6">
                <div className="flex flex-col gap-2">
                  <LigneHoraire libelle="Début" iso={intervention.created_at} />
                  <LigneHoraire libelle="Fin" iso={intervention.date_fin} />
                  <div className="flex h-[38px] items-center rounded-[8px] border border-[#E3E6EB] pl-3 pr-1.5">
                    <span className="flex-1 text-[13px] text-[#3A3A3A]">Temps d&apos;intervention</span>
                    <span className="flex h-[28px] items-center rounded-[4px] bg-[#F3F4F6] px-3.5 text-[11px] text-[#111111]">{duree(intervention)}</span>
                  </div>
                </div>
              </Carte>

              <section className="rounded-[18px] bg-white px-[20px] pb-6 pt-4" style={{ boxShadow: OMBRE_CARTE }}>
                <h2 className="text-[11px] text-[#3A3A3A]">Note</h2>
                <p className="mt-4 flex min-h-[98px] items-center justify-center whitespace-pre-line rounded-[4px] border border-[#E2E5EA] bg-[#F5F6F8] px-8 py-4 text-center text-[13px] text-[#111111]">
                  {intervention.note_fin || "Aucune note sur l'état de l'ordinateur."}
                </p>
              </section>
            </>
          ) : null}

          {onglet === "diagnostic" ? <RecapDiagnostic intervention={intervention} /> : null}

          {onglet === "rdv" ? (
            <>
              <CarteMotif demande={demande} />
              <CarteDateRendezVous demande={demande} />
              <CarteCoordonneesClient demande={demande} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
