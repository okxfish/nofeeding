import {
    Stack,
    Text
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import Layout from "./layout";

const UserInterface = () => {
    const { t } = useTranslation("settings");
    return (
        <Layout title={t("user interface")}>
            <Stack></Stack>
        </Layout>
    );
};

export default UserInterface;
