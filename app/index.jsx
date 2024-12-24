import React from "react";
import { Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "expo-router";

const DashboardScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Login/index")}>
        <Text>Go To Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DashboardScreen;
