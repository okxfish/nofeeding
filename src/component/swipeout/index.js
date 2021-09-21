import { useRef, useState } from "react";
import "./style.css";

const Direction = {
    ToLeft: "ToLeft",
    ToRight: "ToRight"
};

const OpenedSide = {
    Left: "Left",
    Right: "Right"
};

const Action = {
    Open: "Open",
    Close: "Close"
};

export default function Swipeout({
    className="",
    leftBtnsProps = [],
    rightBtnsProps = [],
    overswipeRatio = 0.6,
    btnWidth = 72,
    children
}) {
    const swipeoutContainerRef = useRef(null);
    const contentContainerRef = useRef(null);
    const leftBtnsContainerRef = useRef(null);
    const rightBtnsContainerRef = useRef(null);

    const contentContainerWidth = useRef(0);
    const leftBtnsContainerWidth = useRef(0);
    const rightBtnsContainerWidth = useRef(0);

    const isMoved = useRef(false);
    const isTouched = useRef(false);
    const isScrolling = useRef(undefined);
    const touchStartTime = useRef(0);
    const touchesStart = useRef({ x: 0, y: 0 });

    const [isOpened, setIsOpened] = useState(false);
    const [translate, setTranslate] = useState(0);
    const openedBtnsSide = useRef(null);
    const direction = useRef(Direction.ToLeft);


    const getOpenedContainerWidth = () => {
        return (direction.current === Direction.ToLeft
            ? rightBtnsContainerWidth
            : leftBtnsContainerWidth
        ).current;
    }

    const isOverswipe = Math.abs(translate) > Math.max(overswipeRatio * contentContainerWidth.current, getOpenedContainerWidth())

    const getAction = () => {
        const timeDiff = new Date().getTime() - touchStartTime.current;
        const openedContainerWidth = getOpenedContainerWidth();

        if (timeDiff < 300) {
            if (
                (translate < -10 && direction.current === Direction.ToLeft) ||
                (translate > 10 && direction.current === Direction.ToRight) ||
                (Math.abs(translate) !== 0)
            ) {
                return Action.Open;
            } else {
                return Action.Close;
            }
        } else {
            if (Math.abs(translate) > openedContainerWidth / 2) {
                return Action.Open;
            } else {
                return Action.Close;
            }
        }
    }

    const triggerOverswipeBtnClickEvent = () => {
        let overswipeBtn = openedBtnsSide.current === OpenedSide.Left
            ? leftBtnsProps[0]
            : rightBtnsProps[rightBtnsProps.length - 1];
        if (typeof overswipeBtn.onClick === 'function') {
            overswipeBtn.onClick();
        }
    }

    const openBtnsContainer = () => {
        if (swipeoutContainerRef.current) {
            swipeoutContainerRef.current.classList.add('swipeout-transitioning')
        }
        const openedContainerWidth = getOpenedContainerWidth();
        setTranslate(
            direction.current === Direction.ToLeft
                ? -openedContainerWidth
                : openedContainerWidth
        );
        setIsOpened(true)
    }

    const closeBtnsContainer = () => {
        if (swipeoutContainerRef.current) {
            swipeoutContainerRef.current.classList.add('swipeout-transitioning')
        }
        setTranslate(0);
        setIsOpened(false);
    }

    const initContainerWidth = () => {
        if (leftBtnsProps.length > 0 && leftBtnsContainerRef.current) {
            leftBtnsContainerWidth.current =
                leftBtnsContainerRef.current.offsetWidth;
        }

        if (rightBtnsProps.length > 0 && rightBtnsContainerRef.current) {
            rightBtnsContainerWidth.current =
                rightBtnsContainerRef.current.offsetWidth;
        }

        if (contentContainerRef.current) {
            contentContainerWidth.current = contentContainerRef.current.offsetWidth;
        }

        swipeoutContainerRef.current.classList.remove('swipeout-transitioning');
    }

    const getTranslate = (touchTranslate) => {
        // 如果是在打开的状态下滑动，则本次触摸点移动的位移需要加上打开状态的位移
        // 当前打开的抽屉在哪一侧，就加上那一侧打开后的位移
        let result = touchTranslate;
        if (isOpened) {
            if (openedBtnsSide.current === OpenedSide.Left) {
                // 如果左侧面板被打开，此时的 translate > 0 则向左滑动时，translate 减小 动作理解成 "close"
                // 此时滑块的 translate 于不能小于 0，否则右侧面板将被打开，造成误操作
                result = Math.max(leftBtnsContainerWidth.current + touchTranslate, 0);
            } else {
                // 如果右侧面板被打开，此时的 translate < 0 则向右滑动时，translate 增加 动作理解成 "close"
                // 此时滑块的 translate 于不能大于 0，否则右侧面板将被打开，造成误操作
                result = Math.min(-1 * rightBtnsContainerWidth.current + touchTranslate, 0);
            };
        } else {
            // 向没有按钮的一侧滑动, 不移动出边界
            if (
                (result > 0 && leftBtnsProps.length === 0) ||
                (result < 0 && rightBtnsProps.length === 0)
            ) {
                result = 0;
            }
        }
        return result;
    }

    const onTouchStart = (e) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        isMoved.current = false;
        isTouched.current = true;
        isScrolling.current = undefined;

        touchesStart.current.x = e.targetTouches
            ? e.targetTouches[0].pageX
            : e.pageX;
        touchesStart.current.y = e.targetTouches
            ? e.targetTouches[0].pageY
            : e.pageY;
        touchStartTime.current = new Date().getTime();

        if (leftBtnsContainerRef.current) {
            leftBtnsContainerWidth.current = leftBtnsContainerRef.current.offsetWidth;
        }

        if (rightBtnsContainerRef.current) {
            rightBtnsContainerWidth.current =
                rightBtnsContainerRef.current.offsetWidth;
        }
    };

    const onTouchMove = (e) => {
        if (!isTouched.current) {
            return null;
        }

        e.preventDefault();
        e.stopPropagation()

        const pageX = e.targetTouches
            ? e.targetTouches[0].pageX
            : e.pageX; // 移动中触摸到的点的 x 坐标位置
        const pageY = e.targetTouches
            ? e.targetTouches[0].pageY
            : e.pageY; // 移动中触摸到的点的 y 坐标位置

        if (typeof isScrolling.current === "undefined") {
            isScrolling.current = !!(
                isScrolling.current ||
                Math.abs(pageY - touchesStart.current.y) >
                Math.abs(pageX - touchesStart.current.x)
            );
        }

        if (isScrolling.current) {
            isTouched.current = false;
            return;
        }

        if (!isMoved.current) {
            initContainerWidth();
        }
        isMoved.current = true;

        if (e.cancelable) {
            e.preventDefault();
        }

        // 计算下一次的位移
        let newTranslate = getTranslate(pageX - touchesStart.current.x);

        // 判断方向
        direction.current = newTranslate < 0 ? Direction.ToLeft : Direction.ToRight;
        setTranslate(newTranslate);

        if (newTranslate === 0) {
            isTouched.current = false;
            isMoved.current = false;
            setIsOpened(false);
        }
    };

    const onTouchEnd = (e) => {
        if (!isTouched.current || !isMoved.current) {
            isTouched.current = false;
            isMoved.current = false;
            return;
        }

        isTouched.current = false;
        isMoved.current = false;

        let action = getAction();
        if (action === Action.Open) {
            openedBtnsSide.current =
                direction.current === Direction.ToLeft
                    ? OpenedSide.Right
                    : OpenedSide.Left;
            if (isOverswipe) {
                triggerOverswipeBtnClickEvent();
                closeBtnsContainer();
            } else {
                openBtnsContainer()
            }
        } else if (action === Action.Close) {
            closeBtnsContainer();
        }
    };

    const actionBtnRender = ({
        indexFromMiddle,
        directionFlag,
        btnsNum,
        btnsContainerWidth,
        index,
        btnProps
    }) => {
        const onClick = () => {
            if (typeof btnProps.onClick === 'function') {
                btnProps.onClick()
            }
            closeBtnsContainer();
        }

        const baseOffset = directionFlag * btnWidth * indexFromMiddle // 与内容边缘的的距离
        const btnTranslate = (btnsContainerWidth < Math.abs(translate))
            ? translate
            : (translate * ((btnsNum - indexFromMiddle) / btnsNum) + baseOffset);
        const isOverswipeBtn = indexFromMiddle === (btnsNum - 1) && isOverswipe

        return (
            <div
                className={`swipeout-action-btn ${btnProps.className} ${isOverswipeBtn ? 'swipeout-action-btn--overswipe' : ''}`}
                style={{
                    width: btnWidth,
                    transform: `translate3d(${btnTranslate}px, 0px, 0px)`,
                    zIndex: indexFromMiddle,
                    left: isOverswipeBtn ? baseOffset : 0,
                }}
                key={index}
                onClick={onClick}
            >
                {typeof btnProps.contentRender === 'function' ? btnProps.contentRender(btnProps, index) : btnProps.text}
            </div>
        );
    }

    const leftBtnsRender = () => {
        return leftBtnsProps.map((btnProps, index) => {
            return actionBtnRender({
                indexFromMiddle: leftBtnsProps.length - 1 - index,
                directionFlag: 1,
                btnsNum: leftBtnsProps.length,
                btnsContainerWidth: leftBtnsContainerWidth.current,
                index,
                btnProps
            })
        });
    };

    const rightBtnsRender = () => {
        return rightBtnsProps.map((btnProps, index) => {
            return actionBtnRender({
                indexFromMiddle: index,
                directionFlag: -1,
                btnsNum: rightBtnsProps.length,
                btnsContainerWidth: rightBtnsContainerWidth.current,
                index,
                btnProps
            })
        });
    };

    return (
        <div className={`swipeout-container ${className}`} ref={swipeoutContainerRef} >
            <div
                ref={contentContainerRef}
                style={{ transform: `translate3d(${translate}px, 0, 0)` }}
                className="swipeout-content"
                onMouseDown={onTouchStart}
                onMouseMove={onTouchMove}
                onMouseUp={onTouchEnd}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {children}
            </div>
            <div
                className="swipeout-left-btns-container"
                style={{ transform: `translate3d(-100%, 0, 0)` }}
                ref={leftBtnsContainerRef}
            >
                {leftBtnsRender()}
            </div>
            <div
                className="swipeout-right-btns-container"
                style={{ transform: `translate3d(100%, 0, 0)` }}
                ref={rightBtnsContainerRef}
            >
                {rightBtnsRender()}
            </div>
        </div>
    );
}
