# Developer Setup Guide

## Prerequisites

Before setting up the Beatles Mood Analyzer development environment, ensure you have the following tools installed:

### Required Software

#### Node.js (Version 18.x or higher)
```bash
# Check current version
node --version

# Download from https://nodejs.org/
# Recommended: Use Node Version Manager (nvm)

# Install via nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install via nvm-windows (Windows)
# Download from https://github.com/coreybutler/nvm-windows
nvm install 18.17.0
nvm use 18.17.0
```

#### npm (Version 9.x or higher)
```bash
# Check current version
npm --version

# Update npm if needed
npm install -g npm@latest
```

#### Angular CLI (Version 19.x)
```bash
# Install globally
npm install -g @angular/cli@latest

# Verify installation
ng version
```

#### Git
```bash
# Check installation
git --version

# Configure git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Recommended Tools

#### Code Editor
- **Visual Studio Code** (recommended)
- **WebStorm** or **IntelliJ IDEA**
- **Sublime Text** or **Atom**

#### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "angular.ng-template",
    "johnpapa.angular2",
    "cyrilletuzi.angular-schematics"
  ]
}
```

## Project Setup

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-username/beatles-mood-analyzer.git
cd beatles-mood-analyzer

# Clone via SSH (if SSH keys configured)
git clone git@github.com:your-username/beatles-mood-analyzer.git
cd beatles-mood-analyzer
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install

# Alternative: Clean install
npm ci
```

### 3. Verify Installation

```bash
# Check Angular CLI version
ng version

# Verify project structure
ls -la src/app/

# Check package.json scripts
npm run
```

## Development Environment

### Environment Configuration

The project uses Angular's environment system for configuration:

#### Development Environment (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  enableAnalytics: false,
  debugMode: true,
  apiUrl: 'http://localhost:4200',
};
```

#### Production Environment (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  enableAnalytics: true,
  debugMode: false,
  apiUrl: 'https://your-domain.com',
};
```

### Development Server

#### Start Development Server
```bash
# Start dev server (default port 4200)
npm start
# or
ng serve

# Start with custom port
ng serve --port 8080

# Start with host binding (for network access)
ng serve --host 0.0.0.0

# Start with auto-open browser
ng serve --open
```

#### Development Server Options
```bash
# Watch mode with polling (useful for file system issues)
ng serve --poll=2000

# Serve with HTTPS
ng serve --ssl

# Disable host checking (for proxy scenarios)
ng serve --disable-host-check

# Enable verbose logging
ng serve --verbose
```

### Building the Application

#### Development Build
```bash
# Standard development build
ng build

# Development build with watch mode
ng build --watch

# Development build with source maps
ng build --source-map
```

#### Production Build
```bash
# Production build with optimizations
npm run build
# or
ng build --configuration production

# Production build with bundle analysis
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/angular-app/stats.json
```

#### Build Configurations
```javascript
// angular.json build configurations
"configurations": {
  "production": {
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": false,
    "namedChunks": false,
    "extractLicenses": true,
    "vendorChunk": false,
    "buildOptimizer": true,
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "500kb",
        "maximumError": "1mb"
      }
    ]
  },
  "development": {
    "optimization": false,
    "sourceMap": true,
    "namedChunks": true,
    "extractLicenses": false,
    "vendorChunk": true,
    "buildOptimizer": false
  }
}
```

## Testing Setup

### Unit Testing with Jasmine and Karma

#### Running Tests
```bash
# Run tests once
npm test
# or
ng test

# Run tests with code coverage
ng test --code-coverage

# Run tests in watch mode (default)
ng test --watch

# Run tests headlessly
ng test --browsers=ChromeHeadless --watch=false

