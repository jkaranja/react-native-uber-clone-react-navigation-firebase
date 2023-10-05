import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { StackParamList } from "../types/navigator";
import { Text } from "react-native";
import { IconButton } from "react-native-paper";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
type ChatProps = NativeStackScreenProps<StackParamList, "Chat">;

const Chat = ({ navigation }: ChatProps) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  //fetch messages
  useEffect(() => {
    //##retrieve the contents of a single document using get() and doc()//not collection()
    // const docRef = doc(db, "cities", "SF");
    // const docSnap = await getDoc(docRef);
    //docSnap.exists() && console.log("Document data:", docSnap.data());

    //##Get multiple documents from a collection + filters+sort+limit
    const collectionRef = collection(db, "chats");
    //To retrieve all the documents from a sub-collection, create a reference with the complete path to that subcollection:
    //collection(db, "cities", "SF", "landmarks")
    // Create a query against the collection.
    const q = query(
      collectionRef,
      // where("state", "==", "CA"),
      orderBy("createdAt", "desc")
      // limit(3)
    );
    //#get docs
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });

    //#count docs
    //const snapshot = await getCountFromServer(q);
    //console.log("count: ", snapshot.data().count);

    //#You can also listen to a document/multiple documents with the onSnapshot() method for realtime updates
    //Then, each time the contents change, another call updates the document snapshot
    const unsubscribe = onSnapshot(q, (snapshot) => {
      //console.log("Current data: ", querySnapshot.data());

      setMessages(
        snapshot.docs.map(
          (doc) =>
            ({
              _id: doc.id,
              text: doc.data().text,
              createdAt: doc.data().createdAt.toDate(),
              user: doc.data().user,
              //user: {
              //   _id: 2,
              //   name: "React Native",
              //   avatar: "https://placeimg.com/140/140/any",
              // }
              //click IMessage to see other properties that IMessage contains
            } as IMessage)
        )
      );
    });

    //##Add a doc//see onSend
    //##update a doc(To update field of a sub-doc, use ref with complete path to it eg doc(db, "cities", "DC"))
    // Set "capital" field to 'DC'
    // await updateDoc(docRef, {
    //   capital: "DC",
    // population: increment(50) //dec or inc a numeric value// decrement()
    // capital: deleteField()//remove a field from doc
    //..fields
    // });
    //# Update fields in nested objects: use dot notation like with mongoose embedded docs
    // await updateDoc(frankDocRef, {
    //   age: 13,
    //   "favorites.color": "Red",
    // });
    //## Del a sub-docs {dc: {}, la: {}}//so 'DC' below is a field with a sub doc
    //not sure if it support where clause or how to del the entire doc if we didn't save it as a nested doc 
    //await deleteDoc(doc(db, "cities", "DC"));
    //Warning: Deleting a document does not delete its sub-collections!//

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    //our new message
    const { _id, createdAt, text, user } = messages[0];
    //save message to db
    // Add a new document with an auto generated 'id' to collection "chats"
    //use addDoc(collection(db, "chats", "subDocName") to add message as a sub doc
    addDoc(collection(db, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      //headerBackTitle: "Back",
      //title: "Settings",
      //use headerTitle to use a React.ReactNode as title
      headerTitle: (props) => (
        <Text className="text-lg font-semibold text-white ">Chat</Text>
      ),
      // headerStyle: {
      //   //style object that will be applied to the View that wraps the header
      //   backgroundColor: "#10b981",
      // },
      // headerTitleStyle: {
      //   //style properties for the title
      //   color: "#fff",
      // },

      // headerLeft: () => (
      //     <Button
      //       title="Back"
      //       color="#fff"
      //     />
      // ),
      headerRight: () => (
        <IconButton
          icon="logout"
          iconColor="#fff"
          size={28}
          onPress={() => navigation.navigate("Profile")}
        />
      ),
    });
  }, [navigation]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: "xyz", //can get userId from token->jwt-decode->_id
        avatar:
          "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png",
      }}
      messagesContainerStyle={{backgroundColor: "#fff"}}
    />
  );
};

export default Chat;
