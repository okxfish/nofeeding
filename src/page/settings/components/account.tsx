import {
    DefaultButton,
    Stack,
    Icon,
    Text
} from "@fluentui/react";
import { useContext } from "react";
import { UserInfoContext } from "../../../context";
import Layout from "./layout";

const Account = () => {
    const userInfo = useContext(UserInfoContext);
    return (
        <Layout title="Account">
            <Stack tokens={{ childrenGap: 16 }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                    <Icon iconName="Contact" className=" text-4xl" />
                    <Stack>
                        <Text className="text-lg">{userInfo?.userName}</Text>
                        <Text className="text-sm">{userInfo?.email}</Text>
                    </Stack>
                </Stack>
                <DefaultButton className="sm:max-w-2xs">log out</DefaultButton>
            </Stack>
        </Layout>
    );
};

export default Account;
