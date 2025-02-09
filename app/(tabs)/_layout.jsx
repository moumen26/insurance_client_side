import React, { useState } from "react";
import { Tabs } from "expo-router";
import {
  DocumentTextIcon,
  Squares2X2Icon,
  PlusIcon,
  ChevronDownIcon,
} from "react-native-heroicons/solid";
import {
  View,
  Animated,
  Pressable,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import SelectOption from "../components/SelectOption";

import { LinearGradient } from "expo-linear-gradient";
import ProtectedScreen from "../util/ProtectedScreen";

const TabLayout = () => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [modalVisible, setModalVisible] = useState(false);
  const [claimDetails, setClaimDetails] = useState("");
  const [showSelectOption, setShowSelectOption] = useState(false);

  const [selectedServiceType, setSelectedServiceType] = useState("");

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

  const handleAddButtonPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setClaimDetails(""); // Reset input on close
  };

  const handleAddClaim = () => {
    if (claimDetails) {
      alert(`New claim added: ${claimDetails}`);
      handleModalClose();
    } else {
      alert("Please provide claim details.");
    }
  };

  return (
    <ProtectedScreen>
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

      <View style={styles.addButtonWrapper}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleAddButtonPress}
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

      {/* Modal for Adding New Claim */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Claim</Text>

            <Text style={styles.inputLabel}>Service Type:</Text>
            <TouchableOpacity
              style={styles.selectOption}
              onPress={() => setShowSelectOption(true)}
            >
              <Text style={styles.textlabel}>Select Service Type</Text>
              <ChevronDownIcon size={15} color="#043146" />
            </TouchableOpacity>
            <SelectOption
              options={["Option 1", "Option 2", "Option 3"]}
              visible={showSelectOption}
              onSelect={(option) => {
                // setSelectedOption(option);
                setShowSelectOption(false);
              }}
            />

            <Text style={styles.inputLabel}>Claim Amount:</Text>
            <View
              className="flex-row items-center"
              style={styles.passwordContainer}
            >
              <Text style={styles.textlabel}>Da</Text>
              <TextInput
                style={styles.textlabel}
                placeholder="Claim Amount"
                keyboardType="numeric"
                // value={newClaim.claimAmount}
                // onChangeText={(text) => setNewClaim({ ...newClaim, claimAmount: text })}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddClaim}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ProtectedScreen>

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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    marginBottom: 20,
  },
  passwordContainer: {
    gap: 5,
    width: "100%",
    height: 40,
    borderColor: "#043146",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#000",
    alignSelf: "flex-start",
    fontFamily: "Montserrat-Medium",
  },
  textlabel: {
    fontSize: 14,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#043146",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "300",
  },
  buttonTextCancel: {
    color: "#043146",
    fontSize: 16,
    fontWeight: "300",
  },
  selectOption: {
    width: "100%",
    flexDirection: "row",
    gap: 4,
    height: 40,
    fontSize: 16,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: "#043146",
    borderWidth: 0.5,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
});

export default TabLayout;
