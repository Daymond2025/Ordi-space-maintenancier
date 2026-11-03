import { Suspense } from "react";
import { EcranResultats } from "./EcranResultats";

export default function ResultatsBoutiquePage() {
  return (
    <Suspense fallback={null}>
      <EcranResultats />
    </Suspense>
  );
}
