import { useEffect, useRef, useState } from "react";

/**
 * Returnerer om appen er synlig nå, og en ref som forteller om den har vært
 * skjult siden sist den ble synlig.
 */
export function useVisibility() {
  const [visible, setVisible] = useState(true);
  const wasHiddenRef = useRef(false);

  useEffect(() => {
    const onVis = () => {
      const isVisible = document.visibilityState === "visible";
      if (!isVisible) wasHiddenRef.current = true;
      setVisible(isVisible);
    };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return { visible, wasHiddenRef };
}
