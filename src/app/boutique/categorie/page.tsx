import { Suspense } from "react";
import { EcranFiltres } from "./EcranFiltres";

export default function CategorieBoutiquePage() {
  // useSearchParams() (état des filtres dans l'URL) impose une frontière Suspense.
  return (
    <Suspense fallback={null}>
      <EcranFiltres />
    </Suspense>
  );
}
