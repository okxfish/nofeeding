import {
    Stack,
    Text
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import Layout from "./layout";

const General = () => {
    const { t } = useTranslation("settings");
    return (
        <Layout title={t("general")}>
            <Stack></Stack>
        </Layout>
    );
};

export default General;
