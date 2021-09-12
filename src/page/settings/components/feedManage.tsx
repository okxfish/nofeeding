import { useMutation, useQueryClient } from "react-query";
import { get, isEmpty } from "lodash";
import { Subscription } from "./../../../api/mockData";
import {
  DetailsList,
  IColumn,
  IconButton,
  Image,
  Stack,
  Text,
  Modal,
  TextField,
  DefaultButton,
  PrimaryButton,
  Label,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import api from "../../../api";
import { produce, current } from "immer";
import { useState } from "react";
import Layout from "./layout";

const FeedManage = () => {
  const [isRenameModalOpened, setIsRenameModalOpened] = useState(false);
  const [seletedIndex, setSeletedIndex] = useState(-1);
  const queryClient = useQueryClient();
  const feedsQueryData = queryClient.getQueryData(
    "home/subscriptionsListQuery"
  );
  const entities: Subscription = get(
    feedsQueryData,
    "entities.subscription",
    {}
  );

  const result: string[] = get(feedsQueryData, "result", []);

  const feeds = result.map((id) => {
    return entities[id];
  });

  const deleteFeedMutation = useMutation(
    (streamId: string): any => api.inoreader.unsubscription(streamId),
    {
      onSuccess: (data, streamId: string) => {
        queryClient.setQueryData(
          "home/subscriptionsListQuery",
          produce((data: any) => {
            data.result = data.result.filter((item) => item !== streamId);
          })
        );
      },
    }
  );

  const renameFeedMutation = useMutation(
    ({ streamId, title }: { streamId: string; title: string }): any =>
      api.inoreader.renameFeed(streamId, title),
    {
      onSuccess: (data, { streamId, title }) => {
        queryClient.setQueryData(
          "home/subscriptionsListQuery",
          produce((data: any) => {
            const targetFeed = get(
              data,
              `entities.subscription['${streamId}']`
            );
            console.log("before", current(targetFeed));
            targetFeed.title = title;
            console.log("after", current(targetFeed));
            setIsRenameModalOpened(false);
          })
        );
      },
    }
  );

  const columns: IColumn[] = [
    {
      key: "column1",
      name: "Icon",
      isIconOnly: true,
      fieldName: "Icon",
      minWidth: 16,
      maxWidth: 24,
      onColumnClick: () => { },
      onRender: (item: any) => (
        <Image src={item.iconUrl} className=" h-4 w-4" />
      ),
    },
    {
      key: "column2",
      name: "Name",
      className: "flex-1",
      isIconOnly: false,
      fieldName: "title",
      minWidth: 128,
      maxWidth: 400,
    },
    {
      key: "column3",
      name: "Actions",
      isIconOnly: false,
      minWidth: 32,
      maxWidth: 128,
      onRender: (item: Subscription, index?: number) => {
        const onDeleteBtnClick = () => deleteFeedMutation.mutate(item.id);

        const onRenameBtnClick = () => {
          if (typeof index === "number" && index < feeds.length) {
            setSeletedIndex(index);
            setIsRenameModalOpened(true);
          } else {
            console.error("index is not a number or out of the bound of feeds");
          }
        };

        return (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <IconButton
              iconProps={{ iconName: "Rename" }}
              onClick={onRenameBtnClick}
            />
            <IconButton
              iconProps={{ iconName: "Delete" }}
              onClick={onDeleteBtnClick}
            />
          </Stack>
        );
      },
    },
  ];

  const onRename = (e) => {
    e.preventDefault();
    if (seletedIndex >= 0 && !isEmpty(feeds)) {
      const form = e.target;
      const streamId = feeds[seletedIndex].id;
      const newTitle = form["newFeedTitle"].value;
      renameFeedMutation.mutate({ streamId, title: newTitle });
    }
  };

  return (
    <Layout title="Subscription">
      <div className="h-full w-full overflow-y-auto sm:scrollbar">
        <DetailsList items={feeds} columns={columns} />
        <Modal isOpen={isRenameModalOpened}>
          <form onSubmit={onRename}>
            <div className="p-8">
              <Stack className="mb-4" horizontal>
                <Label className="flex-1 text-xl">Rename the feed</Label>
              </Stack>
              <Stack>
                <Label>New Title</Label>
                <TextField
                  name="newFeedTitle"
                  placeholder={get(
                    feeds,
                    `[${seletedIndex}].title`,
                    "input a new title"
                  )}
                  className="w-96 max-w-full mb-4"
                  required
                />
              </Stack>
            </div>
            <Stack
              className="px-8 py-6"
              horizontal
              horizontalAlign="end"
              verticalAlign="center"
              tokens={{ childrenGap: "16px" }}
            >
              <Stack.Item grow={1}>
                <DefaultButton
                  className="w-full"
                  onClick={() => setIsRenameModalOpened(false)}
                  text="Cancel"
                />
              </Stack.Item>
              <Stack.Item grow={1}>
                <PrimaryButton
                  className="w-full"
                  disabled={renameFeedMutation.isLoading}
                  type="submit"
                >
                  Rename
                  {renameFeedMutation.isLoading && (
                    <Spinner size={SpinnerSize.xSmall} className="ml-2" />
                  )}
                </PrimaryButton>
              </Stack.Item>
            </Stack>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default FeedManage;
