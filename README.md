# Personal Website

This is my personal website built with Hugo. The site includes custom content, interactive hero animations, publication and preprint sections, research pages, conference galleries, and contact integration.

## 🚀 Features

- Built with Hugo static site generator
- Uses a customized `CareerCanvas` theme bundled in this repository
- Styled with Tailwind CSS
- Responsive design
- Typography plugin for better content formatting
- Custom layouts and templates
- Image galleries and stacked photo previews
- Interactive skills, experience, and research sections
- GitHub Pages deployment workflow

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Hugo](https://gohugo.io/installation/) (Extended version recommended)
- [Node.js](https://nodejs.org/) (for npm packages)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🏗️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Shantariq786/MShanTariq.github.io.git
cd MShanTariq.github.io
```

2. Install npm dependencies:
```bash
npm install
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

This command runs `hugo server -D`, which starts a local server and includes draft content (content with `draft: true` in the front matter). This is useful for previewing unpublished or in-progress content during development.

The site will be available at `http://localhost:1313`

For the contact form and Pexels hero backgrounds to work locally, create a `config.local.toml` (gitignored) in the project root:

```toml
[params]
  pexelsapikey = "your_pexels_api_key"
  formspreeendpoint = "https://formspree.io/f/your_form_id"
```

Run with `hugo server --config config.toml,config.local.toml` (or use `./dev.sh` if it merges both).

## 🏗️ Building

To build the site for production, you need to:

1. Build the CSS with Tailwind:
```bash
npm run build:css
```

2. Build the site with Hugo:
```bash
npm run build
```

Or you can do both in one command:
```bash
npm run build:css && npm run build
```

The built site will be in the `public/` directory.

Note: The CSS build step is necessary because the site uses Tailwind CSS, which needs to be processed to generate the final CSS file with only the used styles.

### Deploying

For the contact form and Pexels backgrounds, set at build time: `HUGO_PARAMS_PEXELSAPIKEY`, `HUGO_PARAMS_FORMSPREEENDPOINT` (no underscores in the param name).

## 📁 Project Structure

- `.github/workflows/` - GitHub Actions workflow for Hugo deployment
- `config/` - Hugo menu configuration and related defaults
- `content/en/` - Main English site content used by the live website
- `layouts/shortcodes/` - Project-level shortcode overrides
- `static/` - Public files and images served directly by the site
- `themes/careercanvas/` - Customized theme assets, layouts, CSS, and JavaScript
- `config.toml` - Main site configuration, metadata, social links, and homepage settings
- `package.json` - Local development scripts and frontend build dependencies
- `tailwind.config.js` - Tailwind configuration used for site styling
