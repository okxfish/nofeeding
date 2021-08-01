import React from "react";
import {
  DefaultButton,
  IButtonProps,
  IButtonStyles,
  mergeStyleSets,
} from "@fluentui/react";

export interface Props extends IButtonProps {}

const OverviewCell = ({ className = "", styles, ...rest }: Props) => {
  const defaultStyles: IButtonStyles = {
    root: [
      {
        width: "100%",
        border: "0",
        minWidth: "0",
        textAlign:'left',
        color: 'currentColor',
        backgroundColor: "transparent",
      },
      "h-10 rounded-md pl-8 lr-6",
    ],
    rootFocused: {
      outline: "none",
    },
    rootExpanded: {
      backgroundColor: ''
    },
    icon: ['m-0 w-6 h-6 leading-6'],
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
