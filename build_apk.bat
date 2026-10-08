@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/3] Building frontend production bundle...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error building Vite bundle.
    exit /b %ERRORLEVEL%
)

echo [2/3] Syncing Capacitor native assets...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo Error syncing Capacitor.
    exit /b %ERRORLEVEL%
)

echo [3/3] Compiling Android APK...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo Gradle build failed.
    exit /b %ERRORLEVEL%
)

cd ..
echo ============================================================
echo SUCCESS! APK successfully built:
echo frontend\android\app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
