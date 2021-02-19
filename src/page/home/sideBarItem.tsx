import React from "react";
import {
  DefaultButton,
  IButtonProps,
  IButtonStyles,
} from "office-ui-fabric-react";

export interface Props extends IButtonProps {
  isIconOnly?: boolean;
}

const SideBarItem = ({
  className = "",
  isIconOnly,
  children,
  styles = {},
  ...rest
}: Props) => {
  const {
    rootExpanded: rootExpandedStyle,
    textContainer: textContainerStyle,
    label: labelStyle,
    icon: iconStyle,
    menuIcon: menuIconStyle,
    ...restStyles
  } = styles;

  const defaultStyles: IButtonStyles = {
    rootExpanded: `bg-transparent bg-gray-100 text-gray-600 ${rootExpandedStyle}`,
    textContainer: `text-left ${
      isIconOnly ? "hidden" : ""
    } ${textContainerStyle}`,
    label: `font-normal ${labelStyle}`,
    icon: `px-1 ${iconStyle}`,
    menuIcon: `px-1 ${isIconOnly ? "hidden" : ""} ${menuIconStyle}`,
    ...restStyles,
  };

  return (
    <DefaultButton
      className={`
        w-full h-full rounded-none px-0 border-0 min-w-0 font-sans text-gray-100 text-base bg-transparent 
        sm:h-10
        hover:bg-transparent  hover:bg-gray-100 hover:text-gray-600
        focus:outline-none
        ${className}
      `}
      styles={defaultStyles}
      {...rest}
    >
      {children}
    </DefaultButton>
  );
};

export default SideBarItem;
