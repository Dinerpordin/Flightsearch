FlightSearch Standalone — Release Build Guide
============================================
1) Open in Android Studio.
2) Create keystore: scripts/generate_keystore.sh (mac/linux) or scripts\generate_keystore.cmd (win).
3) Copy gradle.properties.example → gradle.properties; fill values.
4) Build → Generate Signed Bundle/APK… → APK → release → finish.
APK: app/build/outputs/apk/release/app-release.apk
