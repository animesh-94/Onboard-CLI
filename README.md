# Onboard-CLI

> Developer platform for code parsing, systems profiling, and canvas-based node visualization.

[![Go Version](https://img.shields.io/badge/Go-1.21%2B-blue.svg)](https://golang.org/)
[![React Version](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Onboard-CLI** is an advanced command-line interface tool and web-based visualizer designed to help developers quickly understand and map out large, complex codebases. By leveraging AST (Abstract Syntax Tree) parsing via Tree-sitter, Onboard-CLI generates structural topology graphs and enforces architectural boundaries, presenting them through an intuitive React Flow canvas.

## 🌟 Key Features

- **AST Slicing Engine**: Deep code parsing using `tree-sitter` for accurate structural node generation across multiple languages (Go, JS, TS, Python, Java).
- **Interactive Visualizer (`map`)**: Automatically spins up a local React Flow canvas (`http://localhost:3000/app`) to visually explore code paths, dependencies, and topological maps within a specified radius.
- **Architecture Drift Detection (`drift`)**: Analyzes codebase against `architecture.yml` rules to detect unauthorized cross-file imports and boundary violations, ensuring long-term code health.
- **Comprehensive Ecosystem**: Built-in commands for config management, impact analysis, code exporting, owner tracking, and project pulse.
- **Modern Tech Stack**: Blazing fast CLI written in Go, paired with a rich frontend utilizing Vite, React 19, `@xyflow/react` (React Flow), Framer Motion, and Tailwind CSS.

## 📊 Statistics & Capabilities

- **Language Support**: 5+ Built-in parsers (Go, TypeScript, JavaScript, Python, Java).
- **Visualization Radius**: Configurable deep-mapping (default radius: 1, scales to complex dependency trees).
- **Rule Enforcement**: Sub-second boundary regex evaluation for architectural drift across thousands of files.
- **Frontend Performance**: Optimized canvas rendering for large node sets, powered by Vite & SWC/Oxc linting.

## 🚀 Installation

You can install Onboard-CLI using the provided installation scripts:

### macOS / Linux
```bash
curl -fsSL https://raw.githubusercontent.com/onboard-cli/install.sh | bash
```
*(Or run `./install.sh` directly from the repository).*

### Windows
```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/onboard-cli/install.ps1 -OutFile install.ps1; .\install.ps1
```

## 💻 Usage

### 1. Initialize Project
Generate the necessary `.onboard` configurations and `architecture.yaml` file.
```bash
onboard init --template web-api
```
*(Available templates: `generic`, `web-api`, `hft`, `microservice`)*

### 2. Map the Codebase (Visualizer)
Trigger the context engine to map a symbol or file path, and boot up the visualizer server.
```bash
onboard map --target "internal/parser" --radius 2
```
👉 *Click the provided link (http://localhost:3000/app) to view the interactive canvas. Press `Ctrl+P` in the UI to use the Fuzzy Finder! Toggle Dark Mode and Compact Mode from the top right.*

### 3. Extract Backend Routes
Automatically map backend API routes to their exact file and line handler locations across various frameworks (Express, Gin, FastAPI, Spring).
```bash
onboard routes --protocol rest --framework express
```

### 4. Detect Architectural Drift
Check for violations against your defined architecture rules.
```bash
onboard drift --rules architecture.yml
```

### 5. CI/CD Integration
Integrate `onboard drift` into your GitHub Actions workflow to enforce architectural boundaries on every Pull Request. Check out the template at [`docs/onboard-action.yml`](docs/onboard-action.yml).

### 6. Additional Commands
- `onboard impact`: Analyze the impact of a proposed code change.
- `onboard owners`: Track code ownership and maintainers.
- `onboard export`: Export graphical/AST data.
- `onboard pulse`: Get a quick summary of codebase health and recent activity.

*(Note: You can pass the `--no-update-check` global flag to any command to disable the automatic async version checker).*

## 🛠️ Tech Stack

- **CLI Engine**: Go, Cobra, Go-Tree-Sitter, YAML.
- **Web UI**: React 19, TypeScript, Vite, `@xyflow/react` (React Flow), Tailwind CSS, Framer Motion, Lucide React.
- **Code Highlighting & Markdown**: Shiki, MDX, Rehype.

## 🤝 Contributing

We welcome contributions! Please check out the `cmd` and `internal` directories for CLI logic, and the `ui` directory for the React frontend.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
