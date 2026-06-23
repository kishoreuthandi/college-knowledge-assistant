import { useEffect, useState } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem("cka_theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("cka_theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark];
}
