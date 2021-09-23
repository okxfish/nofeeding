import {
    Stack,
    Text,
    Image
} from "@fluentui/react";
import { useTranslation } from "react-i18next";
import Layout from "./layout";

const About = () => {
    const { t } = useTranslation("settings");
    return (
        <Layout title={t("about")}>
            <Stack className="text-base space-y-2">
                <Image src="/images/app-icon.svg" className="w-24 h-24"  maximizeFrame/>
                <Text className="font-semibold text-lg" block>NoFeeding 0.2.6</Text>
                <Text className="text-base" block>© {new Date().getFullYear()} 要没时间了。</Text>
                <a className="text-blue-600 hover:underline" href="https://github.com/okxfish/nofeeding" target="_blank">项目仓库</a>
                <a className="text-blue-600 hover:underline" title="">使用条款</a>
                <a className="text-blue-600 hover:underline" title="">隐私策略</a>
            </Stack>
        </Layout>
    );
};

export default About;
