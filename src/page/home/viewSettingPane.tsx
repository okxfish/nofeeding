import React from "react";
import {
    ChoiceGroup,
    IChoiceGroupOption,
    Toggle,
    Stack,
    Separator,
    Label,
} from "@fluentui/react";
import { Dispatch, RootState } from "../../model";
import { useSelector, useDispatch } from "react-redux";
import { ViewType, FeedThumbnailDisplayType, FeedView } from "../../model/userInterface";

const ViewSettingPane = () => {
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const feedView = useSelector<RootState, any>(
        (state) => state.userInterface.feedView
    );
    const unreadOnly = useSelector<RootState, any>(
        (state) => state.feed.unreadOnly
    );
    const feedThumbnailDisplayType = useSelector<RootState, any>(
        (state) => state.userInterface.feedThumbnailDisplayType
    );

    const dispatch = useDispatch<Dispatch>();

    const feedThumbnaillOptions: IChoiceGroupOption[] = [
        {
            key: FeedThumbnailDisplayType.alwaysDisplay,
            text: "always",
            iconProps: { iconName: "Photo2" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedThumbnailDisplayType.alwaysNotDisplay,
            text: "never",
            iconProps: { iconName: "Photo2Remove" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedThumbnailDisplayType.displayWhenThumbnaillExist,
            text: "auto",
            iconProps: { iconName: "PictureStretch" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
    ];

    const feedViewOptions: IChoiceGroupOption[] = [
        {
            key: FeedView.LeftCover,
            text: "left",
            iconProps: { iconName: "ThumbnailView" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedView.RightCover,
            text: "right",
            iconProps: { iconName: "ThumbnailViewMirrored" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        },
        {
            key: FeedView.SocialMedia,
            text: "social media",
            iconProps: { iconName: "ButtonControl" },
            styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
        }
    ];

    const onIsUreadOnlyChange = () => dispatch.feed.toggleIsUnreadOnly();

    const onfeedThumbnaillDisplayTypeChange = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IChoiceGroupOption
    ) => {
        option && dispatch.userInterface.changeThumbnailDisplayType(option.key);
    };

    const onfeedViewChange = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IChoiceGroupOption
    ) => {
        option && dispatch.userInterface.changeFeedView(option.key);
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
            {viewType !== ViewType.list && (
                <>
                    <Label>Thumbnail</Label>
                    <ChoiceGroup
                        selectedKey={feedThumbnailDisplayType}
                        options={feedThumbnaillOptions}
                        onChange={onfeedThumbnaillDisplayTypeChange}
                        styles={{ flexContainer: "flex-nowrap" }}
                    />
                    <Label>Feed View</Label>
                    <ChoiceGroup
                        selectedKey={feedView}
                        options={feedViewOptions}
                        onChange={onfeedViewChange}
                        styles={{ flexContainer: "flex-nowrap" }}
                    />
                </>
            )}
        </Stack>
    );
};

export default ViewSettingPane;
