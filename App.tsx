/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type {PropsWithChildren} from 'react';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './screens/AppNavigator';

import messaging from '@react-native-firebase/messaging';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {I18nManager, PermissionsAndroid} from 'react-native';
import {configureFonts, MD2LightTheme, PaperProvider} from 'react-native-paper';

I18nManager.forceRTL(true);

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

const queryClient = new QueryClient();

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const App: React.FC = () => {
  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();
  }, []);

  const fontConfig = {
    android: {
      regular: {
        fontFamily: 'IRANSansMobileFaNum',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'IRANSansMobileFaNum',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'IRANSansMobileFaNum',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'IRANSansMobileFaNum',
        fontWeight: 'normal',
      },
    },
  };

  const theme = {
    ...MD2LightTheme,
    // @ts-ignore
    fonts: configureFonts({config: fontConfig, isV3: false}),
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
