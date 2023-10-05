import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";

import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { StackParamList } from "../types/navigator";
import { Searchbar } from "react-native-paper";
import Rides from "./Rides";
import Delivery from "./Delivery";
import { MaterialIcons } from "@expo/vector-icons";

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#10b981" }}
    style={{ backgroundColor: "#fff", paddingTop: 20 }}
    renderIcon={({ route, focused, color }) => {
      let iconName: any = "directions-car";
      if (route.title === "Rides") {
        iconName = focused ? "directions-car" : "directions-car";
      } else if (route.title === "Delivery") {
        iconName = focused ? "delivery-dining" : "delivery-dining";
      }

      return <MaterialIcons name={iconName} color={color} size={24} />;
    }}
    //   <Icon name={focused ? "albums" : "albums-outlined"}  />
    //
    // )}
    //renderBadge//Function which takes an object with the current route and returns a custom React Element to be used as a badge.
    activeColor="#10b981" //Custom color for icon and label in the active tab
    inactiveColor="#667085" //Custom color for icon and label in the inactive tab
    //tabStyle//tyle to apply to the individual tab items in the tab bar.
    //indicatorStyle= "#fff" //Style to apply to the active indicator.
    labelStyle={{ textTransform: "none", fontWeight: 500 }} //Style to apply to the tab item label.
    //style//Style to apply to the tab bar container
    //gap//Define a spacing between tabs
  />
);

type HomeProps = NativeStackScreenProps<StackParamList, "Home">;

const Home = ({ navigation }: HomeProps) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Rides", icon: "account" },
    { key: "second", title: "Delivery" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        first: Rides,
        second: Delivery,
      })}
      renderTabBar={renderTabBar} //used to customize tabs
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      //sceneContainerStyle={{ backgroundColor: "#fff" }} //Style to apply to the view wrapping each screen/scene
      //style={{ backgroundColor: "red" }} //Style to apply to the tab view container
    />
  );
};

export default Home;
