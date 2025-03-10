import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Canvas, useImage } from "@shopify/react-native-skia";

const { width, height } = Dimensions.get("window");

const FlockCanvas = () => {
  const image = useImage(require("@/assets/images/pose_arms_out.png"));

  //

  if (!image) {
    return null;
  }

  return (
    <Canvas
      style={{
        ...StyleSheet.absoluteFillObject,
        width,
        height,
        zIndex: 10,
        // backgroundColor: "rgba(255,0,255,0.5)",
      }}
    >
      {/* <Image
        image={image}
        x={width / 2 - 128}
        y={100}
        width={256}
        height={256}
        fit="cover"
        opacity={0.5}
      /> */}
    </Canvas>
  );
};
export default FlockCanvas;
