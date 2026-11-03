"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { Pagination } from "@/lib/types";
import type { ProduitBoutique } from "@/lib/produitsBoutique";
import {
  FAMILLES,
  FILTRES_VIDES,
  MARQUES,
  PROCESSEURS,
  RAMS,
  STOCKAGES,
  TAILLES,
  TYPES_STOCKAGE,
  ecrireFiltres,
  lireFiltres,
  versParametresApi,
  type ChoixCategorie,
  type ConfigFiltres,
  type Filtres,
  type TypeStockage,
} from "@/lib/filtresCatalogue";
import { ChevronDownIcon, CloseIcon, ImageIcon, LongArrowRightIcon, RefreshIcon } from "@/components/icons";

const ORANGE = "#FF6B0B";
const OMBRE_CARTE = "0px 1px 3px 0px rgba(20, 20, 60, 0.06)";

function basculer<T>(liste: T[], valeur: T): T[] {
  return liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur];
}

function Carte({ titre, droite, children }: { titre?: string; droite?: ReactNode; children: ReactNode }) {
  return (
    <section className="mx-[14px] shrink-0 rounded-[14px] bg-white px-[14px] pb-4 pt-3.5" style={{ boxShadow: OMBRE_CARTE }}>
      {titre ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-extrabold leading-tight text-black">{titre}</h2>
          {droite}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function Puce({ actif, onClick, italique, large, children }: { actif: boolean; onClick: () => void; italique?: boolean; large?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={`flex h-[26px] items-center justify-center whitespace-nowrap rounded-[6px] text-[10px] transition-colors ${large ? "min-w-[70px] px-4" : "px-3"} ${
        italique ? "italic" : ""
      } ${actif ? "font-extrabold text-white" : "bg-[#EFEFFA] text-[#3C3C4C]"}`}
      style={actif ? { background: ORANGE } : undefined}
    >
      {children}
    </button>
  );
}

function Tuile({ nom, actif, petite, onClick }: { nom: string; actif: boolean; petite?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={`flex flex-col items-center rounded-[14px] bg-[#F1F2FF] transition-shadow ${petite ? "gap-1 p-1" : "gap-1.5 p-2 pb-1.5"} ${actif ? "ring-2 ring-[#FF6B0B]" : ""}`}
    >
      {/* Emplacement de la photo de la catégorie — pas encore renseignée : pictogramme neutre. */}
      <span className={`flex w-full items-center justify-center rounded-[10px] bg-white text-[#D5D8EC] ${petite ? "h-[54px]" : "h-[78px]"}`}>
        <ImageIcon className={petite ? "h-5 w-5" : "h-7 w-7"} />
      </span>
      <span className={`w-full truncate text-center text-black ${petite ? "pb-0.5 text-[9px]" : "text-[12px]"} ${actif ? "font-extrabold text-[#FF6B0B]" : ""}`}>{nom}</span>
    </button>
  );
}

function Radio({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="radio"
      aria-checked={actif}
      className="flex h-[34px] flex-1 items-center gap-3 rounded-[10px] bg-[#FFF1E6] px-3 text-left text-[12px] text-[#5A4A3F]"
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#FF9800]">
        {actif ? <span className="h-2 w-2 rounded-full bg-[#FF9800]" /> : null}
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
}

function ListeTuiles({ choix, filtres, colonnes, petites, maj }: { choix: ChoixCategorie[]; filtres: Filtres; colonnes: 3 | 4; petites?: boolean; maj: (p: Partial<Filtres>) => void }) {
  return (
    <div className={`grid gap-2 ${colonnes === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
      {choix.map((c) => (
        <Tuile key={c.id} nom={c.nom} petite={petites} actif={filtres.categories.includes(c.id)} onClick={() => maj({ categories: basculer(filtres.categories, c.id) })} />
      ))}
    </div>
  );
}

/**
 * Onglet "Catégorie" de la Boutique : écran "Filtres" en trois familles
 * (Ordinateur, Accessoires, Logiciels). Les choix des tuiles/types viennent de
 * GET /categories/filtres ; le bouton du bas affiche en direct le nombre de
 * produits à revendre qui correspondent (GET /produits, total) et ouvre la liste.
 * L'état des filtres est dans l'URL (voir lib/filtresCatalogue.ts).
 */
export function EcranFiltres() {
  const router = useRouter();
  const recherche = useSearchParams();
  const { token } = useAuth();
  const filtres = useMemo(() => lireFiltres(new URLSearchParams(recherche.toString())), [recherche]);
  const [config, setConfig] = useState<ConfigFiltres | null>(null);
  const [erreurConfig, setErreurConfig] = useState(false);
  const [total, setTotal] = useState<number | null>(null);

  const requete = versParametresApi(filtres).toString();

  useEffect(() => {
    let annule = false;
    apiFetch<ConfigFiltres>("/categories/filtres", { token: token ?? undefined })
      .then((donnees) => {
        if (!annule) setConfig(donnees);
      })
      .catch(() => {
        if (!annule) setErreurConfig(true);
      });
    return () => {
      annule = true;
    };
  }, [token]);

  // Nombre de résultats en direct — petite attente pour ne pas interroger à chaque tape.
  useEffect(() => {
    let annule = false;
    const attente = setTimeout(() => {
      apiFetch<Pagination<ProduitBoutique>>(`/produits?${requete}&per_page=1`, { token: token ?? undefined })
        .then((page) => {
          if (!annule) setTotal(page.total);
        })
        .catch(() => {});
    }, 200);
    return () => {
      annule = true;
      clearTimeout(attente);
    };
  }, [requete, token]);

  function aller(suivants: Filtres) {
    // "…" le temps de recompter, plutôt qu'un nombre périmé — seulement si la requête change vraiment.
    if (versParametresApi(suivants).toString() !== requete) setTotal(null);
    router.replace(`/boutique/categorie?${ecrireFiltres(suivants)}`, { scroll: false });
  }

  function maj(patch: Partial<Filtres>) {
    aller({ ...filtres, ...patch });
  }

  const marques = (
    <Carte titre="Marque">
      <div className="flex flex-wrap gap-2">
        {filtres.famille === "accessoires" ? (
          <Puce large actif={filtres.marques.length === 0} onClick={() => maj({ marques: [] })}>
            TOUT
          </Puce>
        ) : null}
        {MARQUES.map((m) => (
          <Puce key={m.valeur} large italique actif={filtres.marques.includes(m.valeur)} onClick={() => maj({ marques: basculer(filtres.marques, m.valeur) })}>
            {m.label}
          </Puce>
        ))}
      </div>
    </Carte>
  );

  return (
    <div className="flex h-full flex-col bg-[#F5F5FF]">
      <div className="shrink-0 rounded-b-[18px] bg-white pb-3.5" style={{ boxShadow: "0px 2px 4px 0px rgba(20, 20, 60, 0.1)" }}>
        <div className="flex h-12 items-center justify-between border-b border-[#E9E9F2] px-4">
          <button type="button" onClick={() => router.push("/boutique")} aria-label="Fermer les filtres" className="flex h-8 w-8 items-center justify-center text-black">
            <CloseIcon className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <h1 className="text-[17px] font-extrabold text-black">Filtres</h1>
          <button
            type="button"
            onClick={() => aller({ ...FILTRES_VIDES, famille: filtres.famille })}
            aria-label="Réinitialiser les filtres"
            className="flex h-8 w-8 items-center justify-center text-[#3D3300]"
          >
            <RefreshIcon className="h-6 w-6" />
          </button>
        </div>

        <div role="tablist" className="mx-[18px] mt-3.5 flex items-center justify-between rounded-full bg-[#FFEFE3] p-[7px]">
          {FAMILLES.map((f) => {
            const actif = filtres.famille === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={actif}
                onClick={() => maj({ famille: f.id })}
                className={`h-9 rounded-full px-[22px] text-[15px] transition-colors ${actif ? "font-extrabold text-white" : "font-medium text-[#8A6F60]"}`}
                style={actif ? { background: ORANGE } : undefined}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-3.5">
        {filtres.famille === "ordinateur" ? (
          <>
            <Carte titre="Type d'ordinateur">
              <div role="radiogroup" aria-label="Type d'ordinateur" className="flex gap-2">
                {(config?.ordinateur.types ?? []).map((type) => (
                  <Radio key={type.id} actif={filtres.types.includes(type.id)} onClick={() => maj({ types: filtres.types.includes(type.id) ? [] : [type.id] })}>
                    {type.nom}
                  </Radio>
                ))}
              </div>
            </Carte>

            {marques}

            <Carte titre="Processeur">
              <div className="flex flex-wrap gap-2">
                {PROCESSEURS.map((p) => (
                  <Puce key={p} actif={filtres.processeurs.includes(p)} onClick={() => maj({ processeurs: basculer(filtres.processeurs, p) })}>
                    {p}
                  </Puce>
                ))}
              </div>
            </Carte>

            <Carte
              titre="Disque dur de stockage"
              droite={
                <label className="relative">
                  <span className="sr-only">Type de disque</span>
                  <select
                    value={filtres.stockageType}
                    onChange={(e) => maj({ stockageType: e.target.value as TypeStockage })}
                    className="h-[22px] appearance-none rounded-md bg-[#FFEBDD] pl-2.5 pr-6 text-[10px] font-semibold text-[#E0620F] outline-none"
                  >
                    {TYPES_STOCKAGE.map((t) => (
                      <option key={t.valeur} value={t.valeur}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#E0620F]" />
                </label>
              }
            >
              <div className="flex flex-wrap gap-2">
                {STOCKAGES.map((s) => (
                  <Puce key={s.go} actif={filtres.stockages.includes(s.go)} onClick={() => maj({ stockages: basculer(filtres.stockages, s.go) })}>
                    {s.label}
                  </Puce>
                ))}
              </div>
            </Carte>

            <Carte titre="RAM">
              <div className="flex flex-wrap gap-2">
                {RAMS.map((r) => (
                  <Puce key={r.valeur} actif={filtres.rams.includes(r.valeur)} onClick={() => maj({ rams: basculer(filtres.rams, r.valeur) })}>
                    {r.label}
                  </Puce>
                ))}
              </div>
            </Carte>

            <Carte titre="Tailles">
              <div className="flex flex-wrap gap-2">
                {TAILLES.map((t) => (
                  <Puce key={t} actif={filtres.tailles.includes(t)} onClick={() => maj({ tailles: basculer(filtres.tailles, t) })}>
                    {t} Pouces
                  </Puce>
                ))}
              </div>
            </Carte>
          </>
        ) : filtres.famille === "accessoires" ? (
          <>
            <Carte>
              {config && config.accessoires.categories.length > 0 ? (
                <ListeTuiles choix={config.accessoires.categories} filtres={filtres} colonnes={3} maj={maj} />
              ) : (
                <p className="py-4 text-center text-sm text-brand-muted">{config || erreurConfig ? "Aucun accessoire pour le moment." : "Chargement…"}</p>
              )}
            </Carte>
            {marques}
          </>
        ) : config && config.logiciels.groupes.length > 0 ? (
          config.logiciels.groupes.map((groupe) => (
            <Carte key={groupe.titre} titre={groupe.titre}>
              <ListeTuiles choix={groupe.categories} filtres={filtres} colonnes={4} petites maj={maj} />
            </Carte>
          ))
        ) : (
          <Carte>
            <p className="py-4 text-center text-sm text-brand-muted">{config || erreurConfig ? "Aucun logiciel pour le moment." : "Chargement…"}</p>
          </Carte>
        )}
      </div>

      <div className="shrink-0 bg-[#F8F8FF] px-[22px] pb-4 pt-3.5">
        <button
          type="button"
          onClick={() => router.push(`/boutique/resultats?${ecrireFiltres(filtres)}`)}
          disabled={total === 0}
          className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl text-[15px] font-extrabold text-white disabled:opacity-55"
          style={{ background: ORANGE, boxShadow: "0px 6px 14px 0px rgba(255, 107, 11, 0.35)" }}
        >
          Afficher les résultats ({total ?? "…"})
          <LongArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
