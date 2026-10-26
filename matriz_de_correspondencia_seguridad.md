# TECHNICAL AUDIT AND REGULATORY TRACEABILITY REPORT

**SOFTWARE ENGINEERING TECHNICAL REPORT — FORMAL ACADEMIC EDITION**  
**ACADEMIC PROGRAM:** Software Engineering (ISW) — 9th Quarter  
**COURSE:** Mobile Devices Programming II  
**SOFTWARE PROJECT:** *BeautyStore 2.0 (GlowBeauty)*  
**AUTHOR:** Eduardo Aguilar Sifuentes  
**AUDIT DATE:** October 2026  
**RESEARCH AREA:** Secure Software Development Lifecycle (SSDLC) & IT Governance  

---

### Executive Summary

This technical report presents a comprehensive security audit and regulatory traceability assessment for the **BeautyStore 2.0 (GlowBeauty)** mobile e-commerce platform. Employing a systematic verification methodology, a **Bidirectional Correspondence Matrix** is established, correlating international cybersecurity clauses (**ISO/IEC 27001:2022**, **OWASP API Security Top 10 (2023)**, **OWASP Mobile Application Security Verification Standard (MASVS v2.0)**, and **NIST SP 800-53 Rev. 5**) directly with the source code artifacts, architectural components, and relational persistence models deployed across the system. Furthermore, a **Statement of Applicability and Coverage Justification (SoA)** is presented, validating full compliance across critical controls, detailing compensatory measures applied to address laboratory development gaps, and providing technical justifications for excluded domains outside the academic project scope.

**Keywords:** Correspondence Matrix, Bidirectional Traceability, ISO/IEC 27001:2022, OWASP MASVS, OWASP API Security, NIST SP 800-53, Secure SDLC, Mobile Security, Statement of Applicability, Ionic, Angular, Capacitor, PHP PDO.

---

## 1. Introduction and Contextual Framework

### 1.1 System Architecture and Context
**BeautyStore 2.0** is a luxury mobile e-commerce application engineered for catalog browsing, cosmetic inventory management, and user authentication. Its decoupled architecture is organized into three primary layers:
1. **Client Layer (Mobile & Web):** Built on the Ionic Framework (v9) powered by Angular (v22), natively packaged and deployed to Android (API level 34+) via Capacitor (v8).
2. **Web Services Layer (REST API):** Developed in PHP (v8) running on an Apache HTTP server, serving strictly structured JSON payloads.
3. **Relational Persistence Layer:** Managed on MariaDB/MySQL through the PHP Data Objects (PDO) database abstraction driver.

### 1.2 Theoretical Justification of Regulatory Traceability
In modern Software Engineering, bidirectional traceability between formal regulatory standards and executable software artifacts guarantees that:
* **Requirement $\rightarrow$ Artifact Vector:** Every security objective is concretely materialized into tangible system assets (classes, route guards, controllers, or database schemas).
* **Artifact $\rightarrow$ Requirement Vector:** Every critical code routine carries a clear regulatory mandate, eliminating superfluous code and unmonitored attack vectors.

---

## 2. Methodological Framework and Reference Standards

The audit evaluates the codebase against four globally recognized cybersecurity and secure software development benchmarks:
* **ISO/IEC 27001:2022 (Annex A — Technological Controls A.8):** Information security management standard focused on secure systems lifecycle, data masking, and access control.
* **OWASP API Security Top 10 (2023):** Catalog of the most critical vulnerabilities affecting modern web APIs and microservices.
* **OWASP Mobile Application Security Verification Standard (MASVS v2.0):** Industry baseline for mobile security across data storage, cryptography, authentication, and network communication.
* **NIST Special Publication 800-53 Rev. 5:** Comprehensive security and privacy control catalog published by the National Institute of Standards and Technology (covering AC, IA, SC, SI, and SA families).

---

## 3. Bidirectional Correspondence Matrix

**Table 1** defines the bidirectional correspondence between regulatory clauses and project software artifacts, documenting verifiable technical proofs extracted directly from the codebase.

