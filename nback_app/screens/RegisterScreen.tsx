import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        sendEmailVerification(user)
          .then(() => {
            Alert.alert("Send an e-mail to verify your account");
          })
          .catch((error) => {
            if (error instanceof Error) {
              Alert.alert(error.message);
            } else {
              Alert.alert("An unknown error occurred.");
            }
          });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };

  const inputEmail = (
    <View style={{ marginBottom: 20 }}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  const inputPassword = (
    <View style={{ marginBottom: 20 }}>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Enter your password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
    </View>
  );

  const registerButton = (
    <TouchableOpacity
      style={styles.button}
      onPress={handleRegister}
    >
      <Text style={styles.text}>登録する</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
    >
      <Text style={styles.heading}>ユーザー登録</Text>
      {inputEmail}
      {inputPassword}
      {registerButton}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 16,
    },
    heading: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: "center",
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 12,
      paddingLeft: 10,
    },
    button: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#88cb7f",
      width: 150,
      borderRadius: 10,
      alignSelf: "center",
    },
    text: {
      color: "white",
      fontSize: 20,
      textAlign: "center",
    },
  });

export default RegisterScreen;
