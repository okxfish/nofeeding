import {
    Stack,
    Text
} from "@fluentui/react";
import Layout from "./layout";

const About = () => {
    return (
        <Layout title="About">
            <Stack className="text-base">
                <p className="">fread 0.2.0</p>
                <p className="mb-2">© {new Date().getFullYear()} 要没时间了。</p>
                <a className="text-blue-600 hover:underline" href="https://github.com/okxfish/fread" target="_blank">项目仓库</a>
                <a className="text-blue-600 hover:underline" >使用条款</a>
                <a className="text-blue-600 hover:underline" >隐私策略</a>
            </Stack>
        </Layout>
    );
};

export default About;
