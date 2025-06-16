package com.nativewebview

import android.webkit.WebSettings
import android.webkit.WebView
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature
import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativecommunity.webview.RNCWebViewManager

class CustomWebViewManager : RNCWebViewManager() {

    override fun createViewInstance(context: ThemedReactContext): WebView {
        val webView = super.createViewInstance(context)

        val settings: WebSettings = webView.settings
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_AUTHENTICATION)) {
            WebSettingsCompat.setWebAuthenticationSupport(settings, true)
        }

        return webView
    }

    override fun getName(): String {
        return "CustomWebView"
    }
}
