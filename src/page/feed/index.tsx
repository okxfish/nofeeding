import { default as FeedContainer } from "./feed";
import SubscriptionsBlock from "./SubscriptionsBlock";

const FeedPage = () => {
    return (
        <>
            <SubscriptionsBlock />
            <FeedContainer />
        </>
    );
};

export default FeedPage;
