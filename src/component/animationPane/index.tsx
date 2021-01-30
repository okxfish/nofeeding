import React, { useEffect, useState } from "react";
export interface Props {
  rootClassName?: string;
  isOpend: boolean;
  animationDuration?: number;
  canMaskClose?: boolean;
  onClose(): any;
  children?: React.ReactElement | null;
}

const AnimationPane = ({
  isOpend,
  rootClassName = "",
  animationDuration = 150,
  canMaskClose = true,
  onClose = () => {},
  children,
}: Props) => {
  const [isContentOpen, setIsContentOpen] = useState<boolean>(false);
  const [isRootOpen, setIsRootOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpend) {
      setIsRootOpen(true);
    } else {
      setIsContentOpen(false);
    }
  }, [isOpend]);

  useEffect(() => {
    if (isRootOpen) {
      setIsContentOpen(true);
    }
  }, [isRootOpen]);

  useEffect(() => {
    if (!isContentOpen) {
      setTimeout(() => {
        setIsRootOpen(false);
      }, animationDuration);
    }
  }, [isContentOpen, animationDuration]);

  const handleClickMask = (): void => {
    if (canMaskClose) {
      onClose();
    }
  };

  return (
    <div
      className={`
      relative z-50
      flex-col justify-end
      ${isRootOpen ? "flex" : "hidden"}
      sm:flex sm:z-10 sm:h-full
      ${rootClassName}
      `}
    >
      <div
        className="absolute h-full w-full bg-opacity-50 transition-all bg-gray-500"
        style={{ backdropFilter: "blur(10px)" }}
        onClick={handleClickMask}
      />
      <div
        className={`
        ${isContentOpen ? "translate-y-0" : "translate-y-full"}
        flex flex-col h-2/3 
        shadow-lg transition-all transform
        sm:h-full sm:shadow-none sm:translate-y-0
        `}
        style={{ transitionDuration: `${animationDuration}ms` }}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimationPane;
