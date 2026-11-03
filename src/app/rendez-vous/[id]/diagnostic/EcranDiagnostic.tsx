"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { DemandeSav, NiveauGravite } from "@/lib/types";
import { ChevronDownIcon, ChevronLeftIcon } from "@/components/icons";
import { SelectionMultiple } from "@/components/interventions/SelectionMultiple";
import { DEGRADE_BLEU, DEGRADE_HEADER, DUREES_INTERVENTION, SERVICES_COURTS, achete, illustration, nomClient, statutEtDate } from "@/lib/rendezVous";

const PROBLEMES = [
  "Ne s'allume pas / écran noir",
  "Écran cassé ou défectueux",
  "Batterie défectueuse",
  "Problème de charge",
  "Surchauffe",
  "Clavier ou pavé tactile défectueux",
  "Lenteur du système",
  "Virus / logiciel malveillant",
  "Problème Wi-Fi / réseau",
  "Bruit anormal / ventilateur",
  "Disque dur / stockage",
  "Problème logiciel / système d'exploitation",
];

const GRAVITES: { id: NiveauGravite; label: string }[] = [
  { id: "faible", label: "Faible" },
  { id: "moyenne", label: "Moyenne" },
  { id: "critique", label: "Critique" },
];

const OMBRE_CARTE = "0px 6px 20px rgba(16, 24, 40, 0.08)";

