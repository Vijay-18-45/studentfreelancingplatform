# CampusGig 🎓🚀

**CampusGig** is more than just a marketplace; it's a vibrant, AI-powered ecosystem designed to redefine how students collaborate, earn, and grow within their college campus. 

In a world where traditional part-time jobs are often rigid and disconnected from a student's field of study, CampusGig provides a flexible, skill-centric alternative that builds real-world portfolios while solving everyday campus needs.

![CampusGig Hero](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000)

## 😟 The Problem
Students often face two major hurdles:
1.  **Financial Constraints**: The need for extra income without sacrificing study time.
2.  **Skill Gap**: The difficulty of finding practical projects to apply what they learn in the classroom.
3.  **Trust**: The risk of working with strangers online.

## 💡 The Solution: CampusGig
CampusGig bridges these gaps by creating a **trusted, hyper-local economy**. By limiting the platform to the campus community, we ensure a high level of accountability. By integrating AI, we make the process of finding and posting work effortless and intelligent.

---

## ✨ User Experience & Key Features

### 🤖 Intelligent Matching (The "Aha!" Moment)
When a user logs in, they aren't just met with a list of tasks. They see a **curated experience**. 
*   **AI Task Fit Score**: Our algorithm analyzes your profile skills and reliability history to give you a personalized "Match Score" for every gig. It tells you, *"Hey, you're a 95% match for this Python project!"*
*   **AI Description Enhancer**: Posting a task is no longer a chore. Type a few rough words like *"need java help"*, and our **Gemini AI** transforms it into a professional, detailed job posting that attracts the best talent.

### 🔄 The "Skill Swap" Philosophy
We believe that knowledge is the most valuable currency on campus. 
*   **Beyond Money**: If a student is low on points, they can opt for **Skill Swap Mode**. This allows a design student to help a CS student with a UI, while the CS student helps them with a website backend. It's a pure exchange of value that fosters peer-to-peer learning.

### 🏆 Building a Digital Reputation
*   **Reliability Score**: Every action on the platform contributes to a student's digital resume. On-time completions and positive reviews boost your **Reliability Score**, making you a preferred choice for high-budget tasks.
*   **Verified Student Status**: Every user is a peer, creating a safe and familiar environment for collaboration.

### 📱 Seamless, Mobile-First Interaction
Whether you're in the library or between classes, CampusGig is always ready.
*   **Responsive Sidebar**: A sleek, collapsible navigation system that stays out of your way on mobile but provides quick access on desktop.
*   **Real-Time Feedback**: Smooth animations and instant notifications keep you engaged and informed about your applications.

---

## 🚀 Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS (Utility-first, responsive design)
*   **Animations**: Framer Motion (Fluid transitions and micro-interactions)
*   **Icons**: Lucide React (Consistent, modern iconography)
*   **AI Integration**: @google/genai (Gemini 3 Flash for intelligent text processing)
*   **Persistence**: LocalStorage (Robust client-side state simulation)

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/campus-gig.git
    cd campus-gig
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```text
src/
├── components/     # Atomic UI components (Button, Card, Badge, etc.)
├── services/       # AI and external API logic (Gemini AI)
├── types.ts        # Centralized TypeScript definitions
├── storage.ts      # Data persistence layer and mock data
├── App.tsx         # Core application logic and view routing
└── index.css       # Global styles and Tailwind configuration
```

## 🤝 Contributing
We love community input! Feel free to fork the repo and submit a PR.

## 📄 License
This project is licensed under the MIT License.
