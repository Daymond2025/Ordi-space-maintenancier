"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { formaterPrix } from "@/lib/types";
import type { ProduitBoutique } from "@/lib/produitsBoutique";
import { CheckCircleIcon, ChevronDownIcon, LongArrowRightIcon } from "@/components/icons";

type ReponseCommande = {
  reference: number;
  nom_produit: string;
  montant_produits: number;
  frais_livraison: number;
  total_a_payer: number;
};

const CHAMP = "h-11 w-full rounded-[10px] border border-[#D5D9E0] bg-white px-3.5 text-[13px] text-brand-ink outline-none focus:border-[color:var(--brand-blue-end)]";
const LIBELLE = "block text-[13px] font-extrabold text-black";

/** Drapeau de la Côte d'Ivoire (orange, blanc, vert) — pastille du champ téléphone. */
function DrapeauCI() {
  return (
    <svg viewBox="0 0 30 22" className="h-[22px] w-[30px] shrink-0 rounded-[3px]" aria-hidden="true">
      <rect width="10" height="22" fill="#F77F00" />
      <rect x="10" width="10" height="22" fill="#FFFFFF" />
      <rect x="20" width="10" height="22" fill="#009E60" />
    </svg>
  );
}

/**
 * "Je passe la commande" (détail produit) : le livreur saisit la commande d'un
 * client — nom & prénoms, téléphone, ville de livraison — et l'envoie à
 * l'équipe (POST /boutique/commandes). Elle arrive "en attente" chez l'Admin,
 * qui la valide ; elle apparaît aussitôt dans le Centre des ventes comme
 * "commande manuelle". Reproduit la capture "Information de livraison".
 */
