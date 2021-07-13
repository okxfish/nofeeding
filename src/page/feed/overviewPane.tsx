import React, { ReactElement, useContext } from "react";
import {
  Stack,
  Text,
  INavLink,
  Nav,
  IRenderFunction,
  Icon,
  INavLinkGroup,
} from "@fluentui/react";
import OverviewCell from "./overviewCell";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { default as api } from "../../api";
import { default as get } from "lodash.get";
import { normalize, schema, NormalizedSchema } from "normalizr";
import queryString from "query-string";
import { IdValuePair, SystemStreamIDs } from "../../api/inoreader";
import { StreamPreferenceListResponse } from "./../../api/inoreader";
import { SettingContext, UserInfoContext } from "./../../context";
import { Tag } from "../../api/mockData";

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

const subscription = new schema.Entity("subscription", undefined);
const folder = new schema.Entity("folder");

export const getTagNameFromId = (tagId: string): string => {
  const slice: string[] = tagId.split("/");
  return slice[slice.length - 1];
};

const OverviewPane = ({ className }: Props) => {
  const history = useHistory();
  const location = useLocation();
  const commonPx = "px-2";
  const setting = useContext(SettingContext);
  const userInfo = useContext(UserInfoContext);

  const subscriptionsListQuery = useQuery<
    NormalizedSchema<SubscriptionEntity, string[]>
  >(
    "home/subscriptionsListQuery",
    async () => {
      const subscriptionList = await api.inoreader.getSubscriptionList();
      const subscriptions = get(subscriptionList, "data.subscriptions");
      const subscriptionsNormalized = normalize<
        Subscription,
        SubscriptionEntity
      >(subscriptions, [subscription]);
      return subscriptionsNormalized;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const streamPreferencesQuery = useQuery<StreamPreferenceListResponse>(
    "streamPreferences",
    async () => {
      const res = await api.inoreader.getStreamPreferenceList();
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const folderQuery = useQuery<NormalizedSchema<FolderEntity, string[]>>(
    "home/folderQuery",
    async () => {
      const res = await api.inoreader.getFolderOrTagList(1, 1);
      const tags = res.data.tags;
      const foldersNormalized = normalize<InoreaderTag, FolderEntity>(tags, [
        folder,
      ]);
      return foldersNormalized;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

    const iconRender = (): ReactElement | null => {
      if (props.type === "feed") {
        if (setting.subscription.isIconDisplay && props.iconUrl) {
          return <img className="w-4 h-4 mr-2" src={props.iconUrl} alt="" />;
        } else {
          return null;
        }
      } else {
        return (
          <Icon
            iconName={props.type === "tag" ? "Tag" : "FolderHorizontal"}
            className="mr-2"
          />
        );
      }
    };

    return (
      <Stack horizontal verticalAlign="center" className="w-full">
        {iconRender()}
        <Text block nowrap className="flex-1 text-left font-medium">
          {props.name}
        </Text>
        {props.type !== "feed" ? <span>{props.unreadCount}</span> : null}
      </Stack>
    );
  };

  if (
    !subscriptionsListQuery.data ||
    !folderQuery.data ||
    !streamPreferencesQuery.data
  ) {
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

  const getLinks = (streamPref:IdValuePair[]): any[] => {
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
      unreadCount: tag.unread_count,
    };
  };

  const createFolderLink = (tag: Tag, links: INavLink[], id?:string): INavLink => {
    if (!tag && id) {
      const name = getTagNameFromId(id);
      return {
        name,
        key: id,
        links: links,
        url: createLinkUrl(id),
      }
    } else {
      const name = getTagNameFromId(tag.id);
      return {
        name: name,
        links: links,
        key: tag.id,
        url: createLinkUrl(tag.id),
        type: "folder",
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
          
          return createFolderLink(tag, links, id );
        }
      }
    };

    return _getNavLinkGroupProps(rootStreamId);
  };

  const group = getNavLinkGroupProps(
    `user/${userInfo?.userId}/state/com.google/root`,
    {
      subscriptionById: get(
        subscriptionsListQuery,
        "data.entities.subscription"
      ),
      tagsById: get(folderQuery, "data.entities.folder"),
      streamPrefById: get(streamPreferencesQuery, "data.streamprefs"),
    }
  );

  const handleAllFeedClick = () => history.push("/feed");

  const handleStarFeedClick = () =>
    history.push({
      pathname: "/feed",
      search: queryString.stringify({
        streamId: SystemStreamIDs.STARRED,
        unreadOnly: true,
      }),
    });

  return (
    <Stack className={`${className} min-h-0 p-2`}>
      <OverviewCell
        className={commonPx}
        iconProps={{ iconName: "PreviewLink" }}
        text="all"
        onClick={handleAllFeedClick}
      />
      <OverviewCell
        className={commonPx}
        iconProps={{ iconName: "FavoriteStar" }}
        text="star"
        onClick={handleStarFeedClick}
      />
      <Nav
        styles={{ chevronButton: "bg-transparent text-current", link: "pl-8 pr-6 text-current", compositeLink: 'text-current hover:bg-white' }}
        groups={group ? [group] : null}
        onRenderLink={onRenderLink}
        onLinkClick={handleLinkClick}
        onRenderGroupHeader={() => null}
      />
    </Stack>
  );
};

export default React.memo(OverviewPane);
