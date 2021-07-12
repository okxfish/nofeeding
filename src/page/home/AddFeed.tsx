import {
  TextField,
  PrimaryButton,
  DefaultButton,
  Label,
  Stack,
  IconButton,
} from "@fluentui/react";
import React from "react";
import { QueryKey, useMutation, useQueryClient } from "react-query";
import { default as api } from "../../api";

export interface Props {
  className?: string;
  onCancel?: () => void;
}

const AddFeed = (props: Props) => {
  const queryClient = useQueryClient();

  const addFeedMutation = useMutation(
    (feedUrl: string) => api.inoreader.addSubscription(feedUrl),
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

  const handleOnSubmit = (e?) => {
    e.preventDefault();
    const form = e.target;
    const feedUrl = form["feedUrl"].value;
    addFeedMutation.mutate(feedUrl);
  };

  return (
    <form onSubmit={handleOnSubmit} className="p-4 pt-2 h-full">
      <Stack horizontal>
        <Label className="mb-4 flex-1">add new feed</Label>
        <IconButton
          iconProps={{ iconName: "Cancel" }}
          onClick={props.onCancel}
        />
      </Stack>
      <div>
        <Stack>
          <TextField
            name="feedUrl"
            placeholder="rss url here"
            className="w-96 mb-20"
            required
          />
          <Stack
            horizontal
            horizontalAlign="end"
            tokens={{ childrenGap: "8px" }}
          >
            <Stack.Item>
              <DefaultButton onClick={props.onCancel} text="Cancel" />
            </Stack.Item>
            <Stack.Item>
              <PrimaryButton
                disabled={addFeedMutation.isLoading}
                type="submit"
                text="Add"
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    </form>
  );
};

export default AddFeed;
