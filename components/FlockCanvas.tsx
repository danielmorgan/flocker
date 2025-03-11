import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Atlas,
  Canvas,
  Text,
  useFont,
  useImageAsTexture,
  useRSXformBuffer,
  useRectBuffer,
} from "@shopify/react-native-skia";
import {
  Extrapolation,
  SharedValue,
  clamp,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";

const SPRITE_SIZE = 20;

// const SPRITE_COUNT = 26;
const SPRITE_DELAY = 0.03;
const SPREAD_RADIUS = 40;
const ROTATION_CYCLES = 0.3;

interface Props {
  SPRITE_COUNT: number;
  progress: SharedValue<number>;
}

const FlockCanvas = ({ SPRITE_COUNT, progress }: Props) => {
  const coinTexture = useImageAsTexture(require("@/assets/images/coin_gold_sm.png"));
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 16);

  /**
   * Positions
   */
  const [{ width, height }, setLayout] = useState({
    width: 0,
    height: 0,
  });
  const handleOnLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };
  const c = useMemo(() => ({ x: width / 2, y: height / 2 }), [width, height]); // center of canvas
  const t = useMemo(() => ({ x: width - 95, y: 40 }), [width]); // target for coins to flock to

  /**
   * Debug
   */
  const debugText = useDerivedValue(() => {
    "worklet";
    return `${progress.value}`;
  }, [progress]);

  /**
   * Matrix transformation intermediate functions
   */
  const getDelayedProgress = (index: number, progress: number) => {
    "worklet";
    // Each coin starts slightly after the previous one
    const delay = index * SPRITE_DELAY;
    return clamp((progress - delay) / (1 - delay), 0, 1);
  };
  const getFlightPath = (index: number, progress: number) => {
    "worklet";
    // Start position (spread around center)
    const startAngle = ((index * 137.5) % 360) * (Math.PI / 180);
    const startX = c.x + Math.cos(startAngle) * SPREAD_RADIUS;
    const startY = c.y + Math.sin(startAngle) * SPREAD_RADIUS;

    // Current position
    const x = interpolate(progress, [0, 1], [startX, t.x]);
    const y = interpolate(progress, [0, 1], [startY, t.y]);

    return { x, y };
  };
  const getRotation = (progress: number) => {
    "worklet";
    return progress * Math.PI * 2 * ROTATION_CYCLES;
  };
  const getScale = (progress: number) => {
    "worklet";
    return interpolate(progress, [0, 0.1, 1], [0, 1, 1], Extrapolation.CLAMP);
  };
  const opacity = useDerivedValue(() => {
    "worklet";
    return interpolate(progress.value, [0, 0.1, 0.95, 1], [0, 1, 1, 0], Extrapolation.CLAMP);
  }, [progress]);

  /**
   * Atlas buffers
   */
  const spritesBuffer = useRectBuffer(SPRITE_COUNT, (rect, i) => {
    "worklet";
    rect.setXYWH(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  });
  const transformsBuffer = useRSXformBuffer(SPRITE_COUNT, (val, i) => {
    "worklet";
    const delayedProgress = getDelayedProgress(i, progress.value);
    const { x, y } = getFlightPath(i, delayedProgress);
    const rotation = getRotation(delayedProgress);
    const scale = getScale(delayedProgress);

    // Apply scale and rotation
    const s = Math.sin(rotation) * scale;
    const c = Math.cos(rotation) * scale;

    // Center the pivot point
    const px = SPRITE_SIZE / 2;
    const py = SPRITE_SIZE / 2;

    val.set(
      c, // scale * Cos
      s, // -scale * Sin
      x - c * px + s * py, // translateX
      y - s * px - c * py // translateY
    );
  });

  return (
    <View style={{ pointerEvents: "none", zIndex: 10, ...StyleSheet.absoluteFillObject }}>
      <Canvas
        onLayout={handleOnLayout}
        style={{
          zIndex: 10,
          width: "100%",
          height: "100%",
        }}
      >
        {/* <Text x={0} y={16} text={debugText} font={font} /> */}
        <Atlas
          image={coinTexture}
          sprites={spritesBuffer}
          transforms={transformsBuffer}
          opacity={opacity}
        />
      </Canvas>
    </View>
  );
};
export default FlockCanvas;
