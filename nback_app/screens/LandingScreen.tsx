import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged, User } from "firebase/auth";
import type { StackParamList } from "../App";
import { auth } from "../firebase";
import { StackNavigationProp } from "@react-navigation/stack";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

const LandingScreen: React.FC = () => {
  type homeScreenProp = StackNavigationProp<StackParamList>;
  const navigation = useNavigation<homeScreenProp>();

  const checkUserData = () => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        navigation.navigate("Login");
      } else {
        if (user.emailVerified == true) {
          navigation.navigate("Play");
        } else {
          navigation.navigate("Login");
        }
      }
    });
  };

  useEffect(() => {
    checkUserData();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
      <Text>We are checking your data.</Text>
      <Text>{"\n\n\n"}</Text>
      <Text>If the screen does not progress, please reload or restart.</Text>
      <Text>もし画面が進まない場合はリロードまたは再起動してください．</Text>
    </View>
  );
};

export default LandingScreen;
