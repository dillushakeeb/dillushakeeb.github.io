# Dillu Shakeeb Portfolio

A personal portfolio website for Dillu Shakeeb, interior designer and architect, built with HTML, CSS, and JavaScript.

## Overview

This portfolio website showcases architectural and interior design projects with a focus on:
- Professional presentation of design work
- Responsive layout for all devices
- Project categorization and filtering
- Interactive elements to engage visitors

## Features

- **Responsive Design**: Adapts to all screen sizes
- **Project Gallery**: Filterable by category
- **Project Details**: Individual pages for each project
- **Animations**: Smooth scrolling and fade-in effects
- **Contact Form**: Easy way for potential clients to reach out

## Structure

```
portfolio/
├── index.html              # Homepage
├── projects.html           # All projects overview
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── main.js             # JavaScript functionality
├── images/                 # Image assets
│   └── placeholders/       # Placeholder images
└── projects/               # Individual project pages
    └── half-moon.html      # Sample project detail page
```

## How to Use

### Basic Setup

1. Replace placeholder images with your own project photos:
   - Add your profile picture to `images/` 
   - Add project images to `images/`
   - Replace `hero-bg.jpg` with a background image that represents your work

2. Update project information:
   - Modify project details in `index.html` and `projects.html`
   - Create additional project detail pages in the `projects/` directory

3. Personalize content:
   - Update your bio, skills, and contact information in `index.html`
   - Add or modify sections as needed

### Customization

- **Colors**: Update the color scheme by modifying CSS variables in `css/style.css`:
  ```css
  :root {
      --primary-color: #e05c44; /* Main accent color */
      --secondary-color: #2d2d33; /* Secondary color */
      /* Other color variables */
  }
  ```

- **Fonts**: Change typography by updating font-family properties in `css/style.css`

- **Project Categories**: Modify filter categories in both `index.html` and `projects.html`:
  ```html
  <div class="button-group filter-button-group">
      <button class="btn btn-outline-secondary active" data-filter="*">All</button>
      <!-- Add or modify category buttons and corresponding class names -->
  </div>
  ```

## Hosting

This portfolio is designed to be hosted on GitHub Pages:

1. Create a repository named `yourusername.github.io`
2. Push this portfolio to that repository
3. GitHub Pages will automatically deploy your site to `https://yourusername.github.io`

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- jQuery
- AOS (Animate On Scroll)
- Isotope.js (for filtering)

## Credits

- Font Awesome for icons
- Bootstrap for layout and components
- AOS for scroll animations
- Isotope for filtering functionality
