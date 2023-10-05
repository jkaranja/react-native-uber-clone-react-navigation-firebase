import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo, useState } from "react"; //must import react here for jsx to work//see React fundamental in RN docs
import { useColorScheme } from "react-native";
import {
  MD3LightTheme as PaperDefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import SplashScreen from "./src/components/SplashScreen";
import {
  selectCurrentToken,
  setCredentials,
} from "./src/features/auth/authSlice";
import { getMode, setMode } from "./src/features/theme/themeSlice";
import { useAppDispatch } from "./src/hooks/useAppDispatch";
import { useAppSelector } from "./src/hooks/useAppSelector";
import { store } from "./src/redux/store";
import Settings from "./src/screens/Settings";
import Activity from "./src/screens/Activity";
import Delivery from "./src/screens/Delivery";
import Home from "./src/screens/Home";
import Login from "./src/screens/Login";
import Rides from "./src/screens/Rides";
import Services from "./src/screens/Services";
import Signup from "./src/screens/Signup";
import themeSettings from "./theme";
import Profile from "./src/screens/Profile";
import Preference from "./src/screens/Preferences";

import { StackParamList, TabsParamList } from "./src/types/navigator";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//install package if you need to nest tabs//difficult to maintain nested navigators
//makes code unreadable//
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const TopTab = createMaterialTopTabNavigator();

const Tab = createBottomTabNavigator<TabsParamList>();

const Stack = createNativeStackNavigator<StackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "Log in" }}
      />
      <Stack.Screen
        name="SignUp"
        component={Signup}
        options={{ title: "Sign up" }}
      />
    </Stack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <TopTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Rides") {
            iconName = focused ? "ios-car-sport" : "ios-car-sport";
          } else if (route.name === "Delivery") {
            iconName = focused ? "fast-food-outline" : "fast-food-outline";
          }

          // You can return any component that you like here!
          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? "#10b981" : "rgb(102, 112, 133)"}
            />
          );
        },
        tabBarActiveTintColor: "#10b981", //Color for the icon and label in the active tab.
        tabBarInactiveTintColor: "#667085", //Color for the icon and label in the inactive tabs.
        tabBarIndicatorStyle: { backgroundColor: "#10b981" },
        tabBarAndroidRipple: { borderless: false },
        tabBarPressColor: "#fff",
        //tabBarGap: 10,
        //tabBarPosition: top' and 'bottom'. Defaults to 'top'
        //tabBarLabelStyle: { fontSize: 13 },
        //tabBarBadge: 'string/number',
        //tabBarBadgeStyle
        //tabBarShowIcon: false|true
        //tabBarBackground: ()=> React.Element
        //tabBarIconStyle: { },
        //tabBarLabelPosition: "beside-icon",
        tabBarStyle: { backgroundColor: "#fff" }, //or add custom height: 50,paddingTop: 20
        //headerShown: false
        // headerTitleStyle: {color: "#fff"},//must use this to set header title color
        //headerStyle: { backgroundColor: "#10b981" }, //custom  height: 80 of header etc//color won't work
      })}
    >
      <TopTab.Screen name="Rides" component={Rides} />
      <TopTab.Screen name="Delivery" component={Delivery} />
    </TopTab.Navigator>
  );
};

//you can also move this navigator inside the account screen//
//a navigator can also be displayed inside a View with set height//i.e appear below/above some other content
//first screen will be displayed in this View
const AccountStack = () => {
  // Account modal screens
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Preferences" component={Preference} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const DashboardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Services") {
            iconName = focused ? "border-none" : "border-none";
          } else if (route.name === "Activity") {
            iconName = focused ? "tasks" : "tasks";
          } else if (route.name === "Account") {
            iconName = focused ? "user-alt" : "user-alt";
          }

          // You can return any component that you like here!
          return (
            <FontAwesome5
              name={iconName}
              size={size}
              color={focused ? "#10b981" : "rgb(102, 112, 133)"}
            />
          );
        },
        tabBarActiveTintColor: "#10b981", //Color for the icon and label in the active tab.
        tabBarInactiveTintColor: "#667085", //Color for the icon and label in the inactive tabs.
        //tabBarActiveBackgroundColor: "",//Background color for the active tab
        //tabBarInactiveBackgroundColor:"",//
        // tabBarLabelStyle: { fontSize: 13 },
        //tabBarBadge: 'string/number',
        //tabBarBadgeStyle
        //tabBarLabelPosition: below-icon || beside-icon
        //tabBarBackground: ()=> React.Element
        //tabBarIconStyle: { },
        tabBarStyle: { backgroundColor: DefaultTheme.colors.card }, //or add custom height: 50,
        //headerShown: false
        // headerTitleStyle: {color: "#fff"},//must use this to set header title color
        // headerStyle: { backgroundColor: "#10b981" }, //custom  height: 80 of header etc//color won't work
      })}
    >
      <Tab.Screen
        options={
          {
            //headerShown: false
          }
        }
        name="Home"
        component={HomeTabs}
      />
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Account"
        component={AccountStack}
      />
    </Tab.Navigator>
  );
};

//rootNavigator
const RootNavigator = () => {
  //RN provides 2 ways to get user's appearance preferences eg preferred color scheme (light or dark)
  //1. Using 'Appearance' module, get color scheme: Appearance.getColorScheme(), returns: light | dark | null if user has not set any
  //2. using useColorScheme hook: light | dark | null (null: Follow the system's interface style)
  const scheme = useColorScheme();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(getMode);

  const [isLoading, setIsLoading] = useState(false);

  const token = useAppSelector(selectCurrentToken);

  const theme = useMemo(() => themeSettings(mode!), [mode]);
  //set header theme
  useEffect(() => {
    //set system preference theme
    dispatch(setMode(scheme === null ? "light" : scheme!));
  }, []);

  useEffect(() => {
    const getToken = async () => {
      try {
        setIsLoading(true);
        const token = await SecureStore.getItemAsync("token");

        if (!token) return setIsLoading(false);

        //save token to store
        dispatch(setCredentials(token));
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    };

    if (!token) getToken();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        {token ? <DashboardTabs /> : !isLoading && <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default function App() {
  const theme = {
    ...PaperDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: "#10b981",
      secondary: "#de194e",
    },
  };
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <RootNavigator />
      </PaperProvider>
      <Toast
        position="bottom" //top or bottom//default: top
        bottomOffset={20} //Offset from the bottom of the screen (in px)
        //visibilityTime={4000}//default = 4000ms
        //autoHide={true}//default: true
        //type="success|| error || info"//default: success
      />
    </Provider>
  );
}
