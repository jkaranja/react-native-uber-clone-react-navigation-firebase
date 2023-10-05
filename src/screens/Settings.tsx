import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
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
} from "react-native";
import { StackParamList } from "../types/navigator";
import { Avatar } from "react-native-paper";
import { List, MD3Colors } from "react-native-paper";

import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { IconButton } from "react-native-paper";
import clsx from "clsx";
import CustomBackdrop from "../components/CustomBackdrop";

type SettingsProps = NativeStackScreenProps<StackParamList, "Settings">;

const Settings = ({ navigation }: SettingsProps) => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);
  //open/snap bottom sheet to a defined snap point
  //index === index of a snapPoint(given in %) in the snapPoints array
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);
  //close btm sheet
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      //headerBackTitle: "Back",
      //title: "Settings",
      //use headerTitle to use a React.ReactNode as title
      headerTitle: (props) => (
        <Text className="text-lg font-semibold text-white ">Mark Walter</Text>
      ),
      headerStyle: {
        //style object that will be applied to the View that wraps the header
        backgroundColor: "#10b981",
      },
      headerTitleStyle: {
        //style properties for the title
        color: "#fff",
      },

      // headerLeft: () => (
      //     <Button
      //       title="Back"
      //       color="#fff"
      //     />
      // ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Avatar.Icon
            size={44}
            icon="account"
            color="#10b981"
            style={{ backgroundColor: "#e2e8f0" }}
            className="mx-3"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View className=" p-3 flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <List.Section className={clsx("bg-white p-6 my-0 dark:bg-gray-dark")}>
          <List.Item
            //descriptionStyle={{}}
            // descriptionNumberOfLines={2} //default 2
            // onPress={() => {}}
            titleStyle={{}}
            title={
              <Text className="text-lg font-semibold dark:text-gray-light">
                Mark Walter
              </Text>
            }
            description={
              <Text className="text-sm text-gray-muted dark:text-gray-muted">
                Active
              </Text>
            } // string | React.ReactNode
            left={() => (
              <Avatar.Icon
                size={44}
                icon="account"
                color="#10b981"
                style={{ backgroundColor: "#e2e8f0" }}
              />
            )}
            //right = {() => React.ReactNode}
          />
        </List.Section>

        <List.Section className="bg-white p-6 dark:bg-gray-dark ">
          {/* <List.Subheader>Some title</List.Subheader> */}

          <List.Item
            onPress={() => navigation.navigate("Profile")}
            title={<Text className="dark:text-gray-light">View profile</Text>}
            left={() => <List.Icon color="#10b981" icon="account" />}
          />
          <List.Item
            onPress={() => navigation.navigate("Upload")}
            title={<Text className="dark:text-gray-light">Upload</Text>}
            left={() => <List.Icon color="#10b981" icon="account" />}
          />
          <List.Item
            onPress={() => navigation.navigate("Chat")}
            title={<Text className="dark:text-gray-light">Chat</Text>}
            left={() => <List.Icon color="#10b981" icon="message" />}
          />
          <List.Item
            onPress={() => handleSnapPress(snapPoints.length - 1)}
            title={<Text className="dark:text-gray-light">Notifications</Text>}
            left={() => <List.Icon icon="bell" color="#10b981" />}
          />
        </List.Section>

        <List.Section className="bg-white p-6 dark:bg-gray-dark">
          {/* <List.Subheader>Some title</List.Subheader> */}

          <List.Item
            onPress={() => navigation.navigate("Preferences")}
            title={<Text className="dark:text-gray-light">Preferences</Text>}
            left={() => (
              <List.Icon color="#10b981" icon="application-settings-outline" />
            )}
          />
        </List.Section>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={isOpen ? CustomBackdrop : () => <></>}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        //onClose={() => setIsOpen(false)}
        handleIndicatorStyle={{ backgroundColor: "#10b981" }} //View style to be applied to the handle indicator component.
        // handleStyle={{ backgroundColor: "#10b981" }} //View style to be applied to the handle component.
        //backgroundStyle={{ backgroundColor: "green" }} //style to be applied to the background component
      >
        <BottomSheetScrollView>
          <View className="flex-1 p-8">
            <Text>Awesome 🎉</Text>
            <Button title="close sheet" onPress={handleClosePress} />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Settings;
