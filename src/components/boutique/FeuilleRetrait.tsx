"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { formaterPrix } from "@/lib/types";
import { LOGO_OPERATEUR, MONTANTS_SUGGERES, NOM_OPERATEUR, OPERATEURS_RETRAIT, type OperateurRetrait, type RetraitCommission } from "@/lib/portefeuille";
import { CloseIcon } from "@/components/icons";
import { DEGRADE_BLEU } from "@/components/boutique/style";

/**
 * Feuille "Demande de retrait" (Portefeuille) : opérateur, numéro Mobile
 * Money et montant. L'Admin paie hors de l'app ; le montant est réservé dès
 * l'envoi (POST /boutique/retraits) et restitué s'il refuse ou si le livreur
 * annule. Les contrôles ici (minimum, plafond = disponible) doublent ceux du
 * backend pour éviter un aller-retour, le backend reste l'arbitre.
 */
export function FeuilleRetrait({
  disponible,
  minimum,
  telephoneInitial,
  onFermer,
  onEnvoye,
}: {
  disponible: number;
  minimum: number;
  telephoneInitial: string;
  onFermer: () => void;
  onEnvoye: (retrait: RetraitCommission) => void;
}) {
  const { token } = useAuth();
  const [operateur, setOperateur] = useState<OperateurRetrait>("Orange");
  const [telephone, setTelephone] = useState(telephoneInitial);
  const [montant, setMontant] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const insuffisant = disponible < minimum;

  async function envoyer() {
    if (!token || envoi) return;
    const valeur = Number(montant.replace(/\s/g, ""));

    if (!Number.isInteger(valeur) || valeur < minimum) return setErreur(`Minimum ${formaterPrix(minimum)} FCFA.`);
    if (valeur > disponible) return setErreur("Montant supérieur à ta commission disponible.");
    if (telephone.replace(/\D/g, "").length < 8) return setErreur("Numéro de téléphone invalide.");

    setEnvoi(true);
    setErreur(null);
    try {
      const retrait = await apiFetch<RetraitCommission>("/boutique/retraits", {
        method: "POST",
        token,
        body: { montant: valeur, operateur, telephone },
      });
      onEnvoye(retrait);
    } catch (e) {
      const champs = e instanceof ApiRequestError ? Object.values(e.fields ?? {}).flat() : [];
      setErreur(champs[0] ?? (e instanceof Error ? e.message : "Une erreur est survenue, réessaie."));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onFermer}>
      <div
        className="relative w-full max-w-xl rounded-t-[28px] bg-white px-5 pb-6 pt-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Demande de retrait"
      >
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F5FA] text-brand-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <p className="text-lg font-extrabold text-brand-ink">Demande de retrait</p>
        <p className="mt-0.5 text-xs text-brand-muted">
          Commission disponible : <span className="font-extrabold text-brand-ink">{formaterPrix(disponible)} FCFA</span>
        </p>

        <p className="mt-4 text-[11px] font-bold uppercase text-brand-muted">Opérateur</p>
        <div className="mt-1.5 grid grid-cols-4 gap-2">
          {OPERATEURS_RETRAIT.map((op) => {
            const choisi = operateur === op;
            return (
              <button
                key={op}
                type="button"
                onClick={() => setOperateur(op)}
                aria-pressed={choisi}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-1 py-2 ${
                  choisi ? "border-[color:var(--brand-blue-end)] bg-[#EAF3FF]" : "border-transparent bg-[#F2F5FA]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- logo local statique */}
                <img src={LOGO_OPERATEUR[op]} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="text-[10px] font-extrabold text-brand-ink">{NOM_OPERATEUR[op]}</span>
              </button>
            );
          })}
        </div>

        <label className="mt-4 block text-[11px] font-bold uppercase text-brand-muted" htmlFor="retrait-telephone">
          Numéro à créditer
        </label>
        <input
          id="retrait-telephone"
          type="tel"
          inputMode="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="07 58 84 92 81"
          className="mt-1.5 h-11 w-full rounded-xl border border-[#E3E8F1] bg-[#F7F8FF] px-3 text-sm font-semibold text-brand-ink outline-none focus:border-[color:var(--brand-blue-end)]"
        />

        <label className="mt-4 block text-[11px] font-bold uppercase text-brand-muted" htmlFor="retrait-montant">
          Montant à retirer (FCFA)
        </label>
        <input
          id="retrait-montant"
          type="text"
          inputMode="numeric"
          value={montant}
          onChange={(e) => setMontant(e.target.value.replace(/[^\d]/g, ""))}
          placeholder={`Minimum ${formaterPrix(minimum)}`}
          className="mt-1.5 h-11 w-full rounded-xl border border-[#E3E8F1] bg-[#F7F8FF] px-3 text-sm font-extrabold text-brand-ink outline-none focus:border-[color:var(--brand-blue-end)]"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MONTANTS_SUGGERES.filter((m) => m <= disponible).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMontant(String(m))}
              className="rounded-full bg-[#E8F0FE] px-3 py-1 text-[11px] font-bold text-[#2563EB]"
            >
              {formaterPrix(m)} F
            </button>
          ))}
          {disponible >= minimum ? (
            <button
              type="button"
              onClick={() => setMontant(String(Math.floor(disponible)))}
              className="rounded-full bg-[#FFF1DC] px-3 py-1 text-[11px] font-bold text-[#EA7A0B]"
            >
              Tout retirer
            </button>
          ) : null}
        </div>

        {insuffisant ? (
          <p className="mt-3 text-xs font-semibold text-[#C2740A]">
            Il te faut au moins {formaterPrix(minimum)} FCFA de commission disponible pour retirer.
          </p>
        ) : null}
        {erreur ? <p className="mt-3 text-xs font-semibold text-red-500">{erreur}</p> : null}

        <button
          type="button"
          onClick={envoyer}
          disabled={envoi || insuffisant}
          className="mt-5 h-12 w-full rounded-xl text-sm font-extrabold text-white disabled:opacity-50"
          style={{ background: DEGRADE_BLEU }}
        >
          {envoi ? "Envoi…" : "Envoyer la demande"}
        </button>
        <p className="mt-2 text-center text-[10px] text-brand-muted">
          Le montant est réservé jusqu&apos;à la décision de l&apos;administrateur, qui envoie l&apos;argent hors de l&apos;application.
        </p>
      </div>
    </div>
  );
}
