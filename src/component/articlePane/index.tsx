import {
  useEffect,
  useRef,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IconButton, IIconProps } from "office-ui-fabric-react";
import { Parser as HtmlToReactParser } from "html-to-react";
import { FeedItem } from "../../page/feed/types";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { ArticleContext } from "./../../context/article";

import "./style.css";

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
    const article:FeedItem = useContext(ArticleContext);
    const htmlToReactParserRef = useRef(new HtmlToReactParser());
    const { viewType } = useContext(ViewTypeContext);
    const [contentJSX, setContentJSX] = useState<JSX.Element | null>(null);
    const rootNodeRef = useRef<any>(null);

    useImperativeHandle(ref, () => rootNodeRef.current);

    const htmlContent = article?.content;
    useEffect(() => {
      const parse = htmlToReactParserRef.current.parse;
      setContentJSX(parse(htmlContent));
    }, [htmlContent]);

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

          <div className="article-wrapper overflow-y-scroll scrollbar flex-1 px-6">
            <article className="max-w-3xl w-full mx-auto py-4">
              <header className="mb-4">
                <h2 className="font-bold text-3xl break-words leading-10 mb-4">
                  <a href={article?.url} target="_blank" rel="noreferrer">
                    {article?.title}
                  </a>
                </h2>
                <div className="text-sm font-normal text-gray-400 flex align-middle">
                  <div className="mr-2">{article?.sourceName}</div>
                  <div className="mr-2">
                    Publish at {article?.publishedTime.format("YYYY-M-D H:m")}
                  </div>
                </div>
              </header>
              <div>{contentJSX}</div>
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
