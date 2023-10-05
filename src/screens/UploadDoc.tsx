import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  StatusBar,
} from "react-native";
import React, { useCallback, useState } from "react";
import DocumentPicker, { types } from "react-native-document-picker";

const UploadDoc = () => {
  const [fileResponse, setFileResponse] = useState<Array<any>>([]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      //other methods"
      //DocumentPicker.pickSingle() ==>pick just single file
      //DocumentPicker.pickMultiple() ==>pick multiple files
      //or use below and control with allowMultiSelection: false (default)
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
        type: [types.pdf, types.docx, types.images], //remove for any file type. See types definition for other types
        allowMultiSelection: true, //allow user to select multiple files at once
      });
      //console.log(response)
      setFileResponse(response);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) console.log("Upload cancelled", err);
      console.warn(err);
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      {fileResponse.map((file, index) => (
        <Text
          key={index.toString()}
          style={styles.uri}
          numberOfLines={1}
          ellipsizeMode={"middle"}
        >
          {file?.uri}
        </Text>
      ))}
      <Button title="Select 📑" onPress={handleDocumentSelection} />
    </SafeAreaView>
  );
};

export default UploadDoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  uri: {
    color: "#000",
  },
});
