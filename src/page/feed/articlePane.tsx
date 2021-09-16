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
    ICommandBarItemProps,
} from "@fluentui/react";
import { Parser as HtmlToReactParser } from "html-to-react";
import { FeedItem } from "./types";
import { ArticleContext } from "../../context";
import classnames from "classnames";
import "./style.css";
import { useThemeStyles } from "../../theme";
import useIntersectionObserver from "../../utils/useIntersectionObserver";
import SideBarButton from "../home/sideBarButton";
import { CSSTransition } from "react-transition-group";

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
        const scrollParentRef = useRef<any>(null);
        const htmlToReactParserRef = useRef(new HtmlToReactParser());
        const [contentJSX, setContentJSX] = useState<JSX.Element | null>(null);
        const rootNodeRef = useRef<any>(null);
        const { articleText } = useThemeStyles();
        const titleElemRef = useRef<any>(null);
        const [titleThreshold, setTitleThreshold] = useState<number>(0);
        const titleElemeEntry = useIntersectionObserver(titleElemRef, {threshold: titleThreshold});
        const isTitleVisible =
            titleElemeEntry && !titleElemeEntry?.isIntersecting;

        useImperativeHandle(ref, () => rootNodeRef.current);

        useEffect(() => {
            if (article !== null) {
                scrollParentRef.current.scrollTop = 0;
                setTitleThreshold(titleThreshold === 0 ? 1 : 0)
                const htmlContent = article.content;
                const parse = htmlToReactParserRef.current.parse;
                setContentJSX(parse(htmlContent));
            }
        }, [article]);

        const commandItems: ICommandBarItemProps[] = [
            {
                iconProps: {
                    iconName: article?.isRead ? "RadioBtnOff" : "RadioBtnOn",
                },
                iconOnly: true,
                key: "markThisAsRead",
                text: "mark this as read",
                ariaLabel: "Mark as read",
            },
            {
                iconProps: {
                    iconName: article?.isStar
                        ? "FavoriteStar"
                        : "FavoriteStarFill",
                },
                iconOnly: true,
                key: "star",
                text: "Star",
                ariaLabel: "Mark as Star",
            },
            {
                key: "Share",
                text: "Share",
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
                                    Publish at{" "}
                                    {article?.publishedTime.format(
                                        "YYYY-M-D H:m"
                                    )}
                                </Text>
                            </div>
                        </header>
                        <div className="article-body">{contentJSX}</div>
                        <footer></footer>
                    </article>
                </div>
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
                </div>
            </div>
        );
    }
);

export default ArticlePane;
