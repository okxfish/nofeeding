import classnames from "classnames";
import { Image, ImageFit, useTheme } from "@fluentui/react";
import { FeedThumbnailDisplayType } from "../../../model/userInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../model";

export interface Props {
    className?: string;
    thumbnailSrc?: string;
}

const Thumbnail = ({ className, thumbnailSrc }: Props) => {
    const { palette } = useTheme();

    const feedThumbnailDisplayType = useSelector<RootState, any>(
        (state) => state.userInterface.feedThumbnailDisplayType
    );

    if (
        feedThumbnailDisplayType ===
            FeedThumbnailDisplayType.alwaysNotDisplay ||
        (feedThumbnailDisplayType ===
            FeedThumbnailDisplayType.displayWhenThumbnaillExist &&
            !thumbnailSrc)
    ) {
        return null;
    }

    return (
        <div
            className={classnames(
                "flex-shrink-0 h-24 w-24 mb-0 rounded-lg overflow-hidden border flex items-center justify-center",
                className,
            )}
            style={{
                backgroundColor: palette.neutralQuaternaryAlt,
                borderColor: palette.neutralQuaternaryAlt,
            }}
        >
            {thumbnailSrc ? (
                <Image
                    className="select-none"
                    src={thumbnailSrc}
                    maximizeFrame={true}
                    imageFit={ImageFit.cover}
                />
            ) : null}
        </div>
    );
};

export default Thumbnail;
