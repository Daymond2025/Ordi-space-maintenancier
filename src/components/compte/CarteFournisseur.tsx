import type { FournisseurLivreur } from "@/lib/types";
import { HorlogeIcon, MapIcon, PinIcon, StoreIcon, UserIcon } from "@/components/icons";
import { CartePartenaire } from "@/components/compte/CartePartenaire";

/**
 * Carte "Fournisseur" (détail produit et profil Boutique) : tout ce qui aide le
 * livreur à joindre le fournisseur d'un produit et à le trouver — gérant,
 * téléphone (WhatsApp / appel), adresse, horaires, zone et itinéraire. Vient de
 * Fournisseur::fichePourLivreur() côté backend ; un produit sans fournisseur
 * (publié directement par l'Admin) n'a pas de carte.
 */
export function CarteFournisseur({ fournisseur }: { fournisseur: FournisseurLivreur | null | undefined }) {
  if (!fournisseur) return null;

  return (
    <CartePartenaire
      logo={
        fournisseur.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici
          <img src={fournisseur.photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <StoreIcon className="h-6 w-6 text-[color:var(--brand-blue-end)]" />
        )
      }
      nom={fournisseur.nom_entreprise ?? "Fournisseur"}
      sousTitre="Fournisseur du produit"
      telephone={fournisseur.telephone}
      whatsappUrl={fournisseur.whatsapp_url}
      lignes={[
        { icone: UserIcon, label: "Gérant", valeur: fournisseur.nom_gerant },
        { icone: PinIcon, label: "Adresse", valeur: fournisseur.adresse },
        { icone: HorlogeIcon, label: "Horaires", valeur: fournisseur.horaires },
        { icone: MapIcon, label: "Zone couverte", valeur: fournisseur.zone_couverte },
        { icone: UserIcon, label: "Contact pro", valeur: fournisseur.contact_pro },
      ]}
      action={fournisseur.lien_maps ? { libelle: "Itinéraire vers le fournisseur", href: fournisseur.lien_maps } : undefined}
    />
  );
}
