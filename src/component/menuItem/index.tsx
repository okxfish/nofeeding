import { Stack, Icon, Text } from "@fluentui/react";
import { ReactElement } from "react";

export interface Props {
    text: string,
    iconName: string,
    suffixRender(): ReactElement | null,    
}

const MenuItem = ({
    text,
    iconName,
    suffixRender
})=> {
    return (
        <Stack
            horizontal
            verticalAlign="center"
            className="w-full h-full"
            tokens={{ childrenGap: 8 }}
        >
            <Icon iconName={iconName} className="w-4 ml-1" />
            <Text className="flex-1 text-base leading-8">{text}</Text>
            {suffixRender()}
        </Stack>
    );
};

export default MenuItem