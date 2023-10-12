import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, StyleSheet } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import PlayScreen from "./screens/PlayScreen";
import LandingScreen from "./screens/LandingScreen";
import ResultScreen from "./screens/ResultScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export type StackParamList = {
  Result: undefined;
  Landing: undefined;
  Login: undefined;
  Play: undefined;
  Register: undefined;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
        <Text>BehaviorTracking is up and running!</Text>
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Login"}>
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Play"
            component={PlayScreen}
            options={{
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
