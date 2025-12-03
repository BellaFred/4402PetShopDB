import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BottomNav from "./components/BottomNav";

export default function ConfirmationScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Purchase Successful!</Text>
          <Text style={styles.subtitle}>Enjoy your new companion!</Text>
        </View>
      </SafeAreaView>
      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002D2D",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#7AAFA9",
    fontSize: 18,
    textAlign: "center",
  },
});