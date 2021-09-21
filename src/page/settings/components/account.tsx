import { DefaultButton, Stack, Icon, Text, Image } from "@fluentui/react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../../../model";
import Layout from "./layout";

const Account = () => {
    const { t } = useTranslation(['translation', 'settings']);
    
    const userInfo = useSelector<RootState, any>((state) => state.userInfo);
    const history = useHistory();

    const handleLogoffClick = (e): void => {
        localStorage.removeItem("inoreaderToken");
        history.replace("/login");
    };

    return (
        <Layout title={t("settings:account")}>
            <Stack tokens={{ childrenGap: 16 }}>
                <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                >
                    <Image src={userInfo?.avatar} className="w-8 h-8 bg-gray-300 rounded-full"/>
                    <Stack>
                        <Text className="text-lg">{userInfo?.userName}</Text>
                        <Text className="text-sm">{userInfo?.userEmail}</Text>
                    </Stack>
                </Stack>
                <DefaultButton
                    className="sm:max-w-2xs"
                    onClick={handleLogoffClick}
                >
                    {t('log off')}
                </DefaultButton>
            </Stack>
        </Layout>
    );
};

export default Account;
