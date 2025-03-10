import { StyleSheet, TouchableOpacity } from "react-native";
import FlockCanvas from "@/components/FlockCanvas";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  return (
    <>
      <View style={{ pointerEvents: "none", zIndex: 10 }}>
        <FlockCanvas />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Press Me</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
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
    backgroundColor: "forestgreen",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
