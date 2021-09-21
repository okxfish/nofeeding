import { Stack, Text } from "@fluentui/react";
import { useTranslation } from "react-i18next";
import Layout from "./layout";

const ReadingPreference = () => {
    const { t } = useTranslation("settings");

    return (
        <Layout title={t("reading preference")}>
            <Stack></Stack>
        </Layout>
    );
};

export default ReadingPreference;
