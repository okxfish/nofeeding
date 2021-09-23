import {
    CommandBar as FluentCommandBar,
    ICommandBarItemProps,
} from "@fluentui/react";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../model";
import { ModalKeys } from "../../../model/globalModal";
import { useTranslation } from "react-i18next";

export interface Props {
    className?: string;
}

const CommandBar = ({}: Props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<Dispatch>();
    const commandItems: ICommandBarItemProps[] = [
        {
            key: "addSubscription",
            text: t("add subscription"),
            iconOnly: true,
            iconProps: { iconName: "Add" },
            onClick: () =>
                dispatch.globalModal.openModal(ModalKeys.AddFeedModal),
        },
    ];

    return (
        <FluentCommandBar
            className=""
            items={commandItems}
            styles={{ root: "p-0" }}
        />
    );
};

export default CommandBar;
