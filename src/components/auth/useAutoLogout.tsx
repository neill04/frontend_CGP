import { useEffect, useRef, useState } from "react";

export function useAutoLogout(timeoutMinutes: number) {
  const [secondsLeft, setSecondsLeft] = useState(timeoutMinutes * 60);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      setSecondsLeft(timeoutMinutes * 60);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        console.log("Tiempo agotado. Cerrando sesión...");
        window.location.href = "/"; 
      }, timeoutMinutes * 60 * 1000);
    };

    // Intervalo para imprimir cada segundo
    const countdownInterval = setInterval(() => {
      setSecondsLeft(prev => {
        const next = prev > 0 ? prev - 1 : 0;
        console.log(`Tiempo restante: ${Math.floor(next/60)}:${(next%60).toString().padStart(2,"0")}`);
        return next;
      });
    }, 1000);

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(countdownInterval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [timeoutMinutes]);
}