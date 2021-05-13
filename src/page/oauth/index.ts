import { useEffect } from "react";
import { useSearchParam } from "../../utils/useSearchParma";
import { default as api } from "../../api";

const Oauth = () => {
  const code = useSearchParam("code") || '';
  useEffect(() => {
    const getAutoToken = async () => {
      const {
        data: { token }
      } = await api.auth.getInoreaderAccessToken(code);
      localStorage.setItem("inoreaderToken", token);
      window.close();
    };
    getAutoToken();
  }, [code]);

  return null;
};

export default Oauth;
