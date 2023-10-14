import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "../App";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const PlayScreen: React.FC = () => {
  const [startBool, setStartBool] = useState(true);
  const [checkBool, setCheckBool] = useState(true);
  const [canResume, setCanResume] = useState(true);
  const [endUp, setEndUp] = useState(true);
  const [timeList, setTimeList] = useState<number[]>([]);
  const [letterList, setLetterList] = useState<string[]>(["", "", "", ""]);
  const [randomLetter, setRandomLetter] = useState("");
  const [displayCount, setDisplayCount] = useState(0);
  const [collectCount, setCollectCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  type homeScreenProp = StackNavigationProp<StackParamList>;
  const navigation = useNavigation<homeScreenProp>();

  const RandomAlphabet = () => {
    if (!checkBool || displayCount === 24) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    setRandomLetter(alphabet[randomIndex]);
    setDisplayCount(displayCount + 1);
    setLetterList((prevList) => {
      const updatedList = [...prevList, alphabet[randomIndex]].slice(-4);
      return updatedList;
    });
    if (displayCount >= 4) {
      setCheckBool(false);
      setCanResume(false);
      setStartTime(performance.now());
    }
  };

  const CheckAnswer = (num: number) => {
    const endTime = performance.now();
    const timeDifference = (endTime - startTime) / 1000;
    if (letterList[0] === letterList[3] && num) {
      setCollectCount(collectCount + 1);
    } else if (letterList[0] !== letterList[3] && !num) {
      setCollectCount(collectCount + 1);
    }
    setCheckBool(true);
    setCanResume(true);
    setTimeList((prevList) => [...prevList, timeDifference]);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      RandomAlphabet();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [displayCount, canResume]);

  useEffect(() => {
    //最初に表示させる4個のアルファベットを除外して30問解かせるため
    if (displayCount === 24) {
      setEndUp(false);
    }
  }, [timeList]);

  const formatDateToCustomString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;
  }

  const SendData = async () => {
    const currentDate: Date = new Date();
    const formattedDate = formatDateToCustomString(currentDate);
    const newData = {
      [formattedDate]: {
        正解率: `${collectCount}/${displayCount - 4}`,
        解答時間: timeList,
      },
    };
    const currentUserEmail = auth.currentUser?.email ? auth.currentUser.email : "";
    const dataRef = doc(db, "2023", currentUserEmail);
    await setDoc(
      dataRef,
      {
        data: newData,
      },
      { merge: true }
    );
    navigation.navigate("Result");
  };

  return (
    <View style={styles.container}>
      {endUp ? (
        startBool ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setStartBool(false)}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : checkBool ? (
          <View style={styles.container}>
            <Text style={[styles.randomLetter, { marginTop: -80 }]}>
              {randomLetter}
            </Text>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.text}>
              三つ前のアルファベットと同じですか？
            </Text>
            <TouchableOpacity
              style={[styles.button, { marginTop: 50 }]}
              onPress={() => CheckAnswer(1)}
            >
              <Text style={styles.buttonText}>同じ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => CheckAnswer(0)}
            >
              <Text style={styles.buttonText}>異なる</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>結果</Text>
          <Text style={styles.text}>
            {collectCount}/{displayCount - 4}
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 50 }]}
            onPress={() => SendData()}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 10,
    width: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
  randomLetter: {
    fontSize: 256,
  },
  text: {
    color: "black",
    fontSize: 24,
    textAlign: "center",
  },
});

export default PlayScreen;
