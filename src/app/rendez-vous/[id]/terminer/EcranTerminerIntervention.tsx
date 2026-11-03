"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { DemandeSav } from "@/lib/types";
import { CalendrierIcon, ChevronDownIcon, ChevronLeftIcon, HorlogeIcon } from "@/components/icons";
import { CarteIntervention } from "@/components/interventions/CarteIntervention";
import { PIECES, PRESTATIONS } from "@/components/interventions/prestations";
import { SelectionMultiple } from "@/components/interventions/SelectionMultiple";
import { DEGRADE_HEADER, DUREES_INTERVENTION, statutEtDate } from "@/lib/rendezVous";

const OMBRE_CARTE = "0px 6px 20px rgba(16, 24, 40, 0.08)";
const DEGRADE_VERT = "linear-gradient(90deg, #068A2D 0%, #2FE65B 100%)";
const CHAMP = "flex h-[38px] items-center gap-2.5 rounded-[8px] border border-[#E3E6EB] bg-white px-2.5 text-[13px] text-[#2B2B2B]";

function Carte({ titre, children, className = "" }: { titre: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[18px] bg-white pb-5 pt-4 ${className}`} style={{ boxShadow: OMBRE_CARTE }}>
      <h2 className="text-[13px] text-[#3A3A3A]">{titre}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function maintenant(): { date: string; heure: string } {
  const d = new Date();
  const deux = (n: number) => String(n).padStart(2, "0");
  return { date: `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`, heure: `${deux(d.getHours())}:${deux(d.getMinutes())}` };
}

/**
 * "Marquer terminé" — ouvert depuis "Intervention Terminée" (intervention en
 * cours). Prestations, pièces, fin et note, puis clôture de l'intervention :
 * POST /sav/rendez-vous/{id}/intervention (statut terminee).
 */
export function EcranTerminerIntervention({ demandeSavId }: { demandeSavId: number }) {
  const { token } = useAuth();
  const router = useRouter();
  const [demande, setDemande] = useState<DemandeSav | null>(null);
  const [erreurChargement, setErreurChargement] = useState(false);
  const [prestations, setPrestations] = useState<string[]>([]);
  const [pieces, setPieces] = useState<string[]>([]);
  const [dateFin, setDateFin] = useState(() => maintenant().date);
  const [heureFin, setHeureFin] = useState(() => maintenant().heure);
  const [duree, setDuree] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let annule = false;
    apiFetch<DemandeSav>(`/sav/demandes/${demandeSavId}`, { token })
      .then((d) => {
        if (annule) return;
        setDemande(d);
        const estimee = statutEtDate(d).rdv?.intervention?.duree_estimee_minutes;
        if (estimee) setDuree(estimee);
      })
      .catch(() => {
        if (!annule) setErreurChargement(true);
      });
    return () => {
      annule = true;
    };
  }, [token, demandeSavId]);

  function basculer(prestation: string) {
    setPrestations((liste) => (liste.includes(prestation) ? liste.filter((p) => p !== prestation) : [...liste, prestation]));
  }

  async function terminer() {
    const rdv = demande ? statutEtDate(demande).rdv : null;
    if (!token || !demande || !rdv || chargement) return;
    if (prestations.length === 0) {
      setErreur("Sélectionne au moins une prestation réalisée.");
      return;
    }

    setErreur(null);
    setChargement(true);
    try {
      await apiFetch(`/sav/rendez-vous/${rdv.id}/intervention`, {
        method: "POST",
        token,
        body: {
          statut_intervention: "terminee",
          prestations,
          pieces_remplacees: pieces,
          date_fin: dateFin && heureFin ? `${dateFin} ${heureFin}:00` : null,
          duree_reelle_minutes: duree === "" ? null : duree,
          note_fin: note.trim() || null,
        },
      });
      router.replace(`/rendez-vous/${demande.id}/intervention`);
    } catch (e) {
      setErreur(e instanceof ApiRequestError ? e.message : "Impossible de terminer l'intervention. Vérifie ta connexion internet.");
      setChargement(false);
    }
  }

  if (erreurChargement) {
    return <p className="flex flex-1 items-center justify-center px-6 text-center text-sm text-rose-600">Impossible de charger cette intervention.</p>;
  }

  if (!demande) {
    return <p className="flex flex-1 items-center justify-center text-sm text-brand-muted">Chargement…</p>;
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
              <p className="mt-1 text-[10px] text-white">Marquer terminé</p>
            </div>
          </div>

          <div className="mx-[10px] mt-[24px]">
            <CarteIntervention demande={demande} etat="en_cours" />
          </div>
        </div>

        <div className="relative -mt-[34px] rounded-t-[30px] bg-white px-[16px] pb-8 pt-[10px]">
          <span className="mx-auto block h-[5px] w-[58px] rounded-full bg-[#D9D9D9]" />

          <div className="mt-[34px] flex flex-col gap-[22px]">
            <Carte titre="Prestations réalisées" className="px-[33px] pb-10 pt-6">
              <div className="grid grid-cols-2 gap-x-[8px] gap-y-[6px]">
                {PRESTATIONS.map(({ label, Icone, couleur }) => {
                  const choisie = prestations.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => basculer(label)}
                      aria-pressed={choisie}
                      className={`flex h-[34px] min-w-0 items-center gap-2 rounded-[10px] px-3 text-left text-[13px] transition-colors ${
                        choisie ? "bg-[#0A6CFF] text-white shadow-[0_0_0_3px_#CFE2FF]" : "bg-[#F3F4F6] text-[#3A3A3A]"
                      }`}
                    >
                      <Icone className="h-4 w-4 shrink-0" style={{ color: choisie ? "#FFFFFF" : couleur }} />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </Carte>

            <Carte titre="Pièces remplacées" className="px-[22px]">
              <SelectionMultiple options={PIECES} valeurs={pieces} onChange={setPieces} placeholder="Sélectionner les pièces" />
            </Carte>

            <Carte titre="Date et heure de fin" className="px-[22px] pb-7 pt-6">
              <div className="flex gap-3">
                <label className={`${CHAMP} min-w-0 flex-[1.6]`}>
                  <CalendrierIcon className="h-5 w-5 shrink-0" />
                  <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} aria-label="Date de fin" className="min-w-0 flex-1 bg-transparent outline-none" />
                </label>
                <label className={`${CHAMP} min-w-0 flex-1`}>
                  <HorlogeIcon className="h-5 w-5 shrink-0" />
                  <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} aria-label="Heure de fin" className="min-w-0 flex-1 bg-transparent outline-none" />
                </label>
              </div>
              <div className="relative mt-3">
                <select
                  value={duree}
                  onChange={(e) => setDuree(e.target.value === "" ? "" : Number(e.target.value))}
                  aria-label="Durée de l'intervention"
                  className="h-[38px] w-full appearance-none rounded-[8px] border border-[#E3E6EB] bg-white px-4 text-[13px] text-[#2B2B2B] outline-none"
                >
                  <option value="">Durée de l&apos;intervention</option>
                  {DUREES_INTERVENTION.map((d) => (
                    <option key={d.minutes} value={d.minutes}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B2B2B]" />
              </div>
            </Carte>

            <Carte titre="Note" className="px-[22px] pb-7">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Dites-nous quelque chose sur l'état général de l'ordinateur ?"
                className="block h-[98px] w-full resize-none rounded-[4px] border border-[#E2E5EA] bg-[#F5F6F8] px-10 py-7 text-center text-[13px] text-[#2B2B2B] outline-none placeholder:text-[#B5BAC3] focus:border-[#0A6CFF] focus:px-4 focus:py-3 focus:text-left"
              />
            </Carte>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-white px-[30px] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[12px]">
        {erreur ? <p className="mb-2 text-center text-xs text-rose-500">{erreur}</p> : null}
        <button
          type="button"
          onClick={terminer}
          disabled={chargement}
          className="flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ background: DEGRADE_VERT, boxShadow: "0px 6px 14px rgba(6, 138, 45, 0.25)" }}
        >
          {chargement ? "Enregistrement…" : "Intervention Terminée"}
        </button>
      </div>
    </>
  );
}
