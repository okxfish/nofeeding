import { useContext } from "react";
import { Stack, Text, Icon } from "@fluentui/react";
import SideBarButton from "./sideBarButton";
import queryString from "query-string";
import { DispatchContext } from "../../context";
import { useQueryClient } from "react-query";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";
import { get } from "lodash";
import { ModalKeys } from "../../reducer";
import { getTagNameFromId } from "./../feed/overviewPane";
import HomeCommandBar from "./HomeCommandBar";

const Header = () => {
  const dispatch = useContext(DispatchContext);
  const history = useHistory();
  const queryClient = useQueryClient();
  const location = useLocation();
  const qs = queryString.parse(location.search);
  const { streamId } = qs;

  const subscriptionsList = queryClient.getQueryData(
    "home/subscriptionsListQuery"
  );

  const handleBackBtnClick = () => {
    history.goBack();
  };

  const handleHomeBtnClick = () => {
    history.push("/");
  };

  const subscription = get(
    subscriptionsList,
    `entities.subscription['${streamId}']`
  );

  const folderName =
    streamId && typeof streamId === "string"
      ? getTagNameFromId(streamId)
      : "All article";

  const name = subscription ? subscription.title : folderName;

  return (
    <Stack
      horizontal
      verticalAlign="center"
      className="h-12 pr-4 space-x-2"
      style={{ flexShrink: 0 }}
    >
      <div className="w-auto sm:w-72">
        <SideBarButton
          iconProps={{ iconName: "Back" }}
          onClick={handleBackBtnClick}
          className="mx-2"
        />
      </div>
      <Switch>
        <Route
          path="/settings"
          render={() => <Text className="text-lg">Settings</Text>}
        />
        <Route
          path={["/", "/feed"]}
          render={() => (
            <>
              <Stack
                horizontal
                verticalAlign="center"
                className="space-x-2 flex sm:hidden"
                onClick={() =>
                  dispatch({
                    type: "OPEN_MODAL",
                    modalKey: ModalKeys.OverViewPane,
                  })
                }
              >
                <Text className="text-lg flex-1" block nowrap>
                  {name}
                </Text>
                <Icon iconName="ChevronDown" />
              </Stack>
              <Text className="text-lg flex-1 hidden sm:block" block nowrap>
                {name}
              </Text>
            </>
          )}
        />
      </Switch>
      <HomeCommandBar className="hidden sm:flex flex-1 justify-end" />
    </Stack>
  );
};

export default Header;
