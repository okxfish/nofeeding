import {
  TextField,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  Label,
  Stack,
  IconButton,
  IDropdownOption,
} from "@fluentui/react";
import { NormalizedSchema } from "normalizr";
import React, { useState } from "react";
import { QueryKey, useMutation, useQueryClient } from "react-query";
import { default as api } from "../../api";
import { FolderEntity } from "../feed/overviewPane";
import { getTagNameFromId } from "./../feed/overviewPane";

export interface Props {
  className?: string;
  onCancel?: () => void;
}

const AddFeed = (props: Props) => {
  const [selectedFolder, setSelectedFolder] = useState<IDropdownOption>();
  const queryClient = useQueryClient();

  const getDropdownOptions = (): IDropdownOption[] => {
    const tagList =
      queryClient.getQueryData<NormalizedSchema<FolderEntity, string[]>>(
        "home/folderQuery"
      );
    if (tagList) {
      const tagResult = tagList.result;
      const tagEntities = tagList.entities.folder;
      return tagResult
        .filter((key) => tagEntities[key].type === "folder")
        .map((key) => ({
          key: tagEntities[key].id,
          text: getTagNameFromId(tagEntities[key].id),
        }));
    } else {
      return [];
    }
  };

  const addFeedMutation = useMutation(
    ({ feedUrl, folderId }: { feedUrl: string; folderId: string }) =>
      api.inoreader.addSubscription(`feed/${feedUrl}`, folderId),
    {
      onSuccess: () => {
        alert("Success");
        queryClient.refetchQueries({
          predicate: (query) => {
            const keys: QueryKey[] = [
              "home/subscriptionsListQuery",
              "streamPreferences",
              "home/folderQuery",
            ];
            return keys.includes(query.queryKey);
          },
        });
      },
      onError: (error) => {
        alert("Failed");
      },
    }
  );

  const handleDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number
  ) => {
    setSelectedFolder(option);
  };

  const handleOnSubmit = (e?) => {
    e.preventDefault();
    const form = e.target;
    const feedUrl = form["feedUrl"].value;
    addFeedMutation.mutate({ feedUrl, folderId: String(selectedFolder?.key) });
  };

  return (
    <form onSubmit={handleOnSubmit} className="h-full">
      <div className="p-8">
        <Stack className="mb-4" horizontal>
          <Label className="flex-1 text-xl">Add new feed</Label>
        </Stack>
        <Stack>
          <Label>RSS Url</Label>
          <TextField
            name="feedUrl"
            placeholder="rss url here"
            className="w-96 max-w-full mb-4"
            required
          />
          <Label>Folder to store the RSS</Label>
          <Dropdown
            selectedKey={selectedFolder ? selectedFolder.key : undefined}
            options={getDropdownOptions()}
            placeHolder="select a folder to categroy the feed"
            onChange={handleDropdownChange}
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
            onClick={props.onCancel}
            text="Cancel"
          />
        </Stack.Item>
        <Stack.Item grow={1}>
          <PrimaryButton
            className="w-full"
            disabled={addFeedMutation.isLoading}
            type="submit"
            text="Add"
          />
        </Stack.Item>
      </Stack>
    </form>
  );
};

export default AddFeed;
