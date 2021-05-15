import { useState, useEffect } from "react";

export const useInoreaderToken = () => {
  const [inoreaderToken, setInoreaderToken] = useState<string>((): string => {
    return localStorage.getItem("inoreaderToken") || "";
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (
        e.key === "inoreaderToken" &&
        typeof e.newValue === "string" &&
        e.newValue !== ""
      ) {
        setInoreaderToken(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return inoreaderToken;
};
