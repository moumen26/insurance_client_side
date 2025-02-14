import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput
} from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import useAuthContext from "../hooks/useAuthContext";
import decodeJWT from "../util/tokenDecoder";
import Config from "../config.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProtectedScreen from "../util/ProtectedScreen";
import { formatDate } from "../util/useFullFunctions";
import ArchiveButton from "../components/ArchiveButton.jsx";
import AntDesign from '@expo/vector-icons/AntDesign';

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ArchiveClaim = ({ navigation }) => {
  const { user } = useAuthContext();
  const decodedToken = decodeJWT(user?.token);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClaimData, setSelectedClaimData] = useState(null);
  const [error, setError] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [accusation, setAccusation] = useState("");

  const handleAddButtonPress = (item) => {
    setSelectedClaimData(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedClaimData(null);
    setModalVisible(false);
  };

  const renderClaimItem = ({ item }) => (
    <TouchableOpacity
      style={styles.claimCard}
      onPress={() => handleAddButtonPress(item)}
    >
      <Text style={styles.claimTitle}>Claim #{item?.id}</Text>
      <Text style={styles.claimText}>Service Type: {item?.medicalServiceAssociation?.userAssociation?.fullname}</Text>
      <Text style={styles.claimAmount}>
        Claim Amount: {item?.claim_amount} DA
      </Text>
      {item?.status == 'paid' &&
        <Text style={styles.claimAmount}>
          Reimbursement: {item?.reimbursement || 0} DA
        </Text>
      }
      <Text style={styles.claimStatus}>Status: {item?.status}</Text>
      <Text style={styles.claimDate}>Submitted: {formatDate(item?.date)}</Text>
    </TouchableOpacity>
  );

  const renderClaimItemLoading = ({ item }) => (
    <ShimmerPlaceholder style={styles.claimCardLoading} />
  );

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch medical services data
  const fetchAllArchiveClaimsData = async () => {
    try {
      const response = await api.get(`/claim/client/archived/${decodedToken?.id}`, {
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
          throw new Error("Error receiving claims data");
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
    data: AllArchiveClaimsData,
    error: AllArchiveClaimsDataError,
    isLoading: AllArchiveClaimsDataLoading,
    refetch: AllArchiveClaimsDataRefetch,
  } = useQuery({
    queryKey: ["AllArchiveClaimsData", user?.token], // Ensure token is part of the query key
    queryFn: fetchAllArchiveClaimsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 1000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  const handleAddAccusation = async () => {
    setError("");    
    setSubmitionLoading(true);
    try {
      const response = await fetch(`${Config.API_URL}/accusation/create/${decodedToken?.id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          justification: selectedClaimData?.justification?.id,
          description: accusation,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
        setSubmitionLoading(false);
      } else {
        AllArchiveClaimsDataRefetch();
        handleModalClose();
        setSubmitionLoading(false);
        setError("");
      }
    } catch (err) {
      setSubmitionLoading(false);
      setError("Something went wrong. Please try again.");
      console.log(err);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text className="text-center" style={styles.welcomeBack}>
        My archive
      </Text>
      {/* If loading, show a loading message */}
      {AllArchiveClaimsDataLoading ? (
        <View style={styles.loadingClass}>
          <FlatList
            data={[]}
            renderItem={renderClaimItemLoading}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <FlatList
          data={AllArchiveClaimsData}
          renderItem={renderClaimItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* Modal for Adding New Claim */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        {(!AllArchiveClaimsDataLoading) ?
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Claim #{selectedClaimData?.id}</Text>              
                <Text style={styles.claimDate}>{formatDate(selectedClaimData?.date)}</Text>
                <Text style={styles.claimStatus}>Status: {selectedClaimData?.status}</Text>
                <View style={styles.filePreviewContainer}>
                  <Text style={styles.claimModalTitle}>Details:</Text>
                  <Text style={styles.claimText}>Service : {selectedClaimData?.medicalServiceAssociation?.userAssociation?.fullname}</Text>
                  <Text style={styles.claimAmount}>
                    Claim amount : {selectedClaimData?.claim_amount} DA
                  </Text>
                  <Text style={styles.claimAmount}>
                    Reimbursement : {(Number(selectedClaimData?.clientAssociation?.policyAssociation?.co_pay) * Number(selectedClaimData?.claim_amount)) / 100 || 0} DA / {selectedClaimData?.clientAssociation?.policyAssociation?.co_pay}%
                  </Text>
                  
                  {/* Display payments */}
                  {selectedClaimData?.status == "paid" &&
                    <>
                      <Text style={styles.claimModalTitle}>Payments:</Text>
                      <Text style={styles.claimAmount}>
                        Total payment: {selectedClaimData?.reimbursement || 0} DA
                      </Text>
                      {selectedClaimData?.payments?.length > 0 ?
                        <View style={styles.filePreviewContainer}>
                          {selectedClaimData?.payments?.map((item, index) => (
                            <View key={index} style={styles.card}>
                              <Text style={styles.paymentText}>{item.amount} DA</Text>
                              <TouchableOpacity>
                                <AntDesign name="checkcircle" size={15} color="green" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                        :
                        <Text style={styles.claimText}>No payments yet</Text>
                      }
                    </>
                  }
                  {/* Display justification */}
                  {selectedClaimData?.status == "rejected" &&
                    <>
                      <Text style={styles.claimModalTitle}>Justification:</Text>
                      <Text style={styles.claimText}>{selectedClaimData?.justification?.description}</Text>
                    </>
                  }
                  {/* Display accusation */}
                  {selectedClaimData?.status == "rejected" &&
                    <>
                      <Text style={styles.claimModalTitle}>Accusation:</Text>
                      {!selectedClaimData?.accusation ?
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your accusation"
                          value={accusation}
                          onChangeText={(text) => setAccusation(text)}
                        />
                        :
                        <Text style={styles.claimText}>{selectedClaimData?.accusation?.description}</Text>
                      }
                    </>
                  }
                </View>
              {selectedClaimData?.status == "rejected" && !selectedClaimData?.accusation &&
                <>
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
                      style={styles.cancelButtonV2}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.buttonTextCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleAddAccusation}  
                    >
                      <Text 
                        style={styles.buttonText}
                      >Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              }
              {(selectedClaimData?.status == "paid" || (selectedClaimData?.status == "rejected" && selectedClaimData?.accusation)) &&
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>
          :
          <View style={styles.modalOverlay}>
            <Text>Loading...</Text>
          </View>
        }
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingTop: 25,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  list: {
    paddingBottom: 40,
  },
  claimCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 0.1,
    borderColor: "#043146",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginHorizontal: 20,
  },
  loadingClass: {
    width: "100%",
    paddingRight: 20,
    paddingLeft: 20,
  },
  claimCardLoading: {
    backgroundColor: "red",
    width: "100%",
    height: "180",
    borderRadius: 15,
    marginBottom: 15,
  },
  claimTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    color: "#2a2a2a",
  },
  claimText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    fontFamily: "Montserrat-Regular",
  },
  claimAmount: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Montserrat-Regular",
    marginTop: 5,
    fontWeight: "600",
  },
  claimStatus: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#007bff",
    marginTop: 5,
  },
  claimDate: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Montserrat-Regular",
    marginTop: 10,
  },
  SignInScreen: {
    width: "100%",
    height: "90%",
    backgroundColor: "#043146",
    paddingTop: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  topScreen: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "10%",
    padding: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    gap: 2,
  },
  picture: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#888888",
  },
  subTextTopScreen: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
  },
  textTopScreen: {
    fontSize: 15,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
  },
  notificationClass: {
    width: 45,
    height: 45,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  DashboardContainer: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  topDashboard: {
    flexDirection: "column",
    gap: 4,
    marginBottom: 20,
  },
  topScreen:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "10%",
    padding: 20,
    marginBottom: 10,
  },
  welcomeBack: {
    color: "#043146",
    fontSize: 28,
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
  },
  hereDashboard: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
    color: "#043146",
  },
  justifyBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  justifyEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    height: 200,
    borderColor: "#043146",
    borderRadius: 40,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 0.5,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  cardText: {
    fontSize: 17,
    fontFamily: "Montserrat-Medium",
  },
  cardTextValeur: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
  },
  dinarText: {
    fontSize: 12,
    marginLeft: 50,
  },
  justifyBetweenCart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowClass: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 50,
  },
  recentNotificationClass: {
    padding: 20,
    paddingRight: 20,
    flexDirection: "column",
    gap: 12,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  Vide: {
    width: 40,
    height: 40,
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
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonV2: {
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
  paymentText: {
    color: '#000',
    fontSize: 16,
  },
  claimModalTitle:{
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
    marginTop: 5,
  }
});

export default ArchiveClaim;
