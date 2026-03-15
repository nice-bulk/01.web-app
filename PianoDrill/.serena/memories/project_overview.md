# PianoDrill - Project Overview

## Purpose
PianoDrill is a piano drill/practice web application currently in early development stage (scaffolded from Vite + React + TypeScript template). The project name suggests it will be a piano practice/drilling tool.

## Tech Stack
- **Framework**: React 19
- **Language**: TypeScript ~5.9.3
- **Build Tool**: Vite 8
- **Package Manager**: pnpm (pnpm-lock.yaml present)
- **Linting**: ESLint 9 with typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh
- **Module Type**: ESM (`"type": "module"`)

## Project Structure
```
PianoDrill/
├── src/
│   ├── App.tsx          # Main app component (currently Vite default template)
│   ├── App.css          # App styles
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles
│   └── assets/
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
├── public/              # Static assets
├── index.html           # HTML entry
├── vite.config.ts       # Vite config (React plugin)
├── tsconfig.json        # TypeScript config root
├── tsconfig.app.json    # TypeScript config for app
├── tsconfig.node.json   # TypeScript config for Node
├── eslint.config.js     # ESLint flat config
├── package.json
└── pnpm-lock.yaml
```

## Current State
Scaffolded from the official Vite + React + TypeScript template. App.tsx still contains default Vite starter content. Active development of piano drill features has not yet begun.
