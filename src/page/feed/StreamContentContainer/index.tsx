import { FeedContext, SetFeedItemContext } from "../../../context";
import { useStreamContent, useStreamContentQueryKey } from "../utils";
import { ReactNode } from "react";

const StreamContentContainer = ({children}:{children:ReactNode}) => {
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
                {children}
            </SetFeedItemContext.Provider>
        </FeedContext.Provider>
    );
};

export default StreamContentContainer;
