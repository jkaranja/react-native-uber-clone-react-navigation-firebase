import React, { useState } from "react";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { EMAIL_REGEX, PWD_REGEX } from "../constants/regex";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "../hooks/useAppDispatch";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { setCredentials } from "../features/auth/authSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../types/navigator";
import { ActivityIndicator } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

type SignUpProps = NativeStackScreenProps<StackParamList, "SignUp">;

const SignUp = ({ navigation }: SignUpProps) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  type Inputs = {
    email: string;
    password: string;
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        setIsLoading(false);
        // Signed in
        const user = userCredential.user;

        //in a real app, you would send this auth info to server and get an access token
        const token = "dummy-auth-jwt-token-from-server";

        //save token to secure store
        await SecureStore.setItemAsync("token", token);

        //save token->store
        dispatch(setCredentials(token));

        //Don't manually navigate: You'll get an error if you attempt to navigate manually
        //when token state changes, app re-renders, token is true=>display first screen of signed in user
        //navigation.navigate("Home");
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;

        // ..
        Toast.show({
          type: "error", // error || info
          text1: errorMessage,
        });
      });
  };

  return (
    <KeyboardAvoidingView className="items-stretch justify-end flex-1 bg-emerald">
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="auto" backgroundColor="#10b981" />
      {/*This can be an image/banner */}
      <View className="basis-1/6" />
      <View
        className="p-10 flex-1  bg-[#fff]  rounded-s-xl	"
        style={{ borderTopLeftRadius: 40 }}
      >
        <Text className="text-3xl font-semibold ">Create an account</Text>
        <Text className="text-gray-muted mb-4">Please sign-up below</Text>

        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: EMAIL_REGEX,
              message: "Enter an email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
              autoCapitalize="none"
              className="bg-gray-lighter  placeholder:text-gray-muted  h-[40] px-2 rounded-md"
            />
          )}
          name="email"
        />
        <Text className="my-2 px-2 text-red">{errors.email?.message}</Text>

        <Controller
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Enter at least 6 characters",
            },
            pattern: {
              value: PWD_REGEX,
              message: "Spaces not allowed",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true} //eq to type='password'
              autoCorrect={false}
              textContentType="password"
              autoCapitalize="none"
              className="bg-gray-lighter placeholder:text-gray-muted  h-[40] px-2 rounded-md"
            />
          )}
          name="password"
        />
        <Text className="my-2 px-2 text-red">{errors.password?.message}</Text>

        <TouchableOpacity
          className={clsx(
            "bg-emerald rounded-md p-2 flex-row justify-center ",
            {
              "bg-gray-disabled": isLoading,
            }
          )}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-lg text-white  text-center font-bold uppercase">
            Sign up
          </Text>
          {isLoading && (
            <ActivityIndicator className="px-3" size="small" color="#fff" />
          )}
        </TouchableOpacity>

        <Text className=" text-gray-muted my-4">
          Already have an account?{" "}
          <Text
            className="text-emerald px-1"
            onPress={() => navigation.navigate("Login")}
          >
            Log in
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
