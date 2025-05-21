/**
 * React Native App with WebView
 */
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000' : '#fff'}
      />
      <WebView
        //source={{ uri: 'https://5124-2806-261-49e-d3-a5ff-4773-8fd6-4cd1.ngrok-free.app' }}
        source={{ uri: 'https://felipe-test.mydomainfun.pro/' }}
        onReceivedSslError={(event: { nativeEvent: { handler: { proceed: () => void } } }) => {
          event.nativeEvent.handler.proceed(); // Bypass SSL error (DEV ONLY!)
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;