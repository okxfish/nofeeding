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

  
  const handleBackBtnClick = () => {
    history.goBack();
  };
  
  const handleHomeBtnClick = () => {
    history.push("/");
  };

  return (
    <Stack
      horizontal
      verticalAlign="center"
      className="h-12 pr-4 space-x-2"
      style={{ flexShrink: 0 }}
    >
      <div className="w-auto sm:w-nav-pane">
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
              
            </>
          )}
        />
      </Switch>
      <HomeCommandBar className="hidden sm:flex flex-1 justify-end" />
    </Stack>
  );
};

export default Header;