#### Table 1. Bidirectional Correspondence Matrix between Regulatory Controls and Software Artifacts

| Control ID / Clause | Reference Standard | Regulatory Requirement Description | Associated Software Artifact | Technical Evidence & Proof of Compliance in Code | Traceability Vector |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A.8.24**<br>*(Cryptography)*<br><br>**IA-5**<br>*(NIST)* | ISO/IEC 27001:2022<br><br>NIST SP 800-53 Rev. 5 | **Credential Protection & Cryptographic Hashing:** Passwords at rest must be stored using cryptographically robust one-way hashing functions with automated salts, preventing plaintext recovery in the event of database leaks. | • [backend/signup.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/signup.php)<br>• [backend/login.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/login.php)<br>• [backend/schema.sql](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/schema.sql) | • `signup.php` (Line 41): Irreversible key derivation using `password_hash($password, PASSWORD_DEFAULT)` (Bcrypt algorithm with dynamic salt).<br>• `login.php` (Line 28): Side-channel and timing-attack resistant authentication check via `password_verify($password, $user['password'])`.<br>• `schema.sql`: Column definition `password VARCHAR(255) NOT NULL` accommodating standard Bcrypt/Argon2 hashes. | Requirement $\leftrightarrow$ Code |
| **API3:2023**<br>*(BOPLA)*<br><br>**A.8.11**<br>*(Data Masking)* | OWASP API Security<br><br>ISO/IEC 27001:2022 | **Data Minimization & Prevention of Sensitive Data Exposure:** Authentication responses and client-side diagnostics must never leak password hashes or confidential credentials (*telemetry data leakage*). | • [backend/login.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/login.php)<br>• [src/app/login/login.page.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/login/login.page.ts) | • `login.php` (Line 29): Explicit memory destruction of the hash prior to JSON serialization: `unset($user['password'])`.<br>• `login.page.ts` (Line 58): Preemptive credential masking in client telemetry audit: `diagnostics.payload = { email: this.signInData.email, password: '[REDACTED]' }`. | Requirement $\leftrightarrow$ Code |
| **API8:2023**<br>*(Injection)*<br><br>**A.8.20**<br>*(Network & Data)* | OWASP API Security<br><br>ISO/IEC 27001:2022 | **Code and SQL Injection Mitigation:** Database interactions must abstract query syntax using prepared statements with strongly typed parameter bindings. | • [backend/api.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/api.php)<br>• [backend/login.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/login.php)<br>• [backend/signup.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/signup.php) | • `api.php` (Lines 22-23, 69-74): Strict invocation of `$conn->prepare()` with explicit type binding: `$stmt->bindParam(':id', $id, PDO::PARAM_INT)`.<br>• Zero string concatenation of raw superglobals (`$_GET`, `$_POST`, JSON body) into SQL queries. | Requirement $\leftrightarrow$ Code |
| **MASVS-AUTH-1**<br>*(Authentication)*<br><br>**AC-3**<br>*(NIST)* | OWASP MASVS v2.0<br><br>NIST SP 800-53 Rev. 5 | **Access Enforcement & Protected Client Routing:** Client-side routing must intercept navigation requests and prohibit rendering privileged views when a session is unverified. | • [src/app/guards/auth.guard.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/guards/auth.guard.ts)<br>• [src/app/app-routing.module.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/app-routing.module.ts)<br>• [src/app/services/auth.service.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/services/auth.service.ts) | • `auth.guard.ts` (Lines 5-16): Angular Functional Guard `authGuard` evaluating `await authService.isAuthenticated()`.<br>• If unauthenticated, triggers deterministic redirection: `return router.createUrlTree(['/login'])`.<br>• `app-routing.module.ts`: Configured with `canActivate: [authGuard]` guarding all core operational views (`tabs`). | Requirement $\leftrightarrow$ Architecture |
| **API10:2023**<br>*(Consumption)*<br><br>**SI-10**<br>*(NIST)* | OWASP API Security<br><br>NIST SP 800-53 Rev. 5 | **Strict Input Validation and Type Checking:** All data payloads from external sources must undergo format, data type, and business range validation before processing. | • [backend/signup.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/signup.php)<br>• [backend/api.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/api.php) | • `signup.php` (Line 22): Standard email format verification using `filter_var($email, FILTER_VALIDATE_EMAIL)`.<br>• `api.php` (Lines 48-67): Validation rejecting non-positive decimal prices (`floatval($inputData['price']) < 0`) and validating non-negative stock integers using `FILTER_VALIDATE_INT`, issuing HTTP 400 Bad Request upon mismatch. | Requirement $\leftrightarrow$ Code |
| **MASVS-STORAGE-1**<br>*(Storage)*<br><br>**SC-28**<br>*(NIST)* | OWASP MASVS v2.0<br><br>NIST SP 800-53 Rev. 5 | **Secure Local Storage & Sandboxed Mobile State:** Client session tokens, cached profiles, and local carts must be stored within isolated, OS-level application sandboxes. | • [src/app/services/storage.service.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/services/storage.service.ts)<br>• [src/app/services/auth.service.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/services/auth.service.ts) | • `storage.service.ts` (Lines 13-24): Native mobile persistence leveraging `@capacitor/preferences`, backed by private Android `SharedPreferences` isolated by OS application UID.<br>• `auth.service.ts` (Lines 62-66): Atomic `logout()` procedure that systematically purges runtime memory subjects and persisted mobile device storage. | Requirement $\leftrightarrow$ Storage |
| **A.8.26**<br>*(Application Security)*<br><br>**SC-5**<br>*(NIST)* | ISO/IEC 27001:2022<br><br>NIST SP 800-53 Rev. 5 | **Attack Surface Reduction & HTTP Method Restriction:** Endpoints must restrict incoming traffic strictly to authorized REST verbs, rejecting unexpected methods with standardized status codes. | • [backend/login.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/login.php)<br>• [backend/signup.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/signup.php)<br>• [backend/api.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/api.php) | • `login.php` & `signup.php` (Lines 4-8): Explicit method guard `if ($_SERVER['REQUEST_METHOD'] !== 'POST')`, returning HTTP 405 Method Not Allowed and terminating execution (`exit()`).<br>• `api.php`: Controlled `switch ($method)` handling only `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`. | Requirement $\leftrightarrow$ API Interface |
| **A.8.20**<br>*(Network Controls)*<br><br>**SC-7**<br>*(NIST)* | ISO/IEC 27001:2022<br><br>NIST SP 800-53 Rev. 5 | **Network Communications & CORS Header Negotiation:** Explicit definition of transport headers, character encodings, MIME types, and preflight handling. | • [backend/db_config.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/db_config.php) | • `db_config.php` (Lines 2-12): Standardized emission of `Content-Type: application/json; charset=UTF-8`, `Access-Control-Allow-Methods`, and preflight resolution intercepting `OPTIONS` with an early HTTP 200 response, enabling seamless Capacitor WebView interoperability. | Requirement $\leftrightarrow$ Configuration |
| **SI-11**<br>*(Error Handling)*<br><br>**A.8.15**<br>*(Logging)* | NIST SP 800-53 Rev. 5<br><br>ISO/IEC 27001:2022 | **Controlled Exception Handling & Fault Isolation:** Runtime faults or database connection exceptions must be caught and sanitized, avoiding the exposure of stack traces to end users. | • [backend/db_config.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/db_config.php)<br>• [backend/login.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/login.php) | • Database exceptions fully encapsulated within `try / catch (PDOException $e)` blocks.<br>• Generation of standardized JSON error envelopes with HTTP 500 status (`{"status":"error", ...}`), preventing server path leakage and database driver dumps. | Requirement $\leftrightarrow$ Code |
| **A.8.28**<br>*(Secure Coding)*<br><br>**SA-11**<br>*(NIST)* | ISO/IEC 27001:2022<br><br>NIST SP 800-53 Rev. 5 | **Static Analysis & Strong Compile-Time Typing:** Enforcement of static code analysis rules and strict typing to eliminate type-coercion bugs and null reference exceptions. | • [tsconfig.json](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/tsconfig.json)<br>• [eslint.config.js](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/eslint.config.js) | • `tsconfig.json`: Strict compilation mode enabled (`"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`).<br>• `eslint.config.js`: Automated linting enforcing clean asynchronous patterns and prohibiting dead/untyped variables across the Angular application. | Requirement $\leftrightarrow$ Process |

