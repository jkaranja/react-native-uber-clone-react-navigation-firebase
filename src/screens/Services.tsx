import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { StackParamList } from "../types/navigator";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View className="py-3 bg-gray p-3 my-3">
    <Text className="text-white py-2">{title}</Text>
    <Image
      className="h-[100] w-full"
      source={{
        uri: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
      }}
    />
     {/* <Image source={require("../../assets/glass.svg")} className="h-[100] w-full" />  */}
    {/* <Image
      source={{ uri: "https://reactjs.org/logo-og.png" }}
      style={{ width: 400, height: 400 }}
    /> */}
  </View>
);

type ServicesProps = NativeStackScreenProps<StackParamList, "Services">;

const Services = ({ navigation }: ServicesProps) => {
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     //headerBackTitle: "Back",
  //     title: "Services",
  //     headerStyle: {
  //       //style object that will be applied to the View that wraps the header
  //       backgroundColor: "#10b981",
  //     },
  //     headerTitleStyle: {
  //       //style properties for the title
  //       color: "#fff",
  //     },

  //     // headerRight: () => (
  //     //   <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
  //     // ),
  //   });
  // }, [navigation]);

  return (
    <View className="p-6">
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Services;
