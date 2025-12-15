# LearnHub - Professional Learning Platform

A modern, responsive, and multilingual professional learning website built with HTML, CSS, and JavaScript.

## Features

✨ **6 Language Support**
- English
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Chinese (中文)
- Japanese (日本語)

🎨 **Key Features**
- Responsive design (mobile, tablet, desktop)
- Modern and professional UI
- 6 Featured professional courses
- Smooth navigation and scrolling
- Language preference persistence (using localStorage)
- Contact form
- Statistics section
- Smooth animations and transitions

📱 **Sections**
1. **Navigation Bar** - Sticky navigation with language selector
2. **Hero Section** - Welcome banner with call-to-action
3. **Courses Section** - 6 featured professional courses
4. **About Section** - Platform information and statistics
5. **Contact Section** - Contact form for inquiries
6. **Footer** - Links and copyright information

## File Structure

```
professional-website/
├── index.html       # Main HTML file
├── styles.css       # CSS styling
├── script.js        # JavaScript functionality
├── languages.js     # Language translations
└── README.md        # Documentation
```

## How to Use

### 1. Open the Website
Simply open `index.html` in your web browser.

### 2. Change Language
- Click on the language selector dropdown in the navigation bar
- Select your preferred language:
  - English
  - Español (Spanish)
  - Français (French)
  - Deutsch (German)
  - 中文 (Chinese)
  - 日本語 (Japanese)

### 3. Navigate Sections
- Click on navigation links (Home, Courses, About, Contact) to jump to sections
- Smooth scrolling is enabled for all navigation

### 4. Submit Contact Form
- Fill in your name, email, and message
- Click "Send Message" to submit

## Languages Supported

| Language | Code | Supported |
|----------|------|-----------|
| English | en | ✓ |
| Spanish | es | ✓ |
| French | fr | ✓ |
| German | de | ✓ |
| Chinese | zh | ✓ |
| Japanese | ja | ✓ |

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (Vanilla)** - No dependencies
- **localStorage** - For persisting language preference

## Responsive Breakpoints

- **Desktop** - 1200px and above
- **Tablet** - 768px to 1199px
- **Mobile** - Below 768px
- **Small Mobile** - 480px and below

## Features Explained

### Language System
The website uses a translation system stored in `languages.js`. All translatable text elements have a `data-key` attribute that corresponds to a translation key. When the language is changed, the `updatePageLanguage()` function updates all content.

### Local Storage
The selected language is saved to the browser's localStorage, so when you revisit the site, your language preference is remembered.

### Smooth Navigation
All navigation links use smooth scrolling to enhance user experience. The navigation bar also becomes "sticky" and shows a subtle shadow when you scroll down.

### Responsive Design
The website uses CSS Grid and Flexbox for responsive layouts that adapt beautifully to all screen sizes.

## Customization

### Adding New Content
Edit the `languages.js` file to add translations, and add corresponding `data-key` attributes to HTML elements.

### Changing Colors
Modify the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --light-bg: #f9fafb;
    --border-color: #e5e7eb;
}
```

### Adding New Sections
Add new HTML sections and include `data-key` attributes for any translatable text.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 LearnHub. All rights reserved.

## Support

For questions or issues, please contact us through the contact form on the website.
