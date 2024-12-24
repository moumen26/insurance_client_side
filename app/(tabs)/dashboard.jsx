import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import {
  ArrowUpRightIcon,
  BellIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from "react-native-heroicons/outline";

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.SignInScreen}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topScreen}>
          <View style={styles.row}>
            <View style={styles.picture}></View>
            <View style={styles.column}>
              <Text style={styles.subTextTopScreen}>Good Morning</Text>
              <Text style={styles.textTopScreen}>Khaldi Abdelmoumen</Text>
            </View>
          </View>
          <View style={styles.notificationClass}>
            <BellIcon size={22} color="#26667E" />
          </View>
        </View>
        <View style={styles.DashboardContainer}>
          <View style={styles.topDashboard}>
            <Text style={styles.welcomeBack}>Welcome Back !</Text>
            <Text style={styles.hereDashboard}>
              Here's your health Dashboard
            </Text>
          </View>
          <View style={styles.justifyBetween}>
            <View style={styles.card}>
              <Text style={styles.cardText}>Reimbursed</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  1207 DA
                  {/* <Text style={styles.dinarText}>DA</Text> */}
                </Text>
                <View style={styles.arrowClass}>
                  <ArrowUpRightIcon size={18} color="#26667E" />
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>Claims Submitted</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  12
                  {/* <Text style={styles.dinarText}>DA</Text> */}
                </Text>
                <View style={styles.arrowClass}>
                  <ArrowUpRightIcon size={18} color="#26667E" />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.justifyEnd}>
            <View style={styles.card}>
              <Text style={styles.cardText}>Pending Claims</Text>
              <View style={styles.justifyBetweenCart}>
                <Text style={styles.cardTextValeur}>
                  3{/* <Text style={styles.dinarText}>DA</Text> */}
                </Text>
                <View style={styles.arrowClass}>
                  <ArrowUpRightIcon size={18} color="#26667E" />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.recentNotificationClass}>
            <Text style={styles.cardText}>Recent Notification</Text>
            <View style={styles.row}>
              <CheckBadgeIcon size={22} color="green" />
              <Text>Your last claim was approved for 120 Da</Text>
            </View>
            <View style={styles.row}>
              <ExclamationCircleIcon size={22} color="red" />
              <Text>Missing documents in claim #2605. Update ASAP</Text>
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
