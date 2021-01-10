import React from 'react';
import { Icon, IIconProps } from '@fluentui/react';

export interface Props {
className?: string;
iconProps?: IIconProps;
content?: string | React.ReactElement;
onFooterRender?(): React.ReactElement | null;
onClick?(): any;
}

const defaultFooterRender = ():React.ReactElement => <Icon iconName="ChevronRight"/>

const OverviewCell = ({
className='',
iconProps,
content,
onClick=()=>{},
onFooterRender=defaultFooterRender
}:Props) => {
  return (
    <div className={`${className} flex items-center h-10 hover:bg-gray-300`} onClick={onClick}>
      <Icon className="mr-2" {...iconProps} />
      <div className="flex-1">{content}</div>
      {onFooterRender()}
    </div>
  );
}

export default OverviewCell;