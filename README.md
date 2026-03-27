# ExcellentEnchants Calculator

A GitHub-ready React + Vite project that includes:

- Vanilla enchantments
- ExcellentEnchants enchantments
- Build validation
- Anvil cost estimator
- Cheapest book merge order planner
- Charges refill calculator
- Optional success / destroy chance calculator
- Clean browser GUI
- https://wolfblade2k.github.io/Enchantment-Calculator/

## Quick start

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Deploy on GitHub Pages

This repo already includes a GitHub Actions workflow.

1. Push the project to a GitHub repository.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to the `main` branch.
5. GitHub will build and publish the app automatically.

## Notes

- The anvil logic is a Java-style planner, not a guaranteed exact simulation of every custom server.
- ExcellentEnchants servers can override enchant data in plugin configs, so custom servers may differ.
- The chance tab is only for servers that add custom success / destroy systems.
