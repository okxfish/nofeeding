import { mergeStyleSets, PartialTheme, Theme, useTheme } from "@fluentui/react";
import { NeutralColors, IPalette } from "@fluentui/theme";

const lightThemePalette: Partial<IPalette> = {
  themePrimary: "#016339",
  themeLighterAlt: "#fbfbfb",
  themeLighter: "#f6f6f6",
  themeLight: "#e5e5e5",
  themeTertiary: "#989898",
  themeSecondary: "#696969",
  themeDarkAlt: "#4c4c4c",
  themeDark: "#404040",
  themeDarker: "#2f2f2f",
  neutralLighterAlt: "#fbfbfb",
  neutralLighter: "#f9f9f9",
  neutralLight: "#f3f3f3",
  neutralQuaternaryAlt: "#e5e5e5",
  neutralQuaternary: "#cccccc",
  neutralTertiaryAlt: "#cccccc",
  neutralTertiary: "#101010",
  neutralSecondary: "#202020",
  neutralPrimaryAlt: "#2f2f2f",
  neutralPrimary: "1b1b1b",
  neutralDark: "#666666",
  black: "#1b1b1b",
  white: "#fbfbfb",
};

const darkThemePalette: Partial<IPalette> = {
  themePrimary: "#97bfde",
  themeLighterAlt: "#060809",
  themeLighter: "#181f23",
  themeLight: "#2d3943",
  themeTertiary: "#5b7385",
  themeSecondary: "#85a8c3",
  themeDarkAlt: "#a0c5e1",
  themeDark: "#aecee6",
  themeDarker: "#c2daec",
  neutralLighterAlt: "#fdfdfd",
  neutralLighter: "#272727",
  neutralLight: "#202020",
  neutralQuaternaryAlt: "#303030",
  neutralQuaternary: "#5f5f5f",
  neutralTertiaryAlt: "#7a7a7a",
  neutralTertiary: "#f0f0f0",
  neutralSecondary: "#f2f2f2",
  neutralPrimaryAlt: "#f5f5f5",
  neutralPrimary: "#e8e8e8",
  neutralDark: "#fafafa",
  black: "#fcfcfc",
  white: "#333333",
};

const getComponentsStyle = (palette: Partial<IPalette>) => {
  const inputStyles = [
    "rounded",
    {
      borderColor: palette.neutralQuaternaryAlt,
      borderBottomColor: palette.neutralSecondaryAlt,
      selectors: {
        ":hover": {
          borderColor: palette.neutralQuaternaryAlt,
          borderBottomColor: palette.neutralSecondaryAlt,
          backgroundColor: palette.neutralLighter,
        },
        ":focus": {
          backgroundColor: palette.white,
          outline: 0,
        },
      },
    },
  ]
  return {
    Modal: {
      styles: {
        main: [
          "rounded-lg",
          {
            backgroundColor: palette.neutralLighter,
          },
        ],
      },
    },
    Callout: {
      styles: {
        root: ["rounded-xl"],
      },
    },
    TextField: {
      styles: {
        fieldGroup: inputStyles,
      },
    },
    SearchBox: {
      styles: {
        root: inputStyles,
      },
    },
    DefaultButton: {
      styles: {
        root: [
          "rounded",
          {
            borderColor: palette.neutralQuaternaryAlt,
            borderBottomColor: palette.neutralTertiaryAlt,
          },
        ],
        rootPressed: [
          {
            borderColor: palette.neutralQuaternaryAlt,
            color: palette.neutralTertiary,
          },
        ],
        rootFocused: [
          {
            outline: 0,
          },
        ],
      },
    },
    PrimaryButton: {
      styles: {
        rootPressed: [
          {
            color: palette.white,
          },
        ],
      },
    },
    CommandBar: {
      styles: {
        root: [
          {
            background: 'none',
            selectors: {
              "& .ms-Button--commandBar": {
                backgroundColor: "transparent",
              },
            },
          },
        ],
      },
    },
    DetailsList: {
      styles: {
        root: [{}],
        headerWrapper: [
          {
            selectors: {
              "&>div": {
                backgroundColor: "transparent",
                borderColor: palette.neutralQuaternaryAlt,
              },
            },
          },
        ],
        contentWrapper: [
          {
            selectors: {
              "& .ms-DetailsRow": [
                {
                  backgroundColor: "transparent",
                  borderColor: palette.neutralQuaternaryAlt,
                },
              ],
            },
          },
        ],
      },
    },
    Dropdown: {
      styles: {
        title: [
          "rounded",
          {
            borderColor: palette.neutralQuaternaryAlt,
            borderBottomColor: palette.neutralTertiaryAlt,
            selectors: {
              ":hover": {
                borderColor: palette.neutralQuaternaryAlt,
                borderBottomColor: palette.neutralTertiaryAlt,
              },
              ":focus": {
                outline: 0,
              },
            },
          },
        ],
        dropdownItem: ["rounded"],
      },
    },
    Nav: {
      styles: {
       root: [
         {
          selectors:{
            "& .ms-Nav-compositeLink.is-selected .ms-Nav-link": {
              backgroundColor: palette.neutralQuaternaryAlt
            },
            "& .ms-Nav-compositeLink.is-selected .ms-Nav-link::after": {
              backgroundColor: palette.themePrimary,
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '3px',
              height: '50%',
              borderRadius: '3px',
              border: 0,
              zIndex: 1,
            },
            "& .ms-Nav-compositeLink:hover .ms-Nav-link": {
              backgroundColor: palette.neutralQuaternaryAlt
            },
            "& .ms-Nav-compositeLink.is-selected .ms-Nav-chevronButton": {
              backgroundColor: 'transparent',
            },
            "& .ms-Nav-compositeLink.is-selected .ms-Nav-chevronButton::after": {
              border: 0,
            },
          }
         },
       ],
       navItems: ['space-y-1'],
       link: ['h-10 leaing-10']
      }
    }
  };
};

export const lightTheme: PartialTheme | Theme = {
  components: getComponentsStyle(lightThemePalette),
  palette: lightThemePalette,
};

export const darkTheme = {
  components: getComponentsStyle(darkThemePalette),
  palette: darkThemePalette,
};

export const getLayerClassNames = (isDarkMode) => {};

export const useThemeStyles = () => {
  const theme = useTheme();
  const { palette } = theme;
  return mergeStyleSets({
    contentLayer: [
      "border",
      {
        backgroundColor: palette.neutralLighter,
        borderColor: palette.neutralQuaternaryAlt,
      },
    ],
    articleText: [
      {
        color: palette.neutralPrimary,
      },
    ],
  });
};
