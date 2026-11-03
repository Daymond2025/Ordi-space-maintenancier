import { EcranTerminerIntervention } from "./EcranTerminerIntervention";

export default async function TerminerInterventionPage({ params }: PageProps<"/rendez-vous/[id]/terminer">) {
  const { id } = await params;

  return <EcranTerminerIntervention demandeSavId={Number(id)} />;
}