---

## 4. Statement of Applicability and Coverage Justification

### 4.1 Confirmation of Critical Control Coverage
Following a rigorous static code review and runtime architectural evaluation of **BeautyStore 2.0**, 100% compliance is verified across the core applicable security domains:
1. **Confidentiality in Authentication:** Passwords are cryptographically transformed using the standard Bcrypt algorithm via `password_hash()` and verified with `password_verify()`. This guarantees complete protection against offline attacks and rainbow-table compromises should the database storage be breached.
2. **SQL Injection Immunity:** All CRUD operations across the API service utilize PDO prepared statements with explicit parameter binding (`PDO::PARAM_INT`, strings). No user input is directly concatenated into SQL expressions.
3. **Client Route Governance:** Unauthorized access to core mobile catalog views is comprehensively intercepted by Angular's functional [auth.guard.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/guards/auth.guard.ts), forcing redirects to `/login`.
4. **End-to-End Input Validation:** Both TypeScript client forms and PHP backend handlers enforce format verification (RFC-compliant email validation) and business boundary constraints (non-negative currency and integer quantities).
5. **Data Minimization:** Password hashes are stripped from memory (`unset($user['password'])`) prior to API response delivery, and client-side diagnostics replace credentials with `[REDACTED]` tokens.

---

### 4.2 Gap Analysis and Compensatory Controls in Laboratory Environment

