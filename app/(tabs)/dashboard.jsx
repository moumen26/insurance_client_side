import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import {
  ArrowUpRightIcon,
  BellIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from "react-native-heroicons/outline";
import { useLogout } from "../hooks/useLogout";
import useAuthContext from "../hooks/useAuthContext";
import decodeJWT from "../util/tokenDecoder";
import Config from "../config.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProtectedScreen from "../util/ProtectedScreen";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Dashboard = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const decodedToken = decodeJWT(user?.token);
  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch medical services data
  const fetchStatisticsData = async () => {
    try {
      const response = await api.get(`/claim/client/statistics/${decodedToken?.id}`, {
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
          throw new Error("Error receiving statistics data");
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
    data: StatisticsData,
    error: StatisticsDataError,
    isLoading: StatisticsDataLoading,
    refetch: StatisticsDataRefetch,
  } = useQuery({
    queryKey: ["StatisticsData", user?.token], // Ensure token is part of the query key
    queryFn: fetchStatisticsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 1000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  
  return (
    <SafeAreaView style={styles.SignInScreen}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topScreen}>
          <View style={styles.row}>
            <View style={styles.picture}></View>
            <View style={styles.column}>
              <Text style={styles.subTextTopScreen}>Good Morning</Text>
              <Text style={styles.textTopScreen}>{user?.infos?.fullName}</Text>
            </View>
          </View>
          <View style={styles.notificationClass}>
            <BellIcon 
              size={22} 
              color="#26667E" 
              onPress={() => {
                logout();
              }}
            />
          </View>
        </View>
        <View style={styles.DashboardContainer}>
          <View style={styles.topDashboard}>
            <Text style={styles.welcomeBack}>Welcome Back !</Text>
            <Text style={styles.hereDashboard}>
              Here's your Dashboard
            </Text>
          </View>
          <View style={styles.justifyBetween}>
            <View style={styles.longcard}>
              <Text style={styles.cardText}>Total amount</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  {StatisticsData?.totalClaimAmount} DA
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.justifyBetween}>
            <View style={styles.card}>
              <Text style={styles.cardText}>Validated Reimbursed</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  {StatisticsData?.totalvalidatedReimbursement} DA
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Non validated Reimbursed</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  {StatisticsData?.totalnonvalidatedReimbursement} DA
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.justifyBetween}>
            <View style={styles.card}>
              <Text style={styles.cardText}>Pending Claims</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  {StatisticsData?.totalPendingClaims}
                </Text>
                <View style={styles.arrowClass}>
                  <ArrowUpRightIcon size={18} color="#26667E" />
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Approved Claims</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  {StatisticsData?.totalApprovedClaims}
                </Text>
                <View style={styles.arrowClass}>
                  <ArrowUpRightIcon size={18} color="#26667E" />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.justifyBetween}>
            <View style={styles.card}>
              <Text style={styles.cardText}>Paid Claims</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  {StatisticsData?.totalPaidClaims}
                </Text>
                <View style={styles.arrowClass}>
                  <ArrowUpRightIcon size={18} color="#26667E" />
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Rejected Claims</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  {StatisticsData?.totalRejectedClaims}
                </Text>
                <View style={styles.arrowClass}>
                  <ArrowUpRightIcon size={18} color="#26667E" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 20,
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
  longcard: {
    width: "100%",
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
    fontSize: 16,
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

export default Dashboard;
