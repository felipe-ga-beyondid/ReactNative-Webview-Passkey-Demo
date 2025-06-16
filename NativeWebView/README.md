# Passkey Login Support in Android WebView (Auth0 Universal Login)

This document outlines the steps required to enable passkey (WebAuthn) login support in an Android React Native app using WebView with Auth0 Universal Login.

## Prerequisites

- React Native `0.79.0`
- `react-native-webview` version `^13.13.5`
- Android SDK and Android Studio installed
- Auth0 application with Universal Login enabled and passkeys turned on

## Package.json Key Versions

Ensure the following relevant dependencies are present:

```json
"dependencies": {
  "@react-native/gradle-plugin": "^0.79.3",
  "react": "19.0.0",
  "react-native": "0.79.0",
  "react-native-webview": "^13.13.5"
}
```

## Android WebView Configuration

### WebView Usage in `App.tsx`

```tsx
<WebView
  source={{ uri: 'https://felipe-test.mydomainfun.pro/' }}
  onReceivedSslError={(event) => event.nativeEvent.handler.proceed()}
  style={{ flex: 1 }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
  scalesPageToFit={true}
/>
```

### Custom WebViewManager (Optional for Explicit WebAuthn Enabling)
If needed, you can create a `CustomWebViewManager.kt` to enable WebAuthn manually:

```kotlin
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class CustomWebViewManager : SimpleViewManager<WebView>() {
    override fun getName(): String = "CustomWebView"

    override fun createViewInstance(reactContext: ThemedReactContext): WebView {
        val webView = WebView(reactContext)
        val settings: WebSettings = webView.settings
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_AUTHENTICATION)) {
            WebSettingsCompat.setWebAuthenticationSupport(settings, 1)
        }
        return webView
    }
}
```

Register it in `MainApplication.kt` under `getPackages()` if used.

## AndroidManifest.xml Setup

Ensure the manifest includes the following:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.USE_BIOMETRIC" />
  <uses-feature android:name="android.hardware.fingerprint" android:required="false" />

  <application
      android:name=".MainApplication"
      android:hardwareAccelerated="true"
      ...>

    <activity
        android:name=".MainActivity"
        android:launchMode="singleTask"
        android:hardwareAccelerated="true"
        android:exported="true">

      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>

      <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https"
              android:host="felipe-test.mydomainfun.pro"
              android:pathPrefix="/" />
      </intent-filter>

    </activity>
  </application>
</manifest>
```

## Digital Asset Links (DAL)

Host the `.well-known/assetlinks.json` file on your Auth0 custom domain to allow app association.

Example:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.your.package",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

## Expected Behavior

When navigating to your login page via WebView on Android, the Auth0 Universal Login will detect a compatible environment and display the “Use Passkey” option. On selection, it will trigger the native Android biometric/passkey dialog.

No additional native modules or third-party libraries are required.

---

### Troubleshooting

- If WebAuthn option does not appear:
  - Ensure device has a passkey or biometric setup
  - Test in a release build (some debug builds disable secure context features)
  - Ensure URL uses HTTPS and is listed in manifest `intent-filter`
  - Check Chrome version (WebView must support WebAuthn)

---