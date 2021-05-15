import { useEffect } from "react";
import { useSearchParam } from "../../utils/useSearchParma";
import { default as api } from "../../api";

const Oauth = () => {
  const code = useSearchParam("code") || "";

  useEffect(() => {
    const getAutoToken = async () => {
      const {
        data: {
          data: { token },
        },
      } = await api.auth.getInoreaderAccessToken(code);
      console.log(code, token);
      localStorage.setItem("inoreaderToken", token);
      window.close();
    };
    getAutoToken();
  }, [code]);

  return null;
};

export default Oauth;
