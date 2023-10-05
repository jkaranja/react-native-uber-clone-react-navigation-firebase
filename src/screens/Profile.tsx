import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StackParamList } from "../types/navigator";
import { Avatar } from "react-native-paper";
import { List, MD3Colors, TextInput } from "react-native-paper";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "../hooks/useAppSelector";
import { logOut, selectCurrentToken } from "../features/auth/authSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import * as SecureStore from "expo-secure-store";

type ProfileProps = NativeStackScreenProps<StackParamList, "Profile">;

const Profile = (props: ProfileProps) => {
  const navigation: ProfileProps["navigation"] = useNavigation();

  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    signOut(auth)
      .then(async () => {
        // Sign-out successful.
        Toast.show({
          type: "success", // error || info
          text1: "Signed out!",
        });
        //del token from secure storage//await halt exc until promise settles
        await SecureStore.deleteItemAsync("token");
        //sets token: null//dispatch is synchronous
        dispatch(logOut());
        //then redirect to log in page
        //Don't manually navigate: You'll get an error if you attempt to navigate manually
        //when token state changes to null, app re-renders, token is false=>display first screen of token != true : Login
        //navigation.navigate("Login");
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;

        Toast.show({
          type: "error", // success || info
          text1: errorMessage,
        });
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      //headerBackTitle: "Back",
      title: "Profile",
      //use headerTitle to use a React.ReactNode as title
      headerTitle: () => (
        <Text className="text-lg font-semibold text-white ">Edit Profile</Text>
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
      //headerBackTitleStyle: { backgroundColor: "#fff"},
    });
  }, [navigation]);
  return (
    <ScrollView
      className="bg-gray-light flex "
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4 items-center mb-3 bg-white">
        <Avatar.Icon
          size={44}
          icon="account"
          color="#10b981"
          style={{ backgroundColor: "#e2e8f0" }}
        />
      </View>

      <View className="p-4 mb-3 bg-white gap-y-2">
        <TextInput
          label="Username"
          mode="outlined"
          //right={<TextInput.Affix text="/100" />}
          // value={text}
          // onChangeText={(text) => setText(text)}
          // secureTextEntry
          // right={<TextInput.Icon icon="eye" />}
          //style={{}}
          //color:  string | ((isTextInputFocused: boolean) => string | undefined)
        />
        <TextInput label="Email" mode="outlined" />
        <TextInput label="Phone number" mode="outlined" />
      </View>

      <View className="p-4 mb-3 bg-white gap-y-2">
        <TextInput
          label="New password"
          mode="outlined"
          // value={text}
          // onChangeText={(text) => setText(text)}
          // secureTextEntry
          right={<TextInput.Icon icon="eye" />}
        />

        <TextInput
          label="Confirm password"
          mode="outlined"
          // value={text}
          // onChangeText={(text) => setText(text)}
          // secureTextEntry
          right={<TextInput.Icon icon="eye" />}
        />
      </View>

      <View className="px-4 mb-3 bg-white py-8 grow">
        <TouchableOpacity onPress={handleSignOut}>
          <Text className="text-red">Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
