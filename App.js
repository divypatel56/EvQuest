import { StyleSheet, View, Text } from 'react-native'; // Import core components from React Native
import { useFonts } from 'expo-font'; // Import the useFonts hook from Expo to load custom fonts
import * as SplashScreen from 'expo-splash-screen'; // Import SplashScreen to manage splash screen behavior
import { useEffect, useState } from 'react'; // Import useEffect and useState for handling state and side-effects
import LoginScreen from './App/Screens/LoginScreen'; // Import Login screen component
import SignUpScreen from './App/Screens/SignUpScreen'; // Import Sign Up screen component
import NavigationScreen from './App/Screens/NavigationScreen'; // Import Navigation Screen
import AppStartScreen from './App/Screens/AppStartScreen'; // Import App Start screen component
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer for managing navigation
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator for navigation stack
import { ClerkProvider, useAuth, SignedIn, SignedOut } from '@clerk/clerk-expo'; // Import Clerk Provider for authentication
import * as SecureStore from "expo-secure-store"; // Import SecureStore for storing tokens securely
import TabNavigation from "./App/Navigation/TabNavigation"; // Import TabNavigation for bottom tab navigation
import 'react-native-get-random-values'; // Import required polyfill for random values
import * as Location from 'expo-location'; // Import Expo's location API to access device location
import { UserLocationContext } from './App/Context/UserLocationContext'; // Import UserLocationContext to manage user's location globally
import 'react-native-gesture-handler';

// Token cache to securely store and retrieve tokens using SecureStore
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key); // Retrieve token from SecureStore
    } catch (error) {
      return null; // Return null if there is an error
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value); // Save token to SecureStore
    } catch (err) {
      return; // Do nothing if there is an error
    }
  },
};

// Prevent the splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator(); // Create a stack navigator for screen navigation

// Use Clerk publishable key from environment variables
const Publishable_Key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  // Load custom fonts using the useFonts hook
  const [loaded, error] = useFonts({
    'Outfit': require('./assets/fonts/Outfit-Regular.ttf'),
    'Outfit-medium': require('./assets/fonts/Outfit-Medium.ttf'),
    'Outfit-thin': require('./assets/fonts/Outfit-Thin.ttf'),
  });

  // State to store location and potential error message
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // useEffect hook to request location permission and get user location
  useEffect(() => {
    (async () => {
      try {
        // Request permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // If permission is denied, set an error message
          setErrorMsg('Permission to access location was denied');
          return;
        }
        // Get the user's current location
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords); // Set the location state with the coordinates
      } catch (error) {
        // Catch and handle any errors related to location retrieval
        setErrorMsg(`Location error: ${error.message}`);
      }
    })();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Display text based on whether there's an error or if the location is available
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg; // Display error message if there's an issue
  } else if (location) {
    text = JSON.stringify(location); // Display the location coordinates
  }

  // useEffect hook to hide the splash screen once the fonts are loaded
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Hide the splash screen
    }
  }, [loaded, error]); // Dependencies: this runs whenever the fonts are loaded or there's an error

  // If fonts are still loading and there's no error, return null (don't render anything)
  if (!loaded && !error) {
    return null;
  }

  return (
    // Provide the user's location globally through UserLocationContext
    <UserLocationContext.Provider value={{ location, setLocation }}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={Publishable_Key}
      >
        <NavigationContainer>
          <NavigationHandler />
        </NavigationContainer>
      </ClerkProvider>
    </UserLocationContext.Provider>
  );
}

// NavigationHandler component to manage signed-in and signed-out states
function NavigationHandler() {
  const { isLoaded } = useAuth(); // Get the auth loading state from Clerk

  // If the authentication is still loading, return null (do not render anything)
  if (!isLoaded) {
    return null; // Optionally, you can show a loading spinner here
  }

  return (
    <View style={styles.container}>
      <SignedIn>
        {/* <TabNavigation /> */}
        <Stack.Navigator>
          <Stack.Screen name="Tabs" component={TabNavigation} options={{ headerShown: false }} />
          <Stack.Screen name="NavigationScreen" component={NavigationScreen} options={{ headerShown: false, title: 'Directions' }} />
        </Stack.Navigator>
      </SignedIn>

      <SignedOut>
        <Stack.Navigator initialRouteName="AppStart">
          <Stack.Screen name="AppStart" component={AppStartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up', headerShown: false }} />
        </Stack.Navigator>
      </SignedOut>
    </View>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the entire screen
    backgroundColor: '#fff', // Set the background color to white
    paddingTop: 65, // Add padding at the top
  },
});
