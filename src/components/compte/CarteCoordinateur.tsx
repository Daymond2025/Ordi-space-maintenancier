import type { CoordinateurLivreur } from "@/lib/types";
import { HorlogeIcon, MapIcon, PinIcon, UserIcon } from "@/components/icons";
import { CartePartenaire } from "@/components/compte/CartePartenaire";

/**
 * Carte "Ton coordinateur" : la fiche du coordinateur qui gère les missions du
 * livreur — voir Coordinateur::fichePourLivreur() côté backend. Sans
 * coordinateur (aucune mission confiée), rien n'est affiché.
 *
 * `compacte` (profil Boutique) : nom et téléphone seulement, sans adresse,
 * horaires ni zone couverte — le livreur n'y a besoin que de le joindre.
 * "Mes infos" garde la fiche complète.
 */
export function CarteCoordinateur({
  coordinateur,
  compacte = false,
}: {
  coordinateur: CoordinateurLivreur | null | undefined;
  compacte?: boolean;
}) {
  if (!coordinateur) return null;

  return (
    <CartePartenaire
      logo={
        coordinateur.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici
          <img src={coordinateur.photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserIcon className="h-6 w-6 text-[color:var(--brand-blue-end)]" />
        )
      }
      nom={coordinateur.nom}
      sousTitre="Ton coordinateur"
      telephone={coordinateur.telephone}
      whatsappUrl={coordinateur.whatsapp_url}
      lignes={
        compacte
          ? []
          : [
              { icone: PinIcon, label: "Adresse", valeur: coordinateur.adresse },
              { icone: HorlogeIcon, label: "Horaires", valeur: coordinateur.horaires },
              { icone: MapIcon, label: "Zone couverte", valeur: coordinateur.zone_couverte },
            ]
      }
    />
  );
}
