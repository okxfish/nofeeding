import { useContext } from "react";
import { Stack, useTheme } from "@fluentui/react";
import SideBarButton from "./sideBarButton";
import { useHistory } from "react-router-dom";
import {
  IContextualMenuProps,
} from "@fluentui/react";
import { UserInfoContext } from "../../context/userInfo";

export interface Props {
  className?: string
}

const NavBar = ({className=''}:Props) => {
  const history = useHistory();
  const userInfo = useContext(UserInfoContext);
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

  const handleBackBtnClick = () => {
    history.goBack();
  };

  return (
    <Stack
      horizontalAlign="stretch"
      className={`${className} py-2 px-1 sm:space-y-2 flex-row sm:flex-col order-last sm:order-first justify-between`}
      style={{
        backgroundColor: palette.neutralLighter,
      }}
    >
        <SideBarButton
          iconProps={{ iconName: "Back" }}
          onClick={handleBackBtnClick}
        />
        <SideBarButton
          iconProps={{ iconName: "Home" }}
          onClick={()=>history.push('/feed')}
        />
        <div className="sm:flex-1"/>
        <SideBarButton
          iconProps={{ iconName: "Contact" }}
          menuProps={profileMenuProps}
        />
        <SideBarButton
          iconProps={{ iconName: "Settings" }}
          onClick={()=>history.push('/settings/general')}
        />
    </Stack>
  );
};

export default NavBar;
