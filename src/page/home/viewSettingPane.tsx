import React from "react";
import {
    ChoiceGroup,
    IChoiceGroupOption,
    Toggle,
    Stack,
    Separator,
    Label,
    Icon,
    IconButton,
    useTheme,
} from "@fluentui/react";
import { Dispatch, RootState } from "../../model";
import { useSelector, useDispatch } from "react-redux";
import {
    ViewType,
    FeedThumbnailDisplayType,
    FeedView,
} from "../../model/userInterface";
import { useTranslation } from "react-i18next";

const ViewSettingPane = () => {
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const feedView = useSelector<RootState, any>(
        (state) => state.userInterface.feedView
    );
    const unreadOnly = useSelector<RootState, any>(
        (state) => state.feed.unreadOnly
    );
    const feedThumbnailDisplayType = useSelector<RootState, any>(
        (state) => state.userInterface.feedThumbnailDisplayType
    );

    const { palette } = useTheme();
    const { t } = useTranslation(["translation", "viewSettings"]);

    const dispatch = useDispatch<Dispatch>();

    const feedThumbnaillOptions: IChoiceGroupOption[] = [
        {
            key: FeedThumbnailDisplayType.alwaysDisplay,
            text: t("always"),
            iconProps: { iconName: "Photo2" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedThumbnailDisplayType.alwaysNotDisplay,
            text: t("never"),
            iconProps: { iconName: "Photo2Remove" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedThumbnailDisplayType.displayWhenThumbnaillExist,
            text: t("auto"),
            iconProps: { iconName: "PictureStretch" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
    ];

    const feedViewOptions: IChoiceGroupOption[] = [
        {
            key: FeedView.LeftCover,
            text: t("viewSettings:cover in left"),
            iconProps: { iconName: "ThumbnailView" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedView.RightCover,
            text: t("viewSettings:cover in right"),
            iconProps: { iconName: "ThumbnailViewMirrored" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedView.SocialMedia,
            text: t("viewSettings:social media"),
            iconProps: { iconName: "ButtonControl" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
    ];

    const onIsUreadOnlyChange = () => dispatch.feed.toggleIsUnreadOnly();

    const onfeedThumbnaillDisplayTypeChange = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IChoiceGroupOption
    ) => {
        option && dispatch.userInterface.changeThumbnailDisplayType(option.key);
    };

    const onfeedViewChange = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IChoiceGroupOption
    ) => {
        option && dispatch.userInterface.changeFeedView(option.key);
    };

    const headerRender = (text: string) => {
        return <Label className="mb-2">{t(text)}</Label>;
    };

    const separatorElem = (
        <Separator
            styles={{
                root: {
                    selectors: {
                        "&::before": {
                            backgroundColor: palette.neutralQuaternary,
                        },
                    },
                },
            }}
        />
    );

    return (
        <div>
            {headerRender("theme")}
            <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: "16" }}
            >
                <IconButton
                    iconProps={{ iconName: "ClearNight" }}
                    styles={{
                        root: [
                            "w-10 h-10 rounded-full border text-sm",
                            {
                                border: "1px solid currentColor",
                            },
                        ],
                    }}
                    onClick={() => dispatch.userInterface.changeToDarkTheme()}
                />
                <IconButton
                    iconProps={{ iconName: "Sunny" }}
                    styles={{
                        root: [
                            "w-10 h-10 rounded-full border text-sm",
                            {
                                border: "1px solid currentColor",
                            },
                        ],
                    }}
                    onClick={() => dispatch.userInterface.changeToLightTheme()}
                />
            </Stack>
            <Separator />
            {headerRender("filter")}
            <Toggle
                label={
                    <>
                        <Icon iconName="InboxCheck" className="mr-2" />
                        {t("unread only")}
                    </>
                }
                inlineLabel
                styles={{ label: "flex-1 order-none m-0" }}
                onChange={onIsUreadOnlyChange}
                checked={unreadOnly}
            />
            <Separator />
            {viewType !== ViewType.list && (
                <>
                    {headerRender("viewSettings:thumbnail display")}
                    <ChoiceGroup
                        selectedKey={feedThumbnailDisplayType}
                        options={feedThumbnaillOptions}
                        onChange={onfeedThumbnaillDisplayTypeChange}
                        styles={{ flexContainer: "flex-nowrap" }}
                    />
                    <Separator />
                    {headerRender("viewSettings:feeditem style")}
                    <ChoiceGroup
                        selectedKey={feedView}
                        options={feedViewOptions}
                        onChange={onfeedViewChange}
                        styles={{ flexContainer: "flex-nowrap" }}
                    />
                </>
            )}
        </div>
    );
};

export default ViewSettingPane;
