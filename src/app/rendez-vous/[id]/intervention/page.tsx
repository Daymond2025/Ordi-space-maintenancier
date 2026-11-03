import { EcranSuiviIntervention } from "./EcranSuiviIntervention";

export default async function SuiviInterventionPage({ params }: PageProps<"/rendez-vous/[id]/intervention">) {
  const { id } = await params;

  return <EcranSuiviIntervention demandeSavId={Number(id)} />;
}
