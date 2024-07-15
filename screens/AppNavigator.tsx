import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamList} from '../type';
import LoginScreen from './loginScreen';
import SignupScreen from './SignupScreen';
import WebViewScreen from './WebViewScreen';
import CheckOtp from './checkOtp';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CheckOtp" component={CheckOtp} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
