# Jira Integration Frontend

A React + TypeScript + Vite frontend that integrates with Jira to fetch and display **issues, projects, and audit trail data**.
The app supports syncing data from Jira using a Jira token, auto-syncs daily via cron, and provides filtering, pagination, and export functionality.

---

## How it helps

This project tracks changes in Jira tickets and persistently stores those changes in an **audit log**.
That lets teams track every change (who changed what and when) even if issues or projects are reassigned — useful for accountability, root-cause analysis, and historical record-keeping.

---

## 🚀 Features

- 📊 **Dashboard page** with quick navigation cards to different modules (Issues, Projects, Audit Trail)
- 🔄 **Sync Now** button to manually fetch **projects & issues** from Jira (using Jira token)
- ⏱️ **Auto daily sync** via cron for keeping data up to date
- 🎯 **Filters dropdown** to fetch and apply existing filter values
- 📑 **Pagination & page limit selection** for large datasets
- 📂 **Excel export** of available data (Issues, Projects, Audit Trail)
- 📅 **Last sync date** displayed at the bottom of each page
- 📱 **Responsive UI** for better usability

---

## 📁 Project Structure
```
/
├── public/ # Static public assets
├── src/
│ ├── common/ # Utility/helper functions
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page-level components (views)
│ ├── queries/ # API / backend integration modules / type definitions
│ ├── styles/ # Style management with css
│ └── App.tsx, main.tsx # Entry points
├── .dockerignore
├── Dockerfile
├── .gitignore
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

---

## 🛠 Prerequisites

- Node.js (v16 or higher recommended)
- npm / yarn / pnpm
- A backend that supports Jira API endpoints (or a mock server)
- Jira server / cloud credentials & API access tokens

---

## ⚙️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/Sudhakarselvam12/jira-integration-frontend.git
cd jira-integration-frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a .env file in the root and add:

```env
PORT=<port number>
VITE_BACK_URL=https://your-backend-url.com/api

```

4. **Run development server**
```bash
npm run dev

```

The app should start at http://localhost:5173 (or another port shown in the terminal).

5. **Build for production**

```bash
npm run build

```

The production build will go into dist/.

---

## 🧩 Usage
Once the app is running:
* Navigate to dashboard page where a grid of cards are present each one for projects, issues and audit trail
* You can navigate to respective pages by clicking on the cards or by collapsible/expandable side panel
* Use Sync Now button to manually sync Jira data, last sync date will be visible at the bottom of the page (Data will also auto-sync daily via cron)
* Use the Filters dropdown to apply filters
* Export issues, projects, or audit trail data as Excel
* Pagination and page limit is implemented across all the pages

---

## 📦 Dependencies & Tooling
Major dependencies include:
* React
* TypeScript
* Vite
* Axios
* Tailwind CSS
* ESLint

The project also includes configuration files:
* Dockerfile & .dockerignore
* tsconfig.app.json, tsconfig.node.json, etc.
* vite.config.ts
* .gitignore

---

## ⚠️ Known Issues / TODOs
* Authentication flow (OAuth / tokens) may need refinement
* Better error handling & UI feedback
* UI / UX enhancements & theming
* Add e2e tests

---

## 🪪 Author
Sudhakarselvam12
Contact: sudhakarselvam12@gmail.com
GitHub: https://github.com/Sudhakarselvam12

---

## 🤝 Contributing
1. Fork the repo
2. Create a branch: git checkout -b feature/<name>
3. Commit & push, then open a PR
Please follow the existing lint/format rules and include a short description of changes.

---

## 📷 Screenshots / Demo
- **Dashboard** (`/`)
  ![dashboard](/public/screenshots/Screenshot_Dashboard.png)
  Overview cards linking to Issues, Projects, and Audit Trail. Shows last sync date and a "Sync Now" action.

- **Projects** (`/projects`)
  ![projects](/public/screenshots/Screenshot_Projects.png)
  List of synced Jira projects with sync status. Supports "Sync Now", pagination, filters, and Excel export.

- **Issues** (`/issues`)
  ![issues](/public/screenshots/Screenshot_Issues.png)
  List of synced Jira issues with filters dropdown (fetches available values), pagination / page-limit selector, and Excel export.

- **Audit Trail** (`/audit-trail`)
  ![audit-trail](/public/screenshots/Screenshot_AuditTrail.png)
  Chronological table of sync and user actions (who did what, when). Supports filtering and export.
