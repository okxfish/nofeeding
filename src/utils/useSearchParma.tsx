import { useState, useEffect } from "react";

const getValue = (search: string, param: string) =>
  new URLSearchParams(search).get(param);

export type UseQueryParam = (
  param: string,
  customLocation?: { search: string }
) => string | null;

export const useSearchParam: UseQueryParam = (param, customLocation) => {
  const location = customLocation || window.location;
  const [value, setValue] = useState<string | null>(() =>
    getValue(location.search, param)
  );

  useEffect(() => {
    const onChange = () => {
      setValue(getValue(location.search, param));
    };

    window.addEventListener("popstate", onChange);
    window.addEventListener("pushstate", onChange);
    window.addEventListener("replacestate", onChange);

    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("pushstate", onChange);
      window.removeEventListener("replacestate", onChange);
    };
  }, [location.search, param]);

  return value;
};
