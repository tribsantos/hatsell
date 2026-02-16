# Android Play Publish (Hatsell)

This repository is already set up for Capacitor Android publishing.

Current project status:
- App ID: `com.hatsell.app` (`capacitor.config.json`)
- Android project exists: `android/`
- Target SDK: `36` (`android/variables.gradle`)
- Build command helper added: `scripts/build_android_release.ps1`

## 1. One-time local setup

1. Install Android Studio (includes SDK + tools).
2. Install JDK 17 (if not already present).
3. In Android Studio SDK Manager, ensure Android API 35+ is installed.
4. Verify local tooling:
   - `node -v`
   - `npm -v`
   - `java -version`

## 2. Build the release AAB

From repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build_android_release.ps1
```

Expected output bundle:
- `android/app/build/outputs/bundle/release/app-release.aab`

## 3. Sign the app

For Google Play, upload an AAB signed with an upload key.

Options:
1. Android Studio:
   - Open `android/`
   - Build > Generate Signed Bundle / APK > Android App Bundle
   - Create/select keystore and generate signed AAB
2. CLI with Gradle signing config:
   - Configure release signing in `android/app/build.gradle`
   - Build with `gradlew bundleRelease`

Keep your keystore and passwords backed up securely.

## 4. Create app in Play Console

1. Create new app (package must be `com.hatsell.app`).
2. Fill store listing:
   - App name
   - Short/full description
   - Icon (512x512)
   - Feature graphic (1024x500)
   - Phone screenshots
   - Privacy policy URL
3. Complete:
   - App content declarations
   - Data safety form
   - Target audience questionnaire

## 5. Upload and test before production

1. Go to Testing > Internal testing.
2. Upload `app-release.aab`.
3. Add tester emails.
4. Install from Play test link and verify login, storage, and network behavior.

## 6. Release to production

1. Create production release.
2. Reuse the same AAB (or newer signed AAB).
3. Submit for review.

## Ongoing release rules

- Increment `versionCode` and `versionName` in `android/app/build.gradle` for each update.
- Keep Play target API compliance up to date (policy deadlines can change yearly).

## Notes for this repo

- If web code changes: run build + sync again before generating a new AAB.
- `google-services.json` is currently not present under `android/app/`.
  Add it only if you enable Firebase native Android features.
