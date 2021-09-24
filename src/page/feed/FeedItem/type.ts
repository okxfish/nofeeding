import { ReactElement } from "react";
import { FeedProps } from "../types";

export interface FeedItemViewProps extends FeedProps {
    itemIndex?: number;
    isSelected?: boolean;
    sourceIcon?: string;
    relativePublishedTime?: string;
    onStar(e: any, id: string, isStar?: boolean): void;
    onRead(e: any, id: string, isRead?: boolean): void;
    onClick(e: any, id: string): void;
    markAsReadBtn?: ReactElement | null;
    markAsStarBtn?: ReactElement | null;
    rootClassName?: string;
    containerClassName?: string;
    contentClassName?: string;
    titleClassName?: string;
} 