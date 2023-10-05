import React from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
import { useForm, Controller } from "react-hook-form";
import { EMAIL_REGEX, PWD_REGEX } from "../constants/regex";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "../hooks/useAppDispatch";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { setCredentials } from "../features/auth/authSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../types/navigator";

type LoginProps = NativeStackScreenProps<StackParamList, "Login">;

const Login = ({ navigation }: LoginProps) => {
  const dispatch = useAppDispatch();

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
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        //in a real app, you would send this auth info to server and get an access token
        const token = "dummy-auth-jwt-token-from-server";

        //save token to secure store
        await SecureStore.setItemAsync("token", token);

        //save token->store
        dispatch(setCredentials(token));

        // //expo-secure-store usage//provide a way to encrypt and securely store key–value pairs locally on the device. stores sensitive data eg tokens, password etc
        // //size limit= 2kb//you will get a warning or error is limit is reached

        // await SecureStore.setItemAsync(key, value); //store key
        // await SecureStore.getItemAsync(key); //get/retrieve value for given key// return string | null
        // SecureStore.deleteItemAsync(key); //delete

        // //Async Storage to store non sensitive data eg preferences. Async Storage(in RN) === localStorage in web
        // // provides an asynchronous, unencrypted, key-value store
        // await AsyncStorage.setItem("my-key", value); //value must be a string  //can only store string data
        // await AsyncStorage.setItem("my-key", JSON.stringify(value)); //to store an object, stringify and parse it when retrieving
        // await AsyncStorage.getItem("my-key"); //get/Reading = value || null
        // await AsyncStorage.removeItem("MyApp_key"); //remove

        Toast.show({
          type: "success", // error || info
          text1: "Signed in!",
          //text2: "Second line of text"
          //position: "top" or bottom//default: top
          //visibilityTime:{4000}//default = 4000ms
          //autoHide:{true}//default: true
          //onPress: ()=> void //Called on Toast press
          //bottomOffset={40} //Offset from the bottom of the screen (in px). Has effect only when position is bottom
          //topOffset={40}//Offset from the top of the screen
        });
        //use Toast.hide(); To hide the current visible Toast
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <KeyboardAvoidingView className="items-stretch justify-end flex-1 bg-emerald">
      {/*This can be an image/banner */}
      <View className="basis-1/4" />
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
              className="bg-gray-lighter placeholder:text-gray-muted  h-[40] px-2 rounded-md"
            />
          )}
          name="email"
        />
        <Text>{errors.email?.message}</Text>

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
        <Text>{errors.password?.message}</Text>

        <TouchableOpacity
          className="bg-emerald rounded-md p-2 "
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-lg text-white text-center font-bold">
            Log in
          </Text>
        </TouchableOpacity>

        <Text className=" text-gray-muted my-4">
          Don't have an account yet?{" "}
          <Text
            className="text-emerald px-1 "
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
