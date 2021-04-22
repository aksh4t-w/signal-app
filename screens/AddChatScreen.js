import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../firebase";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => alert(err));
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Chat Name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <Icon
            name="wechat"
            type="antdesign"
            size={24}
            color="rgb(27, 66, 146)"
          />
        }
        onSubmitEditing={createChat}
      />
      <Button disabled={!input} onPress={createChat} title="Create" />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    width: "80%",
    alignSelf: "center",
  },
});
