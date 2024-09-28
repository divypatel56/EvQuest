import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import LoginScreen from './App/Screens/LoginScreen';
import SignUpScreen from './App/Screens/SignUpScreen';
import AppStartScreen from './App/Screens/AppStartScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

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
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AppStart">
          <Stack.Screen name="AppStart" component={AppStartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up', headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
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
