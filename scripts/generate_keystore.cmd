@echo off
setlocal
if not exist keystore mkdir keystore
keytool -genkeypair -v -keystore keystore\flightsearch-release.jks ^
  -storepass change_me_password -keypass change_me_password ^
  -keyalg RSA -keysize 2048 -validity 36500 ^
  -alias flightsearch_release -dname "CN=FlightSearch,O=YourOrg,L=City,S=State,C=GB"
echo Keystore created at keystore\flightsearch-release.jks (change passwords before publishing).
