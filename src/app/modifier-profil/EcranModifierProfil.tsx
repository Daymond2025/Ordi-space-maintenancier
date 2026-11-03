"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { ProfilTechnicien } from "@/lib/types";
import { ChampAuth } from "@/components/auth/ChampAuth";
import { ChevronLeftIcon, CheckCircleIcon } from "@/components/icons";

/**
 * "Modifier mon profil" — branché sur PATCH /moi/profil (générique à tous
 * les rôles), sans la section mot de passe de l'app Livreur : le technicien
 * n'a pas de mot de passe qu'il connaît (compte créé par l'Admin, connexion
 * uniquement par téléphone+OTP) — lui en proposer un à "changer" serait trompeur.
 */
export function EcranModifierProfil() {
  const { token } = useAuth();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [erreurGenerale, setErreurGenerale] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiFetch<ProfilTechnicien>("/moi/profil", { token }).then((profil) => {
      setNom(profil.nom);
      setPrenom(profil.prenom ?? "");
      setTelephone(profil.telephone ?? "");
      setEmail(profil.email ?? "");
    });
  }, [token]);

  async function onSoumettre(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setErreurs({});
    setErreurGenerale(null);
    setSucces(false);
    setChargement(true);
    try {
      await apiFetch("/moi/profil", {
        method: "PATCH",
        token,
        body: {
          nom,
          prenom: prenom.trim() || null,
          telephone: telephone.trim() || null,
          ...(email.trim() ? { email } : {}),
        },
      });
      setSucces(true);
    } catch (e) {
      if (e instanceof ApiRequestError && e.fields) {
        const aplati: Record<string, string> = {};
        for (const [champ, messages] of Object.entries(e.fields)) aplati[champ] = messages[0];
        setErreurs(aplati);
      } else {
        setErreurGenerale(e instanceof ApiRequestError ? e.message : "Impossible d'enregistrer. Vérifiez votre connexion internet.");
      }
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f2f5fa]">
      <div className="flex items-center gap-3 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2f5fa] text-brand-ink"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <p className="text-base font-extrabold text-brand-ink">Modifier mon profil</p>
      </div>

      <form onSubmit={onSoumettre} className="flex flex-1 flex-col gap-3.5 px-4 py-5">
        <ChampAuth type="text" value={nom} onChange={setNom} placeholder="Nom" autoComplete="family-name" erreur={erreurs.nom} />
        <ChampAuth type="text" value={prenom} onChange={setPrenom} placeholder="Prénom" autoComplete="given-name" erreur={erreurs.prenom} />
        <ChampAuth type="tel" value={telephone} onChange={setTelephone} placeholder="Téléphone" autoComplete="tel" erreur={erreurs.telephone} />
        <ChampAuth type="email" value={email} onChange={setEmail} placeholder="Adresse e-mail (optionnel)" autoComplete="email" erreur={erreurs.email} />

        {erreurGenerale ? <p className="text-center text-xs text-rose-500">{erreurGenerale}</p> : null}
        {succes ? (
          <p className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-emerald-600">
            <CheckCircleIcon className="h-4 w-4" /> Profil mis à jour.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={chargement}
          className="bg-gradient-brand-blue mt-4 h-12 w-full rounded-full text-sm font-extrabold text-white transition-opacity disabled:opacity-60"
        >
          {chargement ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
