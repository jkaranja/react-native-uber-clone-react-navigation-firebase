import React, { useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { EMAIL_REGEX, PWD_REGEX } from "../constants/regex";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "../hooks/useAppDispatch";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import clsx from "clsx";
import { setCredentials } from "../features/auth/authSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../types/navigator";
import { Button } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { genRandomToken } from "../utils/tokens";

WebBrowser.maybeCompleteAuthSession(); //browser that will open the Oauth prompt

type LoginProps = NativeStackScreenProps<StackParamList, "Login">;

const Login = ({ navigation }: LoginProps) => {
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
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        setIsLoading(false);
        // Signed in
        const user = userCredential.user;
        //in a real app, you would send this auth info to server and get an access token
        const token = await genRandomToken();

        //save token to secure store
        await SecureStore.setItemAsync("token", token);

        //save token->store
        dispatch(setCredentials(token));

        //Don't manually navigate: You'll get an error if you attempt to navigate manually
        //when token state changes, app re-renders, token is true=>display first screen of signed in user
        //navigation.navigate("Home");

        // //expo-secure-store usage//provide a way to encrypt and securely store key–value pairs locally on the device. stores sensitive data eg tokens, password etc
        // //size limit= 2kb//you will get a warning or error is limit is reached

        // await SecureStore.setItemAsync(key, value); //store key
        // await SecureStore.getItemAsync(key); //get/retrieve value for given key// return string | null
        // await SecureStore.deleteItemAsync(key); //delete

        // //Async Storage to store non sensitive data eg preferences. Async Storage(in RN) === localStorage in web
        // // provides an asynchronous, unencrypted, key-value store
        // await AsyncStorage.setItem("my-key", value); //value must be a string  //can only store string data
        // await AsyncStorage.setItem("my-key", JSON.stringify(value)); //to store an object, stringify and parse it when retrieving
        // await AsyncStorage.getItem("my-key"); //get/Reading = value || null
        // await AsyncStorage.removeItem("MyApp_key"); //remove

        // Toast.show({
        //   type: "success", // error || info
        //   text1: "Signed in!",
        //   //text2: "Second line of text"
        //   //position: "top" or bottom//default: top
        //   //visibilityTime:{4000}//default = 4000ms
        //   //autoHide:{true}//default: true
        //   //onPress: ()=> void //Called on Toast press
        //   //bottomOffset={40} //Offset from the bottom of the screen (in px). Has effect only when position is bottom
        //   //topOffset={40}//Offset from the top of the screen
        // });
        //use Toast.hide(); To hide the current visible Toast
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        Toast.show({
          type: "error", // success || info
          text1: errorMessage,
        });
      });
  };

  //Oauth->sign in with Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "227903853823-tjk1hg4gv5nqgcdvb6t95dtgb5tkr1if.apps.googleusercontent.com",
    androidClientId:
      "227903853823-tjk1hg4gv5nqgcdvb6t95dtgb5tkr1if.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential); //or use then here instead of onAuthStateChanged
    }
  }, [response]);

  //onAuthStateChanged is called whenever user sign in state changes/can use it to set token on sign in or clear token on sign out
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setIsLoading(false);
        //in a real app, you would send this auth info to server and get an access token
        const token = await genRandomToken();
        //save token to secure store
        await SecureStore.setItemAsync("token", token);
        //save token->store
        dispatch(setCredentials(token));
        // ...
      } else {
        // User is signed out
        //this will run when you call signOut(auth)
      }
    });

    return () => unsubscribe();
  }, []);

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
        <Text className="text-3xl font-semibold ">Welcome back</Text>
        <Text className="text-gray-muted mb-4">
          Please sign-in to your account below
        </Text>

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
            Log in
          </Text>
          {isLoading && (
            <ActivityIndicator className="px-3" size="small" color="#fff" />
          )}
        </TouchableOpacity>

        <View className="gap-2 mt-2">
          <Button
            icon="google" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
            mode="contained"
            onPress={() => promptAsync()}
            //uppercase//boolean//Make the label text uppercased
            // icon={({ size, color }) => (
            //   <Image
            //     source={require("../assets/chameleon.jpg")}
            //     style={{ width: size, height: size, tintColor: color }}
            //   />
            // )}//custom icon component
            //icon={require('../assets/chameleon.jpg')}//load img as icon
            //icon={{ uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400' }}//remote img
            //mode='text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'//Default value: 'text'
            //dark= false// boolean//Whether the color is a dark color///only when mode= contained, contained-tonal and elevated modes
            //buttonColor=""
            //textColor=""
            //rippleColor=""//Color of the ripple effect.
            //loading=false //boolean //Whether to show a loading indicator
            //disabled //boolean
            //onPressIn
            //style
            //labelStyle={{fontSize: 20}}////Style for the button text.
          >
            Continue with google
          </Button>
          <Button
            icon="github"
            mode="contained"
            onPress={() => console.log("Pressed")}
          >
            Continue with github
          </Button>
          <Button
            icon="facebook"
            mode="contained"
            onPress={() => console.log("Pressed")}
          >
            Continue with Facebook
          </Button>
        </View>

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
