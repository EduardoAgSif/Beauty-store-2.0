#  BeautyStore 2.0

A luxury beauty e-commerce mobile application built with **Ionic + Angular** and a **PHP** REST API backend. Browse a curated catalog of premium skincare, makeup, fragrances and hair care products.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Running on Android](#-running-on-android)
- [Test Credentials](#-test-credentials)

---

##  Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| **Frontend** | Ionic 9 · Angular 22 · TypeScript 6 |
| **Mobile**   | Capacitor 8 (Android)              |
| **Backend**  | PHP (REST API)                      |
| **Database** | MySQL / MariaDB (XAMPP)             |
| **HTTP**     | Axios                               |

---

##  Project Structure

```
BeautyStore_2.0/
├── android/              # Capacitor Android project
├── backend/              # PHP REST API
│   ├── api.php           # Product endpoints (CRUD)
│   ├── login.php         # Authentication endpoint
│   ├── signup.php        # User registration endpoint
│   ├── db_config.php     # Database connection & CORS config
│   └── schema.sql        # Database schema & seed data
├── src/
│   └── app/
│       ├── guards/       # Route guards (auth)
│       ├── api-demo/     # CRUD demo for the REST API
│       ├── login/        # Login page module
│       ├── models/       # Data models
│       ├── services/     # API services
│       ├── tabs/         # Tab navigation layout
│       ├── tab1/         # Tab 1 - (Product catalog)
│       ├── tab2/         # Tab 2
│       └── tab3/         # Tab 3
├── capacitor.config.ts   # Capacitor configuration
├── angular.json          # Angular CLI configuration
├── ionic.config.json     # Ionic CLI configuration
└── package.json          # Dependencies & scripts
```

---

##  Prerequisites

- **Node.js** (v18+) & **npm**
- **Ionic CLI** — `npm install -g @ionic/cli`
- **XAMPP** (Apache + MySQL) — for the PHP backend
- **Android Studio** — for building the Android APK (optional)

---

##  Backend Setup

1. **Start XAMPP** — make sure **Apache** and **MySQL** are running.

2. **Create the database** — open phpMyAdmin (`http://localhost/phpmyadmin`) and run the script:

   ```sql
   -- Import the file: backend/schema.sql
   ```

   This creates the `app_db` database with `users` and `products` tables, along with 12 seeded luxury beauty products.

3. **Deploy the API** — copy the `backend/` folder into your XAMPP `htdocs` directory:

   ```bash
   cp -r backend/ C:/xampp/htdocs/backend/
   ```

4. **Verify** — visit `http://localhost/backend/api.php` in your browser. You should get a JSON response.

---

##  Frontend Setup

1. **Navigate to the project folder:**

   ```bash
   cd BeautyStore_2.0
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   ionic serve
   ```

   The app will open at `http://localhost:8100`.

---

## REST API CRUD Demo

Open **API CRUD** from the navigation (or visit `http://localhost:8100/api-demo`) to exercise the product API:

1. Set the API host and base path in **Origen de datos**. For XAMPP on the same computer use `localhost`; Android emulators and physical devices need a host reachable from that device (for example, `10.0.2.2` for the Android Studio emulator).
2. Use **Consultar GET** to list the products stored by the server.
3. Enter a name, description, price, and stock, then use **Crear con POST**.
4. Select **Editar** on a server product. Use **Guardar con PUT** to replace its editable fields or **Actualizar stock con PATCH** to change only its stock.
5. Use **DELETE** on a product and confirm the deletion.

Requests show an Ionic loading overlay. The result panel displays the method, actual HTTP status, and response; API errors are shown on screen and in the request diagnostics. The storefront keeps its local catalog fallback, while this demo reports API failures without substituting local data.

For delivery evidence, start the PHP/MySQL backend, run the flow above, and record the screen with a system screenshot or screen recorder. Capture the GET list and the POST, PUT/PATCH, and DELETE results so the HTTP methods and response status are visible.

---

##  Running on Android

```bash
# Build the web assets
ionic build

# Sync with Capacitor
ionic capacitor sync android

# Open in Android Studio
ionic capacitor open android
```

Then build and run from Android Studio on an emulator or physical device.

---

##  Test Credentials

| Field      | Value              |
| ---------- | ------------------ |
| **Email**  | `test@gmail.com`   |
| **Password** | `admin1234`     |

---

##  Available Scripts

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `ionic serve`        | Start the dev server in the browser        |
| `npm run build`      | Build the production bundle                |
| `npm run test`       | Run unit tests                             |
| `npm run lint`       | Lint the project with ESLint               |
| `ionic capacitor sync android` | Sync web assets to the Android project |

---

## 📄 License

This project is for academic purposes — *Programación de Móviles II*.
