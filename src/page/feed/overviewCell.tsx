import React from "react";
import {
  DefaultButton,
  IButtonProps,
  IButtonStyles,
  mergeStyleSets,
} from "@fluentui/react";
import {
  NeutralColors
} from "@fluentui/theme";

export interface Props extends IButtonProps {}

const OverviewCell = ({ className = "", styles, ...rest }: Props) => {
  const defaultStyles: IButtonStyles = {
    root: [
      {
        width: "100%",
        borderRadius: "0",
        border: "0",
        paddingLeft: 0,
        paddingRight: 0,
        minWidth: "0",
        textAlign:'left',
        color: NeutralColors.gray180,
        backgroundColor: "transparent",
      },
      "h-10 text-base",
    ],
    rootFocused: {
      outline: "none",
    },
    rootExpanded: {
      backgroundColor: 'white'
    },
    rootHovered: {
      backgroundColor: NeutralColors.gray30,
    },
    icon: {
      margin: '0',
    },
    textContainer: 'ml-2',
    label: {
      fontWeight: "normal",
      margin: '0',
    },
  };

  return (
    <DefaultButton
      className={`${className}`}
      styles={mergeStyleSets(defaultStyles, styles)}
      {...rest}
    />
  );
};

export default OverviewCell;
