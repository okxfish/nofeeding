import React, { useContext } from "react";
import {
    CommandBar,
    Icon,
    IconButton,
    INavLink,
    INavLinkGroup,
    IRenderFunction,
    Nav,
    Stack,
    Text,
} from "@fluentui/react";
import classnames from "classnames";
import { useThemeStyles } from "../../theme";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import FeedManage from "./components/feedManage";
import Account from "./components/account";
import About from "./components/about";
import General from "./components/general";
import UserInterface from "./components/UserInterface";
import ReadingPreference from "./components/ReadingPreference";
import { useTranslation } from "react-i18next";

const Settings = () => {
    const { contentLayer } = useThemeStyles();
    const { t } = useTranslation("settings");
    const history = useHistory();
    const location = useLocation();
    const navLinkGroups: INavLinkGroup[] = [
        {
            name: "Pages",
            links: [
                {
                    name: t("general"),
                    url: "/settings/general",
                    key: "key1",
                    iconName: "Settings",
                },
                {
                    name: t("account"),
                    url: "/settings/account",
                    key: "key2",
                    iconName: "Contact",
                },
                {
                    name: t("subscription"),
                    url: "/settings/feed-manage",
                    key: "key3",
                    iconName: "Library",
                },
                {
                    name: t("reading preference"),
                    url: "/settings/reading-preference",
                    key: "key4",
                    iconName: "ReadingMode",
                },
                {
                    name: t("user interface"),
                    url: "/settings/user-interface",
                    key: "key5",
                    iconName: "Color",
                },
                {
                    name: t("about"),
                    url: "/settings/about",
                    key: "key6",
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
                <Icon iconName="ChevronRight" className="ml-2 w-6 sm:hidden" />
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
            <div
                className={classnames(
                    "px-2 sm:w-nav-pane flex-col flex-shrink-0",
                    {
                        "hidden sm:flex": location.pathname !== "/settings",
                        "flex-grow sm:flex-0 sm:flex-grow-0 sm:flex-shrink-0":
                            location.pathname === "/settings",
                    }
                )}
            >
                <Stack className="py-2 pl-2" horizontal verticalAlign="center">
                    <IconButton
                        className="sm:hidden mr-2"
                        iconProps={{ iconName: "Back" }}
                        onClick={history.goBack}
                    />
                    <Text className="text-xl font-semibold">
                        {t("settings")}
                    </Text>
                    <CommandBar items={[]} />
                </Stack>
                <Nav
                    groups={navLinkGroups}
                    styles={{ link: "px-2" }}
                    onRenderLink={onRenderLink}
                    onLinkClick={handleLinkClick}
                    onRenderGroupHeader={() => null}
                />
            </div>
            <Stack
                grow
                className={classnames("px-2", contentLayer, {
                    "hidden sm:flex": location.pathname === "/settings",
                })}
            >
                <Switch>
                    <Route
                        path="/settings/feed-manage"
                        component={FeedManage}
                    />
                    <Route path="/settings/account" component={Account} />
                    <Route path="/settings/about" component={About} />
                    <Route path="/settings/general" component={General} />
                    <Route
                        path="/settings/user-interface"
                        component={UserInterface}
                    />
                    <Route
                        path="/settings/reading-preference"
                        component={ReadingPreference}
                    />
                </Switch>
            </Stack>
        </>
    );
};

export default Settings;
