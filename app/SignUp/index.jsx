import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import {
  EnvelopeIcon,
  EyeIcon,
  LockClosedIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from 'react-native-paper';
import Config from "../config.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext.jsx";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const index = () => {
  const { user } = useAuthContext();
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [region, setRegion] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [job, setJob] = useState("");
  const [married, setMarried] = useState("");
  const [policy, setPolicy] = useState("");
  const [error, setError] = useState("");


  // Function to fetch region data
  const fetchRegionData = async () => {
    try {
      const response = await api.get(`/region/all`);

      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404 errors
        } else {
          throw new Error("Error receiving region data");
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
    data: RegionData,
    error: RegionDataError,
    isLoading: RegionDataLoading,
    refetch: RegionDataRefetch,
  } = useQuery({
    queryKey: ["RegionData"], // Ensure token is part of the query key
    queryFn: fetchRegionData, // Pass token to the fetch function
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Function to fetch region data
  const fetchPolicyData = async () => {
    try {
      const response = await api.get(`/policy/all`);

      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404 errors
        } else {
          throw new Error("Error receiving policy data");
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
    data: PolicyData,
    error: PolicyDataError,
    isLoading: PolicyDataLoading,
    refetch: PolicyDataRefetch,
  } = useQuery({
    queryKey: ["PolicyData"], // Ensure token is part of the query key
    queryFn: fetchPolicyData, // Pass token to the fetch function
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  const handleSignUp = async () => {
    setError("");
    try {
      const response = await fetch(`${Config.API_URL}/auth/client/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          phone,
          fullName,
          region,
          age,
          address,
          job,
          married,
          policy,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
      } else {
        alert("Account created successfully, try to login now.");
        setPassword("");
        setUserName("");
        setError("");
        setPhone("");
        setFullName("");
        setRegion("");
        setAge("");
        setAddress("");
        setJob("");
        setMarried(false);
        setPolicy("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err);
    }
  };
  
  if(RegionDataLoading || PolicyDataLoading) {
    return (
      <SafeAreaView style={styles.SignInScreen}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sign Up</Text>
            <Text style={styles.subLoginText}>Create Account</Text>
            <View style={styles.inputsContainer}>
              <Text>Loading...</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.SignInScreen}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Sign Up</Text>
          <Text style={styles.subLoginText}>Create Account</Text>
          <View style={styles.inputsContainer}>
            <View style={styles.row}>
              <UserIcon size={20} color="#043146" />
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                placeholderTextColor="#888888"
                value={username}
                onChangeText={setUserName}
              />
            </View>
            <View style={styles.justifyBetween}>
              <View style={styles.gap}>
                <LockClosedIcon size={20} color="#043146" />
                <TextInput
                  style={styles.textInputPassword}
                  placeholder="********"
                  placeholderTextColor="#888888"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <EyeIcon
                  name={passwordVisible ? "visibility" : "visibility-off"}
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <EnvelopeIcon size={20} color="#043146" />
              <TextInput
                style={styles.textInput}
                placeholder="Phone Number"
                placeholderTextColor="#888888"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View style={styles.row}>
              <UserIcon size={20} color="#043146" />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor="#888888"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <View style={styles.row}>
              <UserIcon size={20} color="#043146" />
              <Picker
                selectedValue={region}
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: "Montserrat-Regular",
                  width: "100%",
                }}
                onValueChange={(itemValue) => setRegion(itemValue)}
                placeholder="Select Region"
              >
                <Picker.Item label="Select Region" value="" color="#888888" />
                {RegionData?.length > 0 &&
                  RegionData?.map((region) => (
                    <Picker.Item
                      key={region.id}
                      label={region.name}
                      value={region.id}
                    />
                  ))
                }
              </Picker>
            </View>
            <View style={styles.row}>
              <UserIcon size={20} color="#043146" />
              <TextInput
                style={styles.textInput}
                placeholder="Age"
                placeholderTextColor="#888888"
                value={age}
                onChangeText={setAge}
              />
            </View>
            <View style={styles.row}>
              <UserIcon size={20} color="#043146" />
              <TextInput
                style={styles.textInput}
                placeholder="Address"
                placeholderTextColor="#888888"
                value={address}
                onChangeText={setAddress}
              />
            </View>
            <View style={styles.row}>
              <UserIcon size={20} color="#043146" />
              <TextInput
                style={styles.textInput}
                placeholder="Job"
                placeholderTextColor="#888888"
                value={job}
                onChangeText={setJob}
              />
            </View>
            <RadioButton.Group
              onValueChange={(newValue) => setMarried(newValue)}
              value={married}
            >
              <View style={styles.radioOption}>
                <RadioButton value={true} color="#043146" />
                <Text style={styles.radioLabel}>Married</Text>
              </View>

              <View style={styles.radioOption}>
                <RadioButton value={false} color="#043146" />
                <Text style={styles.radioLabel}>Single</Text>
              </View>
            </RadioButton.Group>
            <View style={styles.row}>
              <UserIcon size={20} color="#043146" />
              <Picker
                selectedValue={policy}
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: "Montserrat-Regular",
                  width: "100%",
                }}
                onValueChange={(itemValue) => setPolicy(itemValue)}
              >
                <Picker.Item label="Select Policy" value="" color="#888888" />
                {PolicyData?.length > 0 &&
                  PolicyData?.map((policy) => (
                    <Picker.Item
                      key={policy.id}
                      label={policy.name}
                      value={policy.id}
                    />
                  ))
                }
              </Picker>
            </View>
            <Text style={styles.policyText}>
              Creating an account means you're okay with our Terms of Services and
              our Privacy Policy
            </Text>
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
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => handleSignUp()}
          >
            <Text style={styles.loginButtonText}>Sign up</Text>
          </TouchableOpacity>
          <View style={styles.haveAccount}>
            <Text style={styles.textSousSignIn}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login/index")}>
              <Text style={styles.textForgotPassword}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SignInScreen: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginContainer: {
    width: "100%",
  },
  inputsContainer: {
    flexDirection: "column",
    gap: 24,
    marginTop: 24,
  },
  loginText: {
    fontSize: 48,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
  },
  subLoginText: {
    fontSize: 22,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#043146",
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  policyText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    textAlign: "center",
    color: "#888888",
  },
  loginButton: {
    backgroundColor: "#043146",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  haveAccount: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  textSousSignIn: {
    fontSize: 13,
    color: "#888888",
  },
  textForgotPassword: {
    fontSize: 13,
    color: "#26667E",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
  justifyBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#043146",
    height: 50,
    width: "100%",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  gap: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#043146',
    marginLeft: -5,
  },
});

export default index;
