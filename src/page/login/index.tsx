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
  ImageFit,
} from "@fluentui/react";
import "./style.css";
import { useInoreaderToken } from "./../../utils/useInoreaderToken";
import { useHistory } from "react-router-dom";
import BookFilp from "./../../component/bookFilp/index";

const Login = () => {
  const { palette } = useTheme();
  const [isLoginWithInoreader, setIsLoginWithInoreader] =
    useState<boolean>(false);

  const history = useHistory();
  const [inoreaderToken, setInoreaderToken] = useInoreaderToken();

  const classNames = mergeStyleSets({
    baseStack: [
      "w-full sm:w-96 mx-auto rounded-lg shadow-xl border-3 overflow-hidden flex-col sm:flex-row h-full sm:h-128",
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

  const handleEnterMockMode = (e) => {
    e.preventDefault();
    localStorage.setItem('inoreaderToken', 'thisisamockuser')
    window.location.reload()
  }

  return (
    <Stack verticalAlign="center" className="login-page w-screen h-screen">
      <Stack horizontal className={classNames.baseStack}>
        <div className="flex-1 flex flex-col">
          <Text className="mx-auto text-xl tracking-widest font-semibold mt-20 sm:mt-8">
            <span>Fr</span>
            <span className="font-normal text-gray-400">
              <span>ee</span>
              <span> to </span>
              <span>r</span>
            </span>
            <span>ead</span>
          </Text>
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            className="flex-1 sm:h-72"
          >
            {isLoginWithInoreader ? (
              <Spinner
                size={SpinnerSize.large}
                styles={{ circle: "w-16 h-16 border-4" }}
              />
            ) : (
              <Image
                imageFit={ImageFit.contain}
                className="login-page__butterfly-image h-4/5"
                src="/images/Z-but.webp"
              />
            )}
          </Stack>
          <Stack className="text-center mb-24">
            <Stack tokens={{ childrenGap: 16 }} className="w-full mb-8 px-8">
              <PrimaryButton onClick={loginWithInoreader}>
                login with inoreader
              </PrimaryButton>
              <DefaultButton onClick={handleEnterMockMode}>
                enter mock mode
              </DefaultButton>
            </Stack>
            <Text className="text-sm">version: 1.0</Text>
          </Stack>
        </div>
        {/* <Stack.Item
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
           
          </form>
        </Stack.Item> */}
      </Stack>
    </Stack>
  );
};

export default Login;
