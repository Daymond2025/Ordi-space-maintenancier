"use client";

import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { genererAffichePdf } from "@/lib/affichePdf";
import type { FournisseurLivreur, SupportOrdiSpace } from "@/lib/types";
import { formaterMontantPoints, type ProfilBoutique } from "@/lib/ventesBoutique";
import { ChevronLeftIcon, CopyIcon, ImprimanteIcon, LienChaineIcon, PinIcon, ShareIcon, UserIcon } from "@/components/icons";
import { PopupLienAffilie } from "@/components/boutique/PopupLienAffilie";
import { CarteCoordinateur } from "@/components/compte/CarteCoordinateur";
import { CarteFournisseur } from "@/components/compte/CarteFournisseur";
import { CarteConfidentialite, CarteSupportWhatsApp } from "@/components/compte/CartesAide";
import { DEGRADE_BLEU } from "@/components/boutique/style";

const OMBRE_CARTE = "0px 2px 6px 0px rgba(0, 0, 0, 0.12)";
const DEGRADE_ORANGE = "linear-gradient(90deg, #FF7A00 0%, #FFB800 100%)";

function TuileStat({ pastille, teinte, children }: { pastille: string | number; teinte: { fond: string; texte: string }; children: ReactNode }) {
  return (
    <div className="flex h-[41px] items-center gap-2.5 rounded-xl border border-[#E6EAF2] bg-white px-2.5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold"
        style={{ background: teinte.fond, color: teinte.texte }}
      >
        {pastille}
      </span>
      <p className="flex-1 text-center text-[9px] leading-tight text-[#555]">{children}</p>
    </div>
  );
}

function PastilleCompteur({ fond, texte, children }: { fond: string; texte: string; children: string }) {
  return (
    <span
      className="flex h-[22px] shrink-0 items-center rounded-full px-2 text-[7.5px] font-extrabold uppercase"
      style={{ background: fond, color: texte }}
    >
      {children}
    </span>
  );
}

function accorder(nombre: number, singulier: string, pluriel: string): string {
  return `${nombre} ${nombre > 1 ? pluriel : singulier}`;
}

/** "une commission entre 1.500 et 100.000 FCFA", "de 15.000 FCFA" quand il n'y a qu'un montant, "une commission" sans produit à revendre. */
function phraseCommission(min: number | null, max: number | null): ReactNode {
  if (min === null || max === null) return "une commission";
  if (min === max) {
    return (
      <>
        une commission de <strong className="font-extrabold text-brand-ink">{formaterMontantPoints(min)} FCFA</strong>
      </>
    );
  }
  return (
    <>
      une commission entre{" "}
      <strong className="font-extrabold text-brand-ink">
        {formaterMontantPoints(min)} et {formaterMontantPoints(max)} FCFA
      </strong>
    </>
  );
}

/**
 * Onglet "Profil" de la Boutique (GET /boutique/profil) : identité et totaux
 * du livreur, son lien de vente unique (toute sa sélection de produits) et
 * l'affiche A4 dont le QR pointe sur ce même lien. Pas de barre de navigation
 * ici, comme sur le mockup. "Télécharger A4" fabrique l'affiche PDF dans le
 * navigateur (lib/affichePdf.ts) : accroche, grand QR, trois arguments et le
 * nom + téléphone du livreur — aucun produit ni prix, l'affiche ne se périme
 * pas. Sous l'affiche : "Ton coordinateur" (absente tant que le livreur n'a
 * aucune mission), "Support Partenaire WhatsApp" (numéro fixé par l'Admin,
 * GET /support) et "Confidentialité et UGC" (pas encore branchée). "Ton
 * coordinateur" y reste compacte (nom + contact) ; les fournisseurs des
 * produits du livreur (GET /boutique/fournisseurs) ont chacun leur carte, avec
 * adresse, horaires et itinéraire. Toucher la photo de profil ramène au compte
 * principal.
 */
