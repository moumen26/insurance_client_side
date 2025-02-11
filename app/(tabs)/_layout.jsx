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
  Image,
  Alert,
} from "react-native";
import SelectOption from "../components/SelectOption";
import { LinearGradient } from "expo-linear-gradient";
import ProtectedScreen from "../util/ProtectedScreen";
import useAuthContext from "../hooks/useAuthContext";
import decodeJWT from "../util/tokenDecoder";
import Config from "../config.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from '@expo/vector-icons';

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const TabLayout = () => {
  const { user } = useAuthContext();
  const decodedToken = decodeJWT(user?.token);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [modalVisible, setModalVisible] = useState(false);
  const [showSelectOption, setShowSelectOption] = useState(false);
  const [selectedMedicalServiceOption, setSelectedMedicalServiceOption] = useState(null);
  const [claim_amount, setClaimAmount] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  
  // Function to handle image selection
  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // This allows all file types
        multiple: true, // Enable multiple file selection
        copyToCacheDirectory: true,
      });
  
      if (result.canceled) {
        console.log("User cancelled file picker");
      } else {
        setSelectedImages(result.assets);  // Store selected files
      }
    } catch (err) {
      console.error("Error picking file:", err);
      Alert.alert("Error", "Could not pick file. Please try again.");
    }
  };

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

  const handleDelete = (fileToDelete) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((file) => file.name !== fileToDelete.name)
    );
  };

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch medical services data
  const fetchAllMedicalServicesData = async () => {
    try {
      const response = await api.get(`/medicalservice/all`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404 errors
        } else {
          throw new Error("Error receiving medical services data");
        }
      }

      // Return the data from the response
      return await response.data;
    } catch (error) {
      // Handle if the request fails with status code 401 or 404
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return []; // Return an empty array for 401 and 404 errors
      }
      throw new Error(error?.message || "Network error");
    }
  };
  const {
    data: AllMedicalServicesData,
    error: AllMedicalServicesDataError,
    isLoading: AllMedicalServicesDataLoading,
    refetch: AllMedicalServicesDataRefetch,
  } = useQuery({
    queryKey: ["AllMedicalServicesData", user?.token], // Ensure token is part of the query key
    queryFn: fetchAllMedicalServicesData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  
  const handleNewClaim = async () => {
    setError("");    
    setSubmitionLoading(true);
    try {
      // Create FormData object
      const formData = new FormData();
  
      // Append claim data
      formData.append("medicalservice", selectedMedicalServiceOption?.id);
      formData.append("claim_amount", claim_amount);
  
      // Append files
      selectedImages?.forEach((file, index) => {
        formData.append("files", {
          uri: file.uri,
          type: file.mimeType,
          name: file.name || `file_${index}`,
        });
      });
      
      const response = await fetch(`${Config.API_URL}/claim/client/new/${decodedToken?.id}`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
        setSubmitionLoading(false);
      } else {
        //close modal
        setSubmitionLoading(false);
        setModalVisible(false);
        alert(json.message);
        setError("");
      }
    } catch (err) {
      setSubmitionLoading(false);
      setError("Something went wrong. Please try again.");
      console.log(err);
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
        {(!AllMedicalServicesDataLoading && !submitionLoading) ?
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Claim</Text>

              <Text style={styles.inputLabel}>Service Type:</Text>
              <TouchableOpacity
                style={styles.selectOption}
                onPress={() => setShowSelectOption(true)}
              >
                <Text style={styles.textlabel}>{selectedMedicalServiceOption?.userAssociation?.fullname ||
                'Select Service Type'
                }</Text>
                <ChevronDownIcon size={15} color="#043146" />
              </TouchableOpacity>
              <SelectOption
                options={AllMedicalServicesData?.length > 0 ? AllMedicalServicesData : []}
                visible={showSelectOption}
                onSelect={(option) => {
                  setSelectedMedicalServiceOption(option);
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
                  value={claim_amount}
                  onChangeText={setClaimAmount}
                />
              </View>

              <TouchableOpacity onPress={handleFilePicker} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerText}>Select Files</Text>
              </TouchableOpacity>

              {/* Display Selected Images */}
              <View style={styles.filePreviewContainer}>
              {selectedImages.map((file, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(file)}>
                    <Ionicons name="trash-outline" size={15} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
              
              <Text
                style={{
                  display: error ? "flex" : "none",
                  textAlign: "center",
                  color: "red",
                  width: "100%",
                }}
              >
                {error}
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleNewClaim}  
                >
                  <Text 
                    style={styles.buttonText}
                  >Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          :
          <View style={styles.modalOverlay}>
            <Text>Loading...</Text>
          </View>
        }
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
  filePreviewContainer: {
    padding: 10,
  },
  card: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 0.5,
  },
  fileName: {
    color: '#000',
    fontSize: 10,
  },
});

export default TabLayout;
