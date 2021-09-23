import {
    Stack,
    Text,
    IconButton,
} from "@fluentui/react";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../model";
import { default as CommandBar } from "./CommandBar";
import { ScreenPosition } from "../../../model/app";

export interface Props {
    className?: string;
}

const SubscriptionsPaneHeader = ({}: Props) => {
    const dispatch = useDispatch<Dispatch>();
    
    return (
        <Stack className="py-2 pl-2" horizontal verticalAlign="center">
            <IconButton
                className="sm:hidden mr-2"
                iconProps={{ iconName: "GlobalNavButton" }}
                onClick={() =>
                    dispatch.app.changeActivedScreen(ScreenPosition.Center)
                }
            />
            <Text className="text-xl font-semibold flex-1">NoFeeding</Text>
            <CommandBar/>
        </Stack>
    );
};

export default SubscriptionsPaneHeader;
