import React from "react";
import {
  IconButton,
  IButtonProps,
  IButtonStyles,
  mergeStyleSets,
} from "@fluentui/react";
import { NeutralColors } from "@fluentui/theme";

export interface Props extends IButtonProps {}

const SideBarItem = ({ className = "", styles, ...rest }: Props) => {
  const defaultStyles: IButtonStyles = {
    root: [
      {
        width: "100%",
        borderRadius: "0",
        border: "0",
        minWidth: "0",
        backgroundColor: "transparent",
        color: NeutralColors.gray180,
      },
      "h-12 text-base",
    ],
    rootFocused: {
      outlineOffset: "1",
    },
    rootExpanded: {
      backgroundColor: "white",
    },
    rootHovered: {
      backgroundColor: NeutralColors.gray50,
    },
    label: {
      fontWeight: "normal",
    },
    menuIcon: "hidden",
  };

  return (
    <IconButton
      className={`${className}`}
      styles={mergeStyleSets(defaultStyles, styles)}
      {...rest}
    />
  );
};

export default SideBarItem;