# Run specific test file
ng test --include='**/*.spec.ts'
```

#### Test Configuration (`karma.conf.js`)
```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    }
  });
};
```

### End-to-End Testing (E2E)

#### Setup E2E Testing (if not already configured)
```bash
# Add E2E testing capability
ng add @cypress/schematic
# or for Protractor (legacy)
ng add @angular/pwa
```

#### Running E2E Tests
```bash
# Run E2E tests
ng e2e

# Run E2E tests headlessly
ng e2e --headless

# Run E2E tests with specific configuration
ng e2e --configuration production
```

## Code Quality Tools

### ESLint Configuration

#### Install ESLint (if not already installed)
```bash
ng add @angular-eslint/schematics
```

#### Running ESLint
```bash
# Lint all files
ng lint

# Lint with auto-fix
ng lint --fix

# Lint specific files
ng lint --files src/app/services/*.ts
```

#### ESLint Configuration (`.eslintrc.json`)
```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@angular-eslint/recommended",
        "@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@angular-eslint/component-selector": [
          "error",
          {
            "prefix": "app",
            "style": "kebab-case",
            "type": "element"
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["@angular-eslint/template/recommended"],
      "rules": {
        "@angular-eslint/template/no-negated-async": "error"
      }
    }
  ]
}
```

### Prettier Configuration

#### Install Prettier
```bash
npm install --save-dev prettier
```

#### Prettier Configuration (`.prettierrc`)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

#### Format Code with Prettier
```bash
# Format all files
npx prettier --write src/

# Check formatting without fixing
npx prettier --check src/

# Add to package.json scripts
"format": "prettier --write src/",
"format:check": "prettier --check src/"
```

### Husky Pre-commit Hooks

#### Install Husky
```bash
npm install --save-dev husky lint-staged

# Initialize husky
npx husky install
npm pkg set scripts.prepare="husky install"

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

#### Lint-staged Configuration (`package.json`)
```json
{
  "lint-staged": {
    "src/**/*.{ts,js,html}": [
      "prettier --write",
      "eslint --fix"
    ],
    "src/**/*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

## IDE Setup

### Visual Studio Code

#### Workspace Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "angular.log": "verbose",
  "files.associations": {
    "*.html": "html"
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  }
}
```

#### Tasks Configuration (`.vscode/tasks.json`)
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "ng-serve",
      "type": "shell",
      "command": "ng serve",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": "$tsc"
    },
    {
      "label": "ng-build",
      "type": "shell",
      "command": "ng build",
      "group": "build"
    },
    {
      "label": "ng-test",
      "type": "shell",
      "command": "ng test",
      "group": "test"
    }
  ]
}
```