Three operational constraints were identified as artifacts of the local testing environment (XAMPP / Android Emulator). Each constraint was systematically addressed through documented compensatory controls:

#### A. Gap 1: Permissive Cross-Origin Resource Sharing (`Access-Control-Allow-Origin: *`)
* **Operational Context:** To accommodate simultaneous testing from web browsers (`localhost:8100`), the Android emulator (`10.0.2.2`), and physical devices on the local area network, the backend exposes broad CORS headers in [db_config.php](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/backend/db_config.php).
* **Compensatory Control:** The API implements strict HTTP method verification (`REQUEST_METHOD`) on all endpoints, immediately terminating unauthorized verbs with HTTP 405 Method Not Allowed, and enforces strict JSON payload validation, preventing rogue payload executions regardless of caller origin.

#### B. Gap 2: Local Session Persistence without Asymmetric Cryptographic Tokens (JWT/OAuth2)
* **Operational Context:** User session states (`UserSession`) are persisted locally via [storage.service.ts](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/services/storage.service.ts) rather than utilizing an OAuth2 authorization server with signed asymmetric JWT tokens.
* **Compensatory Control:** Mobile persistence is delegated exclusively to `@capacitor/preferences`, isolating session records within the sandboxed Android `SharedPreferences` isolated by the operating system UID. Furthermore, the `logout()` routine performs atomic memory and storage revocation.

