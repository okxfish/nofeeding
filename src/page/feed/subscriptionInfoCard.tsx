import { Stack, Icon, IconButton, Text, Image } from "@fluentui/react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useQueryClient } from "react-query";
import { get } from "lodash";

export interface Props {
  rootClassName?: string;
}

const SubscriptionInfoCard = ({ rootClassName }: Props) => {
  const location = useLocation();
  const qs = queryString.parse(location.search);
  const queryClient = useQueryClient();
  const subscriptionsList = queryClient.getQueryData(
    "home/subscriptionsListQuery"
  );
  const streamId = qs.streamId;
  const subscription = get(
    subscriptionsList,
    `entities.subscription['${streamId}']`
  );
  const name = subscription?.title;
  const feedType = subscription?.feedType;
  const iconUrl = subscription?.iconUrl;

  const iconRender = () => {
    if (feedType === "rss" && iconUrl) {
      return <Image src={iconUrl} className="mr-2" />;
    } else {
      return <Icon iconName="FolderHorizontal" className="text-lg mr-2" />;
    }
  };

  return (
    <Stack
      className={`p-1 ${rootClassName}`}
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
    >
      {iconRender()}
      <Text className="text-lg flex-1">{name}</Text>
      <IconButton
        iconProps={{ iconName: "Settings" }}
        styles={{ root: "w-auto h-auto p-0", icon: "m-0" }}
      />
    </Stack>
  );
};

export default SubscriptionInfoCard;
