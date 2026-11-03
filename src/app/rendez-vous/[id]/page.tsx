import { EcranRendezVous } from "./EcranRendezVous";

export default async function RendezVousPage({ params }: PageProps<"/rendez-vous/[id]">) {
  const { id } = await params;

  return <EcranRendezVous demandeSavId={Number(id)} />;
}
