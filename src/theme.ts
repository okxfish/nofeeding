import { PartialTheme, Theme } from "@fluentui/react"

export const lightTheme:PartialTheme | Theme = {
  components: {
    Modal: {
      styles: {
        main: ['rounded-xl']
      },
    },
    Callout: {
      styles: {
        root: ['rounded-xl']
      },
    },
    TextField: {
      styles: {
        fieldGroup: ['rounded-md']
      },
    },
    PrimaryButton: {
      styles: {
        root: ['rounded-md']
      },
    },
    DefaultButton: {
      styles: {
        root: ['rounded-md']
      },
    },
    Dropdown: {
      styles: {
        title: ['rounded-md']
      },
    },
  },
  palette: {
    themePrimary: '#545454',
    themeLighterAlt: '#f8f8f8',
    themeLighter: '#e4e4e4',
    themeLight: '#cccccc',
    themeTertiary: '#989898',
    themeSecondary: '#696969',
    themeDarkAlt: '#4c4c4c',
    themeDark: '#404040',
    themeDarker: '#2f2f2f',
    neutralLighterAlt: '#fdfdfd',
    neutralLighter: '#f9f9f9',
    neutralLight: '#f3f3f3',
    neutralQuaternaryAlt: '#d3d3d3',
    neutralQuaternary: '#cacaca',
    neutralTertiaryAlt: '#c2c2c2',
    neutralTertiary: '#101010',
    neutralSecondary: '#202020',
    neutralPrimaryAlt: '#2f2f2f',
    neutralPrimary: '#363636',
    neutralDark: '#666666',
    black: '#8e8e8e',
    white: '#f7f7f7',
  },
}

export const darkTheme = {
  components: {
    Modal: {
      styles: [
        'rounded-lg'
      ],
    },
  },
  palette: {
    themePrimary: '#97bfde',
    themeLighterAlt: '#060809',
    themeLighter: '#181f23',
    themeLight: '#2d3943',
    themeTertiary: '#5b7385',
    themeSecondary: '#85a8c3',
    themeDarkAlt: '#a0c5e1',
    themeDark: '#aecee6',
    themeDarker: '#c2daec',
    neutralLighterAlt: '#fdfdfd',
    neutralLighter: '#f9f9f9',
    neutralLight: '#f3f3f3',
    neutralQuaternaryAlt: '#595959',
    neutralQuaternary: '#5f5f5f',
    neutralTertiaryAlt: '#7a7a7a',
    neutralTertiary: '#f0f0f0',
    neutralSecondary: '#f2f2f2',
    neutralPrimaryAlt: '#f5f5f5',
    neutralPrimary: '#e8e8e8',
    neutralDark: '#fafafa',
    black: '#fcfcfc',
    white: '#333333',
  },
}

export const getLayerClassNames = (isDarkMode) => ({
  "rounded-t-lg border-2": true,
  "ms-bgColor-gray210": isDarkMode,
  "ms-bgColor-gray20": !isDarkMode,
});