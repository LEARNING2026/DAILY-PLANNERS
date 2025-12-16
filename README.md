# Daily Planner & Language Hub

A modern, responsive, and feature-rich Daily Planner application with an integrated Language Learning Hub. Built with Vanilla JavaScript, CSS (Glassmorphism), and HTML.

## Features

-   **Daily Planner**:
    -   Task management with priorities (High, Medium, Low).
    -   Categorization (Work, Personal, Learning, Fun).
    -   Gamification (Points & Badges).
-   **Language Hub**:
    -   Multi-language support (English, French, Arabic).
    -   Lesson plans for levels A1-C2.
    -   Interactive lessons with dialogues and key takeaways.
    -   **PRO** features (Business level locked for free users).
-   **UI/UX**:
    -   Modern Glassmorphism design.
    -   Confetti animations on task completion.
    -   Dark/Light theme support (via CSS variables).
    -   Fully responsive mobile sidebar.
    -   **RTL Support**: Full Arabic layout support.

## Project Structure

```
/
├── assets/             # Images and Icons
├── css/
│   ├── main.css        # Base styles, variables, typography
│   ├── layout.css      # Sidebar, Grid, Hero styles
│   ├── components.css  # Cards, Buttons, Inputs, Badges
│   ├── rtl.css         # Right-to-Left specific overrides
├── js/
│   ├── app.js          # Main entry point, routing, initialization
│   ├── auth.js         # Authentication logic (Login/Register mock)
│   ├── store.js        # Data management (LocalStorage)
│   ├── ui.js           # DOM rendering and updates
│   ├── i18n.js         # Internationalization (Translations)
│   ├── utils.js        # Helper functions
├── index.html          # Main HTML file
└── README.md           # This file
```

## Setup & Usage

1.  **Clone or Download** the repository.
2.  Open `index.html` in any modern web browser.
3.  **No build step required!** (Vanilla JS).

## Customization

-   **Colors**: Edit `./css/main.css` root variables.
-   **Translations**: Add keys to `./js/i18n.js`.
-   **Content**: Modify `./js/store.js` for default data.
