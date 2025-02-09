import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { AuthContextProvider } from "./context/Authcontext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function RootLayout() {
  useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Stack>
          {/* Unprotected Screens */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp/index"
            options={{
              headerShown: false,
            }}
          />
          {/* Protected Screens */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ArchiveClaim/index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
