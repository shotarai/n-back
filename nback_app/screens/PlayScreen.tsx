import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PlayScreen: React.FC = () => {
  const [startBool, setStartBool] = useState(true);
  const [checkBool, setCheckBool] = useState(true);
  const [canResume, setCanResume] = useState(true);
  const [timeList, setTimeList] = useState<number[]>([]);
  const [letterList, setLetterList] = useState<string[]>(["", "", "", ""]);
  const [randomLetter, setRandomLetter] = useState("");
  const [displayCount, setDisplayCount] = useState(0);
  const [collectCount, setCollectCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [timeDifference, setTimeDifference] = useState(0);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const RandomAlphabet = () => {
    if (!checkBool) {
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
    if (letterList[0] === letterList[3] && num) {
      setCollectCount(collectCount + 1);
    } else if (letterList[0] !== letterList[3] && !num) {
      setCollectCount(collectCount + 1);
    }
    setCheckBool(true);
    setEndTime(performance.now());
    const timeDiffInMilliseconds = (endTime - startTime) / 1000;
    setTimeDifference(timeDiffInMilliseconds);
    setTimeList((prevList) => [...prevList, timeDifference]);
    setCanResume(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      RandomAlphabet();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [displayCount, canResume]);

  return (
    <View style={styles.container}>
      {startBool ? (
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
          <Text style={styles.text}>三つ前のアルファベットと同じですか？</Text>
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
