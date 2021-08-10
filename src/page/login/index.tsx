import React, { useState, useEffect, useContext } from "react";
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
  useTheme,
  mergeStyleSets,
} from "@fluentui/react";
import "./style.css";
import { useInoreaderToken } from "./../../utils/useInoreaderToken";
import { useHistory } from "react-router-dom";
import { SettingContext } from './../../context/setting';
import BookFilp from "./../../component/bookFilp/index";

const Login = () => {
  const { palette } = useTheme();
  const [isLoginWithInoreader, setIsLoginWithInoreader] =
  useState<boolean>(false);
  const { isDarkMode } = useContext(SettingContext);

  const history = useHistory();
  const inoreaderToken = useInoreaderToken();

  const classNames = mergeStyleSets({
    baseStack: [
      "w-full md:w-192 mx-auto rounded-lg shadow-xl border-3 overflow-hidden flex-col sm:flex-row h-full sm:h-auto",
      {
        backgroundColor: palette.neutralQuaternaryAlt
      }
    ],
    leftCol: ["relative z-10 group cursor-pointer px-4 sm:px-6"],
    rightCol: [
      "rounded-t-2xl sm:rounded-t-none shadow-md sm:shadow-none",
      {
        backgroundColor: palette.neutralLighter
      }
    ],
  });

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
    <div className="login-page w-screen h-screen sm:pt-32">
      <Stack horizontal className={classNames.baseStack}>
        <Stack.Item grow={1} className="flex flex-col">
          <div className="flex-1 flex justify-center items-center">
            {isLoginWithInoreader ? (
              <Spinner
                size={SpinnerSize.large}
                styles={{ circle: "w-16 h-16 border-4" }}
              />
            ) : (
              <Image
                className="login-page__butterfly-image w-32 transform translate-y-12 sm:w-48 md:w-72"
                src="/images/Z-but.webp"
              />
            )}
          </div>
          <Stack className="text-center mb-16">
            <Text className="">
              <a
                href="https://github.com/uwpdver/fread"
                target="_blank"
                rel="noreferrer"
              >
                Homepage
              </a>
            </Text>
            <Text className="text-sm">version: 1.0</Text>
          </Stack>
        </Stack.Item>
        <Stack.Item
          grow={1}
          className={classNames.rightCol}
        >
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
