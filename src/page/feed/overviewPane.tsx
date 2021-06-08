import React, { ReactElement, useContext } from "react";
import {
  Stack,
  Text,
  Label,
  INavLink,
  Nav,
  IRenderFunction,
  Icon,
  INavLinkGroup,
} from "@fluentui/react";
import OverviewCell from "./overviewCell";
import { useHistory } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { default as api } from "../../api";
import { default as get } from "lodash.get";
import { normalize, schema, NormalizedSchema } from "normalizr";
import { produce } from "immer";
import queryString from "query-string";
import { IdValuePair, SystemStreamIDs } from "../../api/inoreader";
import { SettingContext } from "./../../context/setting";
import { StreamPreferenceListResponse } from "./../../api/inoreader";
import { UserInfoContext } from "./../../context/userInfo";

export interface Props {
  className?: string;
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

interface SubscriptionEntity {
  subscription: { [key: string]: Subscription };
}

interface Folder extends InoreaderTag {
  isCollapsed?: boolean;
}

interface FolderEntity {
  folder: { [key: string]: Folder };
}

const subscription = new schema.Entity("subscription", undefined);
const folder = new schema.Entity("folder");

const OverviewPane = ({ className }: Props) => {
  const history = useHistory();
  const commonPx = "px-2";
  const queryClient = useQueryClient();
  const { setting, setSetting } = useContext(SettingContext);
  const userInfo = useContext(UserInfoContext);

  const setSubscriptionDataById = (streamId: string, updater: any): void =>
    queryClient.setQueryData(
      ["home/subscriptionsListQuery"],
      produce((data) => {
        const subscription = get(data, `entities.subscription['${streamId}']`);
        updater(subscription);
      })
    );

  const setFolderDataById = (folderId: string, updater: any): void =>
    queryClient.setQueryData(
      ["home/folderQuery"],
      produce((data) => {
        const folder = get(data, `entities.folder['${folderId}']`);
        updater(folder);
      })
    );

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
    ["streamPreferences"],
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
    ["home/folderQuery"],
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
        <Text block nowrap className="flex-1 text-left">
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

  const getIdBySortid = (sortid: string): string => {
    const subscriptionIdTableIndexBySortid = createIdTableIndexedBySortid(
      subscriptionsListQuery.data.entities.subscription
    );

    const tagIdTableIndexBySortid = createIdTableIndexedBySortid(
      folderQuery.data.entities.folder
    );

    const sortidToIdMap = {
      ...subscriptionIdTableIndexBySortid,
      ...tagIdTableIndexBySortid,
    };
    return sortidToIdMap[sortid];
  };

  const isFeedId = (id: string): boolean => {
    return id.startsWith("feed/");
  };

  const getFolderById = (id: string): Folder =>
    folderQuery.data.entities.folder[id];

  const getSubscriptionById = (id: string): Subscription =>
    subscriptionsListQuery.data.entities.subscription[id];

  const getStreamPrefById = (id: string): IdValuePair[] => {
    return streamPreferencesQuery.data.streamprefs[id];
  };

  const getSortIdString = (streamPref: IdValuePair[]): string => {
    return streamPref[streamPref.length - 1]?.value;
  };

  const chunck = (str: string): string[] => {
    return str.match(/.{1,8}/g) || [];
  };

  const getTagName = (folderId: string): string => {
    const slice: string[] = folderId.split("/");
    return slice[slice.length - 1];
  };

  const getNavLinks = (id: string): any => {
    const url = `/feed?streamId=${id}`;
    if (isFeedId(id)) {
      const subscription = getSubscriptionById(id);
      return {
        name: subscription.title,
        key: id,
        url: url,
        type: "feed",
        iconUrl: subscription.iconUrl,
      };
    } else {
      const tag = getFolderById(id);
      if (tag && tag.type === "tag") {
        return {
          name: getTagName(id),
          key: id,
          url: url,
          type: "tag",
          unreadCount: tag.unread_count,
        };
      } else {
        const streamPref = getStreamPrefById(id);
        const sortIdString = getSortIdString(streamPref);
        const childrenSortIds = chunck(sortIdString);
        const links = childrenSortIds.map(getIdBySortid).map(getNavLinks);
        const name = getTagName(id);
        return {
          name: name === "root" ? "Feed" : name,
          links: links,
          key: id,
          url: url,
          type: "folder",
          unreadCount: tag?.unread_count,
        };
      }
    }
  };

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
    history.push({ pathname: "/feed", search: `streamId=${item?.key}` });
  };

  const groups = userInfo
    ? [getNavLinks(`user/${userInfo.userId}/state/com.google/root`)]
    : [];

  return (
    <Stack className={`${className} min-h-0`}>
      <OverviewCell
        className={commonPx}
        iconProps={{ iconName: "PreviewLink" }}
        text="all"
        onClick={() => history.push("/feed")}
      />
      <OverviewCell
        className={commonPx}
        iconProps={{ iconName: "FavoriteStar" }}
        text="star"
        onClick={() =>
          history.push({
            pathname: "/feed",
            search: queryString.stringify({
              streamId: SystemStreamIDs.STARRED,
              unreadOnly: "0",
            }),
          })
        }
      />
      <Nav
        styles={{ chevronButton: "bg-transparent" }}
        groups={groups}
        onRenderLink={onRenderLink}
        onLinkClick={handleLinkClick}
      />
    </Stack>
  );
};

export default OverviewPane;
