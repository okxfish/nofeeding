import React, { ReactElement, useContext } from "react";
import {
  Stack,
  Text,
  INavLink,
  Nav,
  IRenderFunction,
  Icon,
  INavLinkGroup,
  CommandBar,
  ICommandBarItemProps,
} from "@fluentui/react";
import { useHistory, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";
import { get } from "lodash";
import queryString from "query-string";
import { IdValuePair, SystemStreamIDs } from "../../api/inoreader";
import { SettingContext, UserInfoContext, DispatchContext } from "./../../context";
import { Tag } from "../../api/mockData";
import { ModalKeys } from "../../reducer";

export interface Props {
  className?: string;
}
export interface KeyValuePair<T> {
  [key: string]: T;
}
export interface Sortable {
  sortid: string;
}

export interface Subscription extends Sortable {
  id: string;
  title: string;
  iconUrl?: string;
  iconName?: string;
}

export interface InoreaderTag extends Sortable {
  id: string;
  type?: "tag" | "folder" | "active_search";
  unread_count?: number;
  unseen_count?: number;
}

export interface SubscriptionEntity {
  subscription: { [key: string]: Subscription };
}

export interface Folder extends InoreaderTag {
  isCollapsed?: boolean;
}

export interface FolderEntity {
  folder: { [key: string]: Folder };
}

export const getTagNameFromId = (tagId: string): string => {
  const slice: string[] = tagId.split("/");
  return slice[slice.length - 1];
};

const OverviewPane = ({ className }: Props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useContext(DispatchContext);
  const setting = useContext(SettingContext);
  const userInfo = useContext(UserInfoContext);

  const queryClient = useQueryClient();

  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

    const iconRender = (): ReactElement | null => {
      if (props.type === "feed") {
        if (setting.subscription.isIconDisplay && props.iconUrl) {
          return <img className="w-6 h-6 mr-2" src={props.iconUrl} alt="" />;
        } else {
          return (
            <Icon
              iconName={props.iconName}
              className="mr-2 w-6 h-6 leading-6"
            />
          );
        }
      }

      return (
        <Icon
          iconName={props.iconName}
          className="mr-2 w-6 h-6 leading-6"
        />
      );
    };

    return (
      <Stack horizontal verticalAlign="center" className="w-full">
        {iconRender()}
        <Text block nowrap className="flex-1 text-left">
          {props.name}
        </Text>
        {props.type !== "feed" && props.unreadCount !== 0 ? (
          <span >
            {props.unreadCount}
          </span>
        ) : null}
      </Stack>
    );
  };

  const subscriptionsListData = queryClient.getQueryData(
    "home/subscriptionsListQuery"
  );
  const folderData = queryClient.getQueryData("home/folderQuery");
  const streamPreferencesData = queryClient.getQueryData("streamPreferences");

  if (!subscriptionsListData || !folderData || !streamPreferencesData) {
    return null;
  }

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
    const qs = queryString.parse(location.search);
    history.push({
      pathname: "/feed",
      search: queryString.stringify({ ...qs, streamId: item?.key }),
    });
  };

  const getIdBySortidCurry = ({
    subscriptionById,
    tagsById,
  }: {
    subscriptionById: {
      [key: string]: Subscription;
    };
    tagsById: {
      [key: string]: Folder;
    };
  }) => {
    const createIdTableIndexedBySortid = (tagsById: {
      [id: string]: Sortable;
    }): { [sortId: string]: string } => {
      let result = {};
      for (const id in tagsById) {
        if (Object.prototype.hasOwnProperty.call(tagsById, id)) {
          const tag = tagsById[id];
          result[tag.sortid] = id;
        }
      }
      return result;
    };

    const subscriptionIdTableIndexBySortid =
      createIdTableIndexedBySortid(subscriptionById);

    const tagIdTableIndexBySortid = createIdTableIndexedBySortid(tagsById);

    const sortidToIdMap = {
      ...subscriptionIdTableIndexBySortid,
      ...tagIdTableIndexBySortid,
    };

    return (sortid: string) => sortidToIdMap[sortid];
  };

  const createLinkUrl = ((search: string) => {
    const queryObject = queryString.parse(search);
    return (id: string) => {
      return `/feed?${queryString.stringify({
        ...queryObject,
        streamId: id,
      })}`;
    };
  })(location.search);

  const getLinks = (streamPref: IdValuePair[]): any[] => {
    const getSortIdString = (streamPref: IdValuePair[]): string => {
      return streamPref[streamPref.length - 1]?.value;
    };

    const chunck = (str: string): string[] => {
      return str.match(/.{1,8}/g) || [];
    };

    const sortIdString = getSortIdString(streamPref);
    const childrenSortIds = chunck(sortIdString);
    const links = childrenSortIds;
    return links;
  };

  const createBuildInNavLink = ({ name, id, iconName }): INavLink => {
    return (
      {
        name,
        key: id,
        url: createLinkUrl(id),
        type: 'buildIn',
        iconName,
      }
    )
  }

  const createLink = (subscription: Subscription): INavLink => {
    return {
      name: subscription.title,
      key: subscription.id,
      url: createLinkUrl(subscription.id),
      type: "feed",
      iconUrl: subscription.iconUrl,
    };
  };

  const createTagLink = (tag: Tag): INavLink => {
    return {
      name: getTagNameFromId(tag.id),
      key: tag.id,
      url: createLinkUrl(tag.id),
      type: "tag",
      iconName: 'Tag',
      unreadCount: tag.unread_count,
    };
  };

  const createFolderLink = (
    tag: Tag,
    links: INavLink[],
    id?: string
  ): INavLink => {
    if (!tag && id) {
      const name = getTagNameFromId(id);
      return {
        name,
        links: links,
        key: id,
        url: createLinkUrl(id),
        type: "folder",
        iconName: "FolderHorizontal",
      };
    } else {
      const name = getTagNameFromId(tag.id);
      return {
        name: name,
        links: links,
        key: tag.id,
        url: createLinkUrl(tag.id),
        type: "folder",
        iconName: "FolderHorizontal",
        unreadCount: tag?.unread_count,
      };
    }
  };

  const getNavLinkGroupProps = (
    rootStreamId: string,
    {
      subscriptionById,
      tagsById,
      streamPrefById,
    }: {
      subscriptionById: KeyValuePair<Subscription>;
      tagsById: KeyValuePair<Folder>;
      streamPrefById: KeyValuePair<IdValuePair[]>;
    }
  ): INavLinkGroup | null => {
    if (!subscriptionById || !tagsById || !streamPrefById) {
      return null;
    }

    const getIdBySortid = getIdBySortidCurry({ subscriptionById, tagsById });

    const _getNavLinkGroupProps = (id: string): any => {
      const isFeedId = (id: string): boolean => {
        return !!id && id.startsWith("feed/");
      };

      if (isFeedId(id)) {
        const subscription = subscriptionById[id];
        return createLink(subscription);
      } else {
        const tag = tagsById[id];
        if (tag && tag.type === "tag") {
          return createTagLink(tag);
        } else {
          const links = getLinks(streamPrefById[id])
            .map(getIdBySortid)
            .map(_getNavLinkGroupProps);
          return createFolderLink(tag, links, id);
        }
      }
    };

    return _getNavLinkGroupProps(rootStreamId);
  };

  let group = getNavLinkGroupProps(
    `user/${userInfo?.userId}/state/com.google/root`,
    {
      subscriptionById: get(subscriptionsListData, "entities.subscription"),
      tagsById: get(folderData, "entities.folder"),
      streamPrefById: get(streamPreferencesData, "streamprefs"),
    }
  );

  if (group) {
    const allLink = createBuildInNavLink({
      id: '',
      name: 'All',
      iconName: 'PreviewLink',
    })

    const favLink = createBuildInNavLink({
      id: SystemStreamIDs.STARRED,
      name: 'Stared',
      iconName: 'FavoriteStar',
    })

    group.links.unshift(allLink, favLink);
  }

  const commandItems: ICommandBarItemProps[] = [
    {
      key: "newFeed",
      text: "Add Subscript",
      iconOnly: true,
      iconProps: { iconName: "Add" },
      onClick: () =>
        dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.AddFeedModal }),
    }
  ]

  const overflowItems: ICommandBarItemProps[] = [];

  return (
    <Stack className={`${className} min-h-0`}>
      <Stack className="py-2 pl-2" horizontal verticalAlign="center">
        <Text className="text-xl font-medium flex-1">Fread</Text>
        <CommandBar
          className=""
          items={commandItems}
          overflowItems={overflowItems}
          styles={{ root: 'p-0' }}
        />
      </Stack>
      <Nav
        styles={{ chevronButton: "", link: "pl-8 pr-6", compositeLink: "" }}
        groups={group ? [group] : null}
        onRenderLink={onRenderLink}
        onLinkClick={handleLinkClick}
        onRenderGroupHeader={() => null}
      />
    </Stack>
  );
};

export default React.memo(OverviewPane);
