import React from "react";
import { TextField } from "office-ui-fabric-react";
import { NavLink, Route, Switch } from "react-router-dom";

const Setting = ({ location }) => {
  const getErrorMessage = (value: string): string => {
    return /a.*/.test(value) ? "not allowed a" : "";
  };

  const navBtnsProp = [
    {
      textContent: 'other',
      subPath: 'other',
    },
    {
      textContent: 'Profile',
      subPath: 'profile',
    },
    {
      textContent: 'account',
      subPath: 'account',
    },
  ]

  const navBtnsRender = (navBtnsProp: any[]): React.ReactElement | null => {
    navBtnsProp.map(
      ({
        textContent,
        subPath,
      }: {
        to: string;
        textContent: string;
        subPath: string;
      }): React.ReactElement | null => {
        return (
          <NavLink className="h-12 block" to={`/setting/${subPath}`}>
            {textContent}
          </NavLink>
        );
      }
    );
    return null;
  };

  return (
    <>
      <div className="col-start-2 row-span-3 divide-y divide-gray-200">
        {navBtnsRender(navBtnsProp)}
      </div>
      <div className="col-start-3 col-span-2 row-span-3 bg-gray-200">
        <Switch>
          <Route
            path="/setting/general"
            component={() => {
              return null;
            }}
          />
          <Route
            path="/setting/profile"
            component={() => {
              return null;
            }}
          />
          <Route
            path="/setting/account"
            component={() => {
              return null;
            }}
          />
          <Route
            path="/setting/other"
            component={() => {
              return null;
            }}
          />
        </Switch>
      </div>
    </>
  );
};

export default Setting;
