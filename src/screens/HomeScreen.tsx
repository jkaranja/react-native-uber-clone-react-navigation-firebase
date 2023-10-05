import * as React from "react";
import { Button, View, Text, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StackParamList } from "../types/navigator";
//or use generic NativeStackScreenProps<any, any> types
type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

const HomeScreen = ({ navigation, route }: HomeScreenProps) => {
  //use the navigation hook if navigating from a a component other than a screen i.e those without the navigation prop(better than passing it from the parent)
  //const navigation = useNavigation();
  //This will detect if the app is running on a device with notches, if so, ensure the content isn't hidden behind any hardware elements. see in use inside view style
  const insets = useSafeAreaInsets();
  /* 2. Get the param */
  // const { itemId, otherParam } = route.params;//must add param types in RootStackParamList

  //setoptions when screen mounts//use useLayoutEffect to set options b4 the paint is done
  // React.useEffect(() => {
  //   // Use `setOptions` to update the button that we previously specified
  //   // Now the button includes an `onPress` handler to update the count
  //   navigation.setOptions({
  //    headerBackTitle: "Backxxxx",
  // add header interaction with its screen component//eg profile avatar
  //     headerRight: () => (
  //       <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
  //     ),
  //   });
  // }, [navigation]);

  // call a function/do something or render something on screen focusing/when screen comes into focus
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const unsubscribe = API.subscribe(userId, (user) => setUser(data));

  //     return () => unsubscribe();
  //   }, [userId])
  // );
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // Paddings to handle safe area//if a screen has a header, no need to add this as safe area is handled by react navigation by default//else no header, must add this to prevent things like notches, status bar from overlapping your content->not advised to add padding or to use safeAreaView(only supported in iOS).
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {/* custom status bar for each screen 
      //status bar is top most zone that displays: the current time, Wi-Fi and cellular network information, battery level//use it if you don't have a navigation header, or your navigation header changes color based on the route
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" /> */}
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Home")}
        //<Button title="Go back" onPress={() => navigation.goBack()} />//or use arrow provided by the native stack navigator
        //#onPress={() => navigation.popToTop()} //go to first screen or use navigate('Home')
        //#pass data to routes when we navigate to them.
        // onPress={() => {
        //   /* 1. Navigate to the Details route with params */
        //   navigation.navigate("Details", {
        //     itemId: 86,
        //     otherParam: "anything you want here",
        //   });
        // }}
        //# use push to update params(won't redirect) in the Details screen:
        // onPress={() =>
        //   navigation.push('Details', {
        //     itemId: Math.floor(Math.random() * 100),
        //   })
        //#update the options configuration for the active screen from the mounted screen component itself.
        //onPress={() => navigation.setOptions({ title: "Updated!" })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
