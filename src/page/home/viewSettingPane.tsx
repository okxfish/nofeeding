import React from "react";
import {
    ChoiceGroup,
    IChoiceGroupOption,
    Toggle,
    Stack,
    Separator,
} from "@fluentui/react";
import { Dispatch, RootState } from "../../model";
import { useSelector, useDispatch } from "react-redux";
import { ViewType, FeedThumbnailDisplayType } from "../../model/userInterface";

const ViewSettingPane = () => {
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const unreadOnly = useSelector<RootState, any>(
        (state) => state.feed.unreadOnly
    );
    const feedThumbnailDisplayType = useSelector<RootState, any>(
        (state) => state.userInterface.feedThumbnailDisplayType
    );

    const dispatch = useDispatch<Dispatch>();

    const viewTypeOptions: IChoiceGroupOption[] = [
        {
            key: ViewType.magazine,
            text: "Magazine",
            iconProps: { iconName: "GridViewMedium" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: ViewType.list,
            text: "List",
            iconProps: { iconName: "GroupedList" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: ViewType.threeway,
            text: "Threeway",
            iconProps: { iconName: "ColumnRightTwoThirds" },
            styles: {
                root: "hidden lg:block flex-1",
                choiceFieldWrapper: "flex-1",
            },
        },
    ];

    const feedThumbnaillOptions: IChoiceGroupOption[] = [
        {
            key: FeedThumbnailDisplayType.alwaysDisplay,
            text: "Always Display",
        },
        {
            key: FeedThumbnailDisplayType.alwaysNotDisplay,
            text: "Always Not Display",
        },
        {
            key: FeedThumbnailDisplayType.displayWhenThumbnaillExist,
            text: "Display When Thumbnaill Exist",
        },
    ];

    const onIsUreadOnlyChange = () => dispatch.feed.toggleIsUnreadOnly();

    const onfeedThumbnaillDisplayTypeChange = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IChoiceGroupOption
    ) => {
        option &&
            dispatch.userInterface.changeThumbnailDisplayType(
                FeedThumbnailDisplayType[option.key]
            );
    };

    const onViewTypeChange = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IChoiceGroupOption
    ) => {
        option && dispatch.userInterface.changeViewType(ViewType[option.key]);
    };

    return (
        <Stack
            tokens={{
                childrenGap: "s",
            }}
        >
            <Toggle
                label="Unread Only"
                inlineLabel
                styles={{ label: "flex-1 order-none m-0" }}
                onChange={onIsUreadOnlyChange}
                checked={unreadOnly}
            />
            <Separator />
            {viewType !== ViewType.list && (
                <>
                    <ChoiceGroup
                        selectedKey={feedThumbnailDisplayType}
                        options={feedThumbnaillOptions}
                        onChange={onfeedThumbnaillDisplayTypeChange}
                        label="Feed Thumbnail"
                        styles={{ label: "mb-2" }}
                    />
                    <Separator />
                </>
            )}
            <ChoiceGroup
                selectedKey={viewType}
                options={viewTypeOptions}
                onChange={onViewTypeChange}
                label="View Type"
                styles={{ label: "mb-2" }}
            />
        </Stack>
    );
};

export default ViewSettingPane;
