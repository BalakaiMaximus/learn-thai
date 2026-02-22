# eas-build-pre-install.sh
#!/bin/bash

echo "🛠️ Injecting sdk.dir into local.properties inside build folder"
echo "📂 Current dir: $(pwd)"
echo "🗂 EAS build artifacts dir: $EAS_LOCAL_BUILD_ARTIFACTS_DIR"

# Check if we're inside an eas local build temp directory
if [[ "$EAS_LOCAL_BUILD_ARTIFACTS_DIR" != "" ]]; then
  mkdir -p "$EAS_LOCAL_BUILD_ARTIFACTS_DIR/android"
  echo "sdk.dir=/Users/patrick/Library/Android/sdk" > "$EAS_LOCAL_BUILD_ARTIFACTS_DIR/android/local.properties"
  echo "✅ Wrote local.properties to: $EAS_LOCAL_BUILD_ARTIFACTS_DIR/android"
else
  echo "⚠️ EAS_LOCAL_BUILD_ARTIFACTS_DIR is not set!"
fi

echo "🔧 Fixing @solana packages for React Native compatibility..."
# Run the fix script for @solana packages
if [[ -f "fix-solana-codecs.js" ]]; then
  node fix-solana-codecs.js
  echo "✅ Applied @solana package fixes"
else
  echo "⚠️ fix-solana-codecs.js not found"
fi
