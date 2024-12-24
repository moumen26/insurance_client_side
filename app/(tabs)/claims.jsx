import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For the 'add' icon
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

// Static mock data for claims (modified for patient info)
const mockClaims = [
  {
    claimNumber: 1,
    serviceType: "Consultation",
    claimAmount: "150.00",
    reimbursementAmount: "120.00",
    status: "Approved",
    submissionDate: "2024-12-01",
  },
  {
    claimNumber: 2,
    serviceType: "Surgery",
    claimAmount: "320.00",
    reimbursementAmount: "250.00",
    status: "Pending",
    submissionDate: "2024-11-22",
  },
  {
    claimNumber: 3,
    serviceType: "Diagnostic Test",
    claimAmount: "220.00",
    reimbursementAmount: "200.00",
    status: "Approved",
    submissionDate: "2024-10-15",
  },
  {
    claimNumber: 4,
    serviceType: "Consultation",
    claimAmount: "410.00",
    reimbursementAmount: "380.00",
    status: "Rejected",
    submissionDate: "2024-09-30",
  },
];

const ClaimSubmissionScreen = ({ navigation }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      setTimeout(() => {
        setClaims(mockClaims);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching claims:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const renderClaimItem = ({ item }) => (
    <TouchableOpacity
      style={styles.claimCard}
      onPress={() => alert("Claim details")}
    >
      <Text style={styles.claimTitle}>Claim #{item.claimNumber}</Text>
      <Text style={styles.claimText}>Service Type: {item.serviceType}</Text>
      <Text style={styles.claimAmount}>
        Claim Amount: {item.claimAmount} DA
      </Text>
      <Text style={styles.claimAmount}>
        Reimbursement: {item.reimbursementAmount} DA
      </Text>
      <Text style={styles.claimStatus}>Status: {item.status}</Text>
      <Text style={styles.claimDate}>Submitted: {item.submissionDate}</Text>
    </TouchableOpacity>
  );

  const renderClaimItemLoading = ({ item }) => (
    <ShimmerPlaceholder style={styles.claimCardLoading} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeBack}>Claim Submissions</Text>
      {/* If loading, show a loading message */}
      {loading ? (
        // <Text style={styles.loadingText}>Loading...</Text>
        <View style={styles.loadingClass}>
          <FlatList
            data={claims}
            renderItem={renderClaimItemLoading}
            keyExtractor={(item) => item.claimNumber.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <FlatList
          data={claims}
          renderItem={renderClaimItem}
          keyExtractor={(item) => item.claimNumber.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  welcomeBack: {
    color: "#043146",
    fontSize: 28,
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
    marginBottom: 20,
    marginTop: 15,
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
});

export default ClaimSubmissionScreen;