export function FormulaireCommandeLivreur({ produit, onFermer }: { produit: ProduitBoutique; onFermer: () => void }) {
  const router = useRouter();
  const { token } = useAuth();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [localiteId, setLocaliteId] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [commande, setCommande] = useState<ReponseCommande | null>(null);

  const villes = produit.frais_livraison.filter((f) => f.localite !== null);
  const frais = villes.find((f) => String(f.localite?.id) === localiteId);

  async function confirmer(e: React.FormEvent) {
    e.preventDefault();
    if (!token || envoi) return;

    if (!nom.trim()) return setErreur("Indique le nom et les prénoms du client.");
    if (telephone.replace(/\D/g, "").length < 8) return setErreur("Indique un numéro de téléphone valide.");
    if (!localiteId) return setErreur("Choisis la ville de livraison.");

    setEnvoi(true);
    setErreur(null);
    try {
      setCommande(
        await apiFetch<ReponseCommande>("/boutique/commandes", {
          method: "POST",
          token,
          body: { produit_id: produit.id, nom: nom.trim(), telephone, localite_id: Number(localiteId) },
        })
      );
    } catch (err) {
      const champs = err instanceof ApiRequestError ? Object.values(err.fields ?? {}).flat() : [];
      setErreur(champs[0] ?? (err instanceof Error ? err.message : "Une erreur est survenue, réessaie."));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={commande ? undefined : onFermer}>
      <div
        className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-y-auto rounded-t-[36px] bg-white"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Information de livraison"
      >
        <p className="border-b border-[#E5E7EB] px-6 pb-4 pt-6 text-center text-[17px] font-extrabold text-[#777]">
          {commande ? "Commande envoyée" : "Information de livraison"}
        </p>

        {commande ? (
          <div className="flex flex-col items-center px-6 pb-7 pt-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DDF7E8] text-[#16A34A]">
              <CheckCircleIcon className="h-9 w-9" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-brand-ink">Commande transmise à l&apos;admin</h2>
            <p className="mt-1 text-sm text-brand-muted">
              Référence <span className="font-extrabold text-brand-ink">n°{commande.reference}</span>
            </p>

            <div className="mt-5 w-full rounded-2xl bg-[#F4F7FF] p-4 text-left text-sm">
              <p className="font-extrabold text-brand-ink">{commande.nom_produit}</p>
              <div className="mt-2 flex justify-between text-brand-muted">
                <span>Produit</span>
                <span className="whitespace-nowrap font-semibold text-brand-ink">{formaterPrix(commande.montant_produits)}&nbsp;FCFA</span>
              </div>
              <div className="mt-1 flex justify-between text-brand-muted">
                <span>Livraison</span>
                <span className="whitespace-nowrap font-semibold text-brand-ink">{formaterPrix(commande.frais_livraison)}&nbsp;FCFA</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-[#E5E7EB] pt-2">
                <span className="font-bold text-brand-ink">Client à payer</span>
                <span className="whitespace-nowrap font-extrabold text-orange-600">{formaterPrix(commande.total_a_payer)}&nbsp;FCFA</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              L&apos;équipe va la valider et appeler le client. Ta commission t&apos;est acquise dès la validation.
            </p>

            <button
              type="button"
              onClick={() => router.push("/boutique/ventes")}
              className="mt-5 h-12 w-full rounded-xl text-sm font-extrabold text-white"
              style={{ background: "linear-gradient(90deg, #FF7A00 0%, #FFC400 100%)" }}
            >
              Voir mes ventes
            </button>
            <button type="button" onClick={onFermer} className="mt-2 h-11 w-full rounded-xl text-sm font-bold text-brand-muted">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={confirmer} onChange={() => setErreur(null)} noValidate className="flex flex-col px-6 pb-7 pt-6">
            <label className={LIBELLE} htmlFor="commande-nom">
              Nom &amp; Prénoms
            </label>
            <input
              id="commande-nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              autoComplete="off"
              placeholder="Entrez votre nom et prénom"
              className={`${CHAMP} mt-2.5`}
            />

            <label className={`${LIBELLE} mt-6`} htmlFor="commande-telephone">
              Numero De Telephone
            </label>
            <div className="mt-2.5 flex h-11 items-center gap-2.5 rounded-[10px] border border-[#D5D9E0] px-3 focus-within:border-[color:var(--brand-blue-end)]">
              <DrapeauCI />
              <span className="text-sm font-extrabold text-black">+225</span>
              <span className="h-6 w-px bg-[#D5D9E0]" />
              <input
                id="commande-telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value.replace(/[^\d\s]/g, ""))}
                type="tel"
                inputMode="tel"
                placeholder="Numéro de WhatsApp et joignable"
                className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-brand-ink outline-none placeholder:text-[11px]"
              />
            </div>

            <label className={`${LIBELLE} mt-6`} htmlFor="commande-ville">
              Lieu De Livraison
            </label>
            <div className="relative mt-2.5">
              <select
                id="commande-ville"
                value={localiteId}
                onChange={(e) => setLocaliteId(e.target.value)}
                disabled={villes.length === 0}
                className={`${CHAMP} appearance-none pr-10 ${localiteId ? "" : "text-[#6B7280]"}`}
              >
                <option value="">
                  {villes.length === 0 ? "Livraison indisponible pour ce produit" : "Sélectionner votre ville, (Exemple Abidjan)"}
                </option>
                {villes.map((f) => (
                  <option key={f.id} value={f.localite?.id}>
                    {f.localite?.nom}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B6F5E]" />
            </div>
            {frais ? (
              <p className="mt-2 text-xs text-brand-muted">
                Livraison : <span className="whitespace-nowrap font-bold text-brand-ink">{formaterPrix(frais.montant)}&nbsp;FCFA</span>
              </p>
            ) : null}

            {erreur ? <p className="mt-4 text-[13px] font-semibold text-red-500">{erreur}</p> : null}

            <button
              type="submit"
              disabled={envoi || villes.length === 0}
              className="mt-10 flex h-[46px] w-full items-center justify-center gap-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide text-white disabled:opacity-60"
              style={{ background: "linear-gradient(90deg, #FF7A00 0%, #FFC400 100%)" }}
            >
              {envoi ? "Envoi en cours…" : "Confirmer la commande"}
              {envoi ? null : <LongArrowRightIcon className="h-4 w-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
