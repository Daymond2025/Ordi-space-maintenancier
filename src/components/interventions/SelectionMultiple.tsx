"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";

/** Liste déroulante à choix multiples — problèmes identifiés (diagnostic), pièces remplacées (fin d'intervention). */
export function SelectionMultiple({
  options,
  valeurs,
  onChange,
  placeholder,
}: {
  options: string[];
  valeurs: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        className="flex h-[36px] w-full items-center justify-between gap-2 rounded-[6px] border border-[#E3E6EB] bg-white px-4 text-left text-[11px] text-[#2B2B2B]"
      >
        <span className="truncate">{valeurs.length > 0 ? valeurs.join(", ") : placeholder}</span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 transition-transform ${ouvert ? "rotate-180" : ""}`} />
      </button>

      {/* Toucher en dehors de la liste la referme. */}
      {ouvert ? <div className="fixed inset-0 z-10" onClick={() => setOuvert(false)} aria-hidden /> : null}

      {ouvert ? (
        <ul className="absolute inset-x-0 top-[40px] z-20 max-h-60 overflow-y-auto rounded-[8px] border border-[#E3E6EB] bg-white py-1 shadow-lg">
          {options.map((option) => {
            const coche = valeurs.includes(option);
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => onChange(coche ? valeurs.filter((v) => v !== option) : [...valeurs, option])}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] text-[#2B2B2B] hover:bg-[#F5F6F8]"
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${coche ? "border-[#0A6CFF] bg-[#0A6CFF] text-white" : "border-[#C9CED6]"}`}>
                    {coche ? <CheckIcon className="h-3 w-3" /> : null}
                  </span>
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
