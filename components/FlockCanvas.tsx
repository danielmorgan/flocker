import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Atlas,
  Canvas,
  Circle,
  rect,
  useImageAsTexture,
  useRSXformBuffer,
} from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

const coinSize = 20;
const NUM_SPRITES = 500;
const sprites = new Array(NUM_SPRITES).fill(0).map(() => rect(0, 0, coinSize, coinSize));

const FlockCanvas = ({ sv }: { sv: SharedValue<number> }) => {
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

  const transforms2 = useRSXformBuffer(NUM_SPRITES, (val, i) => {
    "worklet";
    const tx = c.x + coinSize / 2 + ((i * coinSize) % width);
    const ty = c.y - coinSize / 2 - ((i * coinSize) % height);
    const theta = Math.atan2(c.y - ty * sv.value, c.x - tx * sv.value);
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
        <Atlas image={coinTexture} sprites={sprites} transforms={transforms2} />
        {/* <Image image={coin} fit="cover" x={0} y={0} width={40} height={40} /> */}
        <Circle cx={c.x} cy={c.y} r={5} color="magenta" />
      </Canvas>
    </View>
  );
};
export default FlockCanvas;
