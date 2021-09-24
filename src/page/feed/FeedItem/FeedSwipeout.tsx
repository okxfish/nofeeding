import React from "react";
import { IIconProps, Icon } from "@fluentui/react";
import Swipeout from "../../../component/swipeout";
import { useWindowSize } from "react-use";

export interface Props {
    id: string;
    isRead?: boolean;
    isStar?: boolean;
    className?: string;
    onStar(e: any, id: string, isStar?: boolean): void;
    onRead(e: any, id: string, isRead?: boolean): void;
    children?: React.ReactNode;
}

const favoriteStarIcon: IIconProps = { iconName: "FavoriteStar" };
const favoriteStarFillIcon: IIconProps = { iconName: "FavoriteStarFill" };
const radioBtnOffIcon: IIconProps = { iconName: "RadioBtnOff" };
const radioBtnOnIcon: IIconProps = { iconName: "RadioBtnOn" };

const FeedSwipeout = ({
    id,
    isRead,
    isStar,
    className,
    onStar,
    onRead,
    children,
}: Props) => {
    const { width: windowWidth } = useWindowSize();

    const swipeoutLeftBtnsProps =
        windowWidth < 640
            ? [
                  {
                      className: "bg-yellow-300 text-white text-xl font-medium",
                      text: (
                          <Icon
                              className="text-2xl"
                              {...(isStar
                                  ? favoriteStarFillIcon
                                  : favoriteStarIcon)}
                          />
                      ),
                      onClick: (e) => onStar(e, id, isStar),
                  },
              ]
            : [];

    const swipeoutRightBtnsProps =
        windowWidth < 640
            ? [
                  {
                      className: "bg-green-400 text-white text-xl font-medium",
                      text: (
                          <Icon
                              className="text-2xl"
                              {...(isRead ? radioBtnOffIcon : radioBtnOnIcon)}
                          />
                      ),
                      onClick: (e) => onRead(e, id, isRead),
                  },
              ]
            : [];

    return (
        <Swipeout
            className={`${className}`}
            leftBtnsProps={swipeoutLeftBtnsProps}
            rightBtnsProps={swipeoutRightBtnsProps}
            overswipeRatio={0.3}
            btnWidth={96}
        >
            {children}
        </Swipeout>
    );
};

export default React.memo(FeedSwipeout);
