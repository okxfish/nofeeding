import React, { useContext } from "react";
import { default as FeedsPaneComponent } from "./component";
import {
  FeedProps,
  FeedGroup,
} from "./types";
import { IGroup } from "office-ui-fabric-react";
import { FeedContext } from './../../context/feed';

export interface Props {
  className?: string;
  isFetching: boolean;
  onClickFeed?(e: FeedProps): any;
}

const FeedsPaneContainer = (props: Props) => {
  const { isFetching, className, onClickFeed } = props;
  const { state, dispatch, streamContents=[] } = useContext(FeedContext);

  return (
    <FeedsPaneComponent
      isSidePaneOpen={state.isSidePaneOpen}
      items={streamContents}
      groups={[]}
      isFetching={isFetching}
      dispatch={dispatch}
      className={className}
      onClickFeed={onClickFeed}
    />
  );
};

export default FeedsPaneContainer;