#### Launch Configuration (`.vscode/launch.json`)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    },
    {
      "name": "Attach to Chrome",
      "type": "chrome",
      "request": "attach",
      "port": 9222,
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Debugging

### Browser Debugging

#### Chrome DevTools
1. **Open Developer Tools** (F12)
2. **Enable source maps** in Settings > Preferences
3. **Set breakpoints** in TypeScript files
4. **Use Angular DevTools** extension for component inspection

#### Angular DevTools
```bash
# Install Angular DevTools Chrome extension
# Available at: https://chrome.google.com/webstore/detail/angular-devtools/
```

#### VS Code Debugging
1. **Set breakpoints** in TypeScript files
2. **Start debug session** with "Launch Chrome" configuration
3. **Debug both client and server** side code

### Common Debugging Scenarios

#### Component Issues
```typescript
// Add console logging for debugging
export class MoodDisplayComponent {
  ngOnInit() {
    console.log('MoodDisplayComponent initialized');
    console.log('Input selectedSong:', this.selectedSong);
    console.log('Input moodResult:', this.moodResult);
  }
}
```

#### Service Issues
```typescript
// Debug service methods
analyzeMood(song: Song): Observable<MoodResult> {
  console.log('Analyzing mood for song:', song);
  
  return this.validateSong(song).pipe(
    tap(() => console.log('Song validation passed')),
    switchMap(() => this.performDeepAnalysis(song)),
    tap(analysis => console.log('Analysis complete:', analysis)),
    catchError(error => {
      console.error('Analysis failed:', error);
      return this.handleAnalysisError(error);
    })
  );
}
```

## Performance Optimization

### Bundle Analysis

#### Analyze Bundle Size
```bash
# Generate stats file
ng build --stats-json

# Analyze with webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/angular-app/stats.json

# Alternative: source-map-explorer
npm install -g source-map-explorer
ng build --source-map
source-map-explorer dist/angular-app/**/*.js
```

### Build Optimization

#### Tree Shaking
```typescript
// Use tree-shakable providers
@Injectable({
  providedIn: 'root'
})
export class MoodService { }

// Import only needed parts of libraries
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
```

#### Lazy Loading (Future Enhancement)
```typescript
// Route-based lazy loading
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

## Deployment

### Local Build Testing

#### Serve Production Build Locally
```bash
# Build for production
ng build --configuration production

# Serve using simple HTTP server
npm install -g http-server
http-server dist/angular-app -p 8080 -c-1

# Or use Angular CLI
ng serve --configuration production
```

### Docker Setup (Optional)

#### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/angular-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  beatles-mood-analyzer:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## Git Workflow

### Branch Strategy
```bash
# Main development branch
git checkout main

# Create feature branch
git checkout -b feature/mood-analysis-improvements

# Create fix branch
git checkout -b fix/theme-toggle-issue

# Create hotfix branch
git checkout -b hotfix/security-update
```

### Commit Message Convention
```bash
# Conventional commit format
git commit -m "feat: add mood confidence scoring"
git commit -m "fix: resolve theme persistence issue"
git commit -m "docs: update API documentation"
git commit -m "test: add mood service unit tests"
git commit -m "refactor: improve analysis pipeline"
git commit -m "style: format code with prettier"
```

### Pre-commit Workflow
```bash
# Automatic pre-commit checks (via Husky)
# 1. ESLint fixes
# 2. Prettier formatting
# 3. Type checking
# 4. Unit tests (optional)

# Manual pre-commit checks
npm run lint
npm run format:check
npm run test -- --watch=false
npm run build
```

## Troubleshooting

### Common Development Issues

#### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### Angular CLI Issues
```bash
# Update Angular CLI globally
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest

# Clear Angular CLI cache
ng cache clean
```

#### TypeScript Issues
```bash
# Restart TypeScript service in VS Code
# Command Palette > "TypeScript: Restart TS Server"

# Check TypeScript configuration
npx tsc --noEmit
```

#### Port Conflicts
```bash
# Find process using port 4200
lsof -i :4200
# or on Windows
netstat -ano | findstr :4200

# Kill process
kill -9 <PID>

# Use different port
ng serve --port 8080
```

### Performance Issues

#### Slow Build Times
```bash
# Use incremental builds
ng build --watch

# Disable source maps in development
ng serve --source-map=false

# Use AOT compilation
ng serve --aot
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
ng build

# Or on Windows
set NODE_OPTIONS=--max-old-space-size=8192 && ng build
```

## Contributing Guidelines

### Code Style
- Follow **Angular Style Guide**
- Use **TypeScript strict mode**
- Maintain **95%+ test coverage**
- Write **clear, self-documenting code**
- Use **meaningful variable names**

### Pull Request Process
1. **Create feature branch** from main
2. **Implement changes** with tests
3. **Run full test suite**
4. **Update documentation** if needed
5. **Submit pull request** with clear description
6. **Address review feedback**
7. **Squash commits** before merge

### Testing Requirements
- **Unit tests** for all services and components
- **Integration tests** for complex interactions
- **E2E tests** for critical user journeys
- **Accessibility tests** for WCAG compliance

---

This developer setup guide provides everything needed to contribute effectively to the Beatles Mood Analyzer project. Follow these guidelines to maintain code quality and ensure smooth development workflow.