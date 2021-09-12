import { useContext } from "react";
import { Stack, useTheme } from "@fluentui/react";
import SideBarButton from "./sideBarButton";
import { useHistory } from "react-router-dom";
import {
  IContextualMenuProps,
} from "@fluentui/react";
import { UserInfoContext } from "../../context/userInfo";
import { DispatchContext } from "../../context";
import { useWindowSize } from "react-use";
import { ModalKeys } from "../../reducer";

export interface Props {
  className?: string
}

const NavBar = ({ className = '' }: Props) => {
  const history = useHistory();
  const userInfo = useContext(UserInfoContext);
  const dispatch = useContext(DispatchContext);
  const { width: windowWidth } = useWindowSize();
  const { palette } = useTheme();

  const handleLogoffMenuItemClick = (e, item): void => {
    localStorage.removeItem("inoreaderToken");
    history.replace("/login");
  };

  const profileMenuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    items: [
      {
        key: "userName",
        text: userInfo?.userName,
        iconProps: { iconName: "Contact" },
      },
      {
        key: "logoff",
        text: "logoff",
        iconProps: { iconName: "SignOut" },
        onClick: handleLogoffMenuItemClick,
      },
    ],
  };

  const handleToggleOverviewPane = () => {
    dispatch({ type: 'TOGGLE_OVERVIEW_PANE' })
  };

  return (
    <Stack
      horizontalAlign="stretch"
      className={`${className} py-2 px-1 space-y-2 flex-col justify-evenly`}
      style={{
        backgroundColor: palette.neutralLighter,
      }}
    >
      <SideBarButton
        className="hidden sm:block"
        iconProps={{ iconName: "GlobalNavButton" }}
        onClick={handleToggleOverviewPane}
      />
      <SideBarButton
        iconProps={{ iconName: "Home" }}
        onClick={() => history.push('/feed')}
      />
      {windowWidth > 640 ? <div className="sm:flex-1" /> : null}
      <SideBarButton
        className="hidden sm:block"
        iconProps={{ iconName: "Contact" }}
        menuProps={profileMenuProps}
      />
      <SideBarButton
        iconProps={{ iconName: "Settings" }}
        onClick={() => history.push('/settings')}
      />
    </Stack>
  );
};

export default NavBar;
