"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { DemandeSav, StatutAffiche } from "@/lib/types";
import { CalendrierIcon, ChevronLeftIcon, HorlogeIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { Carte, CarteCoordonneesClient, CarteDateRendezVous, CarteMotif } from "@/components/interventions/blocs";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import {
  DEGRADE_BLEU,
  DEGRADE_HEADER,
  MOIS_BADGE,
  SERVICES_COURTS,
  achete,
  illustration,
  jourDeuxChiffres,
  nomClient,
  statutEtDate,
  versDate,
} from "@/lib/rendezVous";

/** Sous le titre : "Nouvelle demande" en texte, puis une pastille de statut une fois le rendez-vous traité. */
const PASTILLES_STATUT: Record<Exclude<StatutAffiche, "demande">, { label: string; classe: string }> = {
  confirme: { label: "Confirmé", classe: "bg-[#E4F8EA] text-[#12963F]" },
  reporte: { label: "Reporté", classe: "bg-[#FFF1DC] text-[#E58A00]" },
  refuse: { label: "Refusé", classe: "bg-[#FFE4E9] text-[#D3102F]" },
  termine: { label: "Terminée", classe: "bg-[#EDEDED] text-[#2B2B2B]" },
  annule: { label: "Annulée", classe: "bg-[#FFE4E9] text-[#D3102F]" },
};

type Decision = "accepter" | "refuser" | "reporter";

function estPassee(iso: string): boolean {
  return versDate(iso).getTime() < Date.now();
}

function demainDixHeures(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return d;
}

/** "YYYY-MM-DD" / "HH:MM" en heure locale — valeurs par défaut des champs de la feuille de date. */
function valeursChamps(d: Date): { date: string; heure: string } {
  const deux = (n: number) => String(n).padStart(2, "0");
  return { date: `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`, heure: `${deux(d.getHours())}:${deux(d.getMinutes())}` };
}

function FeuilleDate({
  titre,
  dateInitiale,
  chargement,
  erreur,
  onFermer,
  onValider,
}: {
  titre: string;
  dateInitiale: Date;
  chargement: boolean;
  erreur: string | null;
  onFermer: () => void;
  onValider: (dateRdv: string) => void;
}) {
  const initial = valeursChamps(dateInitiale);
  const [date, setDate] = useState(initial.date);
  const [heureChoisie, setHeureChoisie] = useState(initial.heure);

  return (
    <div className="fixed inset-0 z-40">
      <div onClick={onFermer} className="absolute inset-0 bg-slate-900/50" />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-xl rounded-t-[2rem] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
        <button type="button" onClick={onFermer} aria-label="Fermer" className="mx-auto block h-1.5 w-10 rounded-full bg-brand-line" />
        <h2 className="mt-4 text-center text-sm font-bold text-brand-ink">{titre}</h2>

        <div className="mt-5 flex flex-col gap-3">
          <label className="flex h-12 items-center gap-3 rounded-[10px] bg-[#F3F4F6] px-3 text-sm text-brand-ink">
            <CalendrierIcon className="h-5 w-5 shrink-0" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-transparent outline-none" aria-label="Date du rendez-vous" />
          </label>
          <label className="flex h-12 items-center gap-3 rounded-[10px] bg-[#F3F4F6] px-3 text-sm text-brand-ink">
            <HorlogeIcon className="h-5 w-5 shrink-0" />
            <input type="time" value={heureChoisie} onChange={(e) => setHeureChoisie(e.target.value)} className="flex-1 bg-transparent outline-none" aria-label="Heure du rendez-vous" />
          </label>
        </div>

        {erreur ? <p className="mt-3 text-center text-xs text-rose-500">{erreur}</p> : null}

        <button
          type="button"
          disabled={chargement || !date || !heureChoisie}
          onClick={() => onValider(`${date} ${heureChoisie}:00`)}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ background: DEGRADE_BLEU }}
        >
          {chargement ? "Envoi…" : "Confirmer"}
        </button>
      </div>
    </div>
  );
}

