"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { DemandeSav, Pagination } from "@/lib/types";
import { ChevronLeftIcon } from "@/components/icons";
import { CarteIntervention, etatIntervention, type EtatIntervention } from "@/components/interventions/CarteIntervention";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import { lienIntervention } from "@/components/interventions/clients";
import { DEGRADE_HEADER } from "@/lib/rendezVous";

type Onglet = "tout" | Exclude<EtatIntervention, "annulee">;

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: "tout", label: "Tout" },
  { id: "en_cours", label: "En cours" },
  { id: "en_attente", label: "En attente" },
  { id: "terminee", label: "Terminée" },
];

/** Ordre d'affichage : en cours, puis en attente, puis terminées, puis annulées. */
const PRIORITE: Record<EtatIntervention, number> = { en_cours: 0, en_attente: 1, terminee: 2, annulee: 3 };

/**
 * Onglet "Intervention" — rendez-vous acceptés par le technicien, du
 * diagnostic à la fin de la réparation (GET /sav/demandes, déjà scopée).
 */
export function EcranInterventions() {
  const { token } = useAuth();
  const router = useRouter();
  const [demandes, setDemandes] = useState<DemandeSav[] | null>(null);
  const [onglet, setOnglet] = useState<Onglet>("tout");

  const charger = useCallback(() => {
    if (!token) return;
    apiFetch<Pagination<DemandeSav>>("/sav/demandes?per_page=100", { token })
      .then((page) => setDemandes(page.data))
      .catch(() => setDemandes((d) => d ?? []));
  }, [token]);

  useEffect(charger, [charger]);
  useRefetchOnFocus(charger);

  const interventions = useMemo(() => {
    if (!demandes) return null;
    return demandes
      .map((demande) => ({ demande, etat: etatIntervention(demande) }))
      .filter((i): i is { demande: DemandeSav; etat: EtatIntervention } => i.etat !== null)
      .sort((a, b) => PRIORITE[a.etat] - PRIORITE[b.etat] || (b.demande.date_demande ?? "").localeCompare(a.demande.date_demande ?? ""));
  }, [demandes]);

  const filtrees = interventions?.filter((i) => onglet === "tout" || i.etat === onglet) ?? null;
  const terminees = interventions?.filter((i) => i.etat === "terminee").length;
  const enCours = interventions?.filter((i) => i.etat === "en_cours").length;

  return (
    <div className="flex min-h-full flex-col bg-[#F2F5FA]">
      <div className="flex items-center gap-[14px] px-[7px] pb-[16px] pt-[16px]" style={{ background: DEGRADE_HEADER }}>
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Retour"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/25 text-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[15px] font-bold leading-tight text-white">Intervention</h1>
          <p className="mt-0.5 text-[9px] text-white">
            {terminees ?? "—"} Terminée{terminees === 1 ? "" : "s"} <span className="mx-0.5">•</span> {enCours ?? "—"} En cours
          </p>
        </div>
      </div>

      <div className="flex gap-[14px] bg-white px-[17px] py-[10px]" style={{ boxShadow: "0px 4px 10px rgba(16, 24, 40, 0.06)" }}>
        {ONGLETS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOnglet(o.id)}
            className={`h-[25px] flex-1 rounded-full text-[11px] transition-colors ${onglet === o.id ? "font-medium text-white" : "bg-[#EFEFEF] text-[#3A3A3A]"}`}
            style={onglet === o.id ? { background: "#0A6CFF", boxShadow: "0 0 0 2px #A9CCFF" } : undefined}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-[20px] px-[17px] pb-6 pt-[22px]">
        {filtrees === null ? (
          <p className="py-10 text-center text-sm text-brand-muted">Chargement…</p>
        ) : filtrees.length === 0 ? (
          <p className="py-10 text-center text-sm text-brand-muted">Aucune intervention dans cette catégorie.</p>
        ) : (
          filtrees.map(({ demande, etat }) => (
            <CarteIntervention
              key={demande.id}
              demande={demande}
              etat={etat}
              href={lienIntervention(demande, etat)}
            />
          ))
        )}
      </div>
    </div>
  );
}
