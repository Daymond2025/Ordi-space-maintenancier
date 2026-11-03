import { EcranProfilClient } from "./EcranProfilClient";

export default async function ProfilClientPage({ params }: PageProps<"/clients/[cle]">) {
  const { cle } = await params;

  return <EcranProfilClient cle={cle} />;
}
