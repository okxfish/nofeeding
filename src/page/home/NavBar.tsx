import { Stack, useTheme } from "@fluentui/react";
import SideBarButton from "./sideBarButton";
import { useHistory } from "react-router-dom";
import { IContextualMenuProps } from "@fluentui/react";
import { useWindowSize } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../model";
import { useTranslation } from "react-i18next";

export interface Props {
    className?: string;
}

const NavBar = ({ className = "" }: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const userInfo = useSelector<RootState, any>((state) => state.userInfo);
    const dispatch = useDispatch<Dispatch>();
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
                text: t('log off'),
                iconProps: { iconName: "SignOut" },
                onClick: handleLogoffMenuItemClick,
            },
        ],
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
                onClick={() => dispatch.app.toggleOverviewPane()}
            />
            <SideBarButton
                iconProps={{ iconName: "Home" }}
                onClick={() => history.push("/feed")}
            />
            {windowWidth > 640 ? <div className="sm:flex-1" /> : null}
            <SideBarButton
                className="hidden sm:block"
                iconProps={{ iconName: "Contact" }}
                menuProps={profileMenuProps}
            />
            <SideBarButton
                iconProps={{ iconName: "Settings" }}
                onClick={() => history.push("/settings")}
            />
        </Stack>
    );
};

export default NavBar;
