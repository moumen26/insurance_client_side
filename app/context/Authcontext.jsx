import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native'; 
import decodeJWT from "../util/tokenDecoder";

export const AuthContext = createContext();

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, { user: null, cart: [] });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        //get user from AsyncStorage
        const userData = await AsyncStorage.getItem("user");
        //if user is not found, logout and redirect to login screen
        if (!userData) {
          dispatch({ type: "LOGOUT" });
          navigation.reset({
            index: 0,
            routes: [{ name: "Login/index" }],
          });
          return;
        }
        
        const user = JSON.parse(userData);
        //decode the token
        const decodedToken = decodeJWT(user.token);
        //if token is expired, logout and redirect to login screen
        if (decodedToken.exp * 1000 > Date.now()) {
          dispatch({ type: "LOGIN", payload: user });
          navigation.reset({
            index: 0,
            routes: [{ name: "(tabs)" }],
          });
        } else {
          await AsyncStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
          navigation.reset({
            index: 0,
            routes: [{ name: "Login/index" }],
          });
        }

      } catch (error) {
        console.error("Error during user authentication:", error);
        await AsyncStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        navigation.reset({
          index: 0,
          routes: [{ name: "Login/index" }],
        });
      }
    };

    fetchUser();
  }, [navigation, dispatch]);

  return (
    <AuthContext.Provider value={{ ...state, cart: state.cart, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
