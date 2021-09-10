import { useContext } from "react";
import {
  CommandBar,
  IContextualMenuProps,
  ICommandBarItemProps,
  ICommandBarStyles,
  ICommandBarStyleProps,
  IStyleFunctionOrObject,
} from "@fluentui/react";
import { UserInfoContext } from "./../../context/userInfo";
import { useHistory } from "react-router-dom";
import { DispatchContext } from "../../context";
import { ModalKeys } from "../../reducer";

interface Props {
  className?: string;
  styles?: IStyleFunctionOrObject<ICommandBarStyleProps, ICommandBarStyles>;
}

const HomeCommandBar = ({ className, styles }: Props) => {
  const history = useHistory();
  const dispatch = useContext(DispatchContext);
  const userInfo = useContext(UserInfoContext);

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


  const commandItems: ICommandBarItemProps[] = [
    {
      key: "newFeed",
      text: "Add Subscript",
      iconOnly: true,
      iconProps: { iconName: "Add" },
      onClick: () =>
        dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.AddFeedModal }),
    },
    {
      key: "Contact",
      text: "Account",
      iconOnly: true,
      iconProps: { iconName: "Contact" },
      subMenuProps: profileMenuProps,
    },
    {
      key: "settings",
      iconOnly: true,
      text: "Settings",
      iconProps: { iconName: "Settings" },
      onClick: () => history.push("/settings"),
    },
  ];

  const overflowItems: ICommandBarItemProps[] = [];

  return (
    <CommandBar
      className={className}
      items={commandItems}
      overflowItems={overflowItems}
      styles={styles}
    />
  );
};

export default HomeCommandBar;
