import React from "react";
import {
  DefaultButton,
  IButtonProps,
  IButtonStyles,
  mergeStyleSets,
} from "@fluentui/react";

export interface Props extends IButtonProps {
  isIconOnly?: boolean;
}

const SideBarItem = ({
  className = "",
  isIconOnly,
  children,
  styles,
  ...rest
}: Props) => {
  const defaultStyles: IButtonStyles = {
    root: 'w-full h-full rounded-none px-0 border-0 min-w-0 font-sans text-gray-700 text-base bg-transparent sm:h-10 focus:outline-none hover:bg-gray-200',
    rootExpanded: `bg-transparent bg-gray-100`,
    textContainer: `text-left ${isIconOnly ? "hidden" : ""}`,
    label: `font-normal`,
    icon: `px-1`,
    menuIcon: `px-1 ${isIconOnly ? "hidden" : ""}`,
  };

  return (
    <DefaultButton
      className={`${className}`}
      styles={mergeStyleSets(defaultStyles, styles)}
      {...rest}
    >
      {children}
    </DefaultButton>
  );
};

export default SideBarItem;
