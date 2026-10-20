# ECO-CONNECT (Branded as EcoCivic)

**EcoCivic** is a modular, production-ready citizen action portal built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**. It empowers citizens to schedule plastic pickups, track civic verification flowcharts, redeem sustainability rewards, and report local community hazards in real-time.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 with custom Emerald / Teal / Slate design system
- **Icons**: Lucide React (`lucide-react`)
- **Architecture**: Single Page Application (SPA) with tabbed navigation, dynamic state management, interactive modals, and real-time toast feedback.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production
npm run build
```

Dev Server: `http://127.0.0.1:5173/`

---

## 📑 Feature Modules

### 1. Citizen Dashboard (`/src/components/Dashboard.jsx`)
- **Welcome Banner**: Inspiring hero heading & quote with dynamic action shortcuts.
- **Quick Metrics Grid**:
  - ⚖️ **Recycled Weight**: `18.5 kg` (Emerald tint)
  - 🪙 **Earned Credits**: `450 PTS` (Amber tint)
  - 🛠️ **Resolved Issues**: `4 Closed` (Blue tint)
  - 🚚 **Next Pickup**: `Tomorrow` (Purple tint)

### 2. Plastic Pickup Request (`/src/components/PlasticPickup.jsx`)
- **Top Action Bar**: `+ Request Plastic Pickup` button triggering the interactive booking modal.
- **Flowchart Verification Notice**: Transparent explanation of municipal sorting and weighing stages.
- **Request History Table**:
  - `REQUEST ID`: (e.g., `#REQ-8892`, `#REQ-8841`)
  - `DATE & SLOT`: (e.g., `Oct 19, 2026 (09:00 AM)`)
  - `PLASTIC CATEGORY`: (e.g., `PET Bottles & HDPE`, `Hard Plastics`)
  - `VERIFIED WEIGHT`: (e.g., `2.1 kg`, `Pending`)
  - `FLOWCHART STATUS`:
    - **Verified Yes** (Emerald badge with `CheckCircle`)
    - **Recheck Record (No)** (Amber badge with `RefreshCw`)
  - `REWARD OUTCOME`: Verified PTS credit (`+52 PTS Added`) or `Pending Review`.

### 3. Credits & Rewards (`/src/components/CreditsRewards.jsx`)
- **Header**: Live wallet balance display (`450 PTS`).
- **Civic Perks & Discounts**:
  - 🚌 **Public Transit Monthly Pass Discount**: `200 PTS` (15% off municipal transit).
  - ⚡ **Municipal Electricity Bill Rebate**: `300 PTS` ($20 / ₹150 utility deduction).
  - 🌳 **Public Facility Access Pass**: `150 PTS` (Free access to sports complexes & civic parks).
- **Interactive Redemption**: Deducts PTS in real-time, displays an encrypted voucher code, and allows one-click clipboard copying.

### 4. Civic Issue Tracker (`/src/components/ReportIssue.jsx`)
- **Top Action Bar**: `+ Report New Issue` button opening the issue logging modal with file upload preview.
- **Issue Tracking Card**:
  - Status Badge: `IN PROGRESS`
  - Issue Code: `#CIV-9012`
  - Title: "Deep Pothole on Main Market Road"
  - Location: `Sector 14, Near Metro Pillar #42`
  - Photo Evidence placeholder / thumbnail preview
  - Description: Road safety hazard details
  - **4-Step Resolution Timeline Tracker**:
    1. `Submitted` (Green checkmark)
    2. `Assigned` (Green checkmark)
    3. `In Progress` (Active Amber wrench with animation)
    4. `Resolved` (Pending Gray flag)

### 5. Settings Modal / Drawer (`/src/components/SettingsModal.jsx`)
- **Profile Info**: Name, Phone, Citizen Ward ID (`WARD-SEC14-0892`), Home Address.
- **Notifications**: Toggles for SMS alerts, Pickup Status updates, and Reward notifications.
- **Preferences**: Dark Mode toggle and Language Selector (English, Hindi, Tamil, Telugu, Marathi).
