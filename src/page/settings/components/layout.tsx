import { ReactChild } from "react";
import {
    CommandBar,
    IconButton,
    Stack,
    Text,
} from "@fluentui/react";
import { useHistory } from "react-router-dom";

export interface Props {
    title?: string
    children?: ReactChild
}

const Layout = ({ title, children }: Props) => {
    const history = useHistory();

    return (
        <div>
            <Stack className="p-2" horizontal verticalAlign="center" >
                <IconButton className="sm:hidden mr-2" iconProps={{ iconName: 'Back' }} onClick={history.goBack} />
                <Text className="text-xl font-semibold">{title}</Text>
                <CommandBar items={[]} />
            </Stack>
            <Stack className="mt-2 p-2">{children}</Stack>
        </div>
    );
};

export default Layout;