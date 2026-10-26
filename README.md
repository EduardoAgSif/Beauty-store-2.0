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

   This creates the `app_db` database with `users` and `products` tables, along with 12 seeded luxury beauty products. If `products` already exists from an older version, the script also adds the missing `category` and `image_url` columns without deleting existing rows. Re-import the updated file if phpMyAdmin reports `Unknown column 'category'`.

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

## Probar la API REST con Postman

1. Inicia Apache y MySQL desde XAMPP e importa `backend/schema.sql` en phpMyAdmin.
2. En Postman, crea una variable `baseUrl` con el valor `http://localhost/backend`. Si Apache usa otro puerto, inclúyelo en el host, por ejemplo `http://localhost:8080/backend`.
3. Para todas las solicitudes usa el endpoint `{{baseUrl}}/api.php`. En **Headers**, agrega `Accept: application/json`. Para solicitudes con cuerpo JSON agrega también `Content-Type: application/json`.
4. Para POST, PUT y PATCH, selecciona **Body > raw > JSON** y utiliza estos ejemplos:

| Operación | Método y URL | Cuerpo JSON |
|---|---|---|
| Listar productos | `GET {{baseUrl}}/api.php` | Sin cuerpo |
| Consultar un producto | `GET {{baseUrl}}/api.php?id=1` | Sin cuerpo |
| Crear un producto | `POST {{baseUrl}}/api.php` | `{"name":"Producto de prueba","description":"Creado desde Postman","price":125.50,"stock":10}` |
| Reemplazarlo | `PUT {{baseUrl}}/api.php?id=ID` | `{"name":"Producto actualizado","description":"Actualizado con PUT","price":135.50,"stock":8}` |
| Actualizar parcialmente | `PATCH {{baseUrl}}/api.php?id=ID` | `{"stock":6}` |
| Eliminarlo | `DELETE {{baseUrl}}/api.php?id=ID` | Sin cuerpo |

En POST, copia el `id` de la respuesta y úsalo en las solicitudes PUT, PATCH y DELETE. Usa un producto de prueba para DELETE: la eliminación en la base de datos es permanente. Las respuestas esperadas son `200` para GET, PUT, PATCH y DELETE, y `201` para POST. En Postman, la barra de respuesta muestra el estado HTTP y las pestañas **Body** y **Headers** muestran los detalles para revisar o capturar evidencia.

La URL del backend que consume la aplicación se configura en `DEFAULT_CONFIG` de `src/app/services/data-source-config.service.ts` (`localhost`, puerto `80`, ruta `/backend`). Si el servidor está en otro host, actualiza esa constante y vuelve a compilar la app. Postman instalado en el mismo equipo que XAMPP puede utilizar `localhost`.

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
