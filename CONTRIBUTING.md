# Contributing to Onboard-CLI

First off, thank you for considering contributing to Onboard-CLI! It's people like you that make Onboard-CLI such a great tool for developers.

This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Project Structure](#project-structure)
3. [Local Development Setup](#local-development-setup)
4. [How to Contribute](#how-to-contribute)
5. [Pull Request Process](#pull-request-process)
6. [Policy on AI-Generated Code](#policy-on-ai-generated-code)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please be respectful and welcoming to all contributors.

## Project Structure

Onboard-CLI is divided into two main parts:
- **CLI Engine (`/cmd`, `/internal`)**: Written in Go. Handles parsing, abstract syntax tree (AST) generation, drift detection, and serving the local API.
- **Web UI (`/ui`)**: Written in React (Vite). Provides the interactive canvas-based visualization of the codebase.

## Local Development Setup

To work on Onboard-CLI locally, you will need:
- [Go](https://golang.org/dl/) 1.21 or later
- [Node.js](https://nodejs.org/) (v18+) and npm/yarn/pnpm

### 1. Clone the repository
```bash
git clone https://github.com/onboard-cli/onboard-cli.git
cd onboard-cli
```

### 2. Backend (Go CLI)
To build or run the Go CLI locally:
```bash
# Install Go dependencies
go mod download

# Run the CLI from source
go run main.go --help

# Run tests
go test ./...
```

### 3. Frontend (React UI)
To run the frontend locally:
```bash
cd ui

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

## How to Contribute

1. **Find an issue**: Look for open issues labeled `good first issue` or `help wanted`. If you have a new idea, please open an issue first to discuss it!
2. **Fork and Branch**: Fork the repository and create a new branch from `main` (e.g., `feature/add-new-parser` or `fix/canvas-rendering`).
3. **Write Code**: Make your changes. Ensure you add or update tests as necessary.
4. **Test**: Run the test suite (`go test ./...` for Go, and any UI tests if present) and verify everything works.
5. **Lint**: Make sure your code is properly formatted (e.g., `gofmt` for Go, ESLint/Prettier for the UI).

## Pull Request Process

1. Push your changes to your fork.
2. Open a Pull Request against the `main` branch of the upstream repository.
3. Provide a clear and descriptive title and description for your PR. Explain *what* you changed and *why*.
4. Wait for a maintainer to review your code. We may request changes or improvements.
5. Once approved, your PR will be merged!

## Policy on AI-Generated Code

We welcome contributions that are assisted by AI tools (like GitHub Copilot, ChatGPT, Claude, Gemini, etc.), but we require contributors to adhere to the following guidelines:

1. **You are responsible for the code**: If you use AI to generate code, you must thoroughly understand it, test it, and ensure it meets our quality standards. Do not blindly copy-paste code you don't understand.
2. **Security and Best Practices**: AI tools can sometimes generate outdated or insecure code. Always review the suggested code against modern best practices and security standards.
3. **No Copyrighted Material**: Ensure that the AI has not generated code that infringes on third-party copyrights or licenses.
4. **Transparency**: When opening a Pull Request, it is helpful (but optional) to mention if significant parts of the architectural design or complex algorithms were generated with AI assistance. This helps reviewers understand the context.
5. **Documentation**: AI is great for generating initial drafts of documentation or comments. Please read through and edit the generated text to ensure it accurately reflects the codebase and maintains a human-friendly tone.

By submitting a PR, you confirm that you have reviewed and stand by the quality, security, and originality of the code, regardless of whether AI tools were used in its creation.
