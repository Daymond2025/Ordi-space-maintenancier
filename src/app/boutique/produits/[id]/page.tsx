import { EcranDetailProduit } from "./EcranDetailProduit";

export default async function DetailProduitPage({ params }: PageProps<"/boutique/produits/[id]">) {
  const { id } = await params;

  return <EcranDetailProduit produitBoutiqueId={Number(id)} />;
}