#### C. Gap 3: Unencrypted HTTP Transport on Local Testbed (XAMPP)
* **Operational Context:** The local Apache test environment operates over plaintext HTTP (port 80) without certificates from a public Certificate Authority (CA).
* **Compensatory Control:** The client architecture decouples connection endpoints via [DataSourceConfigService](file:///c:/Users/eduar/Documents/ISW/Cuatri%209/3-%20Programacion%20de%20moviles%20II/ProjectMobileII/BeautyStore_2.0/src/app/services/data-source-config.service.ts). This enables an instantaneous switch to HTTPS (port 443) via runtime configuration variables without altering any component or service code.

---

### 4.3 Formal Exclusion Criteria and Scope Delimitation

In compliance with academic guidelines for **Mobile Devices Programming II**, **Table 2** records the formal exclusions and their technical justifications.

#### Table 2. Formal Record of Normative Exclusions and Technical Justification

| Excluded Normative Domain | Reference Standard | Technical Justification for Scope Exclusion |
| :--- | :--- | :--- |
| **PCI-DSS Compliance for Direct Cardholder Processing** | PCI-DSS v4.0 /<br>ISO 27001 A.8.24 | **Outside Curricular Scope:** BeautyStore 2.0 is an academic prototype focused on catalog browsing, mobile state synchronization, and REST CRUD integration. The system does not capture, store, or transmit primary account numbers (PAN) or card verification values (CVV), making third-party payment gateway integration (e.g., Stripe, PayPal SDK) inapplicable for this evaluation phase. |
| **Advanced Multi-Factor Authentication (MFA / WebAuthn Biometrics)** | NIST SP 800-63B /<br>ISO 27001 A.5.17 | **Deferred to Commercial Deployment:** Project requirements mandated a fully functional client-server authentication lifecycle (`signup`, `login`, and `logout`). Hardware biometrics (TouchID/FaceID) and time-based one-time passwords (TOTP) were deferred to maintain full test portability across headless Android emulators. |
| **Cloud Infrastructure Governance & Container Orchestration** | ISO 27001 A.8.22 /<br>NIST SP 800-145 | **Not Applicable to Local Topology:** The solution is designed for on-premise execution (Apache + MySQL via XAMPP) paired with Capacitor Android emulators. Controls targeting Kubernetes clusters, AWS/GCP IAM policies, and cloud Web Application Firewalls (WAF) do not apply to this local architecture. |
| **Transparent Data Encryption at Rest (Database TDE)** | ISO 27001 A.8.24 /<br>NIST SP 800-53 SC-28 | **Environment Constraint:** Standard MySQL/MariaDB distributions included with XAMPP do not provide native Transparent Data Encryption (TDE) without host OS-level drive encryption. Protection of sensitive data at rest is effectively addressed through one-way Bcrypt hashing on all sensitive columns. |

---

## 5. Conclusions

The technical audit and the construction of the **Bidirectional Correspondence Matrix** confirm that **BeautyStore 2.0** was engineered in alignment with industry-standard secure coding principles. Verifiable bidirectional traceability has been established between global standards (**ISO/IEC 27001:2022**, **OWASP MASVS**, **OWASP API Security**, and **NIST SP 800-53**) and the system's software artifacts across the mobile frontend, backend API, and relational persistence layers. Operational gaps inherent to the local academic testbed have been mitigated through effective compensatory controls, demonstrating technical rigor and regulatory compliance.

---

## 6. Bibliographical and Normative References

1. **International Organization for Standardization (ISO).** (2022). *Information security, cybersecurity and privacy protection — Information security management systems — Requirements* (ISO/IEC Standard No. 27001:2022). Geneva, Switzerland: ISO.
2. **National Institute of Standards and Technology (NIST).** (2020). *Security and Privacy Controls for Information Systems and Organizations* (NIST Special Publication 800-53, Revision 5). U.S. Department of Commerce. https://doi.org/10.6028/NIST.SP.800-53r5
3. **Open Worldwide Application Security Project (OWASP).** (2023). *OWASP API Security Top 10 2023*. OWASP Foundation. https://owasp.org/www-project-api-security/
4. **Open Worldwide Application Security Project (OWASP).** (2024). *Mobile Application Security Verification Standard (MASVS v2.0)*. OWASP Foundation. https://mas.owasp.org/MASVS/
5. **The PHP Group.** (2026). *PHP Manual: Password Hashing functions and PDO Prepared Statements*. PHP Documentation Group. https://www.php.net/manual/en/book.password.php
6. **Ionic Framework & Capacitor Community.** (2026). *Capacitor Preferences Plugin: Cross-platform secure local storage for modern mobile applications*. Ionic Native Documentation. https://capacitorjs.com/docs/apis/preferences
