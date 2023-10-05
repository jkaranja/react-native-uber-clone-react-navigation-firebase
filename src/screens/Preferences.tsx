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
} from "react-native";
import { StackParamList } from "../types/navigator";
import { Avatar, Divider, Switch } from "react-native-paper";
import { List, MD3Colors } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { getMode, setMode } from "../features/theme/themeSlice";

type PreferencesProps = NativeStackScreenProps<StackParamList, "Preferences">;

const Preferences = ({ navigation }: PreferencesProps) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(getMode);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [isSwitchOn, setIsSwitchOn] = React.useState(colorScheme === "dark");

  const onToggleSwitch = () => {
    toggleColorScheme();
    setIsSwitchOn(!isSwitchOn);
  };

  useEffect(() => {
    //set theme mode
    dispatch(setMode(colorScheme));
  }, [colorScheme]);
  

  return (
    <ScrollView
      className="bg-white flex dark:bg-gray-darker  p-3"
      showsVerticalScrollIndicator={false}
    >
      <List.Section className="bg-white p-6 my-0 dark:bg-gray-dark">
        <Text className="text-lg font-bold dark:text-gray-light">
          Time and place
        </Text>
        <List.Item
          onPress={() => navigation.navigate("Profile")}
          title={<Text className="dark:text-gray-light">View profile</Text>}
          left={() => <List.Icon color="#10b981" icon="account" />}
        />
        <List.Item
          title={<Text className="dark:text-gray-light">Messages</Text>}
          left={() => <List.Icon color="#10b981" icon="message" />}
        />
      </List.Section>
      <Divider className="dark:bg-gray-muted" />
      <List.Section className="bg-white p-6 my-0 dark:bg-gray-dark">
        <List.Subheader>
          <Text className="text-lg font-bold dark:text-gray-light">
            Look and feel
          </Text>
        </List.Subheader>
        <List.Item
          //onPress={() => navigation.navigate("Profile")}
          title={
            <Text className="dark:text-gray-light">
              {mode === "dark" ? "Dark mode" : "Light mode"}
            </Text>
          }
          left={() => (
            <List.Icon
              color={mode === "dark" ? "#000" : "#f37c02"}
              icon={
                mode === "dark"
                  ? "moon-waning-crescent"
                  : "lightbulb-on-outline"
              }
            />
          )}
          right={() => (
            <Switch
              value={isSwitchOn}
              color="#10b981"
              onValueChange={onToggleSwitch}
            />
          )}
        />
        <List.Item
          title={<Text className="dark:text-gray-light">Messages</Text>}
          left={() => <List.Icon color="#10b981" icon="message" />}
        />
      </List.Section>
      <Divider className="dark:bg-gray-muted" />
      <List.Section className="bg-white px-6 py-2 my-0 dark:bg-gray-dark">
        <List.Subheader>
          <Text className="text-lg font-bold dark:text-gray-light">
            Accessibility
          </Text>
        </List.Subheader>
        <List.Item
          onPress={() => navigation.navigate("Profile")}
          title={<Text className="dark:text-gray-light">Dark mode</Text>}
          left={() => <List.Icon color="#10b981" icon="account" />}
        />
        <List.Item
          title={<Text className="dark:text-gray-light">Messages</Text>}
          left={() => <List.Icon color="#10b981" icon="message" />}
        />
      </List.Section>
    </ScrollView>
  );
};

export default Preferences;
