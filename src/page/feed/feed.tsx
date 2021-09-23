import { FeedContext, SetFeedItemContext } from "./../../context";
import { useStreamContent, useStreamContentQueryKey } from "./utils";
import FeedBlock from "./FeedBlock";
import ArticleBlock from "./ArticleBlock";
import "./style.css";

interface Props {}

const FeedContainer = ({}: Props) => {
    const streamContentQueryKey = useStreamContentQueryKey();
    const {
        streamContentData,
        streamContentQuery,
        setArticleDataById,
        getArticleDataById,
    } = useStreamContent();

    return (
        <FeedContext.Provider
            value={{
                streamContentQuery,
                streamContentData,
                streamContentQueryKey,
            }}
        >
            <SetFeedItemContext.Provider
                value={{
                    getArticleDataById,
                    setArticleDataById,
                }}
            >
                <FeedBlock />
                <ArticleBlock />
            </SetFeedItemContext.Provider>
        </FeedContext.Provider>
    );
};

export default FeedContainer;
