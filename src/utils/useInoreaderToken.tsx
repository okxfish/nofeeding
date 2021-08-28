import { useState, useEffect } from "react";

export const useInoreaderToken = () => {
  const [inoreaderToken, setInoreaderToken] = useState<string>((): string => {
    return localStorage.getItem("inoreaderToken") || "9cb54225d90c42df30f97de246a90933d87277f7";
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (
        e.key === "inoreaderToken" &&
        typeof e.newValue === "string" &&
        e.newValue !== "" &&
        e.newValue !== "undefined"
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
