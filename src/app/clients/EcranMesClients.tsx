"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { DemandeSav, Pagination } from "@/lib/types";
import { ChevronLeftIcon } from "@/components/icons";
import { CarteAppareilClient, fichesClients } from "@/components/interventions/clients";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import { DEGRADE_HEADER } from "@/lib/rendezVous";

/** "Mes clients" (menu Compte) — clients et appareils pris en charge par le technicien. */
export function EcranMesClients() {
  const { token } = useAuth();
  const router = useRouter();
  const [demandes, setDemandes] = useState<DemandeSav[] | null>(null);

  const charger = useCallback(() => {
    if (!token) return;
    apiFetch<Pagination<DemandeSav>>("/sav/demandes?per_page=100", { token })
      .then((page) => setDemandes(page.data))
      .catch(() => setDemandes((d) => d ?? []));
  }, [token]);

  useEffect(charger, [charger]);
  useRefetchOnFocus(charger);

  const fiches = useMemo(() => (demandes ? fichesClients(demandes) : null), [demandes]);
  const nombreClients = new Set(fiches?.map((f) => f.reference.client_id)).size;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F2F5FA]">
      <div className="flex items-center gap-[14px] px-[14px] pb-[20px] pt-[16px]" style={{ background: DEGRADE_HEADER }}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/25 text-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold leading-tight text-white">Mes clients</h1>
          {fiches ? (
            <p className="mt-0.5 text-[10px] text-white">
              {nombreClients} client{nombreClients > 1 ? "s" : ""} <span className="mx-0.5">•</span> {fiches.length} appareil{fiches.length > 1 ? "s" : ""}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-[18px] px-[16px] pb-8 pt-[22px]">
        {fiches === null ? (
          <p className="py-10 text-center text-sm text-brand-muted">Chargement…</p>
        ) : fiches.length === 0 ? (
          <p className="py-10 text-center text-sm text-brand-muted">Aucun client pour l&apos;instant — ils apparaissent dès qu&apos;un rendez-vous est accepté.</p>
        ) : (
          fiches.map((fiche) => <CarteAppareilClient key={fiche.cle} demande={fiche.reference} href={`/clients/${fiche.cle}`} />)
        )}
      </div>
    </div>
  );
}
