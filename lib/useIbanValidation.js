// lib/useIbanValidation.js
import { useEffect, useRef, useState } from "react";

export function useIbanValidation(iban) {
  const [status, setStatus] = useState("idle"); // idle | checking | valid | invalid
  const [bankData, setBankData] = useState(null);
  const debounceRef = useRef(null);
  const ibanRef = useRef("");

  useEffect(() => {
    const cleaned = (iban || "").replace(/\s/g, "").toUpperCase();
    ibanRef.current = cleaned;

    if (!cleaned || cleaned.length < 15) {
      // On ne touche pas au state pour les IBAN trop courts
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setStatus("checking");
        setBankData(null);

        const current = ibanRef.current;
        if (!current || current.length < 15) return;

        const res = await fetch(`/api/validate-iban?iban=${current}`);
        const data = await res.json();

        setStatus(data.valid ? "valid" : "invalid");
        setBankData(data.bankData || null);
      } catch (e) {
        console.error(e);
        setStatus("invalid");
        setBankData(null);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [iban]);

  return { status, bankData };
}
