"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { DemandeSav, Pagination } from "@/lib/types";
import { ChevronLeftIcon } from "@/components/icons";
import { CarteIntervention } from "@/components/interventions/CarteIntervention";
import { CarteAppareilClient, fichesClients, lienIntervention } from "@/components/interventions/clients";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import { DEGRADE_HEADER } from "@/lib/rendezVous";

/** "Profil clients" — un client et son appareil, avec l'historique de ses interventions. */
export function EcranProfilClient({ cle }: { cle: string }) {
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

  const fiche = useMemo(() => (demandes ? (fichesClients(demandes).find((f) => f.cle === cle) ?? null) : undefined), [demandes, cle]);

  if (fiche === undefined) {
    return <p className="flex flex-1 items-center justify-center text-sm text-brand-muted">Chargement…</p>;
  }

  if (fiche === null) {
    return <p className="flex flex-1 items-center justify-center px-6 text-center text-sm text-brand-muted">Ce client n&apos;a aucune intervention avec toi.</p>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-[14px] pb-[58px] pt-[18px]" style={{ background: DEGRADE_HEADER }}>
        <div className="flex items-center gap-[16px]">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/25 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-white">Profil clients</h1>
        </div>

        <div className="mt-[22px] px-[2px]">
          <CarteAppareilClient demande={fiche.reference} />
        </div>
      </div>

      <div className="relative -mt-[32px] rounded-t-[30px] bg-white px-[12px] pb-10 pt-[14px]">
        <h2 className="flex h-[56px] items-center justify-center rounded-full bg-[#E3EEFF] text-[15px] font-semibold text-[#111111]">Historique d&apos;intervention</h2>

        <div className="mt-[30px] flex flex-col gap-[20px] px-[4px]">
          {fiche.interventions.map(({ demande, etat }) => (
            <CarteIntervention key={demande.id} demande={demande} etat={etat} href={lienIntervention(demande, etat)} />
          ))}
        </div>
      </div>
    </div>
  );
}
