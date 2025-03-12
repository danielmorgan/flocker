import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { coinAtom } from "@/app/(tabs)";

export default function SimpleCoinCounter() {
  const [coins, setCoins] = useAtom(coinAtom);

  return (
    <View>
      <Text>Coins: {coins}</Text>
      <TouchableOpacity onPress={() => setCoins(coins + 10)}>
        <Text>Claim 10</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({});
