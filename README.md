# RANDOM TANTRUM

A brutalist web presence for Random Tantrum, designed with attitude.

## 🧠 Features

- Brutalist design aesthetic
- Custom Vaticanus font
- Responsive layout
- Glitch animations

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment to GitHub Pages

1. Fork or clone this repository
2. Update `astro.config.mjs` with your GitHub username:

   ```js
   site: 'https://YOUR_GITHUB_USERNAME.github.io',
   base: '/rndmtntrm', // or your repository name
   ```

3. Push to your GitHub repository
4. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions
   - Your site will deploy automatically on push to main branch

**Troubleshooting:**

- If you get GitHub Actions errors, check the workflow file at `.github/workflows/deploy.yml`
- Make sure all paths in your code include the base path with `import.meta.env.BASE_URL`

## 🎨 Design Notes

The design follows brutalist principles with:

- High contrast black/white color scheme
- Raw typography using Vaticanus font
- Exposed structure and sharp edges
- Deliberate visual glitches
- Minimal styling

## 📝 License

- Vaticanus font: Public Domain (https://www.fontspace.com/vaticanus-font-f128585)

## 🚀 Baseline Astro project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
