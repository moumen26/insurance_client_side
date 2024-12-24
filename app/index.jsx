import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const DashboardScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Login/index")}>
        <Text>Go TO lOGIN</Text>
      </TouchableOpacity>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back!</Text>
        <Text style={styles.subGreeting}>Here’s your health dashboard</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, styles.gradientCard]}>
          <Ionicons name="cash-outline" size={30} color="#fff" />
          <Text style={styles.statsValue}>$540</Text>
          <Text style={styles.statsLabel}>Reimbursed</Text>
        </View>
        <View style={[styles.statsCard, styles.shadowCard]}>
          <Ionicons name="document-outline" size={30} color="#007bff" />
          <Text style={styles.statsValue}>12</Text>
          <Text style={styles.statsLabel}>Claims Submitted</Text>
        </View>
        <View style={[styles.statsCard, styles.shadowCard]}>
          <MaterialCommunityIcons
            name="alert-decagram-outline"
            size={30}
            color="#e63946"
          />
          <Text style={styles.statsValue}>3</Text>
          <Text style={styles.statsLabel}>Pending Claims</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("SubmitClaim")}
        >
          <Ionicons name="document-text-outline" size={40} color="#fff" />
          <Text style={styles.actionText}>Submit Claim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("TrackClaims")}
        >
          <Ionicons name="analytics-outline" size={40} color="#fff" />
          <Text style={styles.actionText}>Track Claims</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Support")}
        >
          <Ionicons name="help-buoy-outline" size={40} color="#fff" />
          <Text style={styles.actionText}>Get Support</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.notificationsSection}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <View style={styles.notificationCard}>
          <Ionicons name="checkmark-circle" size={24} color="#34d399" />
          <Text style={styles.notificationText}>
            Your last claim was approved for $120.
          </Text>
        </View>
        <View style={styles.notificationCard}>
          <Ionicons name="alert-circle" size={24} color="#e63946" />
          <Text style={styles.notificationText}>
            Missing documents in claim #7894. Update ASAP.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subGreeting: {
    fontSize: 16,
    color: "#e0e7ff",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginTop: -30,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientCard: {
    backgroundColor: "linear-gradient(135deg, #007bff, #00d4ff)",
    shadowColor: "#007bff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  shadowCard: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  statsLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    backgroundColor: "#007bff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "30%",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  notificationsSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },
});

export default DashboardScreen;
