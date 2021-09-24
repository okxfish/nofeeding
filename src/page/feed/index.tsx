import StreamContentContainer from "./StreamContentContainer";
import SubscriptionsPane from "./SubscriptionsPane";
import FeedPane from "./FeedPane";
import ArticlePane from "./ArticlePane";

const FeedPage = () => {
    return (
        <>
            <SubscriptionsPane />
            <StreamContentContainer>
                <FeedPane />
                <ArticlePane />
            </StreamContentContainer>
        </>
    );
};

export default FeedPage;
