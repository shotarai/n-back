import React, { useState } from "react";
import {
  Alert,
  TextInput,
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { auth } from "../firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { StackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const LoginScreen: React.FC = () => {
  type homeScreenProp = StackNavigationProp<StackParamList>;
  const navigation = useNavigation<homeScreenProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("メールアドレスまたはパスワードが間違っています！");
    }
    onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        Alert.alert("ユーザーが存在しません");
        navigation.navigate("Login");
      } else {
        if (user.emailVerified == true) {
          navigation.navigate("Play");
        } else {
          Alert.alert("メールの認証がされていません");
          navigation.navigate("Login");
        }
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.heading}>ログイン</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.text}>ログイン</Text>
        </TouchableOpacity>
        <Button
          title="新規登録はこちら→"
          onPress={() => {
            navigation.navigate("Register");
          }}
        />
      </View>
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

export default LoginScreen;
