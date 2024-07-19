/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type {PropsWithChildren} from 'react';
import React, {useEffect} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './screens/AppNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {I18nManager, Platform} from 'react-native';
import {configureFonts, MD2LightTheme, PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import messaging from '@react-native-firebase/messaging';

I18nManager.forceRTL(true);

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const App: React.FC = () => {
  // useEffect(() => {
  //   const initializeFCM = async () => {
  //     // const permissionGranted = await requestUserPermission();
  //     // if (permissionGranted) {
  //     //  const token = await getFCMToken();
  //     // Handle FCM token
  //     // }
  //   };

  //   // initializeFCM();
  // }, []);

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
