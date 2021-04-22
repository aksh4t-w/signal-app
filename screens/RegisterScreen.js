import React, { useLayoutEffect, useState } from "react";
import { StatusBar } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { auth } from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            imageUrl ||
            "https://toppng.com/uploads/preview/roger-berry-avatar-placeholder-11562991561rbrfzlng6h.png",
        });
      })
      .catch((err) => alert(err.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />

      <Text h4 style={{ marginBottom: 50, textAlign: "center" }}>
        Register now! What could go wrong?
        {"\n"}
        (☞ﾟヮﾟ)☞
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autofocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          type="text"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Profile Picture URL (optional)"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
        />
      </View>

      <Button
        containerStyle={styles.button}
        raised
        onPress={register}
        title="Register"
      />

      {/* <View style={{ height: 50, margin: 10 }} /> */}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
});
