import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  EyeIcon,
  LockClosedIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";

const index = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.SignInScreen}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Login</Text>
        <Text style={styles.subLoginText}>Welcome Back to Zid T2amen</Text>
        <View style={styles.inputsContainer}>
          <View style={styles.row}>
            <UserIcon size={20} color="#043146" />
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              placeholderTextColor="#888888"
              // value={userName}
              // onChangeText={setUserName}
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
                // value={password}
                // onChangeText={setPassword}
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
          <Text style={styles.policyText}>
            Creating an account means you're okay with our Terms of Services and
            our Privacy Policy
          </Text>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("(tabs)")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.haveAccount}>
          <Text style={styles.textSousSignIn}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp/index")}>
            <Text style={styles.textForgotPassword}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  haveAccount: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  SignInScreen: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#f1f1f1",
  },
  loginContainer: {
    width: "100%",
    padding: 20,
    flexDirection: "column",
    gap: 8,
  },
  textSousSignIn: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#888888",
  },
  textForgotPassword: {
    fontSize: 13,
    color: "#26667E",
    fontFamily: "Montserrat-Regular",
    textDecorationLine: "underline",
  },
  gap: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#043146",
    height: 50,
    width: "100%",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  inputsContainer: {
    flexDirection: "column",
    gap: 24,
    marginTop: 48,
  },
  loginText: {
    fontSize: 48,
    fontFamily: "Montserrat-Bold",
  },
  subLoginText: {
    fontSize: 22,
    fontFamily: "Montserrat-Regular",
  },
  textlabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  textInput: {
    fontSize: 12,
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
});

export default index;
