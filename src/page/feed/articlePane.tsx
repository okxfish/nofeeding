import {
    useEffect,
    useRef,
    useState,
    useContext,
    forwardRef,
    useImperativeHandle,
    ReactElement,
} from "react";
import {
    IIconProps,
    FontIcon,
    Text,
    Stack,
    CommandBar,
    ContextualMenuItemType,
    Slider,
    ICommandBarItemProps,
    mergeStyleSets,
    IContextualMenuProps,
    IconButton,
    ChoiceGroup,
    IChoiceGroupOption,
    IContextualMenuItem,
    Icon,
    Label,
    Separator,
} from "@fluentui/react";
import { Parser as HtmlToReactParser } from "html-to-react";
import { FeedItem } from "./types";
import { ArticleContext } from "../../context";
import classnames from "classnames";
import { useThemeStyles } from "../../theme";
import useIntersectionObserver from "../../utils/useIntersectionObserver";
import SideBarButton from "../home/sideBarButton";
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../model";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";
import { useWindowSize } from "react-use";
import { LineSpace } from "../../model/userInterface";
import "./style.css";
import MenuItem from "../../component/menuItem";
import { useTranslation } from "react-i18next";

export interface Props {
    className?: string;
    closeModal?(): any;
    style?: {
        [prop: string]: string;
    };
}

const backIcon: IIconProps = { iconName: "ChevronLeft" };

const ArticlePane = forwardRef(
    ({ className, style, closeModal }: Props, ref) => {
        const article: FeedItem | null = useContext(ArticleContext);
        const { t } = useTranslation(["translation", "articleAction"]);
        const scrollParentRef = useRef<any>(null);
        const { width: windowWidth } = useWindowSize();
        const htmlToReactParserRef = useRef(new HtmlToReactParser());
        const [contentJSX, setContentJSX] = useState<JSX.Element | null>(null);
        const [isReadSettingPaneOpen, setIsReadSettingPaneOpen] =
            useState<boolean>(false);
        const rootNodeRef = useRef<any>(null);
        const { articleText } = useThemeStyles();
        const titleElemRef = useRef<any>(null);
        const [titleThreshold, setTitleThreshold] = useState<number>(0);
        const titleElemeEntry = useIntersectionObserver(titleElemRef, {
            threshold: titleThreshold,
        });

        const fontSize = useSelector<RootState, any>(
            (state) => state.userInterface.readingPreference.fontSize
        );

        const lineSpace = useSelector<RootState, any>(
            (state) => state.userInterface.readingPreference.lineSpace
        );

        const dispatch = useDispatch<Dispatch>();

        const isTitleVisible =
            titleElemeEntry && !titleElemeEntry?.isIntersecting;

        useImperativeHandle(ref, () => rootNodeRef.current);

        useEffect(() => {
            if (article !== null) {
                scrollParentRef.current.scrollTop = 0;
                setTitleThreshold(titleThreshold === 0 ? 1 : 0);
                const htmlContent = article.content;
                const parse = htmlToReactParserRef.current.parse;
                setContentJSX(parse(htmlContent));
            }
        }, [article]);

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

        const handleChangeFontSize = (value: number) =>
            dispatch.userInterface.changeArticleFontSize(value);

        const handleChoiceLineSpace = (
            ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
            option?: IChoiceGroupOption
        ) => {
            option && dispatch.userInterface.changeLineSpace(option.key);
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

        const articlePaneClassNames = mergeStyleSets({
            body: [
                {
                    fontSize: fontSize,
                    lineHeight: lineSpace,
                },
            ],
        });

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
                            in={isTitleVisible}
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

        const contentRender = () => {
            if (article === null) {
                return (
                    <Stack className="text-center p-24 ">
                        <FontIcon iconName="ReadingMode" className="text-7xl" />
                        <Text className="font-semibold text-xl">
                            No Article Here
                        </Text>
                    </Stack>
                );
            }

            return (
                <div
                    className="article-wrapper overflow-y-scroll sm:scrollbar flex-1 px-4 sm:px-12 pb-64"
                    ref={scrollParentRef}
                >
                    <article
                        className={`max-w-3xl w-full mx-auto py-4 ${articleText}`}
                    >
                        <header className="mb-4">
                            <h2 className="mb-4" ref={titleElemRef}>
                                <a
                                    className="no-underline"
                                    href={article?.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={article?.url}
                                >
                                    <Text className="font-bold text-3xl break-words leading-7 tracking-wider">
                                        {article?.title}
                                    </Text>
                                </a>
                            </h2>
                            <div className="text-sm font-normal flex align-middle flex-wrap">
                                <Text block nowrap>
                                    {article?.sourceName}
                                </Text>
                                <Text className="mx-2">|</Text>
                                <Text block nowrap>
                                    {`${t("publish at")} `}
                                    {article?.publishedTime.format(
                                        "YYYY-M-D H:m"
                                    )}
                                </Text>
                            </div>
                        </header>
                        <div
                            className={classnames(
                                "article-body",
                                articlePaneClassNames.body
                            )}
                        >
                            {contentJSX}
                        </div>
                        <footer></footer>
                    </article>
                </div>
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
                        <Label>{t('line space')}</Label>
                        <Stack horizontal className="flex-1">
                            <ChoiceGroup
                                options={lineSpaceOptions}
                                selectedKey={lineSpace}
                                onChange={handleChoiceLineSpace}
                                styles={{ flexContainer: "flex-nowrap" }}
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
                    {contentRender()}
                    {readSettingPaneRender()}
                </div>
            </div>
        );
    }
);

export default ArticlePane;
