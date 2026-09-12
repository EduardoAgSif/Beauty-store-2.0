# Fix Login Screen Stuck Issue

The app is stuck on the login screen because it's attempting to connect to `http://localhost/backend`, which refers to the Android device itself rather than the host machine where the PHP backend is running. Additionally, the request is being blocked by the browser's CORS policy.

## User Review Required

> [!IMPORTANT]
> **Host Connectivity**: This plan assumes your PHP backend (XAMPP/Apache) is running on the same computer as Android Studio. For the emulator to see your computer, we must use the IP `10.0.2.2` instead of `localhost`.

> [!NOTE]
> **CORS Policy**: Capacitor apps run on `https://localhost`. Requests to an external `http` server are considered cross-origin. While your PHP code already has `Access-Control-Allow-Origin: *`, using native HTTP requests is a more robust solution for Capacitor apps.

## Proposed Changes

### Web Source (`src/app/login/`)

#### [MODIFY] [login.page.ts](file:///C:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/project01/src/app/login/login.page.ts)
*   Import `Platform` from `@ionic/angular`.
*   Update `apiUrl` dynamically: use `http://10.0.2.2/backend` when running on Android (emulator) and `http://localhost/backend` otherwise.
*   Add a check to ensure `errorMessage` is correctly displayed even if change detection is delayed.

### Backend (`backend/`)

#### [MODIFY] [db_config.php](file:///C:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/project01/backend/db_config.php)
*   Ensure CORS headers are robustly set and handle the `https://localhost` origin explicitly if needed.

## Verification Plan

### Automated Tests
*   I will verify the code changes by running a build check.

### Manual Verification
1.  Deploy the app to the emulator.
2.  Attempt to log in with `eduardo@test.com` and `mypassword123`.
3.  Check Logcat for successful connection to `10.0.2.2`.
4.  Verify that the app redirects to `/tabs/tab1` upon success.
