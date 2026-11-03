"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formaterAnciennete, type ProfilTechnicien } from "@/lib/types";
import { CameraIcon, ChevronRightIcon, GroupeIcon, HeadsetIcon, PencilIcon, ShieldIcon, StoreIcon, UserIcon } from "@/components/icons";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";

const DEGRADE_HEADER = "linear-gradient(90deg, #0077FF 0%, #00BFFF 100%)";

function CarteStat({ valeur, label, puce }: { valeur: string; label: string; puce: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] text-center"
      style={{ width: 93, height: 85, background: "rgba(246, 248, 254, 1)", boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)" }}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${puce}`} />
      <p className="truncate px-1 text-sm font-extrabold text-brand-ink">{valeur}</p>
      <p className="text-[10px] leading-tight text-brand-muted">{label}</p>
    </div>
  );
}

function LigneMenu({ icone, iconeClasse, label, onClick }: { icone: React.ReactNode; iconeClasse: string; label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 py-3 text-left">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconeClasse}`}>{icone}</span>
      <span className="flex-1 text-sm font-bold text-brand-ink">{label}</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-brand-muted" />
    </button>
  );
}

/**
 * "Mon Profil" — miroir de l'écran Livreur équivalent, simplifié : pas de
 * disponibilité (notion livreur, aucun équivalent SAV) ni de véhicule.
 * Spécialité et ancienneté remplacent "Livraison effectuée"/"Montant reçu".
 */
export function EcranCompte() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [profil, setProfil] = useState<ProfilTechnicien | null>(null);
  const [chargementPhoto, setChargementPhoto] = useState(false);
  const inputPhotoRef = useRef<HTMLInputElement>(null);

  function recharger() {
    if (!token) return;
    apiFetch<ProfilTechnicien>("/moi/profil", { token }).then(setProfil);
  }

  useEffect(() => {
    if (!token) return;
    let annule = false;

    apiFetch<ProfilTechnicien>("/moi/profil", { token })
      .then((profilData) => {
        if (!annule) setProfil(profilData);
      })
      .catch(() => {});

    return () => {
      annule = true;
    };
  }, [token]);

  useRefetchOnFocus(recharger);

  async function onChoisirPhoto(fichier: File | undefined) {
    if (!fichier || !token) return;
    setChargementPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", fichier);
      const utilisateurMisAJour = await apiFetch<{ photo: string | null }>("/moi/profil/photo", { method: "POST", token, body: formData });
      setProfil((p) => (p ? { ...p, photo: utilisateurMisAJour.photo } : p));
    } catch {
      // Silencieux : l'avatar reste inchangé, le technicien peut réessayer.
    } finally {
      setChargementPhoto(false);
      if (inputPhotoRef.current) inputPhotoRef.current.value = "";
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f2f5fa]">
      <div className="relative shrink-0" style={{ height: 318 }}>
        <div className="absolute inset-x-0" style={{ top: -121, height: 309, borderRadius: 30, background: DEGRADE_HEADER }} />

        <div
          className="absolute"
          style={{
            top: 130,
            left: 31,
            right: 29,
            height: 188,
            borderRadius: 30,
            background: "rgba(255, 255, 255, 1)",
            boxShadow: "0px 12px 12px 0px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="flex" style={{ paddingTop: 58, paddingLeft: 16, paddingRight: 9, gap: 19 }}>
            <CarteStat valeur={profil?.specialite ?? "—"} label="Spécialité" puce="bg-[color:var(--brand-blue-end)]" />
            <CarteStat valeur={profil ? formaterAnciennete(profil.created_at) : "—"} label="Ancienneté" puce="bg-emerald-400" />
          </div>
        </div>

        <p className="absolute left-4 z-10 text-lg font-extrabold text-white" style={{ top: 32 }}>
          Mon Profil
        </p>

        <div
          role="button"
          tabIndex={0}
          aria-label="Photo de profil"
          className="absolute z-10 overflow-hidden"
          style={{
            top: 72,
            left: 31,
            width: 81,
            height: 81,
            borderRadius: 20,
            background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #0077FF 0%, #00BFFF 100%) border-box",
            border: "1px solid transparent",
            boxShadow: "0px 12px 12px 1px rgba(0, 119, 255, 0.3)",
          }}
        >
          <div
            className="absolute flex items-center justify-center overflow-hidden bg-[#F5F7FA] text-brand-muted"
            style={{ top: 7, left: 4, width: 73, height: 74, borderRadius: 17 }}
          >
            {profil?.photo ? (
              <Image src={profil.photo} alt="" width={73} height={74} className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-9 w-9" />
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputPhotoRef.current?.click();
            }}
            disabled={chargementPhoto}
            aria-label="Modifier la photo de profil"
            className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-blue-end)] text-white ring-2 ring-white disabled:opacity-60"
            style={{ bottom: 2, right: 2 }}
          >
            <CameraIcon className="h-3.5 w-3.5" />
          </button>
        </div>
        <input
          ref={inputPhotoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChoisirPhoto(e.target.files?.[0])}
        />

        <div className="absolute z-10 text-white" style={{ top: 80, left: 126, right: 16 }}>
          <p className="truncate text-lg font-extrabold leading-tight">{user?.prenom ? `${user.prenom} ${user.nom}` : user?.nom}</p>
          <p className="mt-1 text-sm text-white/85">{profil?.telephone ?? ""}</p>
        </div>
      </div>

      <div className="mx-4 mt-4 flex items-center gap-3 rounded-[22px] bg-white p-4" style={{ boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)" }}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[color:var(--brand-blue-end)]">
          <UserIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-brand-ink">Spécialité</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-brand-muted">{profil?.specialite ?? "Non renseignée"}</p>
        </div>
      </div>

      <div className="mx-4 mt-4 divide-y divide-brand-line rounded-[22px] bg-white px-4" style={{ boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)" }}>
        <LigneMenu
          icone={<PencilIcon className="h-4.5 w-4.5" />}
          iconeClasse="bg-blue-50 text-[color:var(--brand-blue-end)]"
          label="Modifier mon profil"
          onClick={() => router.push("/modifier-profil")}
        />
        <LigneMenu
          icone={<StoreIcon className="h-4.5 w-4.5" />}
          iconeClasse="bg-emerald-50 text-emerald-600"
          label="Boutique d'affiliation"
          onClick={() => router.push("/boutique")}
        />
        <LigneMenu
          icone={<GroupeIcon className="h-4.5 w-4.5" />}
          iconeClasse="bg-blue-50 text-[color:var(--brand-blue-end)]"
          label="Mes clients"
          onClick={() => router.push("/clients")}
        />
        <LigneMenu icone={<ShieldIcon className="h-4.5 w-4.5" />} iconeClasse="bg-indigo-50 text-indigo-500" label="Confidentialité et UGC" />
        <LigneMenu icone={<HeadsetIcon className="h-4.5 w-4.5" />} iconeClasse="bg-amber-50 text-amber-500" label="Contactez le service" />
      </div>

      <div className="px-4 pb-6 pt-6">
        <button
          type="button"
          onClick={() => logout()}
          className="h-12 w-full rounded-full bg-black text-xs font-extrabold uppercase tracking-wide text-white"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
