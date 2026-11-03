"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { DemandeSav, StatutIntervention } from "@/lib/types";
import { ChevronLeftIcon } from "@/components/icons";
import { CarteIntervention, ETATS_INTERVENTION, etatIntervention } from "@/components/interventions/CarteIntervention";
import { RecapDiagnostic } from "@/components/interventions/blocs";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import { DEGRADE_BLEU, DEGRADE_HEADER, statutEtDate } from "@/lib/rendezVous";
import { VueInterventionTerminee } from "./VueInterventionTerminee";

const DEGRADE_VERT = "linear-gradient(90deg, #068A2D 0%, #2FE65B 100%)";

/**
 * Intervention (clic sur une carte de l'onglet "Intervention") : en cours →
 * récapitulatif du diagnostic + Terminer / Annuler / Mettre en attente
 * (POST /sav/rendez-vous/{id}/intervention) ; terminée → VueInterventionTerminee.
 */
export function EcranSuiviIntervention({ demandeSavId }: { demandeSavId: number }) {
  const { token } = useAuth();
  const router = useRouter();
  const [demande, setDemande] = useState<DemandeSav | null>(null);
  const [erreurChargement, setErreurChargement] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(() => {
    if (!token) return;
    apiFetch<DemandeSav>(`/sav/demandes/${demandeSavId}`, { token })
      .then((d) => {
        setDemande(d);
        setErreurChargement(false);
      })
      .catch(() => setErreurChargement(true));
  }, [token, demandeSavId]);

  useEffect(charger, [charger]);
  useRefetchOnFocus(charger);

  async function changerStatut(statut: StatutIntervention) {
    const rdv = demande ? statutEtDate(demande).rdv : null;
    if (!token || !rdv || chargement) return;
    setErreur(null);
    setChargement(true);
    try {
      await apiFetch(`/sav/rendez-vous/${rdv.id}/intervention`, { method: "POST", token, body: { statut_intervention: statut } });
      charger();
    } catch (e) {
      setErreur(e instanceof ApiRequestError ? e.message : "Action impossible. Vérifie ta connexion internet.");
    } finally {
      setChargement(false);
    }
  }

  if (erreurChargement) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-rose-600">Impossible de charger cette intervention.</p>
        <button type="button" onClick={charger} className="rounded-full border border-brand-line px-4 py-2 text-xs font-semibold text-brand-ink">
          Réessayer
        </button>
      </div>
    );
  }

  if (!demande) {
    return <p className="flex flex-1 items-center justify-center text-sm text-brand-muted">Chargement…</p>;
  }

  const etat = etatIntervention(demande) ?? "en_attente";
  const intervention = statutEtDate(demande).rdv?.intervention ?? null;

  if (etat === "terminee" && intervention) {
    return <VueInterventionTerminee demande={demande} intervention={intervention} />;
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="px-[7px] pb-[58px] pt-[16px]" style={{ background: DEGRADE_HEADER }}>
          <div className="flex items-start gap-[14px]">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Retour"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/25 text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[15px] font-bold leading-tight text-white">Intervention</h1>
              <p className="mt-1 text-[10px] text-white">{ETATS_INTERVENTION[etat].label}</p>
            </div>
          </div>

          <div className="mx-[10px] mt-[24px]">
            <CarteIntervention demande={demande} etat={etat} />
          </div>
        </div>

        <div className="relative -mt-[34px] rounded-t-[30px] bg-white px-[17px] pb-8 pt-[10px]">
          <span className="mx-auto block h-[5px] w-[58px] rounded-full bg-[#D9D9D9]" />
          <h2 className="mt-[14px] text-center text-[13px] font-bold text-[#111111]">Diagnostic Technique</h2>

          {intervention ? (
            <div className="mt-[10px] flex flex-col gap-[16px]">
              <RecapDiagnostic intervention={intervention} />
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-brand-muted">Le diagnostic n&apos;a pas encore été commencé.</p>
          )}
        </div>
      </div>

      {etat === "en_cours" || etat === "en_attente" ? (
        <div className="shrink-0 rounded-t-[30px] bg-white px-[28px] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[24px]" style={{ boxShadow: "0px -6px 20px rgba(16, 24, 40, 0.06)" }}>
          {erreur ? <p className="mb-2 text-center text-xs text-rose-500">{erreur}</p> : null}

          {etat === "en_cours" ? (
            <>
              <Link
                href={`/rendez-vous/${demande.id}/terminer`}
                className="flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-semibold text-white"
                style={{ background: DEGRADE_VERT, boxShadow: "0px 6px 14px rgba(6, 138, 45, 0.25)" }}
              >
                Intervention Terminée
              </Link>
              <div className="mt-[18px] flex gap-[30px]">
                <button
                  type="button"
                  disabled={chargement}
                  onClick={() => {
                    if (confirm("Annuler cette intervention ? La demande sera clôturée.")) changerStatut("annulee");
                  }}
                  className="h-12 flex-1 rounded-[10px] border-[1.5px] border-[#E0102F] text-[15px] font-semibold text-[#E0102F] disabled:opacity-60"
                  style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFE6EB 100%)" }}
                >
                  Annulée
                </button>
                <button
                  type="button"
                  disabled={chargement}
                  onClick={() => changerStatut("planifiee")}
                  className="h-12 flex-1 rounded-[10px] border-[1.5px] border-[#F5A300] text-[15px] font-semibold text-[#F5A300] disabled:opacity-60"
                  style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFF2D9 100%)" }}
                >
                  Mise en attente
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              disabled={chargement || !intervention}
              onClick={() => changerStatut("en_cours")}
              className="flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-semibold text-white disabled:opacity-60"
              style={{ background: DEGRADE_BLEU, boxShadow: "0px 6px 14px rgba(0, 119, 255, 0.25)" }}
            >
              Reprendre l&apos;intervention
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}
