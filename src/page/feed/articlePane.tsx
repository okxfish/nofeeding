import {
  useEffect,
  useRef,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IconButton, IIconProps, FontIcon, Text } from "@fluentui/react";
import { Parser as HtmlToReactParser } from "html-to-react";
import { FeedItem } from "./types";
import { ViewType } from "../../context/viewType";
import { ArticleContext } from "../../context/article";

import "./style.css";
import { SettingContext } from "../../context/setting";

export interface Props {
  className?: string;
  closeModal?(): any;
  style?: {
    [prop: string]: string;
  };
}

const backIcon: IIconProps = { iconName: "Back" };

const ArticlePane = forwardRef(
  ({ className, style, closeModal }: Props, ref) => {
    const article: FeedItem | null = useContext(ArticleContext);
    const {
      layout: { viewType },
    } = useContext(SettingContext);
    const htmlToReactParserRef = useRef(new HtmlToReactParser());
    const [contentJSX, setContentJSX] = useState<JSX.Element | null>(null);
    const rootNodeRef = useRef<any>(null);

    useImperativeHandle(ref, () => rootNodeRef.current);

    useEffect(() => {
      if (article !== null) {
        const htmlContent = article.content;
        const parse = htmlToReactParserRef.current.parse;
        setContentJSX(parse(htmlContent));
      }
    }, [article]);

    if (article === null) {
      return (
        <div className="text-center p-24 text-gray-300">
          <FontIcon iconName="ReadingMode" className="text-7xl" />
          <div className="font-semibold text-3xl">No Article Here</div>
        </div>
      );
    }

    const contentRender = () => {
      return (
        <div className="flex flex-col h-full overflow-y-hidden">
          {viewType !== ViewType.list && (
            <div className="flex items-center h-10 border-b mx-6">
              <IconButton
                className="block lg:hidden"
                iconProps={backIcon}
                onClick={closeModal}
              />
            </div>
          )}

          <div className="article-wrapper overflow-y-scroll scrollbar flex-1 px-4 sm:px-12">
            <article className="max-w-3xl w-full mx-auto py-4">
              <header className="mb-4">
                <h2 className="mb-4">
                  <a
                    className="no-underline"
                    href={article?.url}
                    target="_blank"
                    rel="noreferrer"
                    title={article?.url}
                  >
                    <Text className="font-bold text-2xl break-words leading-7">
                      {article?.title}
                    </Text>
                  </a>
                </h2>
                <div className="text-sm font-normal text-gray-400 flex align-middle">
                  <div className="mr-2">{article?.sourceName}</div>
                  <div className="mr-2">
                    Publish at {article?.publishedTime.format("YYYY-M-D H:m")}
                  </div>
                </div>
              </header>
              <div className="article-body">{contentJSX}</div>
              <footer></footer>
            </article>
          </div>
        </div>
      );
    };

    return (
      <div className={`${className}`} style={style} ref={rootNodeRef}>
        {contentRender()}
      </div>
    );
  }
);

export default ArticlePane;
