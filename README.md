# TechCorp Corporate LMS Client Portal

An interactive, responsive single-page application (SPA) built with **React** and compiled via **Vite**. The frontend leverages modular dashboards, real-time caching, and JSON Web Token (JWT) session persistence to deliver a modern learning management system.

---

## 🎨 Component Architecture

To maintain code readability and clean state isolation, the client codebase is divided into modular components located inside the `src/components/` directory:

### 1. Central Orchestrator (`src/App.jsx`)
Acts as the central state hub and handles:
- **Global Session Tracking**: Evaluates token verification status on mount (`isLoggedIn`, `selectedUser`).
- **REST CRUD Operations**: Makes HTTP queries to backend API paths (enrollments, module completions, quiz submissions, course creation).
- **Session Cache**: Writes/removes credentials from browser cache (`localStorage`).
- **Header Injection**: Evaluates and injects JWT authorization details (`Authorization: Bearer <token>`) securely on all private endpoints.

### 2. Authentication Screen (`src/components/LoginScreen.jsx`)
- Implements interactive **Sign In** and **Sign Up / Registration** cards.
- Handles form input validations (Name, password, email, and department selection).
- Features a **Supervising Manager** toggle check:
  - If unchecked, registers a new **Learner** and queries the database dynamically for supervisors.
  - If checked, registers a **Manager** and requests validation of the corporate access code (`welcome_manager`).

### 3. Learner Hub (`src/components/LearnerDashboard.jsx`)
- Displays statistics for course progress, enrollment, and completions.
- Provides search filters and category tabs to explore courses.
- Integrates the **Active Course Player**:
  - Lets learners review curriculum modules and toggle completion markers.
  - Renders the **Compliance Quiz** dynamically. Checks answers and updates completion rates.
- Displays verified compliance certificates and calendar timelines.

### 4. Manager Control Room (`src/components/ManagerDashboard.jsx`)
- Lists statistics for direct reports, active courses, and team progress.
- Renders **Team Course Completion Rates** progress indicators.
- Hosts administrative panels for managers:
  - **Create & Deploy Course**: Deploy custom training modules and set quiz rules.
  - **Add Subordinate**: Register team members directly, assigning name, email, department, and custom credentials.

### 5. Utility Layouts (`src/components/Common.jsx`)
- **Loader**: animated skeleton placeholder layouts for loading states.
- **ErrorBanner**: alerts and reconnect options if the database drops off.

---

## 🔄 API Integration & Vite Proxy

To bypass Cross-Origin Resource Sharing (CORS) limits in development, the client project configures a dev proxy inside `vite.config.js`. 
- Requests sent to `/api/*` are redirected to the backend API server running on port `5050` (e.g. `/api/courses` -> `http://localhost:5050/api/courses`).
- All protected resources are routed with authorization headers:
  ```javascript
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
  ```

---

## 🛠️ Scripts & Commands

Navigate to the `client` directory and execute development scripts:

```bash
# Install packages
npm install

# Run the dev hot-reload dashboard locally (on http://localhost:5174)
npm run dev

# Compile production-ready assets (emitted into /dist directory)
npm run build
```
