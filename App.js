import { StyleSheet, View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import LoginScreen from './App/Screens/LoginScreen';
import SignUpScreen from './App/Screens/SignUpScreen';
import AppStartScreen from './App/Screens/AppStartScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ClerkProvider, useAuth, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from "expo-secure-store";
import Constants from 'expo-constants';

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (error) {
      return null
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}


SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

// Use your Clerk publishable key from environment variables
const Publishable_Key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
//const Publishable_Key = Constants.expoConfig.extra.clerkPublishableKey;

export default function App() {

  const [loaded, error] = useFonts({
    'Outfit': require('./assets/fonts/Outfit-Regular.ttf'),
    'Outfit-medium': require('./assets/fonts/Outfit-Medium.ttf'),
    'Outfit-thin': require('./assets/fonts/Outfit-Thin.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Publishable_Key}>

      <NavigationContainer>
        <NavigationHandler />
      </NavigationContainer>
    </ClerkProvider>
  );
}
function NavigationHandler() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // Optionally show a loading spinner or splash screen
  }

  return (
    <View style={styles.container}>
      <SignedIn>
        <Text> Signed In</Text>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 65,
  },
});
