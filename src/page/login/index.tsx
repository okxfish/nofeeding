import React, { useState, useEffect } from "react";
import { default as api } from "../../api";
import {
  TextField,
  PrimaryButton,
  DefaultButton,
  Separator,
  Spinner,
  SpinnerSize,
  Stack,
  Image,
  Label,
  Text,
} from "@fluentui/react";
import "./style.css";
import { useInoreaderToken } from "./../../utils/useInoreaderToken";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [isLoginWithInoreader, setIsLoginWithInoreader] =
    useState<boolean>(false);

  const history = useHistory();
  const inoreaderToken = useInoreaderToken();

  useEffect(() => {
    if (inoreaderToken) {
      setIsLoginWithInoreader(false);
      history.push("/");
    }
  }, [inoreaderToken, history]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
  };

  const loginWithInoreader = async (e) => {
    e.preventDefault();
    try {
      const res = await api.auth.getInoreaderAuthURI();
      setIsLoginWithInoreader(true);
      window.open(res.data.data.auth_uri);
    } catch (error) {
      alert(`login with inoreader: ${error}`);
    }
  };

  return (
    <div className="login-page w-screen h-screen pt-12">
      <Stack
        horizontal
        className="w-192 mx-auto rounded-lg shadow-xl border-3 overflow-hidden"
      >
        <Stack.Item
          grow={1}
          className="flex justify-center items-center bg-gray-200"
        >
          {isLoginWithInoreader ? (
            <Spinner
              label="log in ···"
              size={SpinnerSize.large}
              styles={{ circle: "w-16 h-16 border-8", label: "text-2xl" }}
            />
          ) : (
            <span className="text-8xl">📰</span>
          )}
        </Stack.Item>
        <Stack.Item grow={1} className="bg-white">
          <form className="p-8 pt-10 h-128" onSubmit={handleOnSubmit}>
            <Label className="text-center">Welcome To Fread</Label>
            <TextField
              className="mb-2"
              label="Account"
              name="account"
              type="email"
              required
              placeholder="your emaill here"
            />
            <TextField
              className="mb-4"
              label="Password"
              name="password"
              type="password"
              required
              placeholder="you password here"
            />
            <PrimaryButton className="block w-full mt-6" type="submit">
              log in
            </PrimaryButton>
            <Separator className="mt-8 mb-4" alignContent="center" />
            <DefaultButton className="w-full" onClick={loginWithInoreader}>
              login with inoreader
            </DefaultButton>
          </form>
        </Stack.Item>
      </Stack>
      <div className="max-w-2xl mx-auto mt-8 px-4"></div>
    </div>
  );
};

export default Login;
