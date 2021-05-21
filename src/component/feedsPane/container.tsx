import React, { useContext } from "react";
import { default as FeedsPaneComponent } from "./component";
import { FeedContext } from './../../context/feed';

export interface Props {
  className?: string;
  isFetching: boolean;
}

const FeedsPaneContainer = (props: Props) => {
  const { isFetching, className } = props;
  const { state, dispatch, streamContents=[] } = useContext(FeedContext);

  return (
    <FeedsPaneComponent
      isSidePaneOpen={state.isSidePaneOpen}
      items={streamContents}
      groups={[]}
      isFetching={isFetching}
      dispatch={dispatch}
      className={className}
    />
  );
};

export default FeedsPaneContainer;
