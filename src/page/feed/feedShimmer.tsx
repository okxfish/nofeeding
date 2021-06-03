import {
  ShimmerElementsGroup,
  ShimmerElementType,
  Shimmer,
} from "@fluentui/react";

export interface Props {
  number?: number;
}

const FeedShimmer = ({ number=5 }:Props) => {
  const shimmerRowRender = (item, index): JSX.Element => (
    <div key={index}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, height: 100, width: 100 },
            { type: ShimmerElementType.gap, width: 10, height: 100 },
          ]}
        />
        <ShimmerElementsGroup
          flexWrap
          width={"calc(100% - 110px)"}
          shimmerElements={[
            { type: ShimmerElementType.line, width: "20%", height: 20 },
            { type: ShimmerElementType.gap, width: "80%", height: 20 },
            { type: ShimmerElementType.gap, width: "100%" },
            { type: ShimmerElementType.line, width: "100%", height: 20 },
            { type: ShimmerElementType.gap, width: "100%" },
            { type: ShimmerElementType.line, width: "100%", height: 20 },
          ]}
        />
      </div>
      <ShimmerElementsGroup
        shimmerElements={[
          { type: ShimmerElementType.gap, height: 24, width: "100%" },
        ]}
      />
    </div>
  );

  const getCustomElements = (number: number): JSX.Element => {
    return <div>{Array.from({ length: number }).map(shimmerRowRender)}</div>;
  };

  return (
    <Shimmer
      className="mt-4 mx-auto w-11/12"
      customElementsGroup={getCustomElements(number)}
    />
  );
};

export default FeedShimmer;
