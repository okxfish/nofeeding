import { Stack, Icon, IconButton, Text, Link } from "@fluentui/react";
import React, { useState } from "react";

export interface Props {
  id: string;
  name: string;
  htmlUrl: string;
  iconUrl: string;
  xmlUrl: string;
  orderNumber: number | string;
  lastUpdateTime: string;
  updateCycle: string;
}

const SubscriptionInfoCard = ({
  name,
  htmlUrl,
  iconUrl,
  xmlUrl,
  orderNumber,
  lastUpdateTime,
  updateCycle,
}: Props) => {
  const [isSubscriptionInfoCardCollapsed, setIsSubscriptionInfoCardCollapsed] =
    useState<boolean>(false);
  if (isSubscriptionInfoCardCollapsed) {
    return (
      <Stack
        className="px-4 py-1"
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
      >
        <Icon iconName="Contact" className="text-lg mr-2" />
        <Text className="text-lg flex-1">{name}</Text>
        <IconButton iconProps={{ iconName: "Settings" }} />
        <IconButton
          iconProps={{ iconName: "ChevronDown" }}
          onClick={() => setIsSubscriptionInfoCardCollapsed(false)}
        />
      </Stack>
    );
  } else {
    return (
      <div className="px-4 pt-8 pb-0">
        <Stack>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="start"
          >
            <Icon iconName="Contact" className="text-5xl mb-2" />
            <IconButton iconProps={{ iconName: "Settings" }} />
          </Stack>
          <Text className="text-2xl">{name}</Text>
          <Text className="text-base text-gray-400">{name}</Text>
          <Link href={htmlUrl}>{htmlUrl}</Link>
        </Stack>
        <Stack
          className="mt-4"
          horizontal
          horizontalAlign="space-between"
          tokens={{ childrenGap: "16px" }}
        >
          <Stack className="flex-1">
            <Text className="text-gray-400">order:</Text>
            <Text className="text-gray-600">{orderNumber}</Text>
          </Stack>
          <Stack className="flex-1">
            <Text className="text-gray-400">last update:</Text>
            <Text className="text-gray-600">{lastUpdateTime}</Text>
          </Stack>
          <Stack className="flex-1">
            <Text className="text-gray-400">update cycle:</Text>
            <Text className="text-gray-600">{updateCycle}</Text>
          </Stack>
        </Stack>
        <Stack className="mt-4" horizontal horizontalAlign="space-between">
          <IconButton
            className="ml-auto mr-0"
            iconProps={{ iconName: "ChevronUp" }}
            onClick={() => setIsSubscriptionInfoCardCollapsed(true)}
          />
        </Stack>
      </div>
    );
  }
};

export default SubscriptionInfoCard;