export function EcranProfilBoutique() {
  const router = useRouter();
  const { token } = useAuth();
  const [profil, setProfil] = useState<ProfilBoutique | null>(null);
  const [support, setSupport] = useState<SupportOrdiSpace | null>(null);
  const [fournisseurs, setFournisseurs] = useState<FournisseurLivreur[]>([]);
  const [erreur, setErreur] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);
  const [popupUrl, setPopupUrl] = useState<string | null>(null);
  const [genereAffiche, setGenereAffiche] = useState(false);
  const [erreurAffiche, setErreurAffiche] = useState(false);

  useEffect(() => {
    if (!token) return;
    let annule = false;

    apiFetch<ProfilBoutique>("/boutique/profil", { token })
      .then((donnees) => {
        if (!annule) setProfil(donnees);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });

    // Le support est facultatif : sans numéro réglé par l'Admin, sa carte n'apparaît pas.
    apiFetch<SupportOrdiSpace>("/support", { token })
      .then((donnees) => {
        if (!annule) setSupport(donnees);
      })
      .catch(() => {});

    // Idem : sans produit lié à un fournisseur, aucune carte fournisseur.
    apiFetch<FournisseurLivreur[]>("/boutique/fournisseurs", { token })
      .then((donnees) => {
        if (!annule) setFournisseurs(donnees);
      })
      .catch(() => {});

    return () => {
      annule = true;
    };
  }, [token]);

  useEffect(() => {
    if (!profil) return;
    let annule = false;
    QRCode.toDataURL(profil.affiche.url_qr, { margin: 1, width: 240 }).then((url) => {
      if (!annule) setQr(url);
    });
    return () => {
      annule = true;
    };
  }, [profil]);

  async function copierLien() {
    if (!profil) return;
    try {
      await navigator.clipboard.writeText(profil.lien.url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers refusé : le pop-up garde le lien accessible.
      setPopupUrl(profil.lien.url);
    }
  }

  async function partagerLien() {
    if (!profil) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ma boutique Ordi'Space", url: profil.lien.url });
      } catch {
        // Partage annulé par l'utilisateur — pas une erreur à signaler.
      }
    } else {
      setPopupUrl(profil.lien.url);
    }
  }

  const nomComplet = profil ? [profil.livreur.prenom, profil.livreur.nom].filter(Boolean).join(" ") : "";
  const urlAffichee = profil ? profil.lien.url.replace(/^https?:\/\//, "") : "";

  async function telechargerAffiche() {
    if (!profil || genereAffiche) return;
    setGenereAffiche(true);
    setErreurAffiche(false);
    try {
      const pdf = await genererAffichePdf({
        urlQr: profil.affiche.url_qr,
        urlAffichee,
        nom: nomComplet,
        telephone: profil.livreur.telephone,
      });
      const adresse = URL.createObjectURL(pdf);
      const lien = document.createElement("a");
      lien.href = adresse;
      lien.download = "affiche-ordispace.pdf";
      lien.click();
      // Laisse le navigateur démarrer le téléchargement avant de libérer le blob.
      setTimeout(() => URL.revokeObjectURL(adresse), 10_000);
    } catch {
      setErreurAffiche(true);
    } finally {
      setGenereAffiche(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#F7F8FF]">
      <div className="relative h-[174px] shrink-0 rounded-b-[40px]" style={{ background: DEGRADE_BLEU }}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="absolute left-[15px] top-[27px] flex h-[30px] w-8 items-center justify-center rounded-lg bg-white/25 text-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="absolute inset-x-0 top-[58px] z-20 flex items-start justify-center gap-3 px-4">
          <button
            type="button"
            onClick={() => router.push("/compte")}
            aria-label="Voir mon compte"
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border-[3px] border-white bg-[#EAF3FF] text-[color:var(--brand-blue-end)]"
            style={{ boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.2)" }}
          >
            {profil?.livreur.photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici
              <img src={profil.livreur.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-9 w-9" />
            )}
          </button>
          <div className="min-w-0 pt-2 text-white">
            <p className="truncate text-2xl font-extrabold leading-tight">{nomComplet}</p>
            <p className="text-[13px] font-semibold leading-tight">{profil?.livreur.telephone}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-14 shrink-0 px-[22px]">
        <div className="rounded-[30px] bg-white/50 p-[7px] pb-2.5" style={{ boxShadow: "0px 6px 16px 0px rgba(0, 119, 255, 0.18)" }}>
          <div className="grid grid-cols-2 gap-2 rounded-[26px] bg-white px-[15px] pb-3 pt-[31px]" style={{ boxShadow: OMBRE_CARTE }}>
            <TuileStat pastille={profil?.stats.produits_vendus ?? 0} teinte={{ fond: "#FFEDD5", texte: "#F97316" }}>
              Produit
              <br />
              total vendus
            </TuileStat>
            <TuileStat pastille={profil?.stats.commandes_livrees ?? 0} teinte={{ fond: "#D8F5E6", texte: "#059669" }}>
              Commande
              <br />
              Total livrées
            </TuileStat>
            <TuileStat pastille={profil?.stats.commandes_annulees ?? 0} teinte={{ fond: "#FEE2E2", texte: "#EF4444" }}>
              Commande
              <br />
              total annulée
            </TuileStat>
            <div className="flex h-[41px] items-center gap-2 rounded-xl bg-[#EAF3FF] px-2">
              <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10.5px] font-extrabold text-[#0B6FD6]">
                {formaterMontantPoints(profil?.stats.commission_totale ?? 0)} F
              </span>
              <p className="flex-1 text-center text-[9px] font-semibold leading-tight text-[#0B6FD6]">
                Commission
                <br />
                totale, gagné
              </p>
            </div>
          </div>
        </div>
      </div>

      {profil ? (
        <>
          <div className="relative mx-[30px] mt-7 shrink-0 rounded-[14px] bg-white px-[25px] pb-4 pt-[22px]" style={{ boxShadow: OMBRE_CARTE }}>
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FB] text-[color:var(--brand-blue-end)]">
                <LienChaineIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold leading-tight text-brand-ink">Mon Lien de vente</p>
                <p className="mt-0.5 text-[8.5px] leading-snug text-brand-muted">
                  Tout achat effectué à travers ce lien vous rapporte {phraseCommission(profil.lien.commission_min, profil.lien.commission_max)}
                </p>
              </div>
            </div>

            <div className="absolute right-4 top-[-6px] flex items-center gap-1.5">
              <button
                type="button"
                onClick={copierLien}
                className="flex h-5 items-center gap-1 rounded-md px-2 text-[8px] font-extrabold text-white"
                style={{ background: DEGRADE_BLEU }}
              >
                <CopyIcon className="h-2.5 w-2.5" />
                {copie ? "Copié !" : "Copier"}
              </button>
              <button
                type="button"
                onClick={partagerLien}
                aria-label="Partager mon lien de vente"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ background: DEGRADE_ORANGE, boxShadow: "0px 3px 6px 0px rgba(255, 122, 0, 0.35)" }}
              >
                <ShareIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-[30px] min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-[#F3F5FA] px-2.5">
                <PinIcon className="h-4 w-4 shrink-0 text-[color:var(--brand-blue-end)]" />
                <p className="truncate text-[13px] font-extrabold text-brand-ink">{urlAffichee}</p>
              </div>
              <PastilleCompteur fond="#E8F0FE" texte="#2563EB">{accorder(profil.lien.clics, "Clique", "Cliques")}</PastilleCompteur>
              <PastilleCompteur fond="#DDF7E8" texte="#16A34A">{accorder(profil.lien.livrees, "Livrée", "Livrées")}</PastilleCompteur>
            </div>
          </div>

          <div className="mx-[30px] mb-4 mt-[26px] flex shrink-0 gap-3.5 rounded-[14px] bg-white p-3" style={{ boxShadow: OMBRE_CARTE }}>
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg border border-[#E6EAF2] bg-[#F3F5FA] p-1.5">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL générée localement
                <img src={qr} alt="QR code de ma boutique" className="h-full w-full" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-extrabold leading-tight text-brand-ink">Affiche Vitrine &amp; QR</p>
                <span className="shrink-0 rounded-md bg-[#4FE3A0] px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#0B6B3E]">Prêt A4</span>
              </div>
              <p className="mt-0.5 text-[8.5px] leading-snug text-brand-muted">
                Imprimez votre affiche commerciale personnalisée pour boutique ou salon.
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={telechargerAffiche}
                  disabled={genereAffiche}
                  className="flex h-[26px] shrink-0 items-center gap-1 rounded-lg px-2.5 text-[10px] font-extrabold text-white disabled:opacity-70"
                  style={{ background: DEGRADE_ORANGE, boxShadow: "0px 3px 6px 0px rgba(255, 122, 0, 0.3)" }}
                >
                  <ImprimanteIcon className="h-3.5 w-3.5" />
                  {genereAffiche ? "Création…" : "Télécharger A4"}
                </button>
                <PastilleCompteur fond="#E8F0FE" texte="#2563EB">{accorder(profil.affiche.scans, "Scan", "Scans")}</PastilleCompteur>
                <PastilleCompteur fond="#DDF7E8" texte="#16A34A">{accorder(profil.affiche.livrees, "Livrée", "Livrées")}</PastilleCompteur>
              </div>
              {erreurAffiche ? (
                <p className="mt-1.5 text-[9px] font-semibold text-red-500">Impossible de créer l&apos;affiche, réessaie.</p>
              ) : null}
            </div>
          </div>

          <div className="mx-[30px] mb-8 flex shrink-0 flex-col gap-3.5">
            <CarteCoordinateur coordinateur={profil.coordinateur} compacte />
            {fournisseurs.map((fournisseur) => (
              <CarteFournisseur key={fournisseur.user_id} fournisseur={fournisseur} />
            ))}
            <CarteSupportWhatsApp whatsappUrl={support?.whatsapp_url ?? null} />
            <CarteConfidentialite />
          </div>
        </>
      ) : erreur ? (
        <p className="px-6 pt-10 text-center text-sm text-red-500">Impossible de charger ton profil boutique.</p>
      ) : null}

      {popupUrl ? <PopupLienAffilie url={popupUrl} onFermer={() => setPopupUrl(null)} /> : null}
    </div>
  );
}
