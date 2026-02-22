## Android APK Build Guide

This project is an Expo (SDK 49) app using the bare React Native Android project. You can build an installable APK locally for free.

### Prerequisites
- Node 18+ and npm
- JDK 17 (recommended)
- Android SDK and Platform Tools (install via Android Studio)

Ensure Gradle can find your Android SDK:
- Create `android/local.properties` with your SDK path:
  - macOS: `sdk.dir=/Users/<you>/Library/Android/sdk`
  - Example:
    ```
    sdk.dir=/Users/patrick/Library/Android/sdk
    ```

The project is configured for:
- Android Gradle Plugin 7.4.2
- Gradle Wrapper 7.6.1

### Option 1: Pure Gradle local release build (recommended)
1) Install dependencies
```bash
cd client
npm ci
```

2) Build release APK
```bash
cd android
./gradlew assembleRelease
```

3) Find the APK
```
client/android/app/build/outputs/apk/release/app-release.apk
```

4) Install on device (Samsung S20)
```bash
adb install -r "client/android/app/build/outputs/apk/release/app-release.apk"
```

Notes
- Current release signing uses the debug keystore in `android/app/build.gradle`, which is fine for sideloading.
- Release builds run with `__DEV__ = false`, so `config/environment.ts` will use:
  - `SERVER_URL = https://yourapp.onrender.com`

### Option 2: EAS local build (also free)
1) Ensure `eas-cli` is available (already in dependencies)

2) Optional: force APK output in `eas.json`
```json
{
  "cli": { "version": ">= 3.12.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "production": {
      "developmentClient": false,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    }
  }
}
```

3) Build locally
```bash
cd client
npx eas build --platform android --profile production --local
```

Artifact path will be printed on completion.

### Optional: Create a proper release keystore
If you want to distribute outside of direct sideloading or remove the debug signing:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```
Then configure `signingConfigs.release` and `buildTypes.release` in `android/app/build.gradle` to use it.

### Troubleshooting
- SDK location not found
  - Create `android/local.properties` with `sdk.dir=...` as above.
- compileSdkVersion not specified
  - Defined in `android/build.gradle` via `ext.compileSdkVersion = 33`.
- Gradle download timeouts
  - The wrapper is set to Gradle 7.6.1 with an increased `networkTimeout`. Re-run the build.
- JDK mismatch
  - Use JDK 17 for best compatibility with AGP 7.4.2.

### iOS
Use Xcode or `npx pod-install` + `npx react-native run-ios` (not covered here).


