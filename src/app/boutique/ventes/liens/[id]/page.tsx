import { EcranLienVente } from "./EcranLienVente";

export default async function LienVentePage({ params }: PageProps<"/boutique/ventes/liens/[id]">) {
  const { id } = await params;

  return <EcranLienVente lienId={Number(id)} />;
}
