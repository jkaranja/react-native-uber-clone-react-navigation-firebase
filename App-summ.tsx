import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import { useColorScheme } from "react-native";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "./src/hooks/useAppSelector";
import { useAppDispatch } from "./src/hooks/useAppDispatch";
import { getMode, setMode } from "./src/features/theme/themeSlice";

// an object type with mappings for route name to the params of the route
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string }; //see initialParams prop for the Stack.screen
  Feed: { sort: "latest" | "top" } | undefined;
};

//you can also use drawer for navigation: https://reactnavigation.org/docs/drawer-based-navigation
//or use the tab navigation/bottom btns: https://reactnavigation.org/docs/tab-based-navigation
//add protect routes/auth flow: https://reactnavigation.org/docs/auth-flow
const Stack = createNativeStackNavigator<RootStackParamList>();

//React Native doesn't have a built-in API for navigation like a web browser does. React Navigation provides this for you, along with the iOS and Android gestures and animations to transition between screens.

//React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state - your app pushes and pops items from the navigation stack as users interact with it, and this results in the user seeing different screens.

// Stack.Navigator is a component that takes route configuration as its children with additional props for configuration and renders our content.
// Each Stack.Screen component takes a name prop which refers to the name of the route and component prop which specifies the component to render for the route. These are the 2 required props.

//diff between react navigator and routes in browser is that React Navigation's native stack navigator provides the gestures and animations that you would expect on Android and iOS when navigating between routes in the stack.

//route names: casing of the route name doesn't matter -- you can use lowercase home or capitalized Home, it's up to you. We prefer capitalizing our route names.

export default function App() {
  //get system preference theme: light || dark//os now have built in support for theme preference
  //can also set theme mode manually eg by clicking a btn
  const scheme = useColorScheme();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(getMode);

  useEffect(() => {
    //set system preference theme
    dispatch(setMode());
  }, []);

  //pass custom dark and light themes
  //must provide all of these properties or spread DarkTheme to reuse some properties
  const MyDarkTheme = {
    dark: true,
    colors: {
      primary: "rgb(255, 45, 85)",
      background: "rgb(242, 242, 242)",
      card: "rgb(255, 255, 255)",
      text: "rgb(28, 28, 30)",
      border: "rgb(199, 199, 204)",
      notification: "rgb(255, 69, 58)",
    },
  };

  //example
  const themeSettings = (mode: string) => {
    return {
      dark: mode === "dark",
      ...(mode === "dark"
        ? {
            colors: {
              ...DarkTheme.colors,
              primary: "rgb(255, 45, 85)",
            },
          }
        : {
            colors: {
              ...DefaultTheme.colors,
              primary: "rgb(255, 45, 85)",
            },
          }),
    };
  };

  const theme = useMemo(() => themeSettings(mode!), [mode]);

  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            title:
              "title for all screen//fallback//remove if all has titles below",
          }}
          //customize header bar for all screen
          // screenOptions={{
          //   headerStyle: {
          //     backgroundColor: "#f4511e",
          //   },
          //   headerTintColor: "#fff",
          //   headerTitleStyle: {
          //     fontWeight: "bold",
          //   },
          //#customize the back btn
          // headerBackTitle: "Back", and style it with headerBackTitleStyle: {
          //     fontWeight: "bold",
          //   }
          //hide header bar
          //headerShown: false
          //deader float
          //headerMode: "screen" | "float" //default: "screen"
          // }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Welcome//title for a specific screen" }}
            //options={({ route }) => ({ title: route.params.name })}//or use params as title
            //initialParams={{ userId: user.id }}//pass initial params to home screen, use route.params to retrieve
            //customize style of header bar for a single screen
            // options={{
            //   title: "My home",
            //   headerStyle: {//style object that will be applied to the View that wraps the header
            //     backgroundColor: "#f4511e",
            //   },
            //   headerTintColor: "#fff",//the back button and title both use this property as their color
            //   headerTitleStyle: {//style properties for the title
            //     fontWeight: "bold",
            //   },
            // }}
            //#add right btn to header//or custom bck btn// + using a component as title
            // options={{
            //   headerTitle: (props) => <LogoTitle {...props} />,
            //   headerRight: () => (
            //     <Button
            //       onPress={() => alert("This is a button!")}
            //       title="Info"
            //       color="#fff"
            //     />
            //   ),
            //   headerLeft: () => (
            //     <Button
            //       title="Back"
            //       color="#fff"
            //     />
            //   ),
            // }}
          />
          {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
          {/* <StatusBar style="auto/dark/#color" />//use this if you don't have a navigator to customize header */}
        </Stack.Navigator>

        {/* <RootStack.Group screenOptions={{ presentation: "modal || card(default) || transparentModal=for transparent modal" }}>//stack group//choose either screenOptions or options in screen//use a lib//bottomsheet too
          <RootStack.Screen name="MyModal" component={ModalScreen} options={{ presentation: 'transparentModal', headerShown: false, cardOverlayEnabled: true }} />
        </RootStack.Group> */}

        <View style={styles.container}>
          <Text>Hello up App.js to start working on your app!</Text>
        </View>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
