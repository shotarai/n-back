import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "../App";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const PlayScreen: React.FC = () => {
  const [checkBool, setCheckBool] = useState(true);
  const [canResume, setCanResume] = useState(true);
  const [endUp, setEndUp] = useState(true);
  const [timeList, setTimeList] = useState<number[]>([]);
  const [correctList, setCorrectList] = useState<number[]>([]);
  const [letterList, setLetterList] = useState<string[]>(["", "", ""]);
  const [randomLetter, setRandomLetter] = useState("");
  const [displayCount, setDisplayCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const n = 3;
  const all_questions = 20;
  // const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabet = "ABCDEFGHI";

  type homeScreenProp = StackNavigationProp<StackParamList>;
  const navigation = useNavigation<homeScreenProp>();

  const RandomAlphabet = () => {
    if (!checkBool || displayCount === all_questions + n + 1) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    setRandomLetter(alphabet[randomIndex]);
    setLetterList((prevList) => {
      const updatedList = [...prevList, randomLetter].slice(-(n+1));
      return updatedList;
    });
    setDisplayCount(displayCount + 1);
    if (displayCount <= n) {
      setTimeout(() => {
        setRandomLetter("");
      }, 1500);
    }
    if (displayCount >= n + 1) {
      setCheckBool(false);
      setCanResume(false);
      setStartTime(performance.now());
    }
  };

  const CheckAnswer = (str: string) => {
    const endTime = performance.now();
    const timeDifference = (endTime - startTime) / 1000;
    if (letterList[0] === str) {
      setCorrectCount(correctCount + 1);
      setCorrectList((prevList) => [...prevList, 1])
    }else{
      setCorrectList((prevList) => [...prevList, 0])
    }
    setCheckBool(true);
    setCanResume(true);
    setTimeList((prevList) => [...prevList, timeDifference]);
  };

  useEffect(() => {
    if (displayCount <= n + 1) {
      const intervalIdBefore = setInterval(() => {
        RandomAlphabet();
      }, 2000);

      return () => {
        clearInterval(intervalIdBefore);
      };
    } else {
      const intervalIdAfter = setInterval(() => {
        RandomAlphabet();
      }, 1500);

      return () => {
        clearInterval(intervalIdAfter);
      };
    }
  }, [displayCount, canResume]);

  useEffect(() => {
    //最初に表示させる4個のアルファベットを除外して20問解かせるため
    if (displayCount === all_questions + n + 1) {
      setEndUp(false);
    }
  }, [timeList]);

  const formatDateToCustomString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;
  };

  const SendData = async () => {
    const currentDate: Date = new Date();
    const formattedDate = formatDateToCustomString(currentDate);
    const newData = {
      [formattedDate]: {
        正解数: correctCount,
        解答数: displayCount - n - 1,
        正答遷移: correctList,
        解答時間: timeList,
      },
    };
    const currentUserEmail = auth.currentUser?.email
      ? auth.currentUser.email
      : "";
    const dataRef = doc(db, "2023", currentUserEmail);
    await setDoc(
      dataRef,
      {
        data: newData,
      },
      { merge: true }
    );
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {endUp ? (
         checkBool ? (
          <View style={styles.container}>
            <Text style={[styles.randomLetter, { marginTop: -80 }]}>
              {randomLetter}
            </Text>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.text}>{n}つ前のアルファベットは？</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('A')}
                >
                  <Text style={styles.buttonText}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('B')}
                >
                  <Text style={styles.buttonText}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('C')}
                >
                  <Text style={styles.buttonText}>C</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('D')}
                >
                  <Text style={styles.buttonText}>D</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('E')}
                >
                  <Text style={styles.buttonText}>E</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('F')}
                >
                  <Text style={styles.buttonText}>F</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('G')}
                >
                  <Text style={styles.buttonText}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('H')}
                >
                  <Text style={styles.buttonText}>H</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => CheckAnswer('I')}
                >
                  <Text style={styles.buttonText}>I</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>結果</Text>
          <Text style={styles.text}>
            {correctCount}/{displayCount - n - 1}
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
  buttonContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "80%", // ボタンの幅を調整
    height: "80%", // ボタンの高さを調整
    margin: 10, // コンテナ全体の余白を調整
    justifyContent: "center", // 水平方向に中央揃え
  },
  row: {
    flexDirection: "row",
    width: "100%", // 1行全体の幅を調整
  },
  button2: {
    width: 100, // ボタンの幅
    height: 100, // ボタンの高さ
    margin: 8, // ボタン間の余白を調整
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue", // ボタンの背景色
    borderRadius: 8, // ボタンの角を丸くする
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
