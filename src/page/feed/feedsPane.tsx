import { default as React, useContext } from "react";
import { FeedContext } from "../../context";
import FeedPaneComponent from "./feedPaneComponent";
import FeedsPaneHeader from "./feedsPaneHeader";

export interface Props {
    className?: string;
    getScrollParent(): any;
}

const FeedsPane = ({ className, getScrollParent }: Props) => {
    const { streamContentData, streamContentQuery } = useContext(FeedContext);
    
    return (
        <>
            <FeedsPaneHeader />
            <FeedPaneComponent
                className={className}
                items={streamContentData}
                hasNextPage={streamContentQuery?.hasNextPage}
                isFetching={streamContentQuery?.isFetching}
                fetchNextPage={streamContentQuery?.fetchNextPage}
                getScrollParent={getScrollParent}
            />
        </>
    );
};

export default React.memo(FeedsPane);