function Carte({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[18px] bg-white px-[24px] pb-5 pt-4" style={{ boxShadow: OMBRE_CARTE }}>
      <h2 className="text-[13px] text-[#3A3A3A]">{titre}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/**
 * "Diagnostic technique" — ouvert depuis "Démarrer l'intervention" (rendez-vous
 * confirmé). Enregistre le diagnostic et passe l'intervention "en cours" :
 * POST /sav/rendez-vous/{id}/intervention.
 */
export function EcranDiagnostic({ demandeSavId }: { demandeSavId: number }) {
  const { token } = useAuth();
  const router = useRouter();
  const [demande, setDemande] = useState<DemandeSav | null>(null);
  const [erreurChargement, setErreurChargement] = useState(false);
  const [problemes, setProblemes] = useState<string[]>([]);
  const [precision, setPrecision] = useState("");
  const [cause, setCause] = useState("");
  const [gravite, setGravite] = useState<NiveauGravite>("moyenne");
  const [duree, setDuree] = useState(120);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let annule = false;
    apiFetch<DemandeSav>(`/sav/demandes/${demandeSavId}`, { token })
      .then((d) => {
        if (annule) return;
        setDemande(d);
        // Diagnostic déjà commencé : on le reprend tel quel pour le corriger.
        const intervention = statutEtDate(d).rdv?.intervention;
        if (intervention) {
          setProblemes(intervention.problemes ?? []);
          setPrecision(intervention.probleme_identifie ?? "");
          setCause(intervention.cause_panne ?? "");
          if (intervention.niveau_gravite) setGravite(intervention.niveau_gravite);
          if (intervention.duree_estimee_minutes) setDuree(intervention.duree_estimee_minutes);
        }
      })
      .catch(() => {
        if (!annule) setErreurChargement(true);
      });
    return () => {
      annule = true;
    };
  }, [token, demandeSavId]);

  async function commencer() {
    if (!token || !demande || chargement) return;
    const rdv = statutEtDate(demande).rdv;

    if (!rdv) {
      setErreur("Ce rendez-vous n'est pas encore confirmé.");
      return;
    }
    if (problemes.length === 0 && !precision.trim()) {
      setErreur("Sélectionne ou décris le problème identifié.");
      return;
    }

    setErreur(null);
    setChargement(true);
    try {
      await apiFetch(`/sav/rendez-vous/${rdv.id}/intervention`, {
        method: "POST",
        token,
        body: {
          statut_intervention: "en_cours",
          problemes,
          probleme_identifie: precision.trim() || null,
          cause_panne: cause.trim() || null,
          niveau_gravite: gravite,
          duree_estimee_minutes: duree,
        },
      });
      router.replace(`/rendez-vous/${demande.id}/intervention`);
    } catch (e) {
      setErreur(e instanceof ApiRequestError ? e.message : "Impossible d'enregistrer le diagnostic. Vérifie ta connexion internet.");
      setChargement(false);
    }
  }

  if (erreurChargement) {
    return <p className="flex flex-1 items-center justify-center px-6 text-center text-sm text-rose-600">Impossible de charger ce rendez-vous.</p>;
  }

  if (!demande) {
    return <p className="flex flex-1 items-center justify-center text-sm text-brand-muted">Chargement…</p>;
  }

  const image = illustration(demande);
  const produit = demande.garantie?.ligne_commande?.produit;

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="px-[7px] pb-[66px] pt-[16px]" style={{ background: DEGRADE_HEADER }}>
          <div className="flex items-start gap-[14px]">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Retour"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/25 text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[15px] font-bold leading-tight text-white">Diagnostic Technique</h1>
              <p className="mt-1.5 truncate text-[10px] text-white">
                <span className="text-white/85">Client</span>
                <span className="ml-2 font-bold uppercase">{nomClient(demande)}</span>
              </p>
            </div>
          </div>

          <div className="mx-[10px] mt-[24px] flex h-[62px] items-center gap-3 rounded-[12px] bg-white px-4" style={{ boxShadow: OMBRE_CARTE }}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF1F6]">
              {image ? <Image src={image} alt="" width={28} height={28} className="h-7 w-7 object-contain" /> : null}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-[#111111]">{produit?.nom_produit ?? "Appareil non précisé"}</p>
              <p className="mt-1 truncate text-[8px] text-[#555555]">{SERVICES_COURTS}</p>
            </div>
            {demande.garantie ? <p className="shrink-0 self-end pb-3 text-[9px] text-[#3A3A3A]">{achete(demande.garantie.date_debut)}</p> : null}
          </div>
        </div>

        <div className="relative -mt-[34px] rounded-t-[30px] bg-white px-[17px] pb-8 pt-[10px]">
          <span className="mx-auto block h-[5px] w-[58px] rounded-full bg-[#D9D9D9]" />

          <div className="mt-[34px] flex flex-col gap-[20px]">
            <Carte titre="Problème identifié">
              <SelectionMultiple options={PROBLEMES} valeurs={problemes} onChange={setProblemes} placeholder="Sélectionnez les problèmes que vous avez identifiés" />
              <textarea
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
                placeholder="Ou décrivez le problème ici"
                rows={2}
                className="mt-3 block h-[60px] w-full resize-none rounded-[4px] border border-[#E2E5EA] bg-[#F5F6F8] px-3 py-[22px] text-center text-[11px] leading-4 text-[#2B2B2B] outline-none placeholder:text-[#2B2B2B] focus:border-[#0A6CFF]"
              />
            </Carte>

            <Carte titre="Cause de la panne">
              <textarea
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="Décrivez les symptômes et vos observations ..."
                className="block h-[92px] w-full resize-none rounded-[6px] border border-[#E2E5EA] bg-white px-5 py-3 text-[13px] text-[#2B2B2B] outline-none placeholder:text-[15px] placeholder:text-[#BDBDBD] focus:border-[#0A6CFF]"
              />
            </Carte>

            <Carte titre="Niveau de gravité">
              <div className="flex h-[38px] items-center rounded-[4px] border border-[#E2E5EA] bg-[#F3F4F6] p-[3px]" role="radiogroup" aria-label="Niveau de gravité">
                {GRAVITES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={gravite === g.id}
                    onClick={() => setGravite(g.id)}
                    className={`h-full flex-1 rounded-[6px] text-[12px] transition-colors ${gravite === g.id ? "font-medium text-white" : "text-[#2B2B2B]"}`}
                    style={gravite === g.id ? { background: DEGRADE_BLEU, boxShadow: "0px 6px 12px rgba(0, 119, 255, 0.30)" } : undefined}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </Carte>

            <Carte titre="Temps estimé d'intervention">
              <div className="relative">
                <select
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  aria-label="Temps estimé d'intervention"
                  className="h-[36px] w-full appearance-none rounded-[6px] border border-[#E3E6EB] bg-white px-4 text-[12px] text-[#2B2B2B] outline-none"
                >
                  {DUREES_INTERVENTION.map((d) => (
                    <option key={d.minutes} value={d.minutes}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B2B2B]" />
              </div>
            </Carte>
          </div>
        </div>
      </div>

      <div className="shrink-0 rounded-t-[30px] bg-white px-[28px] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[14px]" style={{ boxShadow: "0px -6px 20px rgba(16, 24, 40, 0.06)" }}>
        {erreur ? <p className="mb-2 text-center text-xs text-rose-500">{erreur}</p> : null}
        <button
          type="button"
          onClick={commencer}
          disabled={chargement}
          className="flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ background: DEGRADE_BLEU, boxShadow: "0px 6px 14px rgba(0, 119, 255, 0.25)" }}
        >
          {chargement ? "Enregistrement…" : "Commencer l'intervention"}
        </button>
      </div>
    </>
  );
}
