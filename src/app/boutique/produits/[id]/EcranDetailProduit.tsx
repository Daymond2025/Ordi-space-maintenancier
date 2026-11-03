"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formaterPrix, type FournisseurLivreur } from "@/lib/types";
import { LIBELLE_ETAT_PRODUIT, resumerSpecs, type ProduitBoutique } from "@/lib/produitsBoutique";
import {
  CarteGraphiqueIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DisqueIcon,
  EcranIcon,
  EngrenageIcon,
  FenetresIcon,
  ImageIcon,
  MemoireIcon,
  ProcesseurIcon,
  ShareIcon,
  TruckIcon,
} from "@/components/icons";
import { FormulaireCommandeLivreur } from "@/components/boutique/FormulaireCommandeLivreur";
import { PopupLienAffilie } from "@/components/boutique/PopupLienAffilie";
import { VisionneuseImages } from "@/components/boutique/VisionneuseImages";
import { CarteFournisseur } from "@/components/compte/CarteFournisseur";

const ONGLETS = [
  { id: "cadeaux", label: "Les cadeaux" },
  { id: "description", label: "Description" },
  { id: "pack", label: "Pack complet" },
] as const;

type IconeSpec = ComponentType<SVGProps<SVGSVGElement>>;

const OMBRE_CARTE = "0px 1px 2px 0px rgba(0, 0, 0, 0.05)";

/**
 * "Détails" — ouvert en tapant une carte produit sur "Boutique". Branché sur
 * GET /produits/{id} (public, même donnée que le catalogue principal).
 * - "Je passe la commande" ouvre le formulaire de saisie d'une commande pour un
 *   client (POST /boutique/commandes) — elle part à l'Admin ;
 * - le lien affilié (POST /boutique/produits/{id}/lien, même endpoint que
 *   "Vendre ce produit" sur la liste) alimente l'icône Partager de l'en-tête
 *   (partage natif, pop-up en repli) et la tuile Copier de la barre du bas ;
 * - toucher la photo l'ouvre en grand ;
 * - la carte "Fournisseur" (GET /boutique/produits/{id}/fournisseur) aide le
 *   livreur à joindre et trouver le fournisseur du produit.
 */
