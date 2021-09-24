import { mergeStyleSets } from "@fluentui/merge-styles";
import { FontIcon, Stack, Text } from "@fluentui/react";
import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ArticleContext } from "../../../context";
import { RootState } from "../../../model";
import { useThemeStyles } from "../../../theme";
import { FeedItem } from "../types";
import { Parser as HtmlToReactParser } from "html-to-react";
import useIntersectionObserver from "../../../utils/useIntersectionObserver";
import { useTranslation } from "react-i18next";

export interface Props {
    onHeaderTitleVisibleChange(value: boolean): void;
    observerRoot: any;
}

const ArticleContent = ({ onHeaderTitleVisibleChange, observerRoot }: Props) => {
    const scrollParentRef = useRef<any>(null);
    const htmlToReactParserRef = useRef(new HtmlToReactParser());
    const [contentJSX, setContentJSX] = useState<JSX.Element | null>(null);
    const article: FeedItem | null = useContext(ArticleContext);
    const { articleText } = useThemeStyles();
    const { t } = useTranslation(["translation", "articleAction"]);

    const fontSize = useSelector<RootState, any>(
        (state) => state.userInterface.readingPreference.fontSize
    );
    const fontFamily = useSelector<RootState, any>(
        (state) => state.userInterface.readingPreference.fontFamily
    );
    const lineSpace = useSelector<RootState, any>(
        (state) => state.userInterface.readingPreference.lineSpace
    );
    const [titleThreshold, setTitleThreshold] = useState<number>(0);
    const mainTitleElemRef = useRef<any>(null);
    const mainTitleObserverEntry = useIntersectionObserver(mainTitleElemRef, {
        root: observerRoot,
        threshold: titleThreshold,
    }); // 观察主标题是否可见

    const articlePaneClassNames = mergeStyleSets({
        body: [
            {
                fontSize: fontSize,
                lineHeight: lineSpace,
            },
        ],
    });

    useEffect(() => {
        onHeaderTitleVisibleChange(
            !!(
                mainTitleObserverEntry &&
                !mainTitleObserverEntry?.isIntersecting
            )
        );
    }, [mainTitleObserverEntry?.isIntersecting]);

    useEffect(() => {
        if (article !== null) {
            setTitleThreshold(titleThreshold === 0 ? 1 : 0);
        }
    }, [article]);

    useEffect(() => {
        if (article !== null) {
            scrollParentRef.current.scrollTop = 0;
            const htmlContent = article.content;
            const parse = htmlToReactParserRef.current.parse;
            setContentJSX(parse(htmlContent));
        }
    }, [article]);

    if (article === null) {
        return (
            <Stack className="text-center p-24 ">
                <FontIcon iconName="ReadingMode" className="text-7xl mb-4" />
                <Text className="font-semibold text-xl">
                    {t("no article here")}
                </Text>
            </Stack>
        );
    }

    return (
        <div
            className="scrollbar-none overflow-y-scroll flex-1 px-4 sm:px-12 pb-64"
            ref={scrollParentRef}
        >
            <article
                className={`max-w-3xl w-full mx-auto py-4 ${articleText}`}
                style={{
                    fontFamily: fontFamily,
                }}
            >
                <header className="mb-4">
                    <h2 className="mb-4" ref={mainTitleElemRef}>
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
                            {article?.publishedTime.format("YYYY-M-D H:m")}
                        </Text>
                    </div>
                </header>
                <div
                    className={classNames(
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

export default ArticleContent;
