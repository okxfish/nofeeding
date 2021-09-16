import { DefaultButton, Stack, Icon, Text } from "@fluentui/react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../model";
import Layout from "./layout";

const Account = () => {
    const userInfo = useSelector<RootState, any>((state) => state.userInfo);
    const history = useHistory();

    const handleLogoffClick = (e): void => {
        localStorage.removeItem("inoreaderToken");
        history.replace("/login");
    };

    return (
        <Layout title="Account">
            <Stack tokens={{ childrenGap: 16 }}>
                <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                >
                    <Icon iconName="Contact" className=" text-4xl" />
                    <Stack>
                        <Text className="text-lg">{userInfo?.userName}</Text>
                        <Text className="text-sm">{userInfo?.email}</Text>
                    </Stack>
                </Stack>
                <DefaultButton
                    className="sm:max-w-2xs"
                    onClick={handleLogoffClick}
                >
                    log off
                </DefaultButton>
            </Stack>
        </Layout>
    );
};

export default Account;
