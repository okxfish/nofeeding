import React, { useContext } from "react";
import { getLayerClassNames } from "../../theme";
import {
  Icon,
  INavLink,
  INavLinkGroup,
  IRenderFunction,
  Nav,
  Stack,
  Text,
} from "@fluentui/react";
import classnames from "classnames";
import { SettingContext } from "../../context";
import { useHistory } from "react-router-dom";

const Settings = () => {
  const { isDarkMode } = useContext(SettingContext);
  const layerClassNames = getLayerClassNames(isDarkMode);
  const history = useHistory();
  const navLinkGroups: INavLinkGroup[] = [
    {
      name: "Pages",
      links: [
        {
          name: "General",
          url: "/settings/general",
          key: "key1",
          iconName: "Settings",
        },
        {
          name: "Account",
          url: "/settings/account",
          key: "key2",
          iconName: "Contact",
        },
        {
          name: "Reading preference",
          url: "/settings/reading-preference",
          key: "key3",
          iconName: "ReadingMode",
        },
        {
          name: "User Interface",
          url: "/settings/user-interface",
          key: "key4",
          iconName: "Color",
        },
        {
          name: "About",
          url: "/settings/about",
          key: "key5",
          iconName: "Info",
        },
      ],
    },
  ];

  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    return (
      <Stack horizontal verticalAlign="center" className="w-full">
        <Icon iconName={props?.iconName} className="mr-2 w-6" />
        <Text block nowrap className="flex-1 text-left">
          {props?.name}
        </Text>
      </Stack>
    );
  };

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
    if (item) {
      history.push(item.url);
    }
  };

  return (
    <>
      <Stack disableShrink className={classnames("w-72 p-2", layerClassNames)}>
        <Nav
          groups={navLinkGroups}
          styles={{link: "px-2"}}
          onRenderLink={onRenderLink}
          onLinkClick={handleLinkClick}
          onRenderGroupHeader={() => null}
        />
      </Stack>
      <Stack grow className={classnames("", layerClassNames)}></Stack>
    </>
  );
};

export default Settings;
