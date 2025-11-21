# Buffet Vibes

## 📖 Project Overview
**Buffet Vibes** is a modern, interactive web application that lets you explore Warren Buffett’s Berkshire Hathaway shareholder letters.  It provides a clean reading experience, analytics, and AI‑powered analysis of any selected passage.

- **Dynamic theme toggle** – Light/Dark mode with smooth transitions.
- **Reading controls** – Adjustable font size, line height, and optional night/sepia modes.
- **Reading analytics** – Tracks reading time, word count, daily streaks, and weekly progress.
- **AI analysis** – Highlight a sentence/paragraph and get language‑lab, rhetorical, and investment‑wisdom insights powered by the Gemini API.
- **Export & print** – Export a letter as a printable HTML file (or print to PDF).

The project is built with **Next.js** (React) for the frontend and a lightweight **Node.js** backend for the AI analysis endpoint.

---

## ✨ Features
| Feature | Description |
|---------|-------------|
| **Theme toggle** | Instantly switch between light and dark themes; the UI updates instantly without a flash of unstyled content. |
| **Reading controls** | Choose font size (`S/M/L/XL`), line spacing (`Compact/Normal/Spacious`), and reading mode (`Normal/Sepia/Night`). |
| **Reading analytics** | Shows total reading time, word count, streaks, and achievements. Data persisted in `localStorage`. |
| **AI analysis panel** | Select any text and click **Analyze** – the backend returns language‑lab, rhetorical analysis, and investment‑wisdom. |
| **Export / Print** | One‑click export to an HTML file that can be printed or saved as PDF. |
| **Responsive layout** | Works on desktop, tablet, and mobile devices. |
| **SEO‑friendly** | Proper `<title>`, meta description, heading hierarchy, and semantic HTML. |

---

## 🚀 Getting Started
### Prerequisites
- **Node.js** (v18 or newer) and **npm**
- A **GitHub** personal access token (PAT) if you plan to push changes.
- (Optional) **Gemini API key** – required for the AI analysis endpoint (`.env` variable `GEMINI_API_KEY`).

### Installation
```bash
# Clone the repository (or use your existing local copy)
git clone https://github.com/cinnak/buffet_vibes.git
cd buffet_vibes

# Install dependencies
npm install
```

### Development
```bash
# Start the dev server (hot‑reloading)
npm run dev
```
Open your browser at `http://localhost:3000`.

### Build for Production
```bash
npm run build   # Generates an optimized production bundle
npm start       # Starts the production server
```

---

## 📂 Project Structure
```
├─ components/            # Reusable React components
│   ├─ AnalysisPanel.js   # AI analysis UI
│   ├─ Header.js          # Top navigation + theme toggle
│   ├─ LetterViewer.js    # Letter display & selection handling
│   ├─ ReadingAnalytics.js
│   ├─ ReadingControls.js
│   └─ ...
├─ data/                  # JSON data for HTML letters (1977‑2009)
├─ lib/                   # Helper functions (letter loading, utils)
├─ pages/                 # Next.js pages
│   ├─ api/analyze.js     # Backend endpoint for Gemini AI
│   ├─ index.js           # Home page
│   └─ letter/[year].js   # Letter viewer page (core of the app)
├─ public/                # Static assets (fonts, images)
├─ scripts/               # One‑off scripts (e.g., PDF scraper)
├─ styles/                # Global CSS with theme variables
├─ .gitignore
├─ package.json
└─ README.md              # <-- This file
```

---

## 🔧 Configuration
Create a `.env` file at the project root with the following variables (replace placeholders with your own values):
```dotenv
# Gemini API key for AI analysis
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: customize the port (default 3000)
PORT=3000
```
The `.gitignore` already excludes `.env` from version control.

---

## 🛠️ API Endpoint
**POST** `/api/analyze`
- **Request body**: `{ "selectedText": "..." }`
- **Response**: JSON containing `LanguageLab`, `Rhetoric`, and `Wisdom` objects.
- The endpoint forwards the request to the Gemini API; see `pages/api/analyze.js` for implementation details.

---

## 📈 Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/awesome-feature`.
3. Make your changes and ensure the app still builds.
4. Commit with a clear message: `git commit -m "feat: add awesome feature"`.
5. Push to your fork and open a Pull Request.

Please follow the existing code style (Prettier + ESLint) and keep the UI consistent with the design system defined in `styles/globals.css`.

---

## 📜 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## 🙏 Acknowledgements
- **Warren Buffett** – for the timeless wisdom contained in the shareholder letters.
- **Google Gemini** – powering the natural‑language analysis.
- **Tailwind‑like utility classes** – inspired by Tailwind, but implemented with vanilla CSS for full control.
- **Open‑source community** – for the many libraries that make this project possible.

Enjoy exploring the letters and gaining insights! 🎉
