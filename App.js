import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  View,
  ActivityIndicator,
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import WebView from "react-native-webview";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, NativeBaseProvider } from "native-base";
import * as SplashScreen from 'expo-splash-screen';
import { Audio } from 'expo-av';
const BASE_URL = "https://81qgwv-gs.myshopify.com/pages/syria-ai/";
const PRIMARY_COLOR = "#000000";

export default function App() {
  const webViewRef = useRef(null);
  const [showWebView, setShowWebView] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [keyVal, setKeyVal] = useState(0);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
  }, []);

  useEffect(() => {
    Alert.alert(
      "Microphone Access Needed",
      "To use the voice feature, please allow microphone access when prompted. If you do not allow access, the voice connection will fail. If you allow it, you can talk with the AI bot.",
      [
        {
          text: "Continue",
          onPress: async () => {
            await SplashScreen.hideAsync();
            setShowWebView(true);
          },
        },
      ]
    );
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      } else {
        BackHandler.exitApp();
        return false;
      }
    };

    if (Platform.OS !== "ios") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }
  }, [canGoBack]);

  const loadingView = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator color={PRIMARY_COLOR} size="large" />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: PRIMARY_COLOR,
          height: Constants.statusBarHeight + 5,
        }}
      >
        <StatusBar
          backgroundColor={PRIMARY_COLOR}
          translucent
          barStyle="light-content"
        />
      </View>

      <NativeBaseProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <Box safeArea minHeight={"100%"}>
            {showWebView && (
              <>
                <WebView
                  key={keyVal}
                  ref={webViewRef}
                  source={{ uri: BASE_URL }}
                  onNavigationStateChange={(navState) => {
                    const { url, canGoBack } = navState;
                    if (
                      url.includes("whatsapp") ||
                      url.includes("instagram") ||
                      url.includes("facebook") ||
                      url.includes("twitter") ||
                      url.includes("wa.me") ||
                      url.includes("go_outside")
                    ) {
                      Linking.openURL(url);
                      setKeyVal((prev) => prev + 1);
                      return;
                    }
                    setCanGoBack(canGoBack);
                  }}
                  startInLoadingState={true}
                  renderLoading={loadingView}
                  geolocationEnabled={true}
                  mixedContentMode="compatibility"
                  cacheEnabled={false}
                  sharedCookiesEnabled={true}
                  thirdPartyCookiesEnabled={true}
                  javaScriptEnabled={true}
                  userAgent={
                    Platform.OS === "ios"
                      ? "Mozilla/5.0 (iPhone; CPU iPhone OS like Mac OS X) AppleWebKit (KHTML, like Gecko) Mobile Safari"
                      : "Mozilla/5.0 (Android) ReactNativeWebView"
                  }
                  applicationNameForUserAgent={"CamelApp/1.1.0"}
                  style={{ opacity: 0.99, minHeight: 1 }}
                />
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() => {
                    Alert.alert(
                      "Report Content",
                      "If you encountered inappropriate AI-generated content, please email us at cyberpixel.marketing@gmail.com"
                    );
                  }}
                >
                  <Text style={styles.reportText}>Report</Text>
                </TouchableOpacity>
              </>

            )}
          </Box>
        </SafeAreaView>
      </NativeBaseProvider>
    </View>
  );
}
const styles = StyleSheet.create({
  reportButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#ececec",
    padding: 10,
    borderRadius: 20,
    zIndex: 999,
    paddingHorizontal: 20
  },
  reportText: {
    color: "#000",
    fontSize: 12
  },
});