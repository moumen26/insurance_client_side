import React from "react";
import { Tabs } from "expo-router";
import {
  DocumentTextIcon,
  Squares2X2Icon,
  PlusIcon,
} from "react-native-heroicons/solid";
import { View, Animated, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const TabLayout = () => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#009ff5",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            position: "absolute",
            overflow: "hidden",
            height: 60,
            width: "calc(100% - 100px)",
            marginLeft: 50,
            marginRight: 50,
            marginBottom: 20,
            alignSelf: "center",
            borderRadius: 15,
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={["#043146", "#001F33"]}
              style={styles.tabBarGradient}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Squares2X2Icon name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="claims"
          options={{
            title: "Claims",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <DocumentTextIcon name="document" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Add Button */}
      <View style={styles.addButtonWrapper}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => alert("Add button clicked!")}
        >
          <Animated.View
            style={[styles.addButton, { transform: [{ scale: scaleAnim }] }]}
          >
            <LinearGradient
              colors={["#009ff5", "#005f87"]}
              style={styles.addButtonGradient}
            >
              <PlusIcon size={28} color="white" />
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarGradient: {
    flex: 1,
    borderRadius: 15,
  },
  addButtonWrapper: {
    position: "absolute",
    bottom: 45,
    left: "50%",
    transform: [{ translateX: -30 }],
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabLayout;
