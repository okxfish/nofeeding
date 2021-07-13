import {
  IconButton,
  IButtonProps,
  IButtonStyles,
  mergeStyleSets,
} from "@fluentui/react";

export interface Props extends IButtonProps {}

// 侧边栏按钮，封装了一些样式
const sideBarButton = ({ className = "", styles, ...rest }: Props) => {
  const defaultStyles: IButtonStyles = {
    root: [
      {
        border: "0",
        minWidth: "0",
        color: "currentColor",
        background: "transparent",
      },
      "w-10 h-10 mx-auto mb-2 rounded-md",
    ],
    rootHovered: [
      {
        background: "rgba(255, 255, 255, 0.5)",
        color: "currentColor",
      },
    ],
    rootPressed: [{
      background: "transparent",
      color: "currentColor",
    }],
    rootFocused: {
      outline: 0,
    },
    rootExpanded: {
      backgroundColor: "white",
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

export default sideBarButton;
