import React from "react";
import {
  DefaultButton,
  IButtonProps,
  IButtonStyles,
} from "office-ui-fabric-react";

export interface Props extends IButtonProps {
  isIconOnly?: boolean;
}

const SideBarItem = ({ className, isIconOnly, children, styles={}, ...rest }: Props) => {
  
  const {
    textContainer: textContainerStyle,
    label: labelStyle,
    icon: iconStyle,
    menuIcon: menuIconStyle,
    ...restStyles
  } = styles;

  const defaultStyles: IButtonStyles = {
    textContainer: `text-left ${isIconOnly ? 'hidden' : ''} ${textContainerStyle}`,
    label: `font-normal ${labelStyle}`,
    icon: `px-1 ${iconStyle}`,
    menuIcon: `px-1 ${isIconOnly ? 'hidden' : ''} ${menuIconStyle}`,
    ...restStyles,
  };

  return (
    <DefaultButton
      className={`text-gray-300 rounded-none focus:outline-none px-0 min-w-0 font-sans text-base bg-transparent hover:bg-transparent w-full hover:bg-gray-100 hover:text-gray-600  h-10 bg-none border-0 ${className}}`}
      styles={defaultStyles}
      {...rest}
    >
      {children}
    </DefaultButton>
  );
};

export default SideBarItem;
