import {
    useRef,
    useState,
    useContext,
    forwardRef,
    useImperativeHandle,
    ReactElement,
} from "react";
import {
    IIconProps,
    Text,
    Stack,
    CommandBar,
    ContextualMenuItemType,
    Slider,
    ICommandBarItemProps,
    IContextualMenuProps,
    IconButton,
    ChoiceGroup,
    IChoiceGroupOption,
    IContextualMenuItem,
    Icon,
    Label,
    Separator,
} from "@fluentui/react";
import { FeedItem } from "../types";
import { ArticleContext } from "../../../context";
import classnames from "classnames";
import SideBarButton from "../../home/sideBarButton";
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../model";
import HelfScreenPanel from "../../../component/halfScreenPanel/halfScreenPanel";
import { useWindowSize } from "react-use";
import { LineSpace } from "../../../model/userInterface";
import MenuItem from "../../../component/menuItem";
import { useTranslation } from "react-i18next";
import ArticleContent from "./articleContent";

export interface Props {
    className?: string;
    closeModal?(): any;
    style?: {
        [prop: string]: string;
    };
}

const backIcon: IIconProps = { iconName: "ChevronLeft" };

const ArticlePaneInner = forwardRef(
    ({ className, style, closeModal }: Props, ref) => {
        const [isHeaderTitleVisible, setIsHeaderTitleVisible] =
            useState<boolean>(false);

        const [isReadSettingPaneOpen, setIsReadSettingPaneOpen] =
            useState<boolean>(false);

        const rootNodeRef = useRef<any>(null);

        const article: FeedItem | null = useContext(ArticleContext);

        const dispatch = useDispatch<Dispatch>();

        const { t } = useTranslation(["translation", "articleAction"]);
        const { width: windowWidth } = useWindowSize();

        const fontSize = useSelector<RootState, any>(
            (state) => state.userInterface.readingPreference.fontSize
        );
        const fontFamily = useSelector<RootState, any>(
            (state) => state.userInterface.readingPreference.fontFamily
        );
        const lineSpace = useSelector<RootState, any>(
            (state) => state.userInterface.readingPreference.lineSpace
        );

        useImperativeHandle(ref, () => rootNodeRef.current);

        const lineSpaceOptions: IChoiceGroupOption[] = [
            {
                key: LineSpace.tight,
                text: t("tight"),
                iconProps: { iconName: "AlignJustify" },
                styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
            },
            {
                key: LineSpace.normal,
                text: t("normal"),
                iconProps: { iconName: "CollapseMenu" },
                styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
            },
            {
                key: LineSpace.wide,
                text: t("wide"),
                iconProps: { iconName: "GlobalNavButton" },
                styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
            },
        ];

        const fontFamilyOptions: IChoiceGroupOption[] = [
            {
                key: "sans-serif",
                text: t("sans-serif"),
            },
            {
                key: "serif",
                text: t("serif"),
            },
        ];

        const handleChangeFontSize = (value: number) =>
            dispatch.userInterface.changeArticleFontSize(value);

        const handleChoiceLineSpace = (
            ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
            option?: IChoiceGroupOption
        ) => {
            option && dispatch.userInterface.changeLineSpace(option.key);
        };

        const handleFontFamilyChange = (
            ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
            option?: IChoiceGroupOption
        ) => {
            option &&
                dispatch.userInterface.changeArticleFontFamily(option.key);
        };

        const getLineSpaceMenuItemProps = (
            key: LineSpace,
            text?: string,
            iconName?: string
        ): IContextualMenuItem => ({
            key,
            onRenderContent: () => (
                <MenuItem
                    text={text}
                    iconName={iconName}
                    suffixRender={() => (
                        <Icon
                            iconName={
                                lineSpace === key ? "RadioBtnOn" : "RadioBtnOff"
                            }
                        />
                    )}
                />
            ),
            onClick: (): void => dispatch.userInterface.changeLineSpace(key),
        });

        const getFontFamilyMenuItemProps = (
            key: string,
            text?: string,
            iconName?: string
        ): IContextualMenuItem => ({
            key,
            onRenderContent: () => (
                <MenuItem
                    text={text}
                    iconName={iconName}
                    suffixRender={() => (
                        <Icon
                            iconName={
                                fontFamily === key
                                    ? "RadioBtnOn"
                                    : "RadioBtnOff"
                            }
                        />
                    )}
                />
            ),
            onClick: (): void =>
                dispatch.userInterface.changeArticleFontFamily(key),
        });

        const getReadingPreferenceMenuProps = ():
            | IContextualMenuProps
            | undefined => {
            if (windowWidth <= 640) return;
            return {
                alignTargetEdge: true,
                items: [
                    {
                        key: "fontSizeHeader",
                        itemType: ContextualMenuItemType.Header,
                        text: t("font size"),
                    },
                    {
                        key: "fontSizeSlider",
                        onRenderContent: () => {
                            return (
                                <Slider
                                    className="flex-1"
                                    value={fontSize}
                                    min={12}
                                    max={24}
                                    onChange={handleChangeFontSize}
                                />
                            );
                        },
                    },
                    {
                        key: "lineSpaceHeader",
                        itemType: ContextualMenuItemType.Header,
                        text: t("line space"),
                    },
                    getLineSpaceMenuItemProps(
                        LineSpace.tight,
                        t("tight"),
                        "AlignJustify"
                    ),
                    getLineSpaceMenuItemProps(
                        LineSpace.normal,
                        t("normal"),
                        "CollapseMenu"
                    ),
                    getLineSpaceMenuItemProps(
                        LineSpace.wide,
                        t("wide"),
                        "GlobalNavButton"
                    ),
                    {
                        key: "fontFamilyHeader",
                        itemType: ContextualMenuItemType.Header,
                        text: t("font family"),
                    },
                    getFontFamilyMenuItemProps("sans-serif", t("sans-serif")),
                    getFontFamilyMenuItemProps("serif", t("serif")),
                ],
            };
        };

        const commandItems: ICommandBarItemProps[] = [
            {
                key: "articleSetting",
                text: t("article setting"),
                iconProps: {
                    iconName: "Font",
                },
                iconOnly: true,
                subMenuProps: getReadingPreferenceMenuProps(),
                onClick: () => {
                    if (windowWidth <= 640) {
                        setIsReadSettingPaneOpen(true);
                    }
                },
            },
            {
                key: "markThisAsRead",
                text: t("articleAction:read"),
                iconProps: {
                    iconName: article?.isRead ? "RadioBtnOff" : "RadioBtnOn",
                },
                iconOnly: true,
            },
            {
                key: "star",
                text: t("articleAction:star"),
                iconProps: {
                    iconName: article?.isStar
                        ? "FavoriteStar"
                        : "FavoriteStarFill",
                },
                iconOnly: true,
            },
            {
                key: "Share",
                text: t("articleAction:share"),
                iconOnly: true,
                iconProps: { iconName: "Share" },
                onClick: () => {
                    if (window.navigator.share) {
                        window.navigator
                            .share({
                                title: article?.title,
                                url: article?.url,
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                },
            },
        ];

        const overflowItems: ICommandBarItemProps[] = [];

        const headerRender = (): ReactElement | null => {
            return (
                <Stack
                    className="px-2 sm:px-12 py-2"
                    horizontal
                    verticalAlign="center"
                >
                    <SideBarButton
                        className="block lg:hidden"
                        iconProps={backIcon}
                        onClick={closeModal}
                    />
                    <div className="overflow-y-hidden flex-1">
                        <CSSTransition
                            in={isHeaderTitleVisible}
                            timeout={{
                                exit: 340,
                            }}
                            unmountOnExit
                            className="article-header__tilte font-semibold text-xl"
                        >
                            <Text block nowrap>
                                {article?.title}
                            </Text>
                        </CSSTransition>
                    </div>
                    <CommandBar
                        className="flex justify-end"
                        styles={{ root: "p-0" }}
                        items={commandItems}
                        overflowItems={overflowItems}
                    />
                </Stack>
            );
        };

        const readSettingPaneRender = () => {
            return (
                <HelfScreenPanel
                    isOpen={isReadSettingPaneOpen}
                    isLightDismiss
                    hasCloseButton={false}
                    onDismiss={() => setIsReadSettingPaneOpen(false)}
                    onLightDismissClick={() => setIsReadSettingPaneOpen(false)}
                >
                    <Stack className="w-full">
                        <Label>{t("font size")}</Label>
                        <Stack horizontal className="flex-1">
                            <IconButton
                                iconProps={{ iconName: "FontDecrease" }}
                                onClick={() =>
                                    dispatch.userInterface.changeArticleFontSize(
                                        Math.max(12, fontSize - 1)
                                    )
                                }
                            />
                            <Slider
                                className="flex-1"
                                value={fontSize}
                                min={12}
                                max={24}
                                onChange={handleChangeFontSize}
                            />
                            <IconButton
                                iconProps={{ iconName: "FontIncrease" }}
                                onClick={() =>
                                    dispatch.userInterface.changeArticleFontSize(
                                        Math.min(24, fontSize + 1)
                                    )
                                }
                            />
                        </Stack>
                        <Separator />
                        <Label>{t("line space")}</Label>
                        <Stack horizontal className="flex-1">
                            <ChoiceGroup
                                options={lineSpaceOptions}
                                selectedKey={lineSpace}
                                onChange={handleChoiceLineSpace}
                                styles={{
                                    root: "w-full",
                                    flexContainer: "flex-nowrap",
                                }}
                            />
                        </Stack>
                        <Separator />
                        <Label>{t("font family")}</Label>
                        <Stack horizontal className="flex-1">
                            <ChoiceGroup
                                options={fontFamilyOptions}
                                selectedKey={fontFamily}
                                onChange={handleFontFamilyChange}
                                styles={{
                                    root: "w-full",
                                    flexContainer: "flex-nowrap",
                                }}
                            />
                        </Stack>
                    </Stack>
                </HelfScreenPanel>
            );
        };

        return (
            <div
                className={classnames(className)}
                style={style}
                ref={rootNodeRef}
            >
                <div className="flex flex-col h-full overflow-y-hidden">
                    {headerRender()}
                    <ArticleContent
                        onHeaderTitleVisibleChange={(value) =>
                            setIsHeaderTitleVisible(value)
                        }
                        observerRoot={rootNodeRef.current}
                    />
                    {readSettingPaneRender()}
                </div>
            </div>
        );
    }
);

export default ArticlePaneInner;
