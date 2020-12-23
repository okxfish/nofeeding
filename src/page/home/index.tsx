import React from "react";
import {
  default as Group,
  Props as GroupPropsType,
} from "./../../component/group/index";
import { Props as FeedItemPropsType } from "./../../component/feedItem/index";
import { GroupedList, DetailsRow } from "office-ui-fabric-react";

interface Props {
  feedsData: GroupPropsType[];
}

const feedItemDataGenerator = (id: string = "1"): FeedItemPropsType => ({
  id: id,
  title: "this is a title",
  content:
    "This will initialise Tailwind with a new configuration file in the root of your project. Now we set up our CSS “entry point”. You can do this wherever you like but here’s how I do it",
  time: "3 days",
  source: "tech head",
  categroy: "tech",
  isRead: false,
  isStar: false,
  isLocked: false,
});

const groupDataGenerator = (id: string = "1"): GroupPropsType => ({
  id: id,
  title: "recently",
  list: Array.from({ length: 3 }).map((item, index) =>
    feedItemDataGenerator(String(index))
  ),
});

const data = Array.from({ length: 3 }).map((item, index) =>
  groupDataGenerator(String(index))
);

interface Source {
  id: string;
  icon?: string;
  url: string;
  unreadCount: number;
  name: string;
  isSelected: boolean;
  isHighlight: boolean;
}

interface Folder {
  id: string;
  name: string;
  children: Source[];
}

const sourceData: Folder[] = [
  {
    id: "1",
    name: "tech",
    children: [
      {
        id: "1",
        icon: "",
        url: "",
        unreadCount: 2,
        name: "Hack news",
        isSelected: false,
        isHighlight: false,
      },
      {
        id: "2",
        icon: "",
        url: "",
        unreadCount: 4,
        name: "Science",
        isSelected: false,
        isHighlight: false,
      },
    ],
  },
  {
    id: "2",
    name: "muisc",
    children: [
      {
        id: "3",
        icon: "",
        url: "",
        unreadCount: 0,
        name: "drake",
        isSelected: false,
        isHighlight: false,
      },
      {
        id: "4",
        icon: "",
        url: "",
        unreadCount: 0,
        name: "2pac",
        isSelected: false,
        isHighlight: false,
      },
      {
        id: "5",
        icon: "",
        url: "",
        unreadCount: 0,
        name: "Jcole",
        isSelected: false,
        isHighlight: false,
      },
    ],
  },
];

const Home = ({ feedsData = data }: Props) => {
  // const items = sourceData.map(folder => item.children);
  const items: any[] = sourceData.reduce(
    (previousValue: any[], currentValue: Folder) => {
      const result = [
        ...previousValue,
        ...currentValue.children.map((item: Source): {
          key: string;
          name: string;
        } => ({
          key: item.id,
          name: item.name,
        })),
      ];
      return result;
    },
    []
  );

  const groups: any[] = sourceData.reduce(
    (previousValue: any[], currentValue: Folder) => {
      const result = [
        ...previousValue,
        {
          key: currentValue.id,
          name: currentValue.name,
          startIndex: previousValue.length,
          count: currentValue.children.length,
          level: 0,
        },
      ];
      return result;
    },
    []
  );

  const groupCellRender = (
    nestingDepth?: number,
    item?: any,
    index?: number
  ): React.ReactNode => (
    <DetailsRow
      className=""
      key={item.key}
      item={item}
      columns={[
        {
          key: "name",
          name: "name",
          fieldName: "name",
          minWidth: 100,
          maxWidth: 500,
        },
      ]}
      groupNestingDepth={nestingDepth}
    />
  );

  return (
    <div className="flex h-screen">
      <div className="w-2/12">
        <GroupedList
          onRenderCell={groupCellRender}
          checkboxVisibility={2}
          items={items}
          groups={groups}
        />
      </div>
      <div className="scrollbar w-3/12 bg-gray-100 h-full overflow-x-auto">
        {feedsData.map((item) => (
          <Group key={item.id} {...item} />
        ))}
      </div>
      <div className="w-7/12 bg-white"></div>
    </div>
  );
};

export default Home;
