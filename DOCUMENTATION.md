# CampusGig Documentation 📘

This document provides a deep dive into the **CampusGig** architecture, its design philosophy, and how it delivers a unique user experience through AI and a student-centric economy.

---

## 🏗️ Architecture Overview

CampusGig is a **Single Page Application (SPA)** built with **React 18** and **TypeScript**. The architecture is designed to be lightweight, performant, and highly responsive.

### 🔄 State Management & Persistence
The application uses **React Hooks** (`useState`, `useEffect`, `useMemo`) for local state management. Since the project is currently a client-side prototype, it uses a custom **LocalStorage-based storage engine** (`src/storage.ts`).

*   **Persistence Strategy**: All data (Users, Tasks, Notifications) is serialized as JSON and stored in `localStorage`. This ensures that a student's progress, tasks, and points are preserved across browser refreshes.
*   **Initialization Logic**: On the first load, the storage engine checks for existing data. If none is found, it populates the app with a rich set of **mock student profiles and tasks** to demonstrate the platform's full potential.

### 🤖 AI Integration (Gemini AI)
The platform leverages the **Gemini 3 Flash** model via the `@google/genai` SDK to provide two critical features that enhance the user experience:

1.  **AI Task Description Enhancer**:
    *   **User Problem**: Students often don't know how to write clear, professional job descriptions.
    *   **AI Solution**: A prompt is sent to Gemini to rewrite the student's rough notes into a structured, professional, and clear task description. This increases the quality of the marketplace and helps attract the right talent.
    *   **Implementation**: A dedicated `enhanceDescription` service in `App.tsx` handles the asynchronous call to the Gemini API.

2.  **AI Task Fit Score**:
    *   **User Problem**: Browsing through dozens of tasks can be overwhelming.
    *   **AI Solution**: A client-side algorithm calculates a **Match Score** for every task based on the current user's skills and reliability.
    *   **Factors**:
        *   **Skill Overlap**: How many of the task's required skills does the user have?
        *   **User Rating**: Higher-rated users get a slight boost in their match score.
        *   **Reliability Score**: Users who consistently complete tasks on time are prioritized.

---

## 🎨 Design Philosophy & UX

### 📱 Mobile-First & Responsive
College students are always on the move. CampusGig is designed to be a **mobile-first** experience.
*   **Collapsible Sidebar**: On mobile, the navigation is tucked away in a hamburger menu to maximize content space.
*   **Touch Optimization**: Buttons and interactive elements are sized for easy tapping (minimum 44px height).
*   **Fluid Grids**: The marketplace and dashboard use CSS Grid with responsive column counts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

### 🔄 The "Skill Swap" Economy
One of the most innovative parts of CampusGig is the **Skill Swap** mode.
*   **Concept**: We recognize that not all students have the points (currency) to hire others. However, every student has a skill.
*   **UX Flow**: When a user toggles "Skill Swap Mode" during task creation, the budget field is replaced with a "What skill can you offer?" field. This creates a unique, non-monetary value exchange that is perfect for a campus environment.

### 🏆 Trust & Reputation System
Trust is the foundation of a campus marketplace.
*   **Reliability Score**: This is a dynamic percentage that reflects a user's commitment. It's calculated based on successful task completions versus cancellations.
*   **Verified Student Badges**: Visual cues that reinforce the "peer-to-peer" nature of the platform.

---

## 🛠️ Key Components & Data Models

### UI Components
*   **`Card`**: A versatile container with consistent shadows and borders, used for everything from task listings to profile summaries.
*   **`Button`**: A multi-variant component (`primary`, `outline`, `ghost`, `danger`) that ensures visual consistency across the app.
*   **`Badge`**: A semantic labeling component with dynamic coloring based on the status or category.

### Core Data Models (`src/types.ts`)
*   **`User`**: Contains profile info, skills, points, rating, and reliability metrics.
*   **`Task`**: Stores title, description, budget, deadline, and status (`pending`, `in_progress`, `completed`).
*   **`Application`**: Links users to tasks, including a custom message and bid amount.
*   **`Notification`**: Tracks system alerts and task-related updates for each user.

---

## 🚀 Future Roadmap
*   **Real-Time Chat**: Integrated messaging between buyers and workers.
*   **Payment Gateway**: Integration with UPI or other digital payment systems for real-money transactions.
*   **Campus Verification**: Integration with university email systems (SSO) for enhanced security.

---

For any questions or support, please contact the lead developer.
