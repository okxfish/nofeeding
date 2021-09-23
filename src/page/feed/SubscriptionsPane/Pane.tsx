import { Stack } from "@fluentui/react";
import {default as SubscriptionsNav} from "./Nav";
import SubscriptionsPaneHeader from "./Header";

export interface Props {
    className?: string;
}

const SubscriptionsPane = ({ className }: Props) => {
    return <Stack className={`${className} min-h-0`}>
        <SubscriptionsPaneHeader />
        <SubscriptionsNav />
    </Stack>;
};

export default SubscriptionsPane;
