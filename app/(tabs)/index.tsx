import { useState } from "react";
import { Image, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import {
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import FlockCanvas from "@/components/FlockCanvas";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  const [playing, setPlaying] = useState(false);
  const sv = useSharedValue(0);

  const handlePress = () => {
    if (!playing) {
      sv.value = withRepeat(withSequence(withTiming(5), withTiming(1)), -1);
      setPlaying(true);
    } else {
      cancelAnimation(sv);
      setPlaying(false);
    }
  };

  return (
    <>
      <FlockCanvas sv={sv} />

      <ImageBackground
        source={require("@/assets/images/colored_talltrees.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.currencyContainer}>
          <Image
            source={require("@/assets/images/coin_gold.png")}
            style={{ width: 24, height: 24, aspectRatio: 1 }}
            resizeMode="contain"
          />
          <Text style={styles.currency}>100</Text>
        </View>
        <Text style={styles.title}>Hello World</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Claim reward</Text>
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    zIndex: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    backgroundColor: "#7629DB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  currencyContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "forestgreen",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#0E2504",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  currency: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
