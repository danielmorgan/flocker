import { Image, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ReText, mixColor } from "react-native-redash";
import FlockCanvas from "@/components/FlockCanvas";
import { Text } from "@/components/Themed";

export default function TabOneScreen() {
  const progress = useSharedValue(0);

  const handlePress = () => {
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.cubic) });
  };

  const coinText = useDerivedValue(() => {
    const coins = interpolate(progress.value, [0, 0.8, 1], [100, 100, 126]);
    return Math.round(coins).toString();
  }, [progress]);

  const coinContainerAnimatedProps = useAnimatedProps(() => {
    const scale = interpolate(progress.value, [0, 0.8, 0.9, 1], [1, 1, 1.1, 1]);
    const color = mixColor(
      interpolate(progress.value, [0.8, 0.9, 1], [0, 1, 0]),
      "hsl(120 60.69% 33.92%)",
      "hsl(120 100% 35.69%)"
    );

    return {
      transform: [{ scale }],
      backgroundColor: color,
    };
  }, [progress]);

  return (
    <>
      <FlockCanvas progress={progress} />

      <ImageBackground
        source={require("@/assets/images/colored_talltrees.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <Animated.View style={styles.currencyContainer} animatedProps={coinContainerAnimatedProps}>
          <Image
            source={require("@/assets/images/coin_gold.png")}
            style={{ width: 24, height: 24, aspectRatio: 1 }}
            resizeMode="contain"
          />
          <ReText style={styles.currency} text={coinText} />
        </Animated.View>
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
    backgroundColor: "hsl(120 60.69% 33.92%)",
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
    fontVariant: ["tabular-nums"],
    fontWeight: "bold",
    color: "white",
  },
});
