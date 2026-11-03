"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formaterAnciennete, type ProfilTechnicien, type SupportOrdiSpace } from "@/lib/types";
import { ChevronLeftIcon, DeconnexionIcon, EngrenageIcon, PhoneFilledIcon, PlusVerticalIcon, UserIcon } from "@/components/icons";
import { CarteCoordinateur } from "@/components/compte/CarteCoordinateur";
import { CarteSupportWhatsApp } from "@/components/compte/CartesAide";
import { DEGRADE_BLEU } from "@/components/boutique/style";

const OMBRE_LIGNE = "0px 6px 16px 0px rgba(0, 119, 255, 0.1)";

function LigneInfo({ icone: Icone, label, valeur }: { icone: ComponentType<SVGProps<SVGSVGElement>>; label: string; valeur: string }) {
  return (
    <div className="flex h-[68px] items-center gap-3.5 rounded-2xl bg-white px-5" style={{ boxShadow: OMBRE_LIGNE }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white" style={{ background: DEGRADE_BLEU }}>
        <Icone className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] leading-tight text-brand-muted">{label}</p>
        <p className="truncate text-[15px] font-extrabold leading-tight text-brand-ink">{valeur}</p>
      </div>
    </div>
  );
}

/** "17/10/2026 (2 Mois)" — un livreur inscrit depuis moins d'un mois n'a pas "0 Mois" d'ancienneté. */
function membreDepuis(createdAtIso: string): string {
  const date = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(createdAtIso.replace(" ", "T"))
  );
  const anciennete = formaterAnciennete(createdAtIso);

  return `${date} (${anciennete === "0 Mois" ? "moins d'un mois" : anciennete})`;
}

/**
 * "Mes infos" — ouvert en tapant la photo de "Mon Profil" : identité du
 * technicien, tirée de GET /moi/profil. "Modifier" les infos reste sur
 * "Modifier mon profil". Deux cartes "partenaire" : son coordinateur (en
 * pratique toujours absente — Coordinateur::fichePourLivreur() se base sur
 * les missions livreur, qu'un technicien n'a jamais) et la carte "Support
 * Partenaire WhatsApp" (numéro fixé par l'Admin, GET /support — absente tant
 * qu'il n'est pas réglé). Le menu "⋮" n'a pas encore d'action.
 */
export function EcranMesInfos() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [profil, setProfil] = useState<ProfilTechnicien | null>(null);
  const [support, setSupport] = useState<SupportOrdiSpace | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    if (!token) return;
    let annule = false;

    apiFetch<ProfilTechnicien>("/moi/profil", { token })
      .then((donnees) => {
        if (!annule) setProfil(donnees);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });

    // Le support est facultatif : s'il ne charge pas, la carte n'apparaît simplement pas.
    apiFetch<SupportOrdiSpace>("/support", { token })
      .then((donnees) => {
        if (!annule) setSupport(donnees);
      })
      .catch(() => {});

    return () => {
      annule = true;
    };
  }, [token]);

  const nomComplet = profil ? [profil.nom, profil.prenom].filter(Boolean).join(" ") : "";

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#F7F8FF]">
      <div className="relative h-[245px] shrink-0 rounded-b-[40px]" style={{ background: DEGRADE_BLEU }}>
        <div className="absolute inset-x-0 top-0 flex h-[70px] items-center gap-3 bg-white/20 px-[7px]">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-[30px] w-8 shrink-0 items-center justify-center rounded-lg bg-white/25 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <p className="flex-1 text-[13px] font-semibold text-white">Mes infos</p>
          <button
            type="button"
            aria-label="Plus d'options"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-white/25 text-white"
          >
            <PlusVerticalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-4 -mt-[141px] shrink-0">
        <div
          aria-hidden="true"
          className="absolute inset-x-[10px] -bottom-3 h-8 rounded-b-[22px] bg-white/70"
          style={{ boxShadow: "0px 10px 24px 0px rgba(0, 119, 255, 0.14)" }}
        />
        <div
          className="relative flex h-[218px] flex-col items-center rounded-[30px] bg-white pt-[34px]"
          style={{ boxShadow: "0px 12px 24px 0px rgba(0, 119, 255, 0.12)" }}
        >
          <div className="relative h-[88px] w-[88px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#EAF3FF] text-[color:var(--brand-blue-end)]" style={{ boxShadow: "0px 6px 14px 0px rgba(0, 0, 0, 0.18)" }}>
              {profil?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici
                <img src={profil.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-10 w-10" />
              )}
            </div>
          </div>
          <p className="mt-3 text-[22px] font-extrabold leading-tight text-brand-ink">{profil?.prenom ?? profil?.nom ?? ""}</p>
          <p className="mt-1.5 text-[9px] text-brand-muted">
            Membre depuis : {profil ? membreDepuis(profil.created_at) : "—"}
          </p>
        </div>
      </div>

      <div className="mx-[19px] mt-[41px] flex shrink-0 flex-col gap-3.5">
        <LigneInfo icone={UserIcon} label="Nom et prénom" valeur={nomComplet || "—"} />
        <LigneInfo icone={PhoneFilledIcon} label="Contact" valeur={profil?.telephone ?? "—"} />
        <LigneInfo icone={EngrenageIcon} label="Spécialité" valeur={profil?.specialite ?? "Non renseignée"} />
      </div>

      <div className="mx-[23px] mt-6 flex shrink-0 flex-col gap-4">
        <CarteCoordinateur coordinateur={profil?.coordinateur} />

        <CarteSupportWhatsApp whatsappUrl={support?.whatsapp_url ?? null} />
      </div>

      {erreur ? <p className="px-6 pt-6 text-center text-sm text-red-500">Impossible de charger tes infos.</p> : null}

      <div className="mt-auto shrink-0 px-[23px] pb-6 pt-8">
        <button
          type="button"
          onClick={() => logout()}
          className="flex h-[47px] w-full items-center justify-center gap-2 rounded-full bg-[#FBE4E4] text-[13px] font-extrabold text-[#C81E1E]"
        >
          <DeconnexionIcon className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
