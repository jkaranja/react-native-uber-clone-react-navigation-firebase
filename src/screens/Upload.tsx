import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  Button,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import UploadingCard from "../components/UploadingCard";
import { ResizeMode, Video } from "expo-av";

const Delivery = () => {
  // The path of the picked image
  const [pickedFilePath, setPickedFilePath] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [files, setFiles] = useState<Array<any>>([]);
  //const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  //permission?.status !== ImagePicker.PermissionStatus.GRANTED

  //pick an image/video from the media library
  //Can also pick only image or only video separately. Set mediaTypes below. Everything else is the same including firebase file upload
  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Alert Title",
        "You've refused to allow this appp to access your photos!",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: true }
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All, //or use .Images//or .Videos to upload only images or only videos separately
      quality: 1,
      aspect: [3, 4], //or 4,3
    });

    // Explore the result
    //console.log(result);
    //if picker was not cancelled
    if (!result.canceled) {
      setPickedFilePath(result.assets[0].uri);
      //upload to Google Cloud Storage bucket
      uploadMediaFile(result.assets[0].uri, "Image/Video");
    }
  };

  //hoisted function declaration//works the same for images and videos
  async function uploadMediaFile(uri: string, fileType: string) {
    //upload image to firebase storage
    // Create a storage reference from our storage service
    //// Create a child reference by passing second arg
    //// imagesRef now points to 'images' folder
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "images" + new Date().getTime());

    // Upload the file and metadata
    const uploadTask = uploadBytesResumable(storageRef, blob);
    //listen for events

    // Pause the upload
    //uploadTask.pause();

    // Resume the upload
    // uploadTask.resume();

    // Cancel the upload
    // uploadTask.cancel();

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(Math.floor(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        //error.code==='storage/unauthorized' | "storage/canceled" | "storage/unknown"
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setPickedFilePath("");
          //console.log("File available at", downloadURL);
          await saveRecord(fileType, downloadURL, new Date().toISOString());
        });
      }
    );
  }

  //hoisted//save record to a collection for referencing later
  async function saveRecord(fileType: string, url: string, createdAt: string) {
    try {
      const ref = collection(db, "files");
      const record = await addDoc(ref, {
        fileType,
        url,
        createdAt,
      });
      //console.log(record.id);
    } catch (error: any) {
      console.error(error.toString());
    }
  }

  //take a photo with the camera
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    // Explore the result
    console.log(result);

    if (!result.canceled) {
      //   setPickedImagePath(result.uri);
      //   console.log(result.uri);
      //    const { uri } = cameraResp.assets[0];
      //    const fileName = uri.split("/").pop();
      //    const uploadResp = await uploadToFirebase(uri, fileName, (v) =>
      //      console.log(v)
      //    );
      //    console.log(uploadResp);
      //    listFiles().then((listResp) => {
      //      const files = listResp.map((value) => {
      //        return { name: value.fullPath };
      //      });
      //      setFiles(files);
      //    });
    }
  };

  //load files from collection on change
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New file", change.doc.data());
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button onPress={pickImage} title="Select an image" />
        <Button onPress={openCamera} title="Open camera" />
      </View>

      {pickedFilePath !== "" && (
        <UploadingCard
          image={pickedFilePath}
          video={pickedFilePath}
          progress={progress}
        />
      )}

      <View style={styles.imageContainer}>
        {pickedFilePath !== "" && (
          <Image source={{ uri: pickedFilePath }} style={styles.image} />
        )}

        <FlatList
          numColumns={3}
          contentContainerStyle={{ gap: 2 }}
          columnWrapperStyle={{ gap: 2 }}
          data={files}
          renderItem={({ item }) => {
            if (item.fileType === "image") {
              return <Image source={{ uri: item.url }} style={styles.image} />;
            } else {
              return (
                <Video
                  source={{
                    uri: item.url,
                  }}
                  videoStyle={{}}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode={ResizeMode.CONTAIN}
                  // shouldPlay
                  // is Looping
                  style={{ width: 200, height: 200 }}
                  // useNativeControls
                />
              );
            }
          }}
          keyExtractor={(item) => item.url}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: 400,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imageContainer: {
    padding: 30,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: "cover",
  },
});

export default React.memo(Delivery);