/**
 * Détail d'un rendez-vous (clic sur une carte de l'accueil) — Accepter /
 * Refuser / Reporter via POST /sav/demandes/{id}/decision.
 */
export function EcranRendezVous({ demandeSavId }: { demandeSavId: number }) {
  const { token } = useAuth();
  const router = useRouter();
  const [demande, setDemande] = useState<DemandeSav | null>(null);
  const [erreurChargement, setErreurChargement] = useState(false);
  const [feuille, setFeuille] = useState<"accepter" | "reporter" | null>(null);
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

  async function decider(decision: Decision, dateRdv?: string) {
    if (!token || chargement) return;
    setErreur(null);
    setChargement(true);
    try {
      await apiFetch(`/sav/demandes/${demandeSavId}/decision`, {
        method: "POST",
        token,
        body: { decision, ...(dateRdv ? { date_rdv: dateRdv } : {}) },
      });
      setFeuille(null);
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
        <p className="text-sm text-rose-600">Impossible de charger ce rendez-vous.</p>
        <button type="button" onClick={charger} className="rounded-full border border-brand-line px-4 py-2 text-xs font-semibold text-brand-ink">
          Réessayer
        </button>
      </div>
    );
  }

  if (!demande) {
    return <p className="flex flex-1 items-center justify-center text-sm text-brand-muted">Chargement…</p>;
  }

  const { statut, date, rdv } = statutEtDate(demande);
  const image = illustration(demande);
  const client = demande.client?.user;
  const produit = demande.garantie?.ligne_commande?.produit;
  const garantieExpiree = demande.garantie ? estPassee(demande.garantie.date_fin) : null;
  const peutDecider = statut === "demande" || statut === "reporte";
  const dateParDefaut = rdv && !estPassee(rdv.date_rdv) ? versDate(rdv.date_rdv) : demainDixHeures();

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="px-[7px] pb-[60px] pt-[13px]" style={{ background: DEGRADE_HEADER }}>
          <div className="flex items-start justify-between pr-[10px]">
            <div className="flex items-start gap-[18px]">
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Retour"
                className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/25 text-white"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <div className="-mt-1">
                <h1 className="text-xl font-bold leading-tight text-white">Rendez-vous</h1>
                {statut === "demande" ? (
                  <p className="text-[13px] font-medium text-white">Nouvelle demande</p>
                ) : (
                  <span className={`mt-1 inline-flex h-[19px] items-center rounded-full px-3 text-[11px] font-semibold ${PASTILLES_STATUT[statut].classe}`}>
                    {PASTILLES_STATUT[statut].label}
                  </span>
                )}
              </div>
            </div>
            {rdv ? (
              <span className="flex h-8 w-8 flex-col items-center justify-center rounded-[6px] border-[1.5px] border-white leading-none text-white" style={{ background: DEGRADE_BLEU }}>
                <span className="text-[10px] font-bold">{jourDeuxChiffres(date)}</span>
                <span className="mt-0.5 text-[8px] font-semibold">{MOIS_BADGE[date.getMonth()]}</span>
              </span>
            ) : null}
          </div>

          <div className="mt-[22px] flex items-center gap-6 px-5">
            <span className="flex h-[78px] w-[84px] shrink-0 items-center justify-center">
              {image ? <Image src={image} alt="" width={84} height={78} className="h-full w-full object-contain" priority /> : null}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-white">Client</p>
              <span className="mt-1.5 flex h-7 max-w-[190px] items-center gap-1.5 rounded-[6px] bg-white/25 px-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2B2B2B] text-white">
                  {client?.photo ? <Image src={client.photo} alt="" width={16} height={16} className="h-full w-full object-cover" /> : <UserIcon className="h-2.5 w-2.5" />}
                </span>
                <span className="truncate text-[11px] font-bold uppercase text-white">{nomClient(demande)}</span>
              </span>
              <p className="mt-1.5 text-[9px] text-white/90">{SERVICES_COURTS}</p>
            </div>
          </div>
        </div>

        <div className="relative -mt-[34px] rounded-t-[30px] bg-white px-[17px] pb-8 pt-[10px]">
          <span className="mx-auto block h-[5px] w-[58px] rounded-full bg-[#D9D9D9]" />

          <div className="mt-[34px] flex flex-col gap-[20px]">
            <CarteMotif demande={demande} />

            <Carte titre="Appareil concerné">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF1F6]">
                  {image ? <Image src={image} alt="" width={28} height={28} className="h-7 w-7 object-contain" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-[#111111]">{produit?.nom_produit ?? "Appareil non précisé"}</p>
                  {demande.garantie ? <p className="mt-0.5 text-[10px] text-[#555555]">{achete(demande.garantie.date_debut)}</p> : null}
                </div>
                {garantieExpiree !== null ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#F3F4F6] px-2 py-1 text-[10px] text-[#2B2B2B]">
                    <ShieldIcon className="h-3 w-3" />
                    {garantieExpiree ? "Garantie expirée" : "Sous garantie"}
                  </span>
                ) : null}
              </div>
            </Carte>

            <CarteDateRendezVous demande={demande} />

            <CarteCoordonneesClient demande={demande} />
          </div>
        </div>
      </div>

      {statut !== "refuse" && statut !== "annule" ? (
        <div className="shrink-0 rounded-t-[30px] bg-white px-[26px] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[12px]" style={{ boxShadow: "0px -6px 20px rgba(16, 24, 40, 0.06)" }}>
          {erreur && !feuille ? <p className="mb-2 text-center text-xs text-rose-500">{erreur}</p> : null}

          {peutDecider ? (
            <button
              type="button"
              disabled={chargement}
              onClick={() => (rdv ? decider("accepter") : setFeuille("accepter"))}
              className="flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-medium text-white disabled:opacity-60"
              style={{ background: DEGRADE_BLEU, boxShadow: "0px 6px 14px rgba(0, 119, 255, 0.25)" }}
            >
              Accepter le rendez-vous
            </button>
          ) : (
            <Link
              href={statut === "confirme" && demande.statut_demande !== "en_cours" ? `/rendez-vous/${demande.id}/diagnostic` : `/rendez-vous/${demande.id}/intervention`}
              className="flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-medium text-white"
              style={{ background: DEGRADE_BLEU, boxShadow: "0px 6px 14px rgba(0, 119, 255, 0.25)" }}
            >
              {statut === "termine" ? "Voir l'intervention" : demande.statut_demande === "en_cours" ? "Continuer l'intervention" : "Démarrer l'intervention"}
            </Link>
          )}

          {statut !== "termine" ? (
            <div className="mt-[10px] flex gap-[33px]">
              <button
                type="button"
                disabled={chargement}
                onClick={() => {
                  if (confirm("Refuser ce rendez-vous ? Le client sera prévenu.")) decider("refuser");
                }}
                className="h-12 flex-1 rounded-[10px] border-[1.5px] border-[#E0102F] text-[15px] font-semibold text-[#E0102F] disabled:opacity-60"
                style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFE6EB 100%)" }}
              >
                Refuser
              </button>
              <button
                type="button"
                disabled={chargement}
                onClick={() => setFeuille("reporter")}
                className="h-12 flex-1 rounded-[10px] border-[1.5px] border-[#F5A300] text-[15px] font-semibold text-[#F5A300] disabled:opacity-60"
                style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFF2D9 100%)" }}
              >
                Reporter
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {feuille ? (
        <FeuilleDate
          titre={feuille === "accepter" ? "Fixer la date du rendez-vous" : "Reporter le rendez-vous"}
          dateInitiale={dateParDefaut}
          chargement={chargement}
          erreur={erreur}
          onFermer={() => {
            setFeuille(null);
            setErreur(null);
          }}
          onValider={(dateRdv) => decider(feuille, dateRdv)}
        />
      ) : null}
    </>
  );
}
