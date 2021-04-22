import React, { useLayoutEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, db } from "../firebase";
import firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // title: route.params.chatName,
      headerTitleStyle: { color: "white" },
      // headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: -10,
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                messages.slice(-1)[0]?.data.photoURL ||
                "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
            }}
          />
          <Text
            style={{
              fontWeight: 700,
              marginLeft: 10,
              color: "white",
            }}
          >
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          activeOpacity={0.5}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behaviour={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      rounded
                      //Web styles
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      size={25}
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      rounded
                      //Web styles
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      position="absolute"
                      bottom={-10}
                      left={-5}
                      size={25}
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.senderName}>
                      {data.displayName.split(" ")[0]}
                    </Text>
                    <Text style={styles.senderText}>{data.message}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Signal Message"
                style={styles.textInput}
                value={input}
                onChangeText={(text) => setInput(text)}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2b68e6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  receiver: {
    padding: 10,
    paddingLeft: 0,
    backgroundColor: "#ececec",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 10,
    paddingLeft: 0,
    paddingBottom: 0,
    backgroundColor: "#2b68e6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 10,
    marginBottom: 10,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    marginLeft: 10,
    marginBottom: 15,
    fontWeight: "400",
    color: "white",
  },
  receiverText: {
    marginLeft: 10,
    fontWeight: "400",
    color: "black",
  },
  senderName: {
    left: 25,
    bottom: -10,
    // paddingRight: 10,
    position: "absolute",
    fontSize: 7,
    color: "black",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ececec",
    borderWidth: 1,
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
});
