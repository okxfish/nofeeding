import { Dropdown, Stack, Text, IDropdownOption } from "@fluentui/react";
import { useTranslation } from "react-i18next";
import Layout from "./layout";

const General = () => {
    const { t, i18n } = useTranslation(["translation", "settings", "lang"]);

    const getDropdownOptions = () => {
        return [
            {
                key: "zh-CN",
                text: t("lang:zh"),
            },
            {
                key: "en-US",
                text: t("lang:en"),
            },
        ];
    };

    const handleLangDropdownChange = (
        event: any,
        option?: IDropdownOption<string>,
        index?: number
    ) => {
        i18n.changeLanguage(String(option?.key));
    };

    return (
        <Layout title={t("settings:general")}>
            <Stack horizontal>
                <Stack.Item grow>
                    <Text>{t("lang")}</Text>
                </Stack.Item>
                <Stack.Item shrink={false} className="w-32">
                    <Dropdown
                        selectedKey={i18n.language}
                        options={getDropdownOptions()}
                        placeHolder={t("langDropdownPlaceholder")}
                        onChange={handleLangDropdownChange}
                    />
                </Stack.Item>
            </Stack>
        </Layout>
    );
};

export default General;
