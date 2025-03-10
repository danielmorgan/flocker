import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Atlas,
  Canvas,
  Circle,
  Text,
  useFont,
  useImageAsTexture,
  useRSXformBuffer,
  useRectBuffer,
} from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

const coinSize = 20;
const NUM_SPRITES = 5;

interface Props {
  progress: SharedValue<number>;
}

const FlockCanvas = ({ progress }: Props) => {
  const [{ width, height }, setLayout] = useState({
    width: 0,
    height: 0,
  });
  const handleOnLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };
  const c = useMemo(() => ({ x: width / 2, y: height / 2 }), [width, height]);
  const coinTexture = useImageAsTexture(require("@/assets/images/coin_gold_sm.png"));
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 16);

  const debugText = useDerivedValue(() => {
    "worklet";
    return `${progress.value}`;
  }, [progress]);

  const spritesBuffer = useRectBuffer(NUM_SPRITES, (rect, i) => {
    "worklet";
    rect.setXYWH(0, 0, coinSize, coinSize);
  });

  const transformsBuffer = useRSXformBuffer(NUM_SPRITES, (val, i) => {
    "worklet";
    const tx = c.x + coinSize / 2 + ((i * coinSize) % width) + progress.value * 25;
    const ty = c.y - coinSize / 2 - ((i * coinSize) % height);
    const theta = Math.atan2(c.y - ty, c.x - tx);
    val.set(Math.sin(theta), Math.cos(theta), tx, ty);
  });

  return (
    <View style={{ pointerEvents: "none", zIndex: 10, ...StyleSheet.absoluteFillObject }}>
      <Canvas
        onLayout={handleOnLayout}
        style={{
          zIndex: 10,
          width: "100%",
          height: "100%",
          // backgroundColor: "rgba(255, 0, 255, 0.5)",
        }}
      >
        <Text x={0} y={16} text={debugText} font={font} />
        <Atlas image={coinTexture} sprites={spritesBuffer} transforms={transformsBuffer} />
        {/* <Image image={coin} fit="cover" x={0} y={0} width={40} height={40} /> */}
        <Circle cx={c.x} cy={c.y} r={5} color="magenta" />
      </Canvas>
    </View>
  );
};
export default FlockCanvas;
