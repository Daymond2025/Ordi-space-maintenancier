import { EcranDiagnostic } from "./EcranDiagnostic";

export default async function DiagnosticPage({ params }: PageProps<"/rendez-vous/[id]/diagnostic">) {
  const { id } = await params;

  return <EcranDiagnostic demandeSavId={Number(id)} />;
}
