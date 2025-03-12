import { useAudioPlayer } from "expo-audio";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { atom, useAtom } from "jotai";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ReText, clamp, mixColor } from "react-native-redash";
import FlockCanvas from "@/components/FlockCanvas";
import SimpleCoinCounter from "@/components/SimpleCoinCounter";
import { Text } from "@/components/Themed";

const COINS_PER_PRESS = 20;

export const coinAtom = atom(300);

export default function TabOneScreen() {
  const sfx = useAudioPlayer(require("@/assets/audio/coin-pickup.mp3"));
  const playSounds = useMemo(
    () => () => {
      sfx.seekTo(0);
      sfx.play();
    },
    [sfx]
  );

  const [coins, setCoins] = useAtom(coinAtom);
  const prevCoinsRef = useRef(coins);
  const progress = useSharedValue(0);
  const displayedCoins = useSharedValue(coins);
  const [isAnimating, setIsAnimating] = useState(false);
  const spriteCount = useMemo(() => {
    return clamp(coins - prevCoinsRef.current, 10, 30);
  }, [coins, prevCoinsRef]);

  useEffect(() => {
    if (prevCoinsRef.current !== coins) {
      prevCoinsRef.current = coins;
      animate();
    }
  }, [coins]);

  const animate = async () => {
    cancelAnimation(progress);
    progress.value = 0;
    setIsAnimating(true);

    setTimeout(() => playSounds(), 1600);

    progress.value = withTiming(
      1,
      {
        duration: 2500,
        easing: Easing.inOut(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          displayedCoins.value = coins;
          runOnJS(setIsAnimating)(false);
        }
      }
    );

    displayedCoins.value = withTiming(coins, {
      duration: 2500,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const coinText = useDerivedValue(() => {
    const rounded = Math.round(displayedCoins.value);
    return new Intl.NumberFormat("en-GB").format(rounded).toString();
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

  const handlePress = () => {
    if (isAnimating) return;
    setCoins(coins + COINS_PER_PRESS);
  };

  return (
    <>
      <FlockCanvas SPRITE_COUNT={spriteCount} progress={progress} />

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
        <TouchableOpacity
          style={[styles.button, { opacity: isAnimating ? 0.5 : 1 }]}
          onPress={handlePress}
          disabled={isAnimating}
        >
          <Text style={styles.buttonText}>Claim {COINS_PER_PRESS}</Text>
        </TouchableOpacity>
        <SimpleCoinCounter />
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
