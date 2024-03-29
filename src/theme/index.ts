import { PartialTheme, Theme } from "@fluentui/react";
import { getComponentsStyle } from "./getComponentsStyle";
import { lightThemePalette, darkThemePalette } from "./palette";
export { useThemeStyles } from "./useThemeStyles";

export const lightTheme: PartialTheme | Theme = {
    components: getComponentsStyle(lightThemePalette),
    palette: lightThemePalette,
};

export const darkTheme = {
    components: getComponentsStyle(darkThemePalette),
    palette: darkThemePalette,
};