export function EcranDetailProduit({ produitBoutiqueId }: { produitBoutiqueId: number }) {
  const router = useRouter();
  const { token } = useAuth();
  const [produit, setProduit] = useState<ProduitBoutique | null>(null);
  const [imageActive, setImageActive] = useState(0);
  const [ongletActif, setOngletActif] = useState<(typeof ONGLETS)[number]["id"]>("description");
  const [chargementLien, setChargementLien] = useState(false);
  const [lienActif, setLienActif] = useState<string | null>(null);
  const [lienCopie, setLienCopie] = useState(false);
  const [commandeOuverte, setCommandeOuverte] = useState(false);
  const [visionneuseOuverte, setVisionneuseOuverte] = useState(false);
  const [fournisseur, setFournisseur] = useState<FournisseurLivreur | null>(null);

  useEffect(() => {
    apiFetch<ProduitBoutique>(`/produits/${produitBoutiqueId}`, { token: token ?? undefined })
      .then(setProduit)
      .catch(() => setProduit(null));
  }, [produitBoutiqueId, token]);

  // Fiche du fournisseur : facultative — sans elle (ou si l'appel échoue), la carte n'apparaît pas.
  useEffect(() => {
    if (!token) return;
    let annule = false;
    apiFetch<{ fournisseur: FournisseurLivreur | null }>(`/boutique/produits/${produitBoutiqueId}/fournisseur`, { token })
      .then((reponse) => {
        if (!annule) setFournisseur(reponse.fournisseur);
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, [produitBoutiqueId, token]);

  /** Récupère (ou crée) le lien affilié du livreur pour ce produit. `null` si l'appel échoue. */
  async function obtenirLien(): Promise<string | null> {
    if (!token || !produit || chargementLien) return null;
    setChargementLien(true);
    try {
      const reponse = await apiFetch<{ code: string; url: string }>(`/boutique/produits/${produit.id}/lien`, {
        method: "POST",
        token,
      });
      return reponse.url;
    } catch {
      // Silencieux : le livreur peut simplement retenter.
      return null;
    } finally {
      setChargementLien(false);
    }
  }

  async function onPartager() {
    if (!produit) return;
    const url = await obtenirLien();
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: produit.nom_produit, text: `${produit.nom_produit} — Ordi'Space`, url });
      } catch {
        // Partage annulé par l'utilisateur — pas une erreur à signaler.
      }
    } else {
      // Pas de partage natif (navigateur de bureau) : pop-up Copier/Partager.
      setLienActif(url);
    }
  }

  async function onCopier() {
    const url = await obtenirLien();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2000);
    } catch {
      // Presse-papiers refusé : on ouvre le pop-up pour que le lien reste accessible.
      setLienActif(url);
    }
  }

  if (!produit) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white text-brand-muted">
        <p className="text-sm">Chargement du produit…</p>
      </div>
    );
  }

  const specs = resumerSpecs(produit);
  const specsDetail = (
    [
      { label: "Processeur", valeur: produit.processeur, Icone: ProcesseurIcon },
      { label: "Disque dur", valeur: produit.stockage, Icone: DisqueIcon },
      { label: "Ram", valeur: produit.memoire_ram, Icone: MemoireIcon },
      { label: "Carte graphique", valeur: produit.carte_graphique, Icone: CarteGraphiqueIcon },
      { label: "Taille d'écran", valeur: produit.taille, Icone: EcranIcon },
      { label: "Système installé", valeur: produit.systeme_exploitation, Icone: FenetresIcon },
    ] as { label: string; valeur: string | null; Icone: IconeSpec }[]
  ).filter((s): s is { label: string; valeur: string; Icone: IconeSpec } => Boolean(s.valeur));

  const contenuOnglet: Record<(typeof ONGLETS)[number]["id"], string> = {
    cadeaux: produit.cadeaux && produit.cadeaux.length > 0 ? produit.cadeaux.join(", ") : "",
    description: produit.description ?? "",
    pack: "",
  };

  const fraisLivraisonMin =
    produit.frais_livraison.length > 0 ? Math.min(...produit.frais_livraison.map((f) => Number(f.montant))) : null;

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f2f5fa]">
      <div className="flex shrink-0 items-center justify-between bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2F5FA] text-brand-ink"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <p className="text-base font-extrabold text-brand-ink">Détails</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPartager}
            disabled={chargementLien}
            aria-label="Partager le produit"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-ink shadow-[0px_1px_3px_0px_rgba(0,0,0,0.15)] disabled:opacity-60"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative h-[320px] w-full shrink-0 bg-[#F2F5FA]">
        {produit.images[imageActive] ? (
          <button
            type="button"
            onClick={() => setVisionneuseOuverte(true)}
            aria-label="Voir la photo en grand"
            className="block h-full w-full cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici */}
            <img src={produit.images[imageActive].url_image} alt="" className="h-full w-full object-cover" />
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-muted">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {produit.etat_produit ? (
          <span
            className="absolute left-[13px] top-[15px] flex h-[22px] items-center rounded-lg px-2 text-xs font-bold leading-[14px] text-white"
            style={{
              background: "linear-gradient(273.52deg, #FFCC00 -3.09%, #FF7800 98.47%)",
              boxShadow: OMBRE_CARTE,
            }}
          >
            {LIBELLE_ETAT_PRODUIT[produit.etat_produit]}
          </span>
        ) : null}
        {produit.pourcentage_reduction ? (
          <span
            className="absolute right-3 top-[15px] flex h-[22px] items-center rounded px-2 text-xs font-bold leading-[14px] text-white"
            style={{ background: "linear-gradient(115.13deg, #FF9700 0%, #FFB800 100%)" }}
          >
            -{produit.pourcentage_reduction}%
          </span>
        ) : null}
      </div>

      {produit.images.length > 1 ? (
        // shrink-0 impératif : la racine de l'écran est "flex flex-col" — sans
        // ça, cette div (overflow-x-auto) est un enfant flexible dont la
        // taille mini automatique tombe à 0 (règle CSS flexbox : min-height
        // auto → 0 dès que overflow ≠ visible), donc écrasée à la hauteur du
        // seul padding, et la carte suivante la recouvrirait.
        <div className="flex shrink-0 gap-2 overflow-x-auto px-1 pb-[25px] pt-[9px]">
          {produit.images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setImageActive(index)}
              className="h-[87px] w-[112px] shrink-0 overflow-hidden rounded-[5px] border-2 bg-white"
              style={{ borderColor: index === imageActive ? "rgba(38, 128, 235, 1)" : "transparent" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici */}
              <img src={image.url_image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : (
        <div className="h-[25px] shrink-0" />
      )}

      <div className="mx-2.5 flex shrink-0 flex-col gap-1 rounded-xl bg-white p-4" style={{ boxShadow: OMBRE_CARTE }}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-black px-2 py-1 text-[10px] font-extrabold text-white">
            {produit.nom_produit.split(" ")[0].toUpperCase()}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {produit.quantite_stock} pièces disponible
          </span>
          <span className="rounded-full bg-[#F2F5FA] px-2 py-0.5 text-[10px] font-semibold text-brand-muted">
            {produit.quantite_stock > 0 ? "En stock" : "Rupture"}
          </span>
        </div>

        <p className="text-xl font-extrabold text-brand-ink">{produit.nom_produit}</p>
        {specs.length > 0 ? <p className="text-xs text-brand-muted">{specs.join(" • ")}</p> : null}

        <div
          className="mt-2 flex min-h-[58px] flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg px-3 py-2"
          style={{ background: "rgba(242, 243, 255, 0.6)" }}
        >
          {/* Un montant ne se coupe jamais : espace insécable avant "FCFA" + nowrap. Seuls les blocs entiers peuvent passer à la ligne. */}
          <div className="shrink-0">
            <p className="whitespace-nowrap text-[10px] text-brand-muted">Prix de vente</p>
            <div className="mt-0.5 flex items-baseline gap-2 whitespace-nowrap">
              <p className="text-[17px] font-extrabold text-orange-600">
                {produit.prix_vente ? `${formaterPrix(produit.prix_vente)}\u00a0FCFA` : "Prix à venir"}
              </p>
              {produit.prix_barre ? (
                <p className="text-[11px] text-brand-muted line-through">{formaterPrix(produit.prix_barre)}&nbsp;FCFA</p>
              ) : null}
            </div>
          </div>
          {produit.prix_barre && produit.prix_vente ? (
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-600">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Économie&nbsp;
              {formaterPrix(Number(produit.prix_barre) - Number(produit.prix_vente))}&nbsp;F
            </span>
          ) : null}
        </div>

        <div
          className="relative mt-1.5 flex min-h-[51px] items-center justify-between rounded-md py-2 pl-5 pr-4"
          style={{ background: "rgba(255, 236, 208, 0.54)" }}
        >
          <span
            aria-hidden="true"
            className="absolute left-[5px] top-1 h-[42px] w-1 rounded-md"
            style={{ background: "rgba(255, 119, 0, 1)" }}
          />
          <span className="whitespace-nowrap text-lg font-light text-orange-700">Commission</span>
          <span className="whitespace-nowrap text-lg font-extrabold text-orange-600">
            {produit.commission_apporteur ? `${formaterPrix(produit.commission_apporteur)}\u00a0FCFA` : "—"}
          </span>
        </div>
      </div>

      <div
        className="mx-[11px] mt-3.5 shrink-0 rounded-[13px] bg-white p-4"
        style={{ boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)" }}
      >
        {specsDetail.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {specsDetail.map((spec) => (
              <div key={spec.label} className="flex items-center gap-1.5 rounded-xl bg-[#F7F8FF] px-2 py-2.5">
                <spec.Icone className="h-5 w-5 shrink-0 text-orange-500" />
                <div className="min-w-0">
                  <p className="truncate text-[9px] text-brand-muted">{spec.label}</p>
                  <p className="text-[10px] font-extrabold leading-tight text-brand-ink">{spec.valeur}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className="mt-3 flex gap-1 rounded-full bg-white p-1"
          style={{ boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)" }}
        >
          {ONGLETS.map((onglet) => (
            <button
              key={onglet.id}
              type="button"
              onClick={() => setOngletActif(onglet.id)}
              className={`flex-1 rounded-full py-2 text-[11px] font-extrabold transition-colors ${
                ongletActif === onglet.id ? "text-white shadow-[0px_3px_8px_0px_rgba(249,115,22,0.4)]" : "text-brand-muted"
              }`}
              style={ongletActif === onglet.id ? { background: "linear-gradient(90deg, #FBBF24 0%, #F97316 100%)" } : undefined}
            >
              {onglet.label}
            </button>
          ))}
        </div>

        <div className="mt-3 min-h-[305px] rounded-[13px] p-4 text-xs text-brand-muted" style={{ background: "rgba(247, 248, 255, 1)" }}>
          {contenuOnglet[ongletActif]}
        </div>
      </div>

      {fraisLivraisonMin !== null || produit.duree_garantie_mois ? (
        <div
          className="mx-[11px] mb-6 mt-3.5 flex shrink-0 flex-col gap-3 rounded-xl bg-white p-4"
          style={{ boxShadow: OMBRE_CARTE }}
        >
          {fraisLivraisonMin !== null ? (
            <div className="flex min-h-[44px] items-center gap-3">
              <TruckIcon
                viewBox="1 6 22 16"
                className="h-[14.67px] w-[20.17px] shrink-0"
                style={{ color: "rgba(255, 119, 0, 1)" }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-brand-ink">Livraison</p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  À partir de {formaterPrix(fraisLivraisonMin)}&nbsp;FCFA — selon ta localité
                </p>
              </div>
            </div>
          ) : null}
          {produit.duree_garantie_mois ? (
            <div
              className="flex min-h-[56px] items-center gap-3 rounded-xl px-4 py-1.5"
              style={{ background: "linear-gradient(274.19deg, #23E755 3.13%, #008421 98.13%)" }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: "rgba(255, 255, 255, 0.54)" }}
              >
                <EngrenageIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 text-white">
                <p className="text-sm font-extrabold">Garantie</p>
                <p className="text-xs">{produit.duree_garantie_mois} mois</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="h-3.5 shrink-0" />
      )}

      {fournisseur ? (
        <div className="mx-[11px] mb-6 shrink-0">
          <CarteFournisseur fournisseur={fournisseur} />
        </div>
      ) : null}

      <div
        className="sticky bottom-0 z-20 mt-auto flex h-[110px] shrink-0 items-start gap-[21px] rounded-t-[23px] bg-white px-[22px] pt-[25px]"
        style={{ boxShadow: "0px -3px 3px 0px rgba(0, 0, 0, 0.1608)" }}
      >
        <button
          type="button"
          onClick={() => setCommandeOuverte(true)}
          disabled={produit.quantite_stock <= 0 || produit.commission_apporteur === null}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-extrabold text-white disabled:opacity-60"
          style={{
            background: "linear-gradient(90deg, #FBBF24 0%, #F97316 100%)",
            boxShadow: "0px 2px 4px -2px rgba(255, 151, 0, 0.2)",
          }}
        >
          {produit.quantite_stock <= 0 ? "Rupture de stock" : "Je passe la commande"}
          <ChevronRightIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onCopier}
          disabled={chargementLien}
          aria-label="Copier le lien de vente"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl disabled:opacity-60"
          style={{ background: "rgba(37, 211, 102, 0.16)", color: "rgba(37, 211, 102, 1)", boxShadow: OMBRE_CARTE }}
        >
          {lienCopie ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
        </button>
      </div>

      {lienActif ? <PopupLienAffilie url={lienActif} onFermer={() => setLienActif(null)} /> : null}
      {commandeOuverte ? <FormulaireCommandeLivreur produit={produit} onFermer={() => setCommandeOuverte(false)} /> : null}
      {visionneuseOuverte ? (
        <VisionneuseImages
          images={produit.images.map((image) => image.url_image)}
          indexInitial={imageActive}
          onFermer={() => setVisionneuseOuverte(false)}
        />
      ) : null}
    </div>
  );
}
