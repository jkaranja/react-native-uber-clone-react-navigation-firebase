import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const themeSettings = (mode: string) => {
  return {
    dark: mode === "light",
    ...(mode === "dark"
      ? {
          colors: {
            ...DarkTheme.colors, //not need/we're changing all color options
            primary: "#10b981", //brand color//not sure
            background: "#161618", //screen bg
            card: "#1e1e20", //headers bg/tabs bg
            text: "#e2e8f0", //text color like header text
            border: "#667085", //header border, tab bar border
            notification: "#10b981", //badge color
          },
        }
      : {
          colors: {
            ...DefaultTheme.colors,
            primary: "#10b981",
            background: "#f1f5f9", //screen bg
            card: "#10b981", //brand//headers/tabs//use headerStyle in options/screenOptions/setOptions
            text: "#fff", //text color
            // border: "#fff", //header border, tab bar border//keep default
            notification: "#10b981", //badge color
          },
        }),
  };
};

export default themeSettings;
