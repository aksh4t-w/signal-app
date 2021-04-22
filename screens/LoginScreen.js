import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behaviour="padding">
      <StatusBar style="light" />
      <Image
        source={{
          uri:
            "data:image/png;base64,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",
        }}
        style={{ width: 200, height: 200, marginBottom: 50 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
          autoCapitalize="none"
        />
      </View>
      <Button containerStyle={styles.button} title="Login" onPress={signIn} />

      <Button
        onPress={() => navigation.navigate("Register")}
        containerStyle={styles.button}
        type="outline"
        title="Register"
      />
      <View style={{ height: 50, margin: 10 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
