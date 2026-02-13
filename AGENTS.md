================================================
FILE: README.md
================================================
# FreeCELPIPTest Platform

FreeCELPIPTest is a production-grade, real-world learning platform for CELPIP candidates. It blends a polished learning experience with a serious cloud architecture: Next.js 15 on AKS, Key Vault–backed secrets, PostgreSQL, and full CI/CD with azd.

This repository is also my Azure DevOps portfolio piece. It is intentionally end-to-end: frontend, backend, infra, security, and deployment automation in one place.

## Why This Project Matters

- Real users, real needs: practice tests, guided prep, and a learning-first UX
- Cloud-native by design: autoscaling, secrets, and zero-trust patterns
- Production workflow: CI/CD, observability, and reliable releases

## Highlights

- Next.js 15 App Router with TypeScript
- AKS deployment via azd and Helm
- Azure Key Vault + CSI driver for secrets
- PostgreSQL Flexible Server with private networking
- Application Insights for telemetry
- NGINX Ingress + cert-manager for HTTPS
- Mobile-first, accessible UI

## Architecture (Short Explanation)

Users reach the platform through DNS and an Azure Load Balancer. Traffic lands on NGINX Ingress in AKS, routes through Kubernetes Services, and hits the Next.js pods. Secrets are pulled securely from Azure Key Vault using the CSI driver, while the app talks to PostgreSQL over private networking. Telemetry flows into Application Insights, and container images come from ACR.

```mermaid
flowchart TB
    %% ============================================
    %% User & Domain Layer
    %% ============================================
    USER["👤 User Browser"]
    PRODDOMAIN["🌐 freecelpiptest.com"]
    DEVDOMAIN["🌐 dev.freecelpiptest.com"]
    
    %% ============================================
    %% GitHub Actions CI/CD Pipeline
    %% ============================================
    subgraph GITHUB["⚡ GitHub Actions CI/CD"]
        direction TB
        TRIGGER["🔔 Triggers<br/>• Push: main/develop<br/>• PR: main"]
        
        subgraph CI["🧪 CI Jobs"]
            direction LR
            LINT["✅ Lint & Test<br/>ESLint • Jest • TSC"]
            SECURITY["🔒 Security Scan<br/>Trivy • CodeQL"]
        end
        
        subgraph BUILD["🏗️ Build Job"]
            direction LR
            DOCKER["🐳 Docker Buildx<br/>linux/amd64,arm64"]
            PUSH["📦 Push ACR<br/>freecelpip:1.2.3"]
        end
        
        subgraph CD["🚀 CD Jobs"]
            direction LR
            DEPLOYDEV["🌱 Deploy Dev<br/>Helm upgrade --set image.tag=1.2.3-dev"]
            DEPLOYPROD["🔥 Deploy Prod<br/>Helm upgrade --set image.tag=1.2.3"]
            SMOKE["🧪 Smoke Tests<br/>curl /api/health"]
        end
        
        OIDC["🔐 Azure OIDC<br/>Workload Identity Federation"]
    end
    
    %% ============================================
    %% Azure Infrastructure
    %% ============================================
    subgraph AZURE["☁️ Azure Canada Central"]
        direction TB
        
        ACR["📦 Azure Container Registry<br/>crdevru7klmqtlrise.azurecr.io<br/>freecelpip:1.2.3"]
        
        subgraph AKS["⚙️ AKS Cluster"]
            direction TB
            
            INGRESS["🔀 NGINX Ingress Controller<br/>52.139.19.34<br/>cert-manager SSL"]
            
            subgraph FREECELPIP["📦 Namespace: freecelpip"]
                direction LR
                POD["🟢 Next.js Pod<br/>Port: 3000<br/>CPU: 100m-500m<br/>RAM: 256-512Mi<br/>/api/health"]
                SERVICE["⚡ K8s Service<br/>ClusterIP:80→3000"]
            end
        end
        
        subgraph SECRETS["🔐 Secret Management"]
            KV["Key Vault<br/>kv-dev-ru7klmqtlrise"]
            CSI["CSI Driver<br/>SecretProviderClass"]
        end
        
        DB["🗄️ PostgreSQL Flexible Server<br/>psql-dev-ru7klmqtlrise<br/>B2s • 128GB • SSL"]
        APPINSIGHTS["📊 Application Insights<br/>appi-dev-ru7klmqtlrise"]
    end
    
    %% ============================================
    %% CI/CD Flow (Fixed Sequence)
    %% ============================================
    TRIGGER --> LINT --> SECURITY --> DOCKER --> PUSH
    OIDC -.auth.-> ACR
    PUSH -.->|develop| DEPLOYDEV
    PUSH -.->|main| DEPLOYPROD
    DEPLOYDEV --> SMOKE
    DEPLOYPROD --> SMOKE
    
    %% ============================================
    %% Deployment Flow
    %% ============================================
    ACR -.docker-pull.-> POD
    DEPLOYPROD -.helm-upgrade.-> AKS
    DEPLOYDEV -.helm-upgrade.-> AKS
    
    %% ============================================
    %% Traffic Flow
    %% ============================================
    USER -->|HTTPS| PRODDOMAIN
    USER -.->|HTTPS| DEVDOMAIN
    PRODDOMAIN -->|443| INGRESS
    DEVDOMAIN -->|443| INGRESS
    INGRESS --> SERVICE
    SERVICE --> POD
    
    %% ============================================
    %% Data & Secrets Flow
    %% ============================================
    POD <-->|Prisma ORM<br/>SSL Required| DB
    KV -->|RBAC| CSI
    CSI -.mount.-> POD
    POD -.telemetry.-> APPINSIGHTS
    
    %% ============================================
    %% Prisma Migrations
    %% ============================================
    DEPLOYPROD -.->|"kubectl run migrate"| DB
    DEPLOYDEV -.->|"kubectl run migrate"| DB
    
    %% ============================================
    %% Professional Styling
    %% ============================================
    style GITHUB fill:#1e3a8a,stroke:#3b82f6,stroke-width:3px,color:#ffffff
    style AZURE fill:#0078d4,stroke:#0369a1,stroke-width:3px,color:#ffffff
    style AKS fill:#0ea5e9,stroke:#0284c7,stroke-width:2px
    style FREECELPIP fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    
    style TRIGGER fill:#10b981,stroke:#059669,stroke-width:2px,color:#ffffff
    style LINT fill:#3b82f6,stroke:#1d4ed8,color:#ffffff
    style SECURITY fill:#ef4444,stroke:#dc2626,color:#ffffff
    style DOCKER fill:#f59e0b,stroke:#d97706,color:#ffffff
    style PUSH fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    style DEPLOYDEV fill:#6b7280,stroke:#4b5563,color:#ffffff
    style DEPLOYPROD fill:#ef4444,stroke:#dc2626,color:#ffffff
    style SMOKE fill:#10b981,stroke:#059669,color:#ffffff
    
    style ACR fill:#1e40af,stroke:#1d4ed8,color:#ffffff
    style INGRESS fill:#f97316,stroke:#ea580c,color:#000
    style POD fill:#22c55e,stroke:#16a34a,color:#000
    style SERVICE fill:#3b82f6,stroke:#1d4ed8,color:#ffffff
    
    style KV fill:#eab308,stroke:#ca8a04,color:#000
    style CSI fill:#a855f7,stroke:#9333ea,color:#ffffff
    style DB fill:#14b8a6,stroke:#0d9488,color:#ffffff
    style APPINSIGHTS fill:#8b5cf6,stroke:#7c3aed,color:#ffffff
    
    style USER fill:#6b7280,stroke:#4b5563,color:#ffffff
    style PRODDOMAIN fill:#10b981,stroke:#059669,color:#ffffff
    style DEVDOMAIN fill:#f59e0b,stroke:#d97706,color:#ffffff
```

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Setup

```bash
npm install
cp .env.example .env
```

Populate `.env` with your values, then:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

## Deploy to Azure (azd)

This repo is wired for azd. The full production workflow is documented here:

- [azure/README.md](azure/README.md)
  
Fast path:

```bash
azd auth login
azd env new dev
azd up
```

## Project Structure

```
FreeCelpipTest/
├── app/                    # Next.js App Router
├── components/             # UI + sections + layout
├── azure/                  # Azure infra, Helm, and deployment scripts
├── prisma/                 # Prisma schema
└── public/                 # Static assets
```

## Showcase Notes

- This project emphasizes reliability: pod disruption budgets, rolling updates, and HPA.
- Security is a first-class citizen: Key Vault, managed identity, private DB networking.
- The UI is practical and human-first, built for real learners.

## Disclaimer

This website is not affiliated with or endorsed by CELPIP. It is an independent study resource built for learners.

## Support

For questions or issues, please contact us through the contact page or open an issue on GitHub.




================================================
FILE: azure.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json

name: freecelpip
metadata:
  template: freecelpip-aks@0.0.1

services:
  web:
    project: .
    language: ts
    host: aks
    docker:
      path: ./azure/Dockerfile.production
      context: .
    k8s:
      helm:
        chart: ./azure/helm/freecelpip
        namespace: freecelpip
        releaseName: freecelpip
        values:
          image:
            repository: ${SERVICE_WEB_IMAGE_NAME%:*}
            tag: ${SERVICE_WEB_IMAGE_NAME##*:}
          keyVault:
            enabled: true
            name: ${AZURE_KEY_VAULT_NAME}
            tenantId: ${AZURE_TENANT_ID}

infra:
  provider: bicep
  path: azure/infra
  module: main

pipeline:
  provider: github
  variables:
    - AZURE_LOCATION
    - AZURE_SUBSCRIPTION_ID
    - AZURE_TENANT_ID

hooks:
  preprovision:
    posix:
      shell: sh
      run: echo "Starting Azure provisioning..."
  postprovision:
    posix:
      shell: sh
      run: |
        echo "Azure resources provisioned successfully"
        echo "Setting up Kubernetes add-ons..."
        chmod +x ./azure/scripts/setup-k8s-addons.sh
        ./azure/scripts/setup-k8s-addons.sh
  predeploy:
    posix:
      shell: sh
      run: |
        echo "Building container image..."
        cd azure/helm/freecelpip
        helm dependency update || true
        echo "Setting Helm values for deployment..."
        export KEY_VAULT_NAME=$(azd env get-value AZURE_KEY_VAULT_NAME)
        export TENANT_ID=$(az account show --query tenantId -o tsv)
        echo "Key Vault: $KEY_VAULT_NAME"
        echo "Tenant ID: $TENANT_ID"
  postdeploy:
    posix:
      shell: sh
      run: |
        echo "Deployment completed!"
        echo ""
        echo "Checking application status..."
        kubectl get pods -n freecelpip
        echo ""
        echo "Checking ingress..."
        kubectl get ingress -n freecelpip
        echo ""
        echo "Get external IP with: kubectl get svc -n ingress-nginx"
        echo "Check logs with: kubectl logs -n freecelpip -l app=freecelpip"



================================================
FILE: eslint.config.mjs
================================================
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "next-env.d.ts",
      "tailwind.config.ts",
      "postcss.config.mjs",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
]



================================================
FILE: next.config.ts
================================================
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Note: Next.js handles tree shaking automatically, no need to configure webpack
  
  // Compression
  compress: true,
  
  // Production optimizations
  // Note: swcMinify is enabled by default in Next.js 15
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // Static generation
  output: 'standalone', // For containerized deployment (Docker/AKS)
  
  // Environment variables for runtime
  env: {
    APPLICATIONINSIGHTS_CONNECTION_STRING: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || '',
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig




================================================
FILE: package.json
================================================
{
  "name": "freecelpiptest",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@mdx-js/loader": "^3.1.1",
    "@mdx-js/react": "^3.1.1",
    "@microsoft/applicationinsights-web": "^3.3.11",
    "@next/mdx": "^16.0.10",
    "@prisma/client": "^5.19.1",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@types/node": "^22.7.5",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.3.19",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.427.0",
    "next": "^15.0.0",
    "next-auth": "^5.0.0-beta.19",
    "next-themes": "^0.3.0",
    "postcss": "^8.4.45",
    "prisma": "^5.19.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.1",
    "remark": "^15.0.1",
    "remark-gfm": "^4.0.1",
    "remark-html": "^16.0.1",
    "tailwind-merge": "^2.5.2",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.6.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.1.0",
    "@eslint/js": "^9.13.0",
    "@tailwindcss/typography": "^0.5.19",
    "eslint": "^9.13.0",
    "eslint-config-next": "^15.5.9"
  }
}



================================================
FILE: postcss.config.mjs
================================================
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;




================================================
FILE: tailwind.config.ts
================================================
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }], // 12px
        'sm': ['0.875rem', { lineHeight: '1.6' }], // 14px
        'base': ['1rem', { lineHeight: '1.7' }], // 16px - professional standard
        'lg': ['1.125rem', { lineHeight: '1.7' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.6' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '1.5' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '1.4' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.3' }], // 36px
        '5xl': ['3rem', { lineHeight: '1.2' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }], // 60px
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        listening: "hsl(var(--listening))",
        reading: "hsl(var(--reading))",
        writing: "hsl(var(--writing))",
        speaking: "hsl(var(--speaking))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;




================================================
FILE: tsconfig.json
================================================
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}




================================================
FILE: .dockerignore
================================================
# Git
.git
.gitignore

# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnp
.pnp.js

# Testing
coverage
.nyc_output

# Next.js
.next
out
.vercel

# Production
build
dist

# Misc
.DS_Store
*.pem

# Debug
*.log

# Local env files
.env
.env*.local
.env.development
.env.test

# Vercel
.vercel

# TypeScript
*.tsbuildinfo

# IDE
.vscode
.idea
*.swp
*.swo
*~

# Azure
.azure
infra
terraform
.terraform

# Kubernetes
k8s
helm

# Docs
docs
README.md
LICENSE

# CI/CD
.github
.gitlab-ci.yml
azure-pipelines.yml

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore



================================================
FILE: .env.example
================================================
# Development Environment Setup

.env.local template for local development:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/freecelpip?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application Insights (optional for local dev)
APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=your-key;IngestionEndpoint=https://canadacentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://canadacentral.livediagnostics.monitor.azure.com/"
```

## Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## Local Development with Docker
```bash
# Start PostgreSQL
docker run -d \
  --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=freecelpip \
  -p 5432:5432 \
  postgres:15-alpine

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```



================================================
FILE: app/globals.css
================================================
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  
  html {
    font-size: 16px; /* Base font size - standard and professional */
  }
}

@layer base {
  :root {
    /* Neutral, eye-friendly color system - softer and less bright */
    --background: 240 6% 93%;
    --foreground: 240 8% 8%;
    --card: 0 0% 100%;
    --card-foreground: 240 8% 8%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 8% 8%;
    /* Professional blue-teal - softer and more refined */
    --primary: 200 85% 48%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 5% 96%;
    --secondary-foreground: 240 6% 10%;
    --muted: 240 4% 96%;
    --muted-foreground: 240 4% 40%;
    /* Refined accent colors - less vibrant, more professional */
    --accent: 217 88% 58%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 72% 55%;
    --destructive-foreground: 0 0% 98%;
    /* Soft borders for clean separation */
    --border: 240 5% 88%;
    --input: 240 5% 88%;
    --ring: 200 85% 48%;
    --radius: 0.75rem;
    /* Success and status colors - refined */
    --success: 142 70% 45%;
    --warning: 38 88% 52%;
    /* Professional chart colors - less vibrant */
    --chart-1: 200 85% 48%;
    --chart-2: 217 88% 58%;
    --chart-3: 271 78% 54%;
    --chart-4: 38 88% 52%;
    --chart-5: 199 85% 48%;
    /* Section-specific colors - refined and professional */
    --listening: 217 88% 58%;
    --reading: 200 85% 48%;
    --writing: 271 78% 54%;
    --speaking: 38 88% 52%;
  }

  .dark {
    /* Neutral, eye-friendly dark mode - lighter and less harsh */
    --background: 240 6% 10%;
    --foreground: 0 0% 95%;
    --card: 240 5% 13%;
    --card-foreground: 0 0% 95%;
    --popover: 240 5% 13%;
    --popover-foreground: 0 0% 95%;
    /* Professional blue-teal in dark mode - refined */
    --primary: 200 85% 52%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 4% 18%;
    --secondary-foreground: 0 0% 95%;
    --muted: 240 4% 18%;
    --muted-foreground: 240 5% 65%;
    --accent: 217 88% 62%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 65% 55%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 4% 22%;
    --input: 240 4% 22%;
    --ring: 200 85% 52%;
    --success: 142 70% 50%;
    --warning: 38 88% 55%;
    --chart-1: 200 85% 52%;
    --chart-2: 217 88% 62%;
    --chart-3: 271 78% 58%;
    --chart-4: 38 88% 55%;
    --chart-5: 199 85% 52%;
    --listening: 217 88% 62%;
    --reading: 200 85% 52%;
    --writing: 271 78% 58%;
    --speaking: 38 88% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    background: hsl(var(--background));
    background-attachment: fixed;
    font-size: 1rem; /* 16px base - professional standard */
    line-height: 1.7; /* Comfortable line height for readability */
    letter-spacing: -0.01em; /* Slightly tighter letter spacing for better flow */
  }
  .dark body {
    background: linear-gradient(
      to bottom,
      hsl(240 6% 10%) 0%,
      hsl(240 5% 12%) 100%
    );
    background-attachment: fixed;
  }
}

@layer utilities {
  /* Modern Card Utilities - Duolingo-inspired */
  
  /* Clean modern card with subtle shadows - refined */
  .card-modern {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 0.875rem;
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.04),
      0 2px 8px rgba(0, 0, 0, 0.03);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-modern:hover {
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.06),
      0 4px 12px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
    border-color: hsl(var(--primary) / 0.15);
  }

  /* Card hover effect */
  .card-hover {
    @apply card-modern;
  }

  /* Success badges */
  .badge-success {
    background: hsl(var(--success));
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* Progress bar */
  .progress-bar {
    height: 0.5rem;
    background: hsl(var(--muted));
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
    border-radius: 9999px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Statistics card */
  .stat-card {
    @apply card-modern;
    text-align: center;
    padding: 1.25rem;
  }

  .stat-card-number {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
  }

  .stat-card-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
    font-weight: 500;
  }

  /* Professional gradient utilities - refined */
  .gradient-primary {
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(200 85% 52%) 100%);
  }

  .gradient-listening {
    background: linear-gradient(135deg, hsl(var(--listening)) 0%, hsl(217 88% 62%) 100%);
  }

  .gradient-reading {
    background: linear-gradient(135deg, hsl(var(--reading)) 0%, hsl(200 85% 52%) 100%);
  }

  .gradient-writing {
    background: linear-gradient(135deg, hsl(var(--writing)) 0%, hsl(271 78% 58%) 100%);
  }

  .gradient-speaking {
    background: linear-gradient(135deg, hsl(var(--speaking)) 0%, hsl(38 88% 56%) 100%);
  }

  /* Text gradients - professional */
  .text-gradient-primary {
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(200 85% 52%) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .text-gradient-accent {
    background: linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(217 88% 62%) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Success and status text colors */
  .text-success {
    color: hsl(var(--success));
  }

  .text-warning {
    color: hsl(var(--warning));
  }

  /* Professional spacing utilities - optimized for better UX */
  .section-padding {
    @apply py-10 md:py-14;
  }

  .container-padding {
    @apply px-4 sm:px-6 lg:px-8;
  }

  /* Improved typography with better readability */
  .heading-1 {
    @apply text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .heading-2 {
    @apply text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .heading-3 {
    @apply text-2xl md:text-3xl font-semibold tracking-tight;
    line-height: 1.3;
  }

  /* Body text with improved line-height */
  .body-text {
    font-size: 1rem; /* 16px - professional standard */
    line-height: 1.7;
    color: hsl(var(--foreground) / 0.9);
  }
  
  /* Paragraph text - professional and readable */
  p {
    font-size: 1rem; /* 16px */
    line-height: 1.7;
    margin-bottom: 1.25rem;
  }

  /* Text balance utility */
  .text-balance {
    text-wrap: balance;
  }

  /* Modern card styling */
  .card-elevated {
    @apply card-modern rounded-xl;
  }

  /* Colorful accent utilities for playful design */
  .accent-listening {
    @apply text-chart-2;
  }

  .accent-reading {
    @apply text-chart-1;
  }

  .accent-writing {
    @apply text-chart-3;
  }

  .accent-speaking {
    @apply text-chart-4;
  }

  /* Refined hover effects */
  .hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.06),
      0 4px 16px rgba(0, 0, 0, 0.05);
  }

  /* Professional button utilities - refined */
  .btn-primary {
    @apply gradient-primary text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99];
  }

  .btn-secondary {
    @apply border border-primary/30 bg-background text-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/8 hover:border-primary/50 transition-all duration-200;
  }

  /* Colorful badge styles */
  .badge-primary {
    @apply bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold;
  }

  .badge-accent {
    @apply bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full text-xs font-semibold;
  }

  /* Playful icon containers */
  .icon-container-primary {
    @apply gradient-primary rounded-xl p-3 shadow-md;
  }

  .icon-container-accent {
    @apply gradient-listening rounded-xl p-3 shadow-md;
  }

  /* Consistent animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
    animation-fill-mode: both;
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Smooth transitions for interactive elements */
  .transition-smooth {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .transition-fast {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Utility classes for removed inline styles */
  .logo-max-width {
    max-width: 140px;
  }

  .progress-bar-width-0 {
    width: 0%;
  }

  .progress-bar-width-10 {
    width: 10%;
  }
}




================================================
FILE: app/layout.tsx
================================================
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WebsiteSchema } from "@/components/seo/website-schema";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freecelpiptest.com"),
  title: {
    default: "FreeCELPIPTest - CELPIP Practice Tests & Expert Tips",
    template: "%s | FreeCELPIPTest",
  },
  description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
  keywords: ["CELPIP", "CELPIP test", "CELPIP practice", "CELPIP preparation", "free CELPIP", "CELPIP listening", "CELPIP reading", "CELPIP writing", "CELPIP speaking"],
  authors: [{ name: "FreeCELPIPTest" }],
  creator: "FreeCELPIPTest",
  publisher: "FreeCELPIPTest",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any", type: "image/png" },
      { url: "/assets/logo-bg.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/logo-bg.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/assets/logo-bg.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freecelpiptest.com",
    siteName: "FreeCELPIPTest",
    title: "FreeCELPIPTest - Master CELPIP with Free Practice Tests",
    description: "Free CELPIP test preparation platform with practice tests and expert tips.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FreeCELPIPTest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeCELPIPTest - Master CELPIP with Free Practice Tests",
    description: "Free CELPIP test preparation platform with practice tests and expert tips.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://freecelpiptest.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <WebsiteSchema />
      </head>
      <body className={inter.variable}>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}




================================================
FILE: app/not-found.tsx
================================================
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="whitespace-nowrap">
        <Link href="/" className="flex items-center">
          <Home className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>Go Home</span>
        </Link>
      </Button>
    </div>
  )
}




================================================
FILE: app/robots.ts
================================================
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: 'https://freecelpiptest.com/sitemap.xml',
  }
}




================================================
FILE: app/sitemap.ts
================================================
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://freecelpiptest.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/practice/listening`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/practice/reading`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/practice/writing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/practice/speaking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mock-tests`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/getting-started`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-celpip`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}




================================================
FILE: app/(main)/layout.tsx
================================================
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SessionProvider } from "@/components/providers/session-provider"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  )
}




================================================
FILE: app/(main)/page.tsx
================================================
import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero-section"
import { ValueProposition } from "@/components/sections/value-proposition"
import { AboutContent } from "@/components/sections/about-content"
import { OrganizationSchema } from "@/components/seo/organization-schema"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

// Lazy load FeaturedBlog to reduce initial bundle
const FeaturedBlogLazy = dynamic(() => import("@/components/sections/featured-blog").then(mod => ({ default: mod.FeaturedBlog })), {
  loading: () => <div className="section-padding"><div className="container mx-auto container-padding"><div className="h-64" /></div></div>,
  ssr: true
})

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <div className="flex flex-col">
        <HeroSection />
        <ValueProposition />
        <AboutContent />
        <FeaturedBlogLazy />
      </div>
    </>
  )
}




================================================
FILE: app/(main)/about-celpip/page.tsx
================================================
import { redirect } from "next/navigation"

export default function AboutCELPIPPage() {
  redirect("/resources#understanding-celpip")
}



================================================
FILE: app/(main)/blog/page.tsx
================================================
import { Suspense } from "react"
import { getAllBlogPosts } from "@/lib/blog"
import { BlogListing } from "@/components/blog/blog-listing"
import { BlogListingSkeleton } from "@/components/blog/blog-listing-skeleton"

export const metadata = {
  title: "CELPIP Study Tips & Blog | FreeCELPIPTest",
  description: "Expert CELPIP study tips, strategies, and guides for all test sections. Learn from proven techniques to improve your score.",
  alternates: {
    canonical: "/blog",
  },
}

// Revalidate every hour for new blog posts
export const revalidate = 3600

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <Suspense fallback={<BlogListingSkeleton />}>
      <BlogListing posts={posts} />
    </Suspense>
  )
}




================================================
FILE: app/(main)/blog/[slug]/page.tsx
================================================
import { notFound } from "next/navigation"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog"
import { BlogPostView } from "@/components/blog/blog-post-view"

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const keywords = post.keywords || post.tags || []
  const coverImage = post.coverImage || post.featuredImage || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://freecelpiptest.com'}/images/blog/default-cover.jpg`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecelpiptest.com'

  return {
    title: `${post.title} | FreeCELPIPTest Blog`,
    description: post.excerpt,
    keywords: keywords.join(', '),
    authors: [{ name: post.author || 'FreeCELPIPTest' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'FreeCELPIPTest'],
      tags: keywords,
      images: [
        {
          url: coverImage.startsWith('http') ? coverImage : `${siteUrl}${coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'FreeCELPIPTest',
      url: `${siteUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [coverImage.startsWith('http') ? coverImage : `${siteUrl}${coverImage}`],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllBlogPosts()
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3)

  return <BlogPostView post={post} relatedPosts={relatedPosts} />
}




================================================
FILE: app/(main)/celpip-score-calculator/page.tsx
================================================
import { Metadata } from "next"
import { CELPIPScoreCalculator } from "@/components/tools/celpip-score-calculator"

export const metadata: Metadata = {
  title: "CELPIP Score Calculator | FreeCELPIPTest",
  description: "Calculate your CELPIP score and see how it maps to Canadian Language Benchmark (CLB) levels. Get an estimate of your overall CELPIP score.",
  keywords: ["CELPIP score calculator", "CLB calculator", "CELPIP score", "CELPIP test score"],
  alternates: {
    canonical: "/celpip-score-calculator",
  },
}

export default function CELPIPScoreCalculatorPage() {
  return <CELPIPScoreCalculator />
}




================================================
FILE: app/(main)/contact/page.tsx
================================================
import { ContactPage } from "@/components/sections/contact-page"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | FreeCELPIPTest",
  description: "Get in touch with us. Have questions about CELPIP preparation? We're here to help!",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPageRoute() {
  return <ContactPage />
}




================================================
FILE: app/(main)/getting-started/page.tsx
================================================
import { redirect } from "next/navigation"

export default function GettingStartedPage() {
  redirect("/resources#get-started")
}



================================================
FILE: app/(main)/mock-tests/page.tsx
================================================
import { ComingSoon } from "@/components/ui/coming-soon"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CELPIP Mock Tests | Full-Length Practice Tests - Coming Soon",
  description: "Full-length CELPIP mock tests to simulate the real exam experience. Practice all 4 sections in one complete test with realistic timing and scoring. Coming soon!",
  keywords: [
    "CELPIP mock tests",
    "CELPIP full-length practice",
    "CELPIP exam simulation",
    "CELPIP practice exam",
    "complete CELPIP test",
    "CELPIP test practice",
    "CELPIP sample test",
  ],
  openGraph: {
    title: "CELPIP Mock Tests | Full-Length Practice - Coming Soon",
    description: "Full-length CELPIP mock tests to simulate the real exam. Practice all sections with realistic timing and scoring.",
    type: "website",
  },
  alternates: {
    canonical: "/mock-tests",
  },
}

export default function MockTestsPage() {
  return (
    <ComingSoon
      title="CELPIP Mock Tests - Coming Soon"
      description="We're developing full-length CELPIP mock tests that simulate the complete exam experience. These comprehensive tests will help you practice all four sections in one sitting, just like the real test."
      features={[
        "Full-length tests covering all 4 sections",
        "Realistic test timing and format",
        "Complete exam simulation experience",
        "Detailed score reports and feedback",
        "Performance analysis by section",
        "Practice under real test conditions",
      ]}
      showNewsletter={true}
      relatedLinks={[
        {
          name: "Practice Tests",
          href: "/practice",
          description: "Practice individual sections with sample questions",
        },
        {
          name: "Study Resources",
          href: "/blog",
          description: "Access study guides, tips, and strategies",
        },
        {
          name: "Test Format Guide",
          href: "/resources#understanding-celpip",
          description: "Learn about CELPIP test structure and format",
        },
      ]}
    />
  )
}




================================================
FILE: app/(main)/practice/page.tsx
================================================
import { PracticeTestsLanding } from "@/components/practice/practice-tests-landing"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CELPIP Practice Tests | Free CELPIP Practice Questions & Exercises",
  description: "Free CELPIP practice tests for Listening, Reading, Writing, and Speaking sections. Practice with sample questions, exercises, and study guides to prepare for your CELPIP test.",
  keywords: [
    "CELPIP practice tests",
    "CELPIP practice questions",
    "free CELPIP practice",
    "CELPIP listening practice",
    "CELPIP reading practice",
    "CELPIP writing practice",
    "CELPIP speaking practice",
    "CELPIP test preparation",
    "CELPIP study materials",
  ],
  openGraph: {
    title: "CELPIP Practice Tests | FreeCELPIPTest",
    description: "Free CELPIP practice tests for all 4 sections. Practice with sample questions and exercises to prepare for your test.",
    type: "website",
  },
  alternates: {
    canonical: "/practice",
  },
}

export default function PracticeTestsPage() {
  return <PracticeTestsLanding />
}




================================================
FILE: app/(main)/practice/[section]/page.tsx
================================================
import { notFound } from "next/navigation"
import { PracticeSectionTasks } from "@/components/practice/practice-section-tasks"
import type { Metadata } from "next"

const validSections = ["listening", "reading", "writing", "speaking"]

const sectionConfig: Record<
  string,
  {
    name: string
    description: string
  }
> = {
  listening: {
    name: "Listening",
    description: "Practice listening comprehension with audio recordings and questions.",
  },
  reading: {
    name: "Reading",
    description: "Improve your reading skills with passages and comprehension questions.",
  },
  writing: {
    name: "Writing",
    description: "Master email and essay writing with guided practice exercises.",
  },
  speaking: {
    name: "Speaking",
    description: "Improve your speaking fluency and pronunciation with practice tasks.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section: sectionParam } = await params
  const section = sectionParam.toLowerCase()
  if (!validSections.includes(section)) {
    return { title: "Section Not Found" }
  }

  const sectionName = sectionConfig[section].name

  return {
    title: `CELPIP ${sectionName} Practice Tests | Free ${sectionName} Practice Questions`,
    description: `Practice CELPIP ${sectionName} section with realistic questions, exercises, and detailed feedback.`,
    keywords: [
      `CELPIP ${sectionName.toLowerCase()} practice`,
      `CELPIP ${sectionName.toLowerCase()} test`,
      `free ${sectionName.toLowerCase()} practice`,
      `CELPIP ${sectionName.toLowerCase()} questions`,
      `CELPIP ${sectionName.toLowerCase()} exercises`,
    ],
    openGraph: {
      title: `CELPIP ${sectionName} Practice | FreeCELPIPTest`,
      description: `Practice CELPIP ${sectionName} section with realistic questions and detailed feedback.`,
      type: "website",
    },
    alternates: {
      canonical: `/practice/${section}`,
    },
  }
}

export default async function PracticeSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionParam } = await params
  const section = sectionParam.toLowerCase()

  if (!validSections.includes(section)) {
    notFound()
  }

  return <PracticeSectionTasks section={section} />
}




================================================
FILE: app/(main)/privacy/page.tsx
================================================
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | FreeCELPIPTest",
  description: "Privacy Policy for FreeCELPIPTest. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14 max-w-4xl">
      <div className="mb-8">
        <h1 className="heading-2 mb-4 text-gradient-primary">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-foreground 
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:scroll-mt-20 prose-h1:leading-tight
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:scroll-mt-20 prose-h2:leading-tight
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:scroll-mt-20 prose-h3:leading-tight
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
        prose-li:mb-2 prose-li:text-foreground/90 prose-li:leading-relaxed">
        
        <h2>1. Introduction</h2>
        <p>
          FreeCELPIPTest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website freecelpiptest.com (the "Service").
        </p>
        <p>
          By using our Service, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2>2. Information We Collect</h2>
        
        <h3>2.1 Information You Provide</h3>
        <ul>
          <li>Account information (name, email address) when you sign up using Google OAuth</li>
          <li>Newsletter subscription email addresses</li>
          <li>Feedback and contact form submissions</li>
          <li>Any other information you voluntarily provide</li>
        </ul>

        <h3>2.2 Automatically Collected Information</h3>
        <ul>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>IP address</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our Service</li>
          <li>To send you newsletters and updates (with your consent)</li>
          <li>To respond to your inquiries and provide customer support</li>
          <li>To improve our website and user experience</li>
          <li>To analyze usage patterns and trends</li>
          <li>To detect and prevent fraud or abuse</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          We use third-party services that may collect information used to identify you:
        </p>
        <ul>
          <li><strong>Google OAuth:</strong> For authentication. Please review Google's Privacy Policy.</li>
          <li><strong>Analytics:</strong> We may use analytics services to understand website usage.</li>
          <li><strong>Hosting:</strong> Our website is hosted on third-party servers that may process your data.</li>
        </ul>

        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal information</li>
          <li>Opt-out of marketing communications</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>
          Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>

        <h2>9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <p>
          <Link href="/contact">Through our contact form</Link>
        </p>
      </div>
    </div>
  )
}




================================================
FILE: app/(main)/resources/page.tsx
================================================
import type { Metadata } from "next"
import { StudyResources } from "@/components/sections/study-resources"

export const metadata: Metadata = {
  title: "CELPIP Study Resources | FreeCELPIPTest",
  description: "Download free CELPIP study guides, vocabulary lists, tips, and strategies to help you prepare for your test.",
  alternates: {
    canonical: "/resources",
  },
}

export default function ResourcesPage() {
  return <StudyResources />
}




================================================
FILE: app/(main)/terms/page.tsx
================================================
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | FreeCELPIPTest",
  description: "Terms of Service for FreeCELPIPTest. Read our terms and conditions for using our CELPIP test preparation platform.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14 max-w-4xl">
      <div className="mb-8">
        <h1 className="heading-2 mb-4 text-gradient-primary">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-foreground 
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:scroll-mt-20 prose-h1:leading-tight
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:scroll-mt-20 prose-h2:leading-tight
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:scroll-mt-20 prose-h3:leading-tight
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
        prose-li:mb-2 prose-li:text-foreground/90 prose-li:leading-relaxed">
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using FreeCELPIPTest ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
        </p>

        <h2>2. Disclaimer</h2>
        <p>
          <strong>Important:</strong> FreeCELPIPTest is NOT affiliated with, endorsed by, or connected to CELPIP (Canadian English Language Proficiency Index Program) or Paragon Testing Enterprises. We are an independent educational resource providing practice materials and study guides.
        </p>
        <ul>
          <li>Our practice materials are for educational purposes only</li>
          <li>We do not guarantee that our practice tests reflect the exact format or difficulty of the official CELPIP test</li>
          <li>Test scores and results from our practice materials are not official and should not be used as a guarantee of actual test performance</li>
          <li>We are not responsible for any decisions made based on information from our website</li>
        </ul>

        <h2>3. Use of Service</h2>
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul>
          <li>Use the Service in any way that violates any applicable law or regulation</li>
          <li>Attempt to gain unauthorized access to any portion of the Service</li>
          <li>Reproduce, duplicate, copy, or sell any portion of the Service without permission</li>
          <li>Use automated systems (bots, scrapers) to access the Service</li>
          <li>Interfere with or disrupt the Service or servers connected to the Service</li>
          <li>Transmit any viruses, malware, or other harmful code</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are owned by FreeCELPIPTest and are protected by international copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may not modify, reproduce, distribute, create derivative works, publicly display, or commercially exploit any content from the Service without our express written permission.
        </p>

        <h2>5. User Accounts</h2>
        <p>
          When you create an account using Google OAuth, you are responsible for:
        </p>
        <ul>
          <li>Maintaining the security of your account</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, FreeCELPIPTest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including:
        </p>
        <ul>
          <li>Loss of profits, data, or other intangible losses</li>
          <li>Damages resulting from your use or inability to use the Service</li>
          <li>Any errors or omissions in the content</li>
          <li>Any decisions made based on information from our Service</li>
        </ul>

        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after changes become effective constitutes acceptance of the new terms.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.
        </p>

        <h2>10. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <p>
          <Link href="/contact">Through our contact form</Link>
        </p>
      </div>
    </div>
  )
}




================================================
FILE: app/(main)/testimonials/page.tsx
================================================
import type { Metadata } from "next"
import { ComingSoon } from "@/components/ui/coming-soon"

export const metadata: Metadata = {
  title: "Testimonials Coming Soon | FreeCELPIPTest",
  description: "Student testimonials and success stories will be added soon. Check back later!",
  alternates: {
    canonical: "/testimonials",
  },
}

export default function TestimonialsPageRoute() {
  return (
    <ComingSoon
      title="Testimonials Coming Soon"
      description="We'll be adding real student testimonials and success stories once we have verified feedback from CELPIP test takers."
      showNewsletter={false}
    />
  )
}




================================================
FILE: app/(main)/vocabulary-level-grader/page.tsx
================================================
import { Metadata } from "next"
import { VocabularyLevelGrader } from "@/components/tools/vocabulary-level-grader"

export const metadata: Metadata = {
  title: "Vocabulary Level Grader | FreeCELPIPTest",
  description: "Test your English vocabulary level and see how it compares to CELPIP requirements. Get personalized recommendations for improvement.",
  keywords: ["vocabulary test", "vocabulary level", "CELPIP vocabulary", "English vocabulary test"],
  alternates: {
    canonical: "/vocabulary-level-grader",
  },
}

export default function VocabularyLevelGraderPage() {
  return <VocabularyLevelGrader />
}




================================================
FILE: app/admin/layout.tsx
================================================
import { requireAdmin } from '@/lib/admin';
import Link from 'next/link';
import { Home, Mail, MessageSquare, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Admin Portal</h1>
              <p className='text-sm text-muted-foreground'>
                Welcome, {session.user?.name || session.user?.email}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link href='/'>
                  <Home className='mr-2 h-4 w-4' />
                  Back to Site
                </Link>
              </Button>
              <form action='/api/auth/signout' method='post'>
                <Button variant='outline' size='sm' type='submit'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Sidebar */}
          <aside className='space-y-2'>
            <Link
              href='/admin'
              className='flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent'
            >
              <Mail className='h-4 w-4' />
              Newsletter Subscribers
            </Link>
            <Link
              href='/admin/feedback'
              className='flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent'
            >
              <MessageSquare className='h-4 w-4' />
              Feedback
            </Link>
          </aside>

          {/* Main Content */}
          <main className='md:col-span-3'>{children}</main>
        </div>
      </div>
    </div>
  );
}



================================================
FILE: app/admin/page.tsx
================================================
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then((res) => res.json())
      .then((data) => {
        setSubscribers(data.subscribers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch subscribers:', err);
        setLoading(false);
      });
  }, []);

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Subscribed At'],
      ...subscribers.map((s) => [
        s.email,
        new Date(s.subscribedAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Newsletter Subscribers</CardTitle>
            <CardDescription>
              {subscribers.length} total subscriber
              {subscribers.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} size='sm' variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {subscribers.length === 0 ? (
          <p className='text-center text-muted-foreground py-8'>
            No subscribers yet.
          </p>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className='font-medium'>
                      {subscriber.email}
                    </TableCell>
                    <TableCell>
                      {new Date(subscriber.subscribedAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant='success'>Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



================================================
FILE: app/admin/feedback/page.tsx
================================================
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Loader2, Star } from 'lucide-react';

interface Feedback {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  category: string;
  createdAt: string;
  status: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/feedback')
      .then((res) => res.json())
      .then((data) => {
        setFeedback(data.feedback || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch feedback:', err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setFeedback((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item)),
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Message', 'Rating', 'Category', 'Status', 'Date'],
      ...feedback.map((f) => [
        f.name || 'Anonymous',
        f.email || 'N/A',
        `"${f.message.replace(/"/g, '""')}"`,
        f.rating || 'N/A',
        f.category,
        f.status,
        new Date(f.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>User Feedback</CardTitle>
            <CardDescription>
              {feedback.length} total feedback submission
              {feedback.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} size='sm' variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {feedback.length === 0 ? (
          <p className='text-center text-muted-foreground py-8'>
            No feedback submissions yet.
          </p>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className='max-w-md'>Message</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>
                      {item.name || 'Anonymous'}
                    </TableCell>
                    <TableCell>{item.email || 'N/A'}</TableCell>
                    <TableCell className='max-w-md'>
                      <div className='truncate' title={item.message}>
                        {item.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.rating ? (
                        <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span>{item.rating}</span>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.status}
                        onValueChange={(value) => updateStatus(item.id, value)}
                      >
                        <SelectTrigger className='w-[140px]'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='new'>New</SelectItem>
                          <SelectItem value='in-progress'>
                            In Progress
                          </SelectItem>
                          <SelectItem value='resolved'>Resolved</SelectItem>
                          <SelectItem value='archived'>Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



================================================
FILE: app/api/admin/feedback/route.ts
================================================
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()

        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const feedback = await prisma.feedback.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json({ feedback })
    } catch (error) {
        console.error("Error fetching feedback:", error)
        return NextResponse.json(
            { error: "Failed to fetch feedback" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth()

        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, status } = await request.json()

        const updated = await prisma.feedback.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json({ feedback: updated })
    } catch (error) {
        console.error("Error updating feedback:", error)
        return NextResponse.json(
            { error: "Failed to update feedback" },
            { status: 500 }
        )
    }
}



================================================
FILE: app/api/admin/newsletter/route.ts
================================================
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()

        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const subscribers = await prisma.newsletter.findMany({
            orderBy: {
                subscribedAt: "desc",
            },
        })

        return NextResponse.json({ subscribers })
    } catch (error) {
        console.error("Error fetching newsletter subscribers:", error)
        return NextResponse.json(
            { error: "Failed to fetch subscribers" },
            { status: 500 }
        )
    }
}



================================================
FILE: app/api/auth/[...nextauth]/route.ts
================================================
import { handlers } from "@/lib/auth"

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const { GET, POST } = handlers




================================================
FILE: app/api/feedback/route.ts
================================================
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  message: z.string().min(1, "Message is required"),
  rating: z.number().min(1).max(5).optional().nullable(),
  category: z.string().default("general"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = feedbackSchema.parse(body)

    // Save feedback to database
    await prisma.feedback.create({
      data: {
        name: validated.name || null,
        email: validated.email || null,
        message: validated.message,
        rating: validated.rating || null,
        category: validated.category,
        status: "new",
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your feedback! We appreciate your input." 
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Feedback submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    )
  }
}




================================================
FILE: app/api/health/route.ts
================================================
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Basic health check
        return NextResponse.json(
            {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 503 }
        )
    }
}



================================================
FILE: app/api/newsletter/route.ts
================================================
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = newsletterSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "Email already subscribed" },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { active: true },
        })
        return NextResponse.json({ message: "Successfully resubscribed" })
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email,
        active: true,
      },
    })

    return NextResponse.json({ message: "Successfully subscribed" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}




================================================
FILE: app/dashboard/layout.tsx
================================================
export const dynamic = "force-dynamic"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}




================================================
FILE: app/dashboard/page.tsx
================================================
"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { Bookmark, Bell, Settings, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/")
    }
  }, [status])

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user?.name || "User"}!
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="saved">Saved Articles</TabsTrigger>
          <TabsTrigger value="progress">Test Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">Overall completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Articles</CardTitle>
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Bookmarked posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Enabled</div>
                <p className="text-xs text-muted-foreground">Mock test alerts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">Since joining</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your CELPIP preparation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <a href="/practice">Start Practice Test</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/blog">Read Study Tips</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/getting-started">View Getting Started Guide</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Articles</CardTitle>
              <CardDescription>Your bookmarked blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                No saved articles yet. Start bookmarking posts you find helpful!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Progress</CardTitle>
              <CardDescription>Track your progress across all test sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Listening", "Reading", "Writing", "Speaking"].map((section) => (
                <div key={section} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{section}</span>
                    <span>0%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mock Test Launch</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when full mock tests are available
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Blog Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about new blog posts
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}




================================================
FILE: azure/README.md
================================================
# Azure Deployment (AKS + azd)

This folder contains all Azure infrastructure and deployment assets for FreeCELPIPTest. It is designed for production deployment on AKS using Azure Developer CLI (azd).

## What Lives Here

- Infrastructure as code (Bicep)
- Helm chart for AKS
- Deployment scripts for cluster add-ons
- Production Dockerfile
- Legacy Azure deployment notes (for reference)

## Quick Start (azd)

From repo root:

```bash
azd auth login
azd env new dev
azd up
```

Note: `azd` reads the root [azure.yaml](../azure.yaml), which points to the assets in this folder.

## Folder Layout

```
azure/
├── infra/                # Bicep templates and modules
├── helm/freecelpip/      # Helm chart
├── scripts/              # Setup and post-deploy helpers
├── Dockerfile.production # Production image
└── legacy-docs/          # Older Azure guides (archived)
```

## Scripts

- `scripts/azure-init.sh` - Interactive environment setup
- `scripts/setup-k8s-addons.sh` - Installs ingress-nginx + cert-manager
- `scripts/post-deploy.sh` - Post-deployment checks and helpers

## CI/CD

The GitHub Actions workflow remains in `.github/workflows/` at repo root because GitHub only runs workflows from that path.

## Legacy Azure Docs

Older guides have been archived in `azure/legacy-docs/` for reference.



================================================
FILE: azure/Dockerfile.production
================================================
# Multi-stage Dockerfile for Next.js standalone production build
# Target image size: ~150MB

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install ALL dependencies (needed for build with tailwindcss plugins)
RUN npm ci && \
    npm cache clean --force

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy application source
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application (standalone mode)
RUN npm run build

# Stage 3: Clean and Production
FROM node:20-alpine AS prune
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Optional: prune production-only dependencies for final image
RUN npm prune --omit=dev

# Stage 4: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    openssl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=prune /app/node_modules ./node_modules
RUN mkdir -p ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create content directory for MDX files
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]



================================================
FILE: azure/helm/freecelpip/Chart.yaml
================================================
apiVersion: v2
name: freecelpip
description: A Helm chart for FreeCelpip Next.js application on Azure AKS
type: application
version: 1.0.0
appVersion: "1.0.0"
keywords:
  - nextjs
  - education
  - celpip
maintainers:
  - name: FreeCelpip Team
home: https://freecelpiptest.com
sources:
  - https://github.com/yourusername/freecelpip



================================================
FILE: azure/helm/freecelpip/values.yaml
================================================
# Default values for freecelpip
# This is a YAML-formatted file.

replicaCount: 1

image:
  repository: "" # Will be set by AZD
  pullPolicy: IfNotPresent
  tag: "latest"

imagePullSecrets: []
nameOverride: ""
fullnameOverride: "freecelpip"

serviceAccount:
  create: true
  annotations: {}
  name: "freecelpip-sa"

podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "3000"
  prometheus.io/path: "/api/metrics"

podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1001
  fsGroup: 1001

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
    - ALL
  readOnlyRootFilesystem: false

service:
  type: ClusterIP
  port: 80
  targetPort: 3000
  annotations: {}

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
  hosts:
    - host: freecelpiptest.com
      paths:
        - path: /
          pathType: Prefix
    - host: www.freecelpiptest.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: freecelpip-tls
      hosts:
        - freecelpiptest.com
        - www.freecelpiptest.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 256Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 3
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
              - key: app
                operator: In
                values:
                  - freecelpip
          topologyKey: kubernetes.io/hostname

livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 20
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3

# Environment variables
env:
  NODE_ENV: production
  NEXT_TELEMETRY_DISABLED: "1"
  PORT: "3000"

# Admin email (set via --set in CI/CD)
adminEmail: ""

# Secrets from Azure Key Vault
keyVault:
  enabled: true
  name: "" # Will be set by deployment
  tenantId: "" # Will be set by deployment
  clientId: "" # Will be set by deployment
  secrets:
    - name: DATABASE_URL
      key: DATABASE-URL
    - name: GOOGLE_CLIENT_ID
      key: GOOGLE-CLIENT-ID
    - name: GOOGLE_CLIENT_SECRET
      key: GOOGLE-CLIENT-SECRET
    - name: NEXTAUTH_SECRET
      key: NEXTAUTH-SECRET
    - name: NEXTAUTH_URL
      value: "https://freecelpiptest.com"
    - name: APPLICATIONINSIGHTS_CONNECTION_STRING
      key: APPLICATIONINSIGHTS-CONNECTION-STRING

# Rolling update strategy
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0

# Pod disruption budget for high availability
podDisruptionBudget:
  enabled: true
  minAvailable: 1



================================================
FILE: azure/helm/freecelpip/templates/_helpers.tpl
================================================
{{/*
Expand the name of the chart.
*/}}
{{- define "freecelpip.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "freecelpip.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "freecelpip.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "freecelpip.labels" -}}
helm.sh/chart: {{ include "freecelpip.chart" . }}
{{ include "freecelpip.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "freecelpip.selectorLabels" -}}
app.kubernetes.io/name: {{ include "freecelpip.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app: freecelpip
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "freecelpip.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "freecelpip.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}



================================================
FILE: azure/helm/freecelpip/templates/deployment.yaml
================================================
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "freecelpip.fullname" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "freecelpip.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  strategy:
    {{- toYaml .Values.strategy | nindent 4 }}
  selector:
    matchLabels:
      {{- include "freecelpip.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
        rollme: {{ randAlphaNum 5 | quote }}
      labels:
        {{- include "freecelpip.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "freecelpip.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
      - name: {{ .Chart.Name }}
        securityContext:
          {{- toYaml .Values.securityContext | nindent 12 }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: 3000
          protocol: TCP
        livenessProbe:
          {{- toYaml .Values.livenessProbe | nindent 12 }}
        readinessProbe:
          {{- toYaml .Values.readinessProbe | nindent 12 }}
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
        env:
        {{- range $key, $value := .Values.env }}
        - name: {{ $key }}
          value: {{ $value | quote }}
        {{- end }}
        {{- if .Values.adminEmail }}
        - name: ADMIN_EMAIL
          value: {{ .Values.adminEmail | quote }}
        {{- end }}
        {{- if .Values.keyVault.enabled }}
        {{- range .Values.keyVault.secrets }}
        - name: {{ .name }}
          {{- if .value }}
          value: {{ .value | quote }}
          {{- else if .key }}
          valueFrom:
            secretKeyRef:
              name: {{ include "freecelpip.fullname" $ }}-kv-secrets
              key: {{ .name }}
          {{- else }}
          value: ""
          {{- end }}
        {{- end }}
        {{- end }}
        {{- if .Values.keyVault.enabled }}
        volumeMounts:
        - name: secrets-store
          mountPath: "/mnt/secrets-store"
          readOnly: true
        {{- end }}
      {{- if .Values.keyVault.enabled }}
      volumes:
      - name: secrets-store
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: {{ include "freecelpip.fullname" . }}-keyvault
      {{- end }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}



================================================
FILE: azure/helm/freecelpip/templates/hpa.yaml
================================================
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "freecelpip.fullname" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "freecelpip.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "freecelpip.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
    {{- end }}
    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
    {{- end }}
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 2
        periodSeconds: 15
      selectPolicy: Max
{{- end }}



================================================
FILE: azure/helm/freecelpip/templates/ingress.yaml
================================================
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "freecelpip.fullname" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "freecelpip.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if .Values.ingress.className }}
  ingressClassName: {{ .Values.ingress.className }}
  {{- end }}
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "freecelpip.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
{{- end }}



================================================
FILE: azure/helm/freecelpip/templates/pdb.yaml
================================================
{{- if .Values.podDisruptionBudget.enabled }}
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ include "freecelpip.fullname" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "freecelpip.labels" . | nindent 4 }}
spec:
  minAvailable: {{ .Values.podDisruptionBudget.minAvailable }}
  selector:
    matchLabels:
      {{- include "freecelpip.selectorLabels" . | nindent 6 }}
{{- end }}



================================================
FILE: azure/helm/freecelpip/templates/secretproviderclass.yaml
================================================
{{- if .Values.keyVault.enabled }}
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: {{ include "freecelpip.fullname" . }}-keyvault
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "freecelpip.labels" . | nindent 4 }}
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: {{ .Values.keyVault.clientId | default "" | quote }}
    keyvaultName: {{ .Values.keyVault.name | quote }}
    tenantId: {{ .Values.keyVault.tenantId | quote }}
    objects: |
      array:
        {{- range .Values.keyVault.secrets }}
        {{- if .key }}
        - |
          objectName: {{ .key | quote }}
          objectType: secret
          objectAlias: {{ .name | quote }}
        {{- end }}
        {{- end }}
  secretObjects:
  - secretName: {{ include "freecelpip.fullname" . }}-kv-secrets
    type: Opaque
    data:
    {{- range .Values.keyVault.secrets }}
    {{- if .key }}
    - objectName: {{ .name | quote }}
      key: {{ .name | quote }}
    {{- end }}
    {{- end }}
{{- end }}



================================================
FILE: azure/helm/freecelpip/templates/secrets.yaml
================================================
# Note: Secrets are now managed via SecretProviderClass (secretproviderclass.yaml)
# This syncs secrets from Azure Key Vault using CSI driver
# The actual secrets are available at:
#   - As K8s Secret: {{ include "freecelpip.fullname" . }}-kv-secrets
#   - As mounted files: /mnt/secrets-store/<secret-name>



================================================
FILE: azure/helm/freecelpip/templates/service.yaml
================================================
apiVersion: v1
kind: Service
metadata:
  name: {{ include "freecelpip.fullname" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "freecelpip.labels" . | nindent 4 }}
  {{- with .Values.service.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
      protocol: TCP
      name: http
  selector:
    {{- include "freecelpip.selectorLabels" . | nindent 4 }}



================================================
FILE: azure/helm/freecelpip/templates/serviceaccount.yaml
================================================
{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "freecelpip.serviceAccountName" . }}
  namespace: {{ .Release.Namespace }}
  labels:
    {{- include "freecelpip.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end }}



================================================
FILE: azure/infra/abbreviations.json
================================================
{
    "resourcesResourceGroups": "rg-",
    "containerRegistryRegistries": "cr",
    "keyVaultVaults": "kv-",
    "managedIdentityUserAssignedIdentities": "id-",
    "operationalInsightsWorkspaces": "log-",
    "insightsComponents": "appi-",
    "containerServiceManagedClusters": "aks-",
    "networkVirtualNetworks": "vnet-",
    "networkNetworkSecurityGroups": "nsg-",
    "networkApplicationGateways": "agw-",
    "networkPublicIPAddresses": "pip-",
    "dBforPostgreSQLServers": "psql-"
}


================================================
FILE: azure/infra/main.bicep
================================================
targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment (dev, staging, prod)')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = 'canadacentral'

@description('Resource group name suffix')
param resourceGroupName string = ''

@secure()
@description('PostgreSQL administrator password')
param postgresPassword string

@secure()
@description('Google OAuth Client ID')
param googleClientId string

@secure()
@description('Google OAuth Client Secret')
param googleClientSecret string

@secure()
@description('NextAuth Secret')
param nextAuthSecret string

@description('Domain name for the application')
param domainName string = 'freecelpiptest.com'

@description('Tags to apply to all resources')
param tags object = {}

// Resource group
var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var finalResourceGroupName = !empty(resourceGroupName)
  ? resourceGroupName
  : '${abbrs.resourcesResourceGroups}${environmentName}-${resourceToken}'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: finalResourceGroupName
  location: location
  tags: union(tags, {
    'azd-env-name': environmentName
  })
}

// Virtual Network Module
module vnet './modules/vnet.bicep' = {
  name: 'vnet-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    tags: tags
  }
}

// Azure Container Registry
module acr './modules/acr.bicep' = {
  name: 'acr-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    tags: tags
  }
}

// Azure Kubernetes Service
module aks './modules/aks.bicep' = {
  name: 'aks-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    subnetId: vnet.outputs.aksSubnetId
    tags: tags
  }
}

// PostgreSQL Flexible Server
module postgres './modules/postgres.bicep' = {
  name: 'postgres-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    administratorPassword: postgresPassword
    subnetId: vnet.outputs.databaseSubnetId
    privateDnsZoneId: vnet.outputs.postgresDnsZoneId
    tags: tags
  }
}

// Key Vault
module keyVault './modules/keyvault.bicep' = {
  name: 'keyvault-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    aksPrincipalId: aks.outputs.kubeletIdentityObjectId
    tags: tags
  }
}

// Application Insights
module appInsights './modules/appinsights.bicep' = {
  name: 'appinsights-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    tags: tags
  }
}

// Application Gateway
module appGateway './modules/appgateway.bicep' = {
  name: 'appgateway-deployment'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    subnetId: vnet.outputs.appGatewaySubnetId
    tags: tags
  }
}

// Store secrets in Key Vault
module secrets './modules/secrets.bicep' = {
  name: 'secrets-deployment'
  scope: rg
  params: {
    keyVaultName: keyVault.outputs.name
    postgresConnectionString: postgres.outputs.connectionString
    postgresPassword: postgresPassword
    googleClientId: googleClientId
    googleClientSecret: googleClientSecret
    nextAuthSecret: nextAuthSecret
    appInsightsConnectionString: appInsights.outputs.connectionString
  }
}

// Assign ACR pull role to AKS
module acrRoleAssignment './modules/acr-role.bicep' = {
  name: 'acr-role-assignment'
  scope: rg
  params: {
    acrName: acr.outputs.name
    aksKubeletIdentityObjectId: aks.outputs.kubeletIdentityObjectId
  }
}

// Outputs
output AZURE_LOCATION string = location
output AZURE_RESOURCE_GROUP string = rg.name
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = acr.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = acr.outputs.name
output AZURE_AKS_CLUSTER_NAME string = aks.outputs.name
output AZURE_KEY_VAULT_NAME string = keyVault.outputs.name
output AZURE_KEY_VAULT_ENDPOINT string = keyVault.outputs.endpoint
output AZURE_POSTGRES_HOST string = postgres.outputs.hostname
output AZURE_POSTGRES_DATABASE string = postgres.outputs.databaseName
output APPLICATIONINSIGHTS_CONNECTION_STRING string = appInsights.outputs.connectionString
output APP_GATEWAY_PUBLIC_IP string = appGateway.outputs.publicIpAddress



================================================
FILE: azure/infra/main.parameters.json
================================================
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "environmentName": {
            "value": "${AZURE_ENV_NAME}"
        },
        "location": {
            "value": "${AZURE_LOCATION=canadacentral}"
        },
        "postgresPassword": {
            "value": "${POSTGRES_PASSWORD}"
        },
        "googleClientId": {
            "value": "${GOOGLE_CLIENT_ID}"
        },
        "googleClientSecret": {
            "value": "${GOOGLE_CLIENT_SECRET}"
        },
        "nextAuthSecret": {
            "value": "${NEXTAUTH_SECRET}"
        }
    }
}


================================================
FILE: azure/infra/modules/acr-role.bicep
================================================
param acrName string
param aksKubeletIdentityObjectId string

resource acr 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' existing = {
  name: acrName
}

var acrPullRoleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')

resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, aksKubeletIdentityObjectId, acrPullRoleDefinitionId)
  scope: acr
  properties: {
    roleDefinitionId: acrPullRoleDefinitionId
    principalId: aksKubeletIdentityObjectId
    principalType: 'ServicePrincipal'
  }
}



================================================
FILE: azure/infra/modules/acr.bicep
================================================
param location string
param environmentName string
param resourceToken string
param tags object = {}

var abbrs = loadJsonContent('../abbreviations.json')
var acrName = '${abbrs.containerRegistryRegistries}${environmentName}${resourceToken}'

resource acr 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: acrName
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
    publicNetworkAccess: 'Enabled'
    networkRuleBypassOptions: 'AzureServices'
    policies: {
      quarantinePolicy: {
        status: 'disabled'
      }
      trustPolicy: {
        type: 'Notary'
        status: 'disabled'
      }
      retentionPolicy: {
        days: 7
        status: 'disabled'
      }
    }
    encryption: {
      status: 'disabled'
    }
    dataEndpointEnabled: false
  }
}

output id string = acr.id
output name string = acr.name
output loginServer string = acr.properties.loginServer



================================================
FILE: azure/infra/modules/aks.bicep
================================================
param location string
param environmentName string
param resourceToken string
param subnetId string
param tags object = {}

var abbrs = loadJsonContent('../abbreviations.json')
var aksName = '${abbrs.containerServiceManagedClusters}${environmentName}-${resourceToken}'

resource aks 'Microsoft.ContainerService/managedClusters@2023-10-01' = {
  name: aksName
  location: location
  tags: union(tags, {
    'azd-service-name': 'web'
  })
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    dnsPrefix: '${aksName}-dns'
    enableRBAC: true
    networkProfile: {
      networkPlugin: 'azure'
      networkPolicy: 'azure'
      serviceCidr: '10.1.0.0/16'
      dnsServiceIP: '10.1.0.10'
      loadBalancerSku: 'standard'
    }
    agentPoolProfiles: [
      {
        name: 'agentpool'
        count: 2
        vmSize: 'Standard_D2s_v3'
        osType: 'Linux'
        mode: 'System'
        vnetSubnetID: subnetId
        enableAutoScaling: true
        minCount: 2
        maxCount: 5
        maxPods: 50
        type: 'VirtualMachineScaleSets'
        availabilityZones: [
          '1'
          '2'
          '3'
        ]
      }
    ]
    oidcIssuerProfile: {
      enabled: true
    }
    securityProfile: {
      workloadIdentity: {
        enabled: true
      }
    }
    addonProfiles: {
      azureKeyvaultSecretsProvider: {
        enabled: true
        config: {
          enableSecretRotation: 'true'
          rotationPollInterval: '2m'
        }
      }
      omsagent: {
        enabled: false
      }
    }
  }
}

output id string = aks.id
output name string = aks.name
output kubeletIdentityObjectId string = aks.properties.identityProfile.kubeletidentity.objectId
output oidcIssuerUrl string = aks.properties.oidcIssuerProfile.issuerURL



================================================
FILE: azure/infra/modules/appgateway.bicep
================================================
param location string
param environmentName string
param resourceToken string
param subnetId string
param tags object = {}

var abbrs = loadJsonContent('../abbreviations.json')
var appGatewayName = '${abbrs.networkApplicationGateways}${environmentName}-${resourceToken}'
var publicIpName = '${abbrs.networkPublicIPAddresses}${environmentName}-${resourceToken}'

resource publicIp 'Microsoft.Network/publicIPAddresses@2023-04-01' = {
  name: publicIpName
  location: location
  tags: tags
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
    publicIPAddressVersion: 'IPv4'
    dnsSettings: {
      domainNameLabel: '${environmentName}-freecelpip-${resourceToken}'
    }
  }
}

resource appGateway 'Microsoft.Network/applicationGateways@2023-04-01' = {
  name: appGatewayName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'WAF_v2'
      tier: 'WAF_v2'
      capacity: 2
    }
    gatewayIPConfigurations: [
      {
        name: 'appGatewayIpConfig'
        properties: {
          subnet: {
            id: subnetId
          }
        }
      }
    ]
    frontendIPConfigurations: [
      {
        name: 'appGatewayFrontendIP'
        properties: {
          publicIPAddress: {
            id: publicIp.id
          }
        }
      }
    ]
    frontendPorts: [
      {
        name: 'port_80'
        properties: {
          port: 80
        }
      }
      {
        name: 'port_443'
        properties: {
          port: 443
        }
      }
    ]
    backendAddressPools: [
      {
        name: 'aksBackendPool'
        properties: {
          backendAddresses: []
        }
      }
    ]
    backendHttpSettingsCollection: [
      {
        name: 'appGatewayBackendHttpSettings'
        properties: {
          port: 80
          protocol: 'Http'
          cookieBasedAffinity: 'Disabled'
          requestTimeout: 30
          pickHostNameFromBackendAddress: false
        }
      }
    ]
    httpListeners: [
      {
        name: 'appGatewayHttpListener'
        properties: {
          frontendIPConfiguration: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendIPConfigurations', appGatewayName, 'appGatewayFrontendIP')
          }
          frontendPort: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendPorts', appGatewayName, 'port_80')
          }
          protocol: 'Http'
        }
      }
    ]
    requestRoutingRules: [
      {
        name: 'rule1'
        properties: {
          ruleType: 'Basic'
          priority: 100
          httpListener: {
            id: resourceId('Microsoft.Network/applicationGateways/httpListeners', appGatewayName, 'appGatewayHttpListener')
          }
          backendAddressPool: {
            id: resourceId('Microsoft.Network/applicationGateways/backendAddressPools', appGatewayName, 'aksBackendPool')
          }
          backendHttpSettings: {
            id: resourceId('Microsoft.Network/applicationGateways/backendHttpSettingsCollection', appGatewayName, 'appGatewayBackendHttpSettings')
          }
        }
      }
    ]
    webApplicationFirewallConfiguration: {
      enabled: true
      firewallMode: 'Prevention'
      ruleSetType: 'OWASP'
      ruleSetVersion: '3.2'
      disabledRuleGroups: []
      requestBodyCheck: true
      maxRequestBodySizeInKb: 128
      fileUploadLimitInMb: 100
    }
  }
}

output id string = appGateway.id
output name string = appGateway.name
output publicIpAddress string = publicIp.properties.ipAddress
output publicIpFqdn string = publicIp.properties.dnsSettings.fqdn



================================================
FILE: azure/infra/modules/appinsights.bicep
================================================
param location string
param environmentName string
param resourceToken string
param tags object = {}

var abbrs = loadJsonContent('../abbreviations.json')
var workspaceName = '${abbrs.operationalInsightsWorkspaces}${environmentName}-${resourceToken}'
var appInsightsName = '${abbrs.insightsComponents}${environmentName}-${resourceToken}'

resource workspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: workspaceName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspace.id
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

output id string = appInsights.id
output name string = appInsights.name
output instrumentationKey string = appInsights.properties.InstrumentationKey
output connectionString string = appInsights.properties.ConnectionString
output workspaceId string = workspace.id



================================================
FILE: azure/infra/modules/keyvault.bicep
================================================
param location string
param environmentName string
param resourceToken string
param aksPrincipalId string
param tags object = {}

var abbrs = loadJsonContent('../abbreviations.json')
var keyVaultName = '${abbrs.keyVaultVaults}${environmentName}-${resourceToken}'

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    enablePurgeProtection: true
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
  }
}

// Grant AKS access to secrets
var keyVaultSecretsUserRole = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')

resource aksKeyVaultAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, aksPrincipalId, keyVaultSecretsUserRole)
  scope: keyVault
  properties: {
    roleDefinitionId: keyVaultSecretsUserRole
    principalId: aksPrincipalId
    principalType: 'ServicePrincipal'
  }
}

output id string = keyVault.id
output name string = keyVault.name
output endpoint string = keyVault.properties.vaultUri



================================================
FILE: azure/infra/modules/postgres.bicep
================================================
param location string
param environmentName string
param resourceToken string
param subnetId string
param privateDnsZoneId string
@secure()
param administratorPassword string
param tags object = {}

var abbrs = loadJsonContent('../abbreviations.json')
var postgresName = '${abbrs.dBforPostgreSQLServers}${environmentName}-${resourceToken}'
var databaseName = 'freecelpip'
var administratorLogin = 'freecelpipAdmin'

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: postgresName
  location: location
  tags: tags
  sku: {
    name: 'Standard_D2s_v3'
    tier: 'GeneralPurpose'
  }
  properties: {
    version: '15'
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorPassword
    storage: {
      storageSizeGB: 128
      autoGrow: 'Enabled'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Enabled'
    }
    highAvailability: {
      mode: 'ZoneRedundant'
    }
    network: {
      delegatedSubnetResourceId: subnetId
      privateDnsZoneArmResourceId: privateDnsZoneId
    }
  }
}

resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgres
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// Allow Azure services
resource firewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = {
  parent: postgres
  name: 'AllowAllAzureServicesAndResourcesWithinAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

output id string = postgres.id
output name string = postgres.name
output hostname string = postgres.properties.fullyQualifiedDomainName
output databaseName string = databaseName
output connectionString string = 'postgresql://${administratorLogin}:${administratorPassword}@${postgres.properties.fullyQualifiedDomainName}:5432/${databaseName}?sslmode=require'



================================================
FILE: azure/infra/modules/secrets.bicep
================================================
param keyVaultName string
@secure()
param postgresConnectionString string
@secure()
param postgresPassword string
@secure()
param googleClientId string
@secure()
param googleClientSecret string
@secure()
param nextAuthSecret string
@secure()
param appInsightsConnectionString string

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' existing = {
  name: keyVaultName
}

resource databaseUrlSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'DATABASE-URL'
  properties: {
    value: postgresConnectionString
  }
}

resource postgresPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'POSTGRES-PASSWORD'
  properties: {
    value: postgresPassword
  }
}

resource googleClientIdSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'GOOGLE-CLIENT-ID'
  properties: {
    value: googleClientId
  }
}

resource googleClientSecretSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'GOOGLE-CLIENT-SECRET'
  properties: {
    value: googleClientSecret
  }
}

resource nextAuthSecretSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'NEXTAUTH-SECRET'
  properties: {
    value: nextAuthSecret
  }
}

resource appInsightsSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'APPLICATIONINSIGHTS-CONNECTION-STRING'
  properties: {
    value: appInsightsConnectionString
  }
}



================================================
FILE: azure/infra/modules/vnet.bicep
================================================
param location string
param environmentName string
param resourceToken string
param tags object = {}

var abbrs = loadJsonContent('../abbreviations.json')
var vnetName = '${abbrs.networkVirtualNetworks}${environmentName}-${resourceToken}'
var addressPrefix = '10.0.0.0/16'

resource nsg 'Microsoft.Network/networkSecurityGroups@2023-04-01' = {
  name: '${abbrs.networkNetworkSecurityGroups}${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    securityRules: [
      {
        name: 'AllowHTTPS'
        properties: {
          priority: 100
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '443'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
        }
      }
      {
        name: 'AllowHTTP'
        properties: {
          priority: 101
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '80'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
        }
      }
      {
        name: 'AllowAppGatewayV2HealthProbes'
        properties: {
          priority: 102
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '65200-65535'
          sourceAddressPrefix: 'Internet'
          destinationAddressPrefix: '*'
        }
      }
    ]
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2023-04-01' = {
  name: vnetName
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        addressPrefix
      ]
    }
    subnets: [
      {
        name: 'aks-subnet'
        properties: {
          addressPrefix: '10.0.0.0/20'
          privateEndpointNetworkPolicies: 'Disabled'
          privateLinkServiceNetworkPolicies: 'Disabled'
        }
      }
      {
        name: 'database-subnet'
        properties: {
          addressPrefix: '10.0.16.0/24'
          delegations: [
            {
              name: 'PostgreSQLFlexibleServerDelegation'
              properties: {
                serviceName: 'Microsoft.DBforPostgreSQL/flexibleServers'
              }
            }
          ]
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
      {
        name: 'appgateway-subnet'
        properties: {
          addressPrefix: '10.0.17.0/24'
          networkSecurityGroup: {
            id: nsg.id
          }
        }
      }
    ]
  }
}

// Private DNS Zone for PostgreSQL
resource postgresDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.postgres.database.azure.com'
  location: 'global'
  tags: tags
}

resource postgresDnsZoneLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: postgresDnsZone
  name: '${vnetName}-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

output vnetId string = vnet.id
output vnetName string = vnet.name
output aksSubnetId string = '${vnet.id}/subnets/aks-subnet'
output databaseSubnetId string = '${vnet.id}/subnets/database-subnet'
output appGatewaySubnetId string = '${vnet.id}/subnets/appgateway-subnet'
output postgresDnsZoneId string = postgresDnsZone.id



================================================
FILE: azure/legacy-docs/AZURE_DEPLOYMENT.md
================================================
# 🚀 Azure AKS Deployment Guide - FreeCelpip

Complete production deployment guide for FreeCelpip on Azure using Azure Developer CLI (azd), AKS, and DevOps best practices.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Domain Configuration](#domain-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Observability](#monitoring--observability)
- [Cost Estimation](#cost-estimation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
```bash
# Install Azure CLI
brew install azure-cli  # macOS
# or visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Install Azure Developer CLI
brew install azd  # macOS
# or: curl -fsSL https://aka.ms/install-azd.sh | bash

# Install kubectl
brew install kubectl

# Install Helm
brew install helm

# Install Docker
# Download from: https://www.docker.com/products/docker-desktop
```

### Azure Requirements
- Azure Subscription (pay-as-you-go or enterprise)
- Sufficient quota for:
  - 2-5 Standard_D2s_v3 VMs (AKS nodes)
  - Public IP addresses (2)
  - Azure Database for PostgreSQL Flexible Server

### GitHub Setup
- GitHub repository with admin access
- GitHub Actions enabled

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           Azure Front Door / App Gateway             │
│              (WAF + DDoS Protection)                 │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│         Azure Kubernetes Service (AKS)              │
│  ┌──────────────────────────────────────────────┐   │
│  │  NGINX Ingress Controller                    │   │
│  └──────────────┬───────────────────────────────┘   │
│                 │                                    │
│  ┌──────────────▼───────────────────────────────┐   │
│  │  Next.js Pods (2-10 replicas w/ HPA)        │   │
│  │  - CPU/Memory based auto-scaling             │   │
│  │  - Rolling updates (zero-downtime)           │   │
│  │  - Pod anti-affinity for HA                  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐  ┌───▼────┐  ┌───▼────────────┐
│  ACR   │  │Key Vault│  │  PostgreSQL    │
│(Images)│  │(Secrets)│  │  (HA Enabled)  │
└────────┘  └─────────┘  └────────────────┘
                 │
         ┌───────▼───────┐
         │App Insights + │
         │ Log Analytics │
         └───────────────┘
```

### Key Components
- **AKS**: Managed Kubernetes with 2-5 nodes, auto-scaling
- **ACR**: Private container registry with geo-replication
- **PostgreSQL**: Flexible Server, zone-redundant HA
- **Application Gateway**: Layer 7 load balancer with WAF
- **Key Vault**: Centralized secrets management
- **App Insights**: Application monitoring & analytics
- **Virtual Network**: Isolated network with private endpoints

---

## Quick Start

### 1. Install Azure Developer CLI
```bash
# macOS/Linux
curl -fsSL https://aka.ms/install-azd.sh | bash

# Windows
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"

# Verify installation
azd version
```

### 2. Clone and Initialize
```bash
cd /path/to/FreeCelpipTest

# Login to Azure
azd auth login

# Initialize environment
azd env new prod
```

### 3. Configure Environment Variables
```bash
# Set required secrets
azd env set POSTGRES_PASSWORD "YourStrongPassword123!"
azd env set GOOGLE_CLIENT_ID "your-google-client-id.apps.googleusercontent.com"
azd env set GOOGLE_CLIENT_SECRET "your-google-client-secret"
azd env set NEXTAUTH_SECRET "$(openssl rand -base64 32)"

# Set Azure location
azd env set AZURE_LOCATION canadacentral
```

### 4. Deploy Infrastructure & Application
```bash
# This single command will:
# 1. Create all Azure resources (AKS, ACR, PostgreSQL, Key Vault, etc.)
# 2. Build and push Docker image to ACR
# 3. Deploy application to AKS using Helm
# 4. Configure networking and secrets

azd up

# Estimated time: 15-20 minutes
```

### 5. Verify Deployment
```bash
# Get AKS credentials
az aks get-credentials \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name $(azd env get-value AZURE_AKS_CLUSTER_NAME)

# Check pods
kubectl get pods -n freecelpip

# Check service status
kubectl get svc -n freecelpip

# Get public IP
kubectl get ingress -n freecelpip
```

---

## Detailed Setup

### Step 1: Azure Login and Subscription
```bash
# Login to Azure
az login

# List subscriptions
az account list --output table

# Set active subscription
az account set --subscription "Your-Subscription-Name"

# Verify
az account show
```

### Step 2: Create Service Principal for GitHub Actions
```bash
# Create service principal with contributor role
az ad sp create-for-rbac \
  --name "freecelpip-github-actions" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv) \
  --sdk-auth

# Save the JSON output - you'll need it for GitHub Secrets
```

### Step 3: Configure GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
AZURE_CLIENT_ID=<clientId from step 2>
AZURE_CLIENT_SECRET=<clientSecret from step 2>
AZURE_TENANT_ID=<tenantId from step 2>
AZURE_SUBSCRIPTION_ID=<subscriptionId from step 2>
AZURE_RESOURCE_GROUP=<your-resource-group-name>
AZURE_AKS_CLUSTER_NAME=<your-aks-cluster-name>
AZURE_KEY_VAULT_NAME=<your-keyvault-name>
ACR_LOGIN_SERVER=<your-acr-name>.azurecr.io
DATABASE_URL=<will be in Key Vault after azd up>
```

### Step 4: Run Database Migrations
```bash
# After deployment, run Prisma migrations
kubectl run prisma-migrate \
  --image=$(azd env get-value AZURE_CONTAINER_REGISTRY_ENDPOINT)/freecelpip:latest \
  --namespace=freecelpip \
  --restart=Never \
  --env="DATABASE_URL=$(az keyvault secret show --vault-name $(azd env get-value AZURE_KEY_VAULT_NAME) --name DATABASE-URL --query value -o tsv)" \
  --command -- npx prisma migrate deploy

# Check migration status
kubectl logs prisma-migrate -n freecelpip
```

### Step 5: Install NGINX Ingress Controller
```bash
# Add Helm repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz

# Get external IP (may take a few minutes)
kubectl get svc -n ingress-nginx
```

### Step 6: Install cert-manager (for SSL)
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create Let's Encrypt issuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

---

## Domain Configuration

### From DigitalOcean to Azure

#### 1. Get Azure Public IP
```bash
# Get the Application Gateway or Ingress public IP
kubectl get ingress -n freecelpip

# Or get from Application Gateway
az network public-ip show \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name $(az network application-gateway list --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) --query "[0].frontendIPConfigurations[0].publicIPAddress.id" -o tsv | xargs -I {} az network public-ip show --ids {} --query name -o tsv) \
  --query ipAddress -o tsv
```

#### 2. Update DNS Records

**Option A: Keep DigitalOcean DNS**
- Go to DigitalOcean → Networking → Domains → freecelpiptest.com
- Update A records:
  ```
  A    @              <AZURE_PUBLIC_IP>    3600
  A    www            <AZURE_PUBLIC_IP>    3600
  ```

**Option B: Migrate to Azure DNS**
```bash
# Create DNS zone in Azure
az network dns zone create \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name freecelpiptest.com

# Create A records
az network dns record-set a add-record \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --zone-name freecelpiptest.com \
  --record-set-name @ \
  --ipv4-address <AZURE_PUBLIC_IP>

az network dns record-set a add-record \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --zone-name freecelpiptest.com \
  --record-set-name www \
  --ipv4-address <AZURE_PUBLIC_IP>

# Get name servers
az network dns zone show \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name freecelpiptest.com \
  --query nameServers -o table
```

**Update name servers at your domain registrar:**
- Go to your domain registrar (e.g., GoDaddy, Namecheap)
- Update name servers to Azure DNS name servers from above

#### 3. Verify DNS Propagation
```bash
# Check DNS resolution
nslookup freecelpiptest.com
dig freecelpiptest.com

# Wait for propagation (can take up to 48 hours)
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

The workflow automatically:
1. ✅ Runs linting and type checking
2. 🔒 Scans for security vulnerabilities (Trivy)
3. 🐳 Builds optimized Docker image (~150MB)
4. 📦 Pushes to Azure Container Registry
5. 🚀 Deploys to AKS using Helm
6. 🔄 Runs database migrations
7. ✅ Performs smoke tests

### Trigger Deployment
```bash
# Push to main branch
git add .
git commit -m "Deploy to production"
git push origin main

# Or manually trigger
gh workflow run deploy-azure.yml
```

### View Deployment Status
```bash
# In GitHub UI: Actions tab
# Or via CLI:
gh run list --workflow=deploy-azure.yml
gh run view <run-id> --log
```

---

## Monitoring & Observability

### Application Insights

**Access Portal:**
```bash
# Open Application Insights in browser
az monitor app-insights component show \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --app $(azd env get-value AZURE_RESOURCE_GROUP)-appi \
  --query appId -o tsv | xargs -I {} open "https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$(azd env get-value AZURE_RESOURCE_GROUP)/providers/microsoft.insights/components/{}/overview"
```

**Key Metrics to Monitor:**
- Request rate and response times
- Failed requests (5xx errors)
- Dependency call durations (PostgreSQL queries)
- Exception rates
- Browser page load times

### Kubernetes Monitoring

```bash
# Pod status
kubectl get pods -n freecelpip -w

# Pod logs
kubectl logs -f deployment/freecelpip -n freecelpip

# Resource usage
kubectl top pods -n freecelpip
kubectl top nodes

# Events
kubectl get events -n freecelpip --sort-by='.lastTimestamp'

# Describe pod for issues
kubectl describe pod <pod-name> -n freecelpip
```

### Set Up Alerts

```bash
# Create alert for 5xx errors
az monitor metrics alert create \
  --name "High 5xx Error Rate" \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --scopes $(az monitor app-insights component show --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) --app $(azd env get-value AZURE_RESOURCE_GROUP)-appi --query id -o tsv) \
  --condition "count requests/failed > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action-group <your-action-group-id>

# Create alert for pod crashes
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: alert-rules
  namespace: freecelpip
data:
  rules.yml: |
    groups:
    - name: pod_alerts
      rules:
      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod is crash looping"
EOF
```

---

## Cost Estimation

### Monthly Costs (Production - Canada Central)

| Service | Configuration | Est. Cost (CAD) |
|---------|--------------|-----------------|
| **AKS** | 2x Standard_D2s_v3 nodes | $220 |
| **PostgreSQL** | Flexible Server, HA, 128GB | $180 |
| **Application Gateway** | WAF_v2, 2 capacity units | $140 |
| **ACR** | Basic tier | $7 |
| **Key Vault** | Standard, <10k operations | $3 |
| **App Insights** | 5GB/month data | $15 |
| **Virtual Network** | Standard | $5 |
| **Public IPs** | 2x Standard | $8 |
| **Bandwidth** | ~100GB egress | $12 |
| **Log Analytics** | 5GB/month | $15 |
| **Total** | | **~$605/month** |

### Development Environment (Lower Cost)
```bash
# Use smaller nodes and single replicas
azd env new dev

# Modify infra/main.bicep:
# - Use 1x Standard_B2s node (~$40/month)
# - PostgreSQL without HA (~$50/month)
# - Skip Application Gateway (use Ingress LoadBalancer)

# Estimated cost: ~$150-200/month
```

### Cost Optimization Tips
```bash
# Stop non-production clusters outside business hours
az aks stop --name <aks-name> --resource-group <rg-name>
az aks start --name <aks-name> --resource-group <rg-name>

# Use Azure Reservations for 1-3 year savings (up to 72% discount)
# Enable auto-scaling to scale down during low traffic

# Monitor costs
az consumption usage list --start-date 2024-01-01 --end-date 2024-01-31 -o table
```

---

## Troubleshooting

### Common Issues

#### 1. Pods Not Starting
```bash
# Check pod events
kubectl describe pod <pod-name> -n freecelpip

# Check logs
kubectl logs <pod-name> -n freecelpip

# Common causes:
# - Image pull errors (check ACR credentials)
# - Resource limits (increase in values.yaml)
# - Database connection (verify DATABASE_URL secret)
```

#### 2. Database Connection Errors
```bash
# Verify PostgreSQL is running
az postgres flexible-server show \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name $(azd env get-value AZURE_POSTGRES_HOST | cut -d. -f1)

# Check firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name $(azd env get-value AZURE_POSTGRES_HOST | cut -d. -f1)

# Test connection from pod
kubectl run -it --rm psql-test \
  --image=postgres:15 \
  --namespace=freecelpip \
  --restart=Never \
  --env="PGPASSWORD=<password>" \
  -- psql -h <hostname> -U <username> -d freecelpip
```

#### 3. SSL/TLS Certificate Issues
```bash
# Check cert-manager
kubectl get certificates -n freecelpip
kubectl describe certificate freecelpip-tls -n freecelpip

# Check certificate order status
kubectl get certificaterequest -n freecelpip

# Force renewal
kubectl delete certificate freecelpip-tls -n freecelpip
# Certificate will be recreated automatically
```

#### 4. High Pod CPU/Memory
```bash
# Check current usage
kubectl top pods -n freecelpip

# Increase limits in helm/freecelpip/values.yaml
resources:
  limits:
    cpu: 2000m      # Increase from 1000m
    memory: 2048Mi  # Increase from 1024Mi

# Redeploy
helm upgrade freecelpip ./helm/freecelpip -n freecelpip
```

#### 5. azd up Fails
```bash
# Check azd logs
azd logs

# Verify Azure CLI login
az account show

# Check quota limits
az vm list-usage --location canadacentral --output table

# Reset environment
azd down --force --purge
azd env new prod
azd up
```

### Debug Commands Cheatsheet
```bash
# Get all resources
kubectl get all -n freecelpip

# Port forward to local
kubectl port-forward svc/freecelpip 3000:80 -n freecelpip

# Execute command in pod
kubectl exec -it <pod-name> -n freecelpip -- /bin/sh

# View resource consumption
kubectl describe node

# Check HPA status
kubectl get hpa -n freecelpip
kubectl describe hpa freecelpip -n freecelpip

# Rollback deployment
helm rollback freecelpip -n freecelpip

# View all events
kubectl get events --all-namespaces --sort-by='.lastTimestamp'
```

---

## Maintenance Tasks

### Update Docker Image
```bash
# Build new image
docker build -t $(azd env get-value AZURE_CONTAINER_REGISTRY_ENDPOINT)/freecelpip:v2.0.0 -f Dockerfile.production .

# Push to ACR
docker push $(azd env get-value AZURE_CONTAINER_REGISTRY_ENDPOINT)/freecelpip:v2.0.0

# Update Helm release
helm upgrade freecelpip ./helm/freecelpip \
  --namespace freecelpip \
  --set image.tag=v2.0.0
```

### Update Helm Values
```bash
# Edit values
vim helm/freecelpip/values.yaml

# Validate
helm lint helm/freecelpip

# Apply changes
helm upgrade freecelpip ./helm/freecelpip -n freecelpip
```

### Scale Manually
```bash
# Scale up
kubectl scale deployment freecelpip -n freecelpip --replicas=5

# Scale down
kubectl scale deployment freecelpip -n freecelpip --replicas=2
```

### Backup Database
```bash
# Configure automated backups (already enabled in Bicep)
az postgres flexible-server show \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name $(azd env get-value AZURE_POSTGRES_HOST | cut -d. -f1) \
  --query backup

# Manual backup
az postgres flexible-server backup create \
  --resource-group $(azd env get-value AZURE_RESOURCE_GROUP) \
  --name $(azd env get-value AZURE_POSTGRES_HOST | cut -d. -f1) \
  --backup-name manual-backup-$(date +%Y%m%d)
```

---

## Cleanup

### Remove Everything
```bash
# This will delete ALL Azure resources
azd down --force --purge

# Or manually
az group delete --name $(azd env get-value AZURE_RESOURCE_GROUP) --yes --no-wait
```

### Remove Just the Application
```bash
# Keep infrastructure, remove app
helm uninstall freecelpip -n freecelpip
kubectl delete namespace freecelpip
```

---

## Next Steps

- [ ] Configure custom domain SSL in helm/freecelpip/values.yaml
- [ ] Set up monitoring dashboards in Azure Portal
- [ ] Configure backup and disaster recovery
- [ ] Implement blue-green or canary deployments
- [ ] Add integration tests to CI/CD
- [ ] Set up staging environment
- [ ] Configure Azure Front Door for global CDN
- [ ] Enable Azure Policy for governance

---

## Support & Resources

- **Azure Documentation**: https://docs.microsoft.com/azure
- **azd Documentation**: https://learn.microsoft.com/azure/developer/azure-developer-cli
- **AKS Best Practices**: https://learn.microsoft.com/azure/aks/best-practices
- **Helm Documentation**: https://helm.sh/docs
- **Kubernetes Documentation**: https://kubernetes.io/docs

---

**Created for FreeCelpip DevOps Portfolio Project**

*Last updated: February 2026*



================================================
FILE: azure/legacy-docs/DEPLOYMENT_GUIDE.md
================================================
# 🚀 Lightning-Fast Deployment Guide

## Deployment Platform: **Digital Ocean App Platform** 🌊

**Digital Ocean App Platform** is an excellent choice for Next.js apps because:
- ✅ Full control over infrastructure
- ✅ Automatic scaling
- ✅ Built-in CDN
- ✅ Automatic HTTPS
- ✅ Database integration
- ✅ Simple deployment from GitHub
- ✅ Cost-effective pricing
- ✅ Global edge locations

### Why Digital Ocean App Platform for Lightning Speed?

1. **Global CDN**: Your site is served from multiple edge locations worldwide
2. **Automatic Static Generation**: All blog posts are pre-rendered at build time
3. **Image Optimization**: Next.js image optimization built-in
4. **Smart Caching**: Aggressive caching for static assets
5. **Fast Builds**: Optimized build process with caching

---

## 📋 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify Build Works Locally**
   ```bash
   npm run build
   npm start
   ```

### Step 2: Create App in Digital Ocean

1. **Go to Digital Ocean App Platform**
   - Visit [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Sign up/login to your Digital Ocean account
   - Click "Create App"

2. **Connect Your GitHub Repository**
   - Select "GitHub" as source
   - Authorize Digital Ocean to access your GitHub
   - Select your repository: `FreeCelpipTest`
   - Choose the branch: `main` (or your production branch)

3. **Configure Build Settings**
   Digital Ocean will auto-detect Next.js, but verify:
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **Environment**: `Node.js`
   - **Node Version**: `18.x` or `20.x` (recommended)

### Step 3: Configure Environment Variables

Add these in Digital Ocean App Platform → Settings → App-Level Environment Variables:

```
NODE_ENV=production
DATABASE_URL=your_database_url
AUTH_SECRET=your_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=https://your-app-name.ondigitalocean.app
NEXT_PUBLIC_SITE_URL=https://your-app-name.ondigitalocean.app
```

**Important Notes:**
- Replace `your-app-name` with your actual app name
- Generate a secure `AUTH_SECRET` (you can use: `openssl rand -base64 32`)
- Add your database URL if using a database
- Add Google OAuth credentials if using authentication

### Step 4: Configure Build Settings

In the App Platform dashboard:

1. **Go to Settings → App Spec**
2. **Verify the configuration:**
   ```yaml
   name: freecelpiptest
   region: nyc
   services:
     - name: web
       source_dir: /
       github:
         repo: your-username/FreeCelpipTest
         branch: main
       run_command: npm start
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       build_command: npm run build
       http_port: 3000
       envs:
         - key: NODE_ENV
           value: production
   ```

### Step 5: Deploy!

1. **Review Configuration**
   - Check all settings
   - Verify environment variables
   - Review build command

2. **Click "Create Resources"**
   - Digital Ocean will start building your app
   - Build typically takes 3-5 minutes
   - You'll see build logs in real-time

3. **Wait for Deployment**
   - Monitor the build logs
   - Fix any errors if they occur
   - Your app will be live once build completes!

### Step 6: Custom Domain (Optional)

1. **Go to Settings → Domains**
2. **Add Custom Domain**
   - Enter your domain: `freecelpiptest.com`
   - Follow DNS configuration instructions
   - Digital Ocean will provision SSL automatically

### Step 7: Database Setup (If Needed)

If you're using a database:

1. **Create Database**
   - Go to App Platform → Databases
   - Create a new database (PostgreSQL recommended)
   - Note the connection string

2. **Link Database to App**
   - In your app settings, add the database
   - Update `DATABASE_URL` environment variable
   - Run migrations: `npm run db:migrate` (if needed)

---

## ⚡ Performance Optimizations Already Included

### ✅ Static Generation
- All blog posts are pre-rendered at build time
- Zero server-side rendering for blog pages
- Instant page loads

### ✅ Image Optimization
- AVIF/WebP format support
- Automatic image compression
- 1-year cache for images

### ✅ Code Splitting
- Automatic code splitting
- Lazy loading for components
- Optimized bundle sizes

### ✅ Caching Headers
- Static assets cached for 1 year
- Aggressive caching for images
- Browser caching optimized

### ✅ Package Optimization
- Tree-shaking enabled
- Optimized imports for lucide-react and framer-motion
- SWC minification

---

## 🎯 Expected Performance Metrics

With Digital Ocean App Platform deployment, you should achieve:

- **First Contentful Paint (FCP)**: < 1.2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Lighthouse Score**: 90-100

---

## 🔧 Additional Optimizations (Optional)

### 1. Enable Analytics
You can use Google Analytics or other analytics services:

**Google Analytics:**
```bash
npm install @next/third-parties
```

Add to `app/layout.tsx`:
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### 2. Enable Monitoring
Consider using:
- **Digital Ocean Monitoring**: Built-in app monitoring
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User analytics

### 3. Use Next.js Image Component (Future Enhancement)
Consider replacing `<img>` tags with Next.js `<Image>` component for:
- Automatic optimization
- Lazy loading
- Responsive images
- Better Core Web Vitals

---

## 🌍 App Platform Configuration Tips

### Scaling Your App

1. **Horizontal Scaling**
   - Increase `instance_count` in app spec
   - Digital Ocean will load balance automatically

2. **Vertical Scaling**
   - Upgrade `instance_size_slug` for more resources
   - Options: `basic-xxs`, `basic-xs`, `basic-s`, `basic-m`, etc.

3. **Auto-Scaling**
   - Enable auto-scaling in app settings
   - Set min/max instance counts
   - Configure scaling rules based on CPU/memory

### Performance Optimization

1. **Enable CDN**
   - Digital Ocean App Platform includes CDN
   - Static assets are automatically cached
   - Configure cache headers in `next.config.ts` (already done)

2. **Database Connection Pooling**
   - Use connection pooling for databases
   - Reduces connection overhead
   - Improves response times

3. **Caching Strategy**
   - Static pages are pre-rendered (already configured)
   - Use ISR (Incremental Static Regeneration) for blog posts
   - Configure cache headers (already done)

---

## 📊 Monitoring Performance

### Tools to Use:
1. **Digital Ocean Monitoring** (Built-in)
   - App metrics dashboard
   - CPU, memory, request metrics
   - Error tracking

2. **Google PageSpeed Insights**
   - Test your live site
   - Get performance recommendations

3. **WebPageTest**
   - Detailed performance analysis
   - Global testing locations

4. **Lighthouse** (Chrome DevTools)
   - Run audits on your production site
   - Monitor Core Web Vitals

### Key Metrics to Monitor:
- Page load time
- Time to First Byte (TTFB)
- Core Web Vitals (LCP, FID, CLS)
- Bundle size
- Image optimization
- Server response times
- Error rates

---

## 🚨 Pre-Deployment Checklist

- [x] All blog posts have static generation
- [x] Images are optimized
- [x] Environment variables set
- [x] Database connection configured
- [x] SEO metadata complete
- [x] Sitemap generated
- [x] Robots.txt configured
- [x] Error pages (404, 500) ready
- [x] Analytics ready (optional)
- [x] Domain configured (if custom)

---

## 🎉 Post-Deployment

1. **Test Performance**
   - Run Lighthouse audit on production URL
   - Check Core Web Vitals
   - Test on mobile devices
   - Verify all pages load correctly

2. **Monitor**
   - Check Digital Ocean App Platform dashboard
   - Monitor error rates in logs
   - Set up alerts for errors
   - Track page views (if analytics enabled)

3. **Optimize**
   - Review slow pages in monitoring dashboard
   - Optimize images further if needed
   - Reduce bundle size if needed
   - Review database queries if using database

4. **Verify Environment Variables**
   - Test authentication (if enabled)
   - Verify database connections
   - Check API endpoints
   - Test all features

---

## 💡 Pro Tips

1. **Use Environment Variables** for all secrets
   - Never commit secrets to Git
   - Use App Platform's environment variable management

2. **Enable Preview Deployments** for testing
   - Create staging environment
   - Test before deploying to production

3. **Set up Custom Domain** for better branding
   - Digital Ocean provides free SSL certificates
   - Configure DNS records as instructed

4. **Monitor Resource Usage**
   - Check CPU and memory usage
   - Scale up if needed
   - Optimize code to reduce resource usage

5. **Enable Automatic HTTPS** (default on Digital Ocean)
   - SSL certificates are automatically provisioned
   - No additional configuration needed

6. **Use Build Caching**
   - Digital Ocean caches `node_modules` between builds
   - Faster subsequent deployments

7. **Set up Health Checks**
   - Configure health check endpoint
   - Automatic restart on failures

---

## 🆘 Troubleshooting

### Build Fails?
- **Check build logs** in Digital Ocean dashboard
- Verify all environment variables are set
- Check for TypeScript errors: `npm run build` locally
- Verify Node.js version matches (18.x or 20.x)
- Check `package.json` scripts are correct
- Ensure `next.config.ts` is valid

### App Won't Start?
- **Check runtime logs** in Digital Ocean dashboard
- Verify `NODE_ENV=production` is set
- Check `DATABASE_URL` if using database
- Verify port is set to 3000 (default)
- Check for missing environment variables

### Slow Performance?
- Check instance size (upgrade if needed)
- Review bundle size in build logs
- Check image sizes and optimize
- Enable CDN (automatic on App Platform)
- Review database queries if using database
- Check for memory leaks

### Images Not Loading?
- Verify image paths are correct
- Check `public` folder structure
- Verify image optimization config in `next.config.ts`
- Check CDN cache settings

### Database Connection Issues?
- Verify `DATABASE_URL` environment variable
- Check database is running and accessible
- Verify network settings (if using managed database)
- Check connection pool settings

### Environment Variables Not Working?
- Verify variables are set at app level (not component level)
- Check variable names match exactly (case-sensitive)
- Restart app after adding new variables
- Verify no typos in variable names

### High Costs?
- Review instance size (downgrade if possible)
- Check for unnecessary resources
- Enable auto-scaling with limits
- Review database usage if using managed database

---

## 📝 Digital Ocean App Platform App Spec Example

Here's a complete `app.yaml` example you can use:

```yaml
name: freecelpiptest
region: nyc
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/FreeCelpipTest
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    build_command: npm run build
    http_port: 3000
    health_check:
      http_path: /
    envs:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: "20"
```

**Note:** You can create this file in your repo root, or configure directly in the Digital Ocean dashboard.

---

**Your site is optimized for lightning-fast performance! 🚀**

Deploy to Digital Ocean App Platform and enjoy fast page loads worldwide!




================================================
FILE: azure/legacy-docs/README_AZURE.md
================================================
# 🎓 FreeCelpip - Azure Production Deployment

[![Azure](https://img.shields.io/badge/Azure-AKS-0078D4?logo=microsoft-azure)](https://azure.microsoft.com/en-us/products/kubernetes-service)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-AKS-326CE5?logo=kubernetes)](https://kubernetes.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org/)

Production-grade CELPIP test preparation platform deployed on Azure Kubernetes Service (AKS) with full DevOps automation.

## 🚀 Quick Start: Deploy to Azure

### Prerequisites
- Azure subscription ([Get free trial](https://azure.microsoft.com/free/))
- Azure Developer CLI installed
- Docker Desktop running

### One-Command Deployment

```bash
# Run the initialization script
./scripts/azure-init.sh

# Or manually:
azd auth login
azd env new prod
azd up
```

**⏱️ Deployment time:** ~15-20 minutes

See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for detailed instructions.

---

## 📐 Architecture

### High-Level Overview
```
Azure Front Door / App Gateway (WAF)
    ↓
AKS Cluster (2-10 pods, auto-scaling)
    ↓
PostgreSQL (HA, zone-redundant)
    ↓
Application Insights (monitoring)
```

### Tech Stack
- **Frontend/Backend**: Next.js 15 (App Router) + TypeScript
- **Database**: Azure PostgreSQL Flexible Server (HA enabled)
- **Container Registry**: Azure Container Registry (ACR)
- **Orchestration**: Azure Kubernetes Service (AKS)
- **Secrets**: Azure Key Vault
- **Monitoring**: Application Insights + Log Analytics
- **Networking**: Virtual Network + Application Gateway (WAF)
- **CI/CD**: GitHub Actions
- **IaC**: Bicep (Azure native)

### DevOps Tools
- **Docker**: Multi-stage builds (~150MB images)
- **Kubernetes**: Deployments, HPA, PDB, rolling updates
- **Helm**: Package management & templating
- **Terraform**: Optional IaC alternative
- **Azure DevOps**: CI/CD pipelines
- **Trivy**: Container security scanning

---

## 📁 Project Structure

```
FreeCelpipTest/
├── azure.yaml                    # Azure Developer CLI config
├── Dockerfile.production         # Optimized multi-stage build
├── AZURE_DEPLOYMENT.md          # Complete deployment guide
│
├── infra/                       # Bicep Infrastructure as Code
│   ├── main.bicep              # Main orchestration
│   ├── main.parameters.json    # Parameter template
│   └── modules/                # Modular Bicep files
│       ├── aks.bicep           # AKS cluster
│       ├── acr.bicep           # Container registry
│       ├── postgres.bicep      # PostgreSQL database
│       ├── keyvault.bicep      # Key Vault
│       ├── appgateway.bicep    # Application Gateway
│       ├── appinsights.bicep   # Monitoring
│       └── vnet.bicep          # Virtual network
│
├── helm/freecelpip/            # Kubernetes Helm chart
│   ├── Chart.yaml              # Helm metadata
│   ├── values.yaml             # Default configuration
│   └── templates/              # K8s manifests
│       ├── deployment.yaml     # App deployment
│       ├── service.yaml        # K8s service
│       ├── ingress.yaml        # Ingress rules
│       ├── hpa.yaml            # Auto-scaling
│       └── pdb.yaml            # Pod disruption budget
│
├── .github/workflows/
│   └── deploy-azure.yml        # CI/CD pipeline
│
├── scripts/
│   ├── azure-init.sh           # Quick setup script
│   └── post-deploy.sh          # Post-deployment config
│
├── app/                        # Next.js app
├── components/                 # React components
├── lib/                        # Utilities
│   ├── appInsights.ts          # Azure monitoring
│   └── prisma.ts               # Database client
│
└── prisma/
    └── schema.prisma           # Database schema
```

---

## 🛠️ Local Development

### Setup
```bash
# Clone repository
git clone <your-repo-url>
cd FreeCelpipTest

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start PostgreSQL (Docker)
docker run -d \
  --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=freecelpip \
  -p 5432:5432 \
  postgres:15-alpine

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

### Development URLs
- **App**: http://localhost:3000
- **Prisma Studio**: `npm run db:studio`

---

## 🌐 Production Deployment

### Method 1: Azure Developer CLI (Recommended)
```bash
# Initialize and deploy
./scripts/azure-init.sh

# Post-deployment configuration
./scripts/post-deploy.sh
```

### Method 2: Manual Deployment
```bash
# Login
azd auth login

# Create environment
azd env new prod

# Set secrets
azd env set POSTGRES_PASSWORD "<strong-password>"
azd env set GOOGLE_CLIENT_ID "<client-id>"
azd env set GOOGLE_CLIENT_SECRET "<client-secret>"
azd env set NEXTAUTH_SECRET "$(openssl rand -base64 32)"

# Deploy
azd up
```

### Method 3: GitHub Actions (Automated)
1. Configure GitHub Secrets (see [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md))
2. Push to `main` branch
3. GitHub Actions auto-deploys

---

## 📊 Infrastructure Details

### Azure Resources Created
| Resource | Purpose | Cost/Month (CAD) |
|----------|---------|------------------|
| AKS (2 nodes) | Application hosting | $220 |
| PostgreSQL (HA) | Database | $180 |
| App Gateway | Load balancer + WAF | $140 |
| ACR | Container registry | $7 |
| Key Vault | Secrets management | $3 |
| App Insights | Monitoring | $15 |
| Virtual Network | Networking | $5 |
| **Total** | | **~$570-605** |

### High Availability Features
- ✅ **AKS**: 2-10 pod replicas with auto-scaling (HPA)
- ✅ **PostgreSQL**: Zone-redundant HA configuration
- ✅ **Load Balancing**: Application Gateway with health probes
- ✅ **Zero-Downtime Deployments**: Rolling updates
- ✅ **Pod Disruption Budget**: Ensures minimum availability
- ✅ **Anti-Affinity**: Pods spread across availability zones

### Security Features
- 🔒 WAF (Web Application Firewall) enabled
- 🔒 Private endpoints for database
- 🔒 Key Vault for secrets
- 🔒 RBAC enabled on AKS
- 🔒 Network policies
- 🔒 Container image scanning (Trivy)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
1. **Lint & Test** - Code quality checks
2. **Security Scan** - Trivy vulnerability scanning
3. **Build** - Multi-stage Docker build
4. **Push** - Upload to ACR
5. **Deploy** - Helm upgrade on AKS
6. **Migrate** - Run Prisma migrations
7. **Smoke Test** - Health endpoint validation

### Trigger Deployment
```bash
# Push to main (production)
git push origin main

# Push to develop (staging)
git push origin develop

# Manual trigger
gh workflow run deploy-azure.yml
```

---

## 📈 Monitoring & Observability

### Application Insights
- Request rates & response times
- Failed requests (5xx errors)
- Database query performance
- Exception tracking
- Custom events & metrics

### Access Monitoring
```bash
# Open Application Insights
az portal show --resource-group <rg-name> --resource appinsights

# View real-time metrics
kubectl top pods -n freecelpip

# View logs
kubectl logs -f deployment/freecelpip -n freecelpip
```

### Set Up Alerts
- Pod crash loops
- High CPU/memory usage
- 5xx error rate spikes
- Database connection failures

See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for configuration.

---

## 🔧 Common Operations

### Scale Application
```bash
# Manual scaling
kubectl scale deployment freecelpip -n freecelpip --replicas=5

# Auto-scaling (HPA) is enabled by default
# Scales between 2-10 pods based on CPU/memory
```

### Update Application
```bash
# Build new image
docker build -t $ACR_NAME.azurecr.io/freecelpip:v2.0.0 .

# Push to ACR
docker push $ACR_NAME.azurecr.io/freecelpip:v2.0.0

# Deploy
helm upgrade freecelpip ./helm/freecelpip \
  --namespace freecelpip \
  --set image.tag=v2.0.0
```

### Run Database Migrations
```bash
kubectl run prisma-migrate \
  --image=$ACR_NAME.azurecr.io/freecelpip:latest \
  --namespace=freecelpip \
  --restart=Never \
  --env="DATABASE_URL=$DATABASE_URL" \
  --command -- npx prisma migrate deploy
```

### View Logs
```bash
# Application logs
kubectl logs -f deployment/freecelpip -n freecelpip

# All pod logs
kubectl logs -f -l app=freecelpip -n freecelpip --all-containers

# Previous crashed pod
kubectl logs deployment/freecelpip -n freecelpip --previous
```

---

## 🌍 Domain Configuration

### DNS Setup
After deployment, configure your domain:

```bash
# Get public IP
kubectl get ingress -n freecelpip

# Add A records:
# A    @       <PUBLIC_IP>    300
# A    www     <PUBLIC_IP>    300
```

### SSL/TLS
SSL certificates are automatically provisioned via Let's Encrypt after DNS is configured.

---

## 💰 Cost Optimization

### Development Environment
- Use smaller node sizes (Standard_B2s)
- Single PostgreSQL instance (no HA)
- Skip Application Gateway
- **Estimated cost**: $150-200/month

### Stop/Start Non-Production
```bash
# Stop AKS (saves ~70% of compute costs)
az aks stop --name <aks-name> --resource-group <rg>

# Start when needed
az aks start --name <aks-name> --resource-group <rg>
```

---

## 🧹 Cleanup

### Remove Everything
```bash
# Delete all Azure resources
azd down --force --purge

# Verify deletion
az group list --output table
```

### Cost After Cleanup
$0 (all resources deleted)

---

## 📚 Documentation

- [**Complete Deployment Guide**](./AZURE_DEPLOYMENT.md) - Step-by-step Azure setup
- [**Architecture Decisions**](./docs/CELPIP_EXAM_UI_PLAN.md)
- [**Performance Optimizations**](./docs/PERFORMANCE_OPTIMIZATIONS.md)

---

## 🎯 DevOps Skills Demonstrated

This project showcases:

- ✅ **Infrastructure as Code** (Bicep)
- ✅ **Container Orchestration** (Kubernetes/AKS)
- ✅ **CI/CD Pipelines** (GitHub Actions)
- ✅ **Docker** multi-stage builds
- ✅ **Helm** package management
- ✅ **Azure Cloud** platform expertise
- ✅ **Monitoring & Logging** (App Insights)
- ✅ **Security** best practices (Key Vault, WAF, RBAC)
- ✅ **High Availability** architecture
- ✅ **GitOps** workflows
- ✅ **Database Management** (PostgreSQL, Prisma)
- ✅ **Load Balancing** & auto-scaling

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

- 📖 [Deployment Guide](./AZURE_DEPLOYMENT.md)
- 🐛 [Report Issues](https://github.com/yourusername/freecelpip/issues)
- 💬 [Discussions](https://github.com/yourusername/freecelpip/discussions)

---

**Built with ❤️ for DevOps Portfolio**

*Demonstrating production-grade cloud architecture and DevOps practices*



================================================
FILE: azure/scripts/add-admin-email.sh
================================================
#!/bin/bash
# Script to add ADMIN_EMAIL secret to Azure Key Vault

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="rg-dev-ru7klmqtlrise"
KEY_VAULT_NAME="kv-dev-ru7klmqtlrise"
ADMIN_EMAIL="${ADMIN_EMAIL:-Ekantik@baps.com}"

echo -e "${YELLOW}Adding ADMIN_EMAIL to Azure Key Vault${NC}"
echo "Resource Group: $RESOURCE_GROUP"
echo "Key Vault: $KEY_VAULT_NAME"
echo "Admin Email: $ADMIN_EMAIL"
echo ""

# Get current user
CURRENT_USER=$(az account show --query user.name -o tsv)
echo -e "${GREEN}Current user: $CURRENT_USER${NC}"

# Grant Key Vault Secrets Officer role if needed
echo ""
echo -e "${YELLOW}Checking Key Vault permissions...${NC}"
USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)

echo "Granting Key Vault Secrets Officer role..."
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee-object-id "$USER_OBJECT_ID" \
  --assignee-principal-type "User" \
  --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEY_VAULT_NAME" \
  2>/dev/null || echo "Role already assigned or waiting for propagation..."

echo ""
echo -e "${YELLOW}Waiting for role assignment to propagate (15 seconds)...${NC}"
sleep 15

# Set the secret
echo ""
echo -e "${YELLOW}Setting ADMIN-EMAIL secret in Key Vault...${NC}"
az keyvault secret set \
  --vault-name "$KEY_VAULT_NAME" \
  --name "ADMIN-EMAIL" \
  --value "$ADMIN_EMAIL"

echo ""
echo -e "${GREEN}✅ Success! ADMIN_EMAIL has been added to Azure Key Vault${NC}"
echo ""
echo "To add multiple admin emails, update the secret with comma-separated values:"
echo "  az keyvault secret set --vault-name $KEY_VAULT_NAME --name ADMIN-EMAIL --value \"email1@gmail.com,email2@gmail.com\""



================================================
FILE: azure/scripts/azure-init.sh
================================================
#!/bin/bash

# FreeCelpip Azure Deployment Initialization Script
# This script prepares your environment for Azure deployment

set -e

echo "🚀 FreeCelpip Azure Deployment Setup"
echo "====================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install azure-cli
    else
        curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
    fi
fi

# Check if Azure Developer CLI is installed
if ! command -v azd &> /dev/null; then
    echo "❌ Azure Developer CLI not found. Installing..."
    curl -fsSL https://aka.ms/install-azd.sh | bash
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install kubectl
    else
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    fi
fi

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo "❌ Helm not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install helm
    else
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
    fi
fi

echo ""
echo "✅ All prerequisites installed!"
echo ""

# Login to Azure
echo "📝 Logging into Azure..."
azd auth login

# Create new environment
echo ""
read -p "Enter environment name (e.g., prod, staging, dev): " ENV_NAME
azd env new "$ENV_NAME"

echo ""
echo "🔐 Setting up environment variables..."
echo "Please provide the following information:"
echo ""

# PostgreSQL password
read -sp "PostgreSQL admin password (min 8 chars): " POSTGRES_PASSWORD
echo ""
azd env set POSTGRES_PASSWORD "$POSTGRES_PASSWORD"

# Google OAuth
read -p "Google OAuth Client ID: " GOOGLE_CLIENT_ID
azd env set GOOGLE_CLIENT_ID "$GOOGLE_CLIENT_ID"

read -sp "Google OAuth Client Secret: " GOOGLE_CLIENT_SECRET
echo ""
azd env set GOOGLE_CLIENT_SECRET "$GOOGLE_CLIENT_SECRET"

# Generate NextAuth secret
echo "Generating NextAuth secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
azd env set NEXTAUTH_SECRET "$NEXTAUTH_SECRET"

# Azure location
echo ""
echo "Available Azure regions:"
echo "1) canadacentral (recommended)"
echo "2) canadaeast"
echo "3) eastus"
echo "4) westus2"
echo "5) westeurope"
read -p "Select region (1-5) [1]: " REGION_CHOICE
REGION_CHOICE=${REGION_CHOICE:-1}

case $REGION_CHOICE in
    1) AZURE_LOCATION="canadacentral";;
    2) AZURE_LOCATION="canadaeast";;
    3) AZURE_LOCATION="eastus";;
    4) AZURE_LOCATION="westus2";;
    5) AZURE_LOCATION="westeurope";;
    *) AZURE_LOCATION="canadacentral";;
esac

azd env set AZURE_LOCATION "$AZURE_LOCATION"

echo ""
echo "✅ Environment configuration complete!"
echo ""
echo "📦 Next steps:"
echo "1. Review the configuration: azd env get-values"
echo "2. Deploy to Azure: azd up"
echo ""
echo "💡 Tip: The deployment will take ~15-20 minutes"
echo ""
read -p "Deploy now? (y/N): " DEPLOY_NOW

if [[ "$DEPLOY_NOW" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting deployment..."
    azd up
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📋 Post-deployment tasks:"
    echo "1. Configure DNS records (see AZURE_DEPLOYMENT.md)"
    echo "2. Install NGINX Ingress Controller"
    echo "3. Install cert-manager for SSL"
    echo "4. Run database migrations"
    echo ""
    echo "📖 See AZURE_DEPLOYMENT.md for detailed instructions"
else
    echo ""
    echo "📖 When ready, run: azd up"
    echo "📚 See AZURE_DEPLOYMENT.md for complete instructions"
fi

echo ""
echo "🎉 Setup complete!"



================================================
FILE: azure/scripts/configure-helm-values.sh
================================================
#!/bin/bash

# Pre-deployment script to configure Helm values dynamically
# Sets Key Vault name, Tenant ID, and ACR image from Azure environment

set -e

echo "📝 Configuring Helm deployment values..."

# Get values from azd environment
KEY_VAULT_NAME=$(azd env get-value AZURE_KEY_VAULT_NAME)
TENANT_ID=$(az account show --query tenantId -o tsv)
ACR_ENDPOINT=$(azd env get-value AZURE_CONTAINER_REGISTRY_ENDPOINT)
IMAGE_NAME=$(azd env get-value SERVICE_WEB_IMAGE_NAME)

# Extract repository and tag from full image name
if [ -n "$IMAGE_NAME" ]; then
    IMAGE_REPO=$(echo "$IMAGE_NAME" | cut -d: -f1)
    IMAGE_TAG=$(echo "$IMAGE_NAME" | cut -d: -f2)
else
    echo "⚠️  SERVICE_WEB_IMAGE_NAME not set, using defaults"
    IMAGE_REPO="${ACR_ENDPOINT}/freecelpip/web"
    IMAGE_TAG="latest"
fi

echo "Key Vault: $KEY_VAULT_NAME"
echo "Tenant ID: $TENANT_ID"
echo "Image: $IMAGE_REPO:$IMAGE_TAG"

# Export for use by azd
export HELM_KEY_VAULT_NAME="$KEY_VAULT_NAME"
export HELM_TENANT_ID="$TENANT_ID"
export HELM_IMAGE_REPOSITORY="$IMAGE_REPO"
export HELM_IMAGE_TAG="$IMAGE_TAG"

echo "✅ Helm values configured"



================================================
FILE: azure/scripts/post-deploy.sh
================================================
#!/bin/bash

# Post-deployment configuration script
# Run this after 'azd up' completes

set -e

echo "🔧 Post-Deployment Configuration"
echo "================================="

# Get environment values
RESOURCE_GROUP=$(azd env get-value AZURE_RESOURCE_GROUP)
AKS_CLUSTER=$(azd env get-value AZURE_AKS_CLUSTER_NAME)
ACR_ENDPOINT=$(azd env get-value AZURE_CONTAINER_REGISTRY_ENDPOINT)

echo "Resource Group: $RESOURCE_GROUP"
echo "AKS Cluster: $AKS_CLUSTER"
echo "ACR Endpoint: $ACR_ENDPOINT"
echo ""

# Get AKS credentials
echo "📝 Getting AKS credentials..."
az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$AKS_CLUSTER" --overwrite-existing

# Install NGINX Ingress
echo ""
echo "🌐 Installing NGINX Ingress Controller..."
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install nginx-ingress ingress-nginx/ingress-nginx \
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
    --wait

# Install cert-manager
echo ""
echo "🔐 Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

echo "Waiting for cert-manager to be ready..."
kubectl wait --for=condition=Available --timeout=300s deployment/cert-manager -n cert-manager
kubectl wait --for=condition=Available --timeout=300s deployment/cert-manager-webhook -n cert-manager
kubectl wait --for=condition=Available --timeout=300s deployment/cert-manager-cainjector -n cert-manager

# Create Let's Encrypt ClusterIssuer
echo ""
echo "📜 Creating Let's Encrypt issuer..."
read -p "Enter your email for Let's Encrypt notifications: " LETSENCRYPT_EMAIL

cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
    name: letsencrypt-prod
spec:
    acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: $LETSENCRYPT_EMAIL
    privateKeySecretRef:
        name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
            class: nginx
EOF

# Get Ingress IP
echo ""
echo "⏳ Waiting for Ingress Controller to get external IP..."
sleep 30

INGRESS_IP=$(kubectl get svc nginx-ingress-ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

if [ -z "$INGRESS_IP" ]; then
    echo "⚠️  External IP not yet assigned. Please wait a few moments and run:"
    echo "kubectl get svc -n ingress-nginx"
else
    echo "✅ Ingress External IP: $INGRESS_IP"
    echo ""
    echo "📋 DNS Configuration Required:"
    echo "================================"
    echo "Add these A records to your DNS:"
    echo ""
    echo "A    @       $INGRESS_IP    300"
    echo "A    www     $INGRESS_IP    300"
    echo ""
fi

# Run database migrations
echo ""
read -p "Run database migrations now? (y/N): " RUN_MIGRATIONS

if [[ "$RUN_MIGRATIONS" =~ ^[Yy]$ ]]; then
    echo "🗄️  Running Prisma migrations..."
    
    DATABASE_URL=$(az keyvault secret show \
        --vault-name $(azd env get-value AZURE_KEY_VAULT_NAME) \
        --name DATABASE-URL \
        --query value -o tsv)
    
    kubectl run prisma-migrate-$(date +%s) \
        --image=$ACR_ENDPOINT/freecelpip:latest \
        --namespace=freecelpip \
        --restart=Never \
        --env="DATABASE_URL=$DATABASE_URL" \
        --command -- npx prisma migrate deploy
    
    echo "✅ Migration job created. Check status with:"
    echo "kubectl get pods -n freecelpip -l job-name=prisma-migrate*"
fi

# Display summary
echo ""
echo "✅ Post-deployment configuration complete!"
echo ""
echo "📋 Summary:"
echo "==========="
echo "✓ NGINX Ingress Controller installed"
echo "✓ cert-manager installed"
echo "✓ Let's Encrypt issuer created"
if [ ! -z "$INGRESS_IP" ]; then
    echo "✓ External IP: $INGRESS_IP"
fi
echo ""
echo "🔄 Next Steps:"
echo "1. Update DNS A records (see above)"
echo "2. Wait for DNS propagation (up to 48 hours)"
echo "3. SSL certificates will be issued automatically"
echo "4. Monitor deployment: kubectl get pods -n freecelpip"
echo ""
echo "📖 See AZURE_DEPLOYMENT.md for detailed documentation"



================================================
FILE: azure/scripts/setup-k8s-addons.sh
================================================
#!/bin/bash

# Automated Kubernetes Add-ons Setup for AKS
# Installs NGINX Ingress Controller and cert-manager
# Called automatically after provisioning via azd hooks

set -e

echo "🔧 Setting up Kubernetes Add-ons"
echo "================================="

# Get AKS credentials
RESOURCE_GROUP=$(azd env get-value AZURE_RESOURCE_GROUP)
AKS_CLUSTER=$(azd env get-value AZURE_AKS_CLUSTER_NAME)

echo "Getting AKS credentials..."
az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$AKS_CLUSTER" --overwrite-existing

# Install NGINX Ingress Controller
echo ""
echo "🌐 Installing NGINX Ingress Controller..."
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx 2>/dev/null || true
helm repo update
if helm list -n ingress-nginx | grep -q nginx-ingress; then
    echo "NGINX Ingress already installed, upgrading..."
    helm upgrade nginx-ingress ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
        --wait \
        --timeout=5m
else
    echo "Installing NGINX Ingress..."
    helm install nginx-ingress ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
        --wait \
        --timeout=5m
fi

# Install cert-manager
echo ""
echo "🔐 Installing cert-manager..."
if kubectl get namespace cert-manager &>/dev/null; then
    echo "cert-manager namespace exists, checking installation..."
    if kubectl get deployment cert-manager -n cert-manager &>/dev/null; then
        echo "cert-manager already installed, skipping..."
    else
        kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
    fi
else
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
fi

echo "Waiting for cert-manager to be ready..."
kubectl wait --for=condition=Available --timeout=300s deployment/cert-manager -n cert-manager || true
kubectl wait --for=condition=Available --timeout=300s deployment/cert-manager-webhook -n cert-manager || true
kubectl wait --for=condition=Available --timeout=300s deployment/cert-manager-cainjector -n cert-manager || true

# Create Let's Encrypt ClusterIssuer
echo ""
echo "📜 Creating Let's Encrypt ClusterIssuer..."

# Use a default email if LETSENCRYPT_EMAIL not set
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-noreply@freecelpiptest.com}"

cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
    name: letsencrypt-prod
spec:
    acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: $LETSENCRYPT_EMAIL
    privateKeySecretRef:
        name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
            class: nginx
EOF

echo ""
echo "✅ Kubernetes add-ons setup complete!"
echo ""
echo "⏳ Waiting for Ingress Controller to get external IP..."
sleep 15

INGRESS_IP=$(kubectl get svc nginx-ingress-ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")

if [ -z "$INGRESS_IP" ]; then
    echo "⚠️  External IP not yet assigned. Check status with:"
    echo "   kubectl get svc -n ingress-nginx --watch"
else
    echo "✅ Ingress External IP: $INGRESS_IP"
    echo ""
    echo "📋 DNS Configuration:"
    echo "   Point your domain A records to: $INGRESS_IP"
fi

echo ""
echo "🎉 Setup complete! Ready for application deployment."



================================================
FILE: components/analytics/google-analytics.tsx
================================================
"use client"

import Script from "next/script"

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-Q8HJ7ZQW5P"

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  )
}




================================================
FILE: components/blog/blog-card.tsx
================================================
"use client"

import Link from "next/link"
import { Clock, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlogPost } from "@/lib/blog"

interface BlogCardProps {
  post: BlogPost
  priority?: boolean
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const imageUrl = post.coverImage || post.featuredImage
  
  return (
    <Card className="card-hover h-full flex flex-col card-elevated overflow-hidden group border-border/50">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
            width={400}
            height={224}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
            <div className="text-muted-foreground text-sm opacity-50">No image</div>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-block px-3 py-1.5 rounded-md text-xs font-semibold bg-primary/90 backdrop-blur-sm text-white shadow-md">
            {post.category}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3 flex-1">
        <CardTitle className="text-base font-semibold mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-2.5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 opacity-70" />
            <span>{post.readingTime} min</span>
          </div>
          <span className="opacity-50">•</span>
          <div className="flex items-center gap-1.5">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-muted/80 text-muted-foreground border border-border/50"
              >
                <Tag className="h-3 w-3 opacity-60" />
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-muted-foreground opacity-70 self-center">+{post.tags.length - 2}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}




================================================
FILE: components/blog/blog-listing-skeleton.tsx
================================================
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BlogListingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="mb-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="card-modern">
            <CardHeader>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}




================================================
FILE: components/blog/blog-listing.tsx
================================================
"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Tag, X } from "lucide-react"
import { BlogCard } from "./blog-card"
import type { BlogPost } from "@/lib/blog"

interface BlogListingProps {
  posts: BlogPost[]
}

const categories = [
  "All",
  "Listening Tips",
  "Reading Tips",
  "Writing Tips",
  "Speaking Tips",
  "Test Strategy",
  "Success Stories",
]

export function BlogListing({ posts }: BlogListingProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag))

      return matchesSearch && matchesCategory && matchesTags
    })
  }, [posts, searchQuery, selectedCategory, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <div className="mb-10">
        <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Study Tips & Blog</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Expert strategies and proven techniques to help you succeed on your CELPIP test.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Tag Filter */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Filtered by:</span>
            {selectedTags.map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="sm"
                onClick={() => toggleTag(tag)}
                className="gap-2"
              >
                {tag}
                <X className="h-3 w-3" />
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Available Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium self-center">Tags:</span>
          {allTags.slice(0, 10).map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPosts.length} of {posts.length} articles
        </p>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}




================================================
FILE: components/blog/blog-post-view.tsx
================================================
import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogPostStructuredData } from "./structured-data"
import { BlogCard } from "./blog-card"
import { BlogTableOfContents } from "./blog-table-of-contents"
import { BlogSidebar } from "./blog-sidebar"
import { ShareButtons } from "./share-buttons"
import type { BlogPost } from "@/lib/blog"

interface BlogPostViewProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export function BlogPostView({ post, relatedPosts }: BlogPostViewProps) {

  return (
    <>
      <BlogPostStructuredData post={post} />
      <div className="flex min-h-screen bg-background">
        {/* Left Sidebar - Table of Contents */}
        <BlogTableOfContents content={post.content} />
        
        {/* Main Content */}
        <article className="flex-1 container mx-auto container-padding py-10 md:py-14 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8 whitespace-nowrap" size="sm">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
              <span>Back to Blog</span>
            </Link>
          </Button>

          {/* Cover Image */}
          {(post.coverImage || post.featuredImage) && (
            <div className="relative w-full h-64 md:h-96 mb-10 rounded-2xl overflow-hidden bg-muted">
              <img
                src={post.coverImage || post.featuredImage}
                alt={`${post.title} - Cover image`}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1200}
                height={630}
              />
            </div>
          )}

          <header
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold gradient-primary text-white mb-5 shadow-sm">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-gradient-primary">{post.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
            
            {/* Author and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-border/50">
              {/* Author Section */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                  {post.author ? post.author.charAt(0).toUpperCase() : 'F'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground leading-tight">{post.author || 'FreeCELPIPTest'}</div>
                  <div className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-border/60 hidden sm:block" />

              {/* Reading Time */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{post.readingTime} min read</span>
              </div>

              {/* Share Section */}
              <div className="ml-auto">
                <ShareButtons title={post.title} />
              </div>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12
              prose-headings:font-bold prose-headings:text-foreground 
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:scroll-mt-20 prose-h1:leading-tight
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:scroll-mt-20 prose-h2:leading-tight
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:scroll-mt-20 prose-h3:leading-tight
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
              prose-li:mb-2 prose-li:text-foreground/90 prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:my-6
              prose-code:text-primary prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
              prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:border prose-img:border-border
              prose-hr:border-border prose-hr:my-8
              prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-table:shadow-sm prose-table:rounded-lg prose-table:overflow-hidden prose-table:border prose-table:border-border
              prose-th:border prose-th:border-border prose-th:bg-muted/80 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-th:text-sm prose-th:first:rounded-tl-lg prose-th:last:rounded-tr-lg
              prose-td:border prose-td:border-border prose-td:p-4 prose-td:text-foreground/90 prose-td:text-sm prose-td:align-top
              prose-tr:border-b prose-tr:border-border prose-tr:last:border-b-0 prose-tr:hover:bg-muted/30 prose-tr:transition-colors
              prose-thead:bg-muted/50 prose-tbody:bg-background"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-12 pt-8 border-t border-border/50">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">Tagged:</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Button key={tag} variant="outline" size="sm" className="h-8 text-xs px-3 rounded-full" asChild>
                      <Link href={`/blog?tag=${tag}`} className="hover:text-primary">{tag}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t">
              <h2 className="heading-3 mb-8 text-gradient-primary">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Right Sidebar - Tools */}
        <BlogSidebar />
      </div>
    </>
  )
}




================================================
FILE: components/blog/blog-sidebar.tsx
================================================
"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, BookOpen } from "lucide-react"

export function BlogSidebar() {
  return (
    <aside className="hidden xl:block w-64 border-l border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🛠️</span>
            Useful Tools
          </h3>
          <div className="space-y-3">
            <Link href="/celpip-score-calculator" className="block">
              <Card className="card-hover card-elevated cursor-pointer transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold mb-1">Score Calculator</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">
                        Calculate your CELPIP score and CLB level
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            
            <Link href="/vocabulary-level-grader" className="block">
              <Card className="card-hover card-elevated cursor-pointer transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg gradient-reading flex items-center justify-center flex-shrink-0 shadow-md">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold mb-1">Vocabulary Grader</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">
                        Test your vocabulary level
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  )
}




================================================
FILE: components/blog/blog-table-of-contents.tsx
================================================
"use client"

import { useEffect, useState } from "react"
import { Hash } from "lucide-react"

interface TableOfContentsProps {
  content: string
}

export function BlogTableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from HTML content and add IDs
    const contentDiv = document.querySelector('.prose')
    if (!contentDiv) return

    const headingElements = contentDiv.querySelectorAll('h1, h2, h3')
    
    const extractedHeadings: { id: string; text: string; level: number }[] = []
    headingElements.forEach((heading, index) => {
      const text = heading.textContent || ''
      const id = heading.id || `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}`
      
      if (!heading.id) {
        heading.id = id
      }
      
      extractedHeadings.push({
        id,
        text,
        level: parseInt(heading.tagName.charAt(1))
      })
    })
    
    setHeadings(extractedHeadings)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i]
        if (element && element.offsetTop <= window.scrollY + 100) {
          setActiveId(element.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block w-64 border-r border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Hash className="h-3.5 w-3.5" />
          Table of Contents
        </h3>
        <ul className="space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${
                  heading.level === 1 ? 'pl-2 font-medium' : heading.level === 2 ? 'pl-4' : 'pl-6 text-xs'
                } ${
                  activeId === heading.id
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}




================================================
FILE: components/blog/share-buttons.tsx
================================================
"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin } from "lucide-react"

interface ShareButtonsProps {
  title: string
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = title

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Share</span>
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("twitter")}
          aria-label="Share on Twitter"
          className="h-8 w-8 p-0 hover:bg-primary/10 rounded-md"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("facebook")}
          aria-label="Share on Facebook"
          className="h-8 w-8 p-0 hover:bg-primary/10 rounded-md"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("linkedin")}
          aria-label="Share on LinkedIn"
          className="h-8 w-8 p-0 hover:bg-primary/10 rounded-md"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}




================================================
FILE: components/blog/structured-data.tsx
================================================
import type { BlogPost } from "@/lib/blog"

interface StructuredDataProps {
  post: BlogPost
}

export function BlogPostStructuredData({ post }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || "https://freecelpiptest.com/og-image.jpg",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: "FreeCELPIPTest",
    },
    publisher: {
      "@type": "Organization",
      name: "FreeCELPIPTest",
      logo: {
        "@type": "ImageObject",
        url: "https://freecelpiptest.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://freecelpiptest.com/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}




================================================
FILE: components/layout/footer.tsx
================================================
"use client"

import Link from "next/link"
import { useState } from "react"
import { Mail, MessageSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  // Feedback form state
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
    category: "general",
  })
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Successfully subscribed!" })
        setEmail("")
      } else {
        setMessage({ type: "error", text: "Something went wrong. Please try again." })
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingFeedback(true)
    setFeedbackMessage(null)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      })

      const data = await response.json()

      if (response.ok) {
        setFeedbackMessage({ type: "success", text: data.message || "Thank you for your feedback!" })
        setFeedbackData({ name: "", email: "", message: "", rating: 0, category: "general" })
        setTimeout(() => {
          setFeedbackOpen(false)
          setFeedbackMessage(null)
        }, 2000)
      } else {
        setFeedbackMessage({ type: "error", text: data.error || "Something went wrong. Please try again." })
      }
    } catch {
      setFeedbackMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const footerLinks = {
    Practice: [
      { name: "Listening", href: "/practice/listening" },
      { name: "Reading", href: "/practice/reading" },
      { name: "Writing", href: "/practice/writing" },
      { name: "Speaking", href: "/practice/speaking" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Study Resources", href: "/resources" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "/contact" },
    ],
  }

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto container-padding py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <span className="text-xl md:text-2xl font-bold text-gradient-primary tracking-tight">
                FreeCELPIPTest
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Master CELPIP with comprehensive practice tests, expert tips, and study resources designed to help you achieve your target score.
            </p>
            
            {/* Newsletter Signup */}
            <div>
              <h3 className="text-xs font-semibold mb-3 text-foreground">Get free CELPIP tips & test launch updates</h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" disabled={isSubmitting} size="sm">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {message && (
                  <p
                    className={`text-xs ${
                      message.type === "success"
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold mb-4 text-foreground">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors leading-relaxed"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FreeCELPIPTest. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Feedback Dialog */}
            <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <MessageSquare className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                  <span>Feedback</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Help Us Improve
                  </DialogTitle>
                  <DialogDescription>
                    Your feedback helps us make FreeCELPIPTest better. Share your thoughts, suggestions, or report issues.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="feedback-name" className="text-sm font-medium mb-2 block">
                      Name (optional)
                    </label>
                    <Input
                      id="feedback-name"
                      value={feedbackData.name}
                      onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-email" className="text-sm font-medium mb-2 block">
                      Email (optional)
                    </label>
                    <Input
                      id="feedback-email"
                      type="email"
                      value={feedbackData.email}
                      onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-category" className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <select
                      id="feedback-category"
                      value={feedbackData.category}
                      onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background text-sm"
                    >
                      <option value="general">General Feedback</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="content">Content Suggestion</option>
                      <option value="ui">UI/UX Improvement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackData({ ...feedbackData, rating })}
                          className={`p-2 rounded-lg transition-colors ${
                            feedbackData.rating >= rating
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Star
                            className={`h-5 w-5 ${feedbackData.rating >= rating ? "fill-current" : ""}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="feedback-message" className="text-sm font-medium mb-2 block">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="feedback-message"
                      value={feedbackData.message}
                      onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                      required
                      rows={4}
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      className="w-full p-3 rounded-lg resize-none border border-input bg-background text-sm"
                    />
                  </div>
                  {feedbackMessage && (
                    <p
                      className={`text-sm ${
                        feedbackMessage.type === "success"
                          ? "text-primary"
                          : "text-destructive"
                      }`}
                    >
                      {feedbackMessage.text}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFeedbackOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmittingFeedback || !feedbackData.message.trim()} className="flex-1 whitespace-nowrap">
                      {isSubmittingFeedback ? (
                        "Submitting..."
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Social Links */}
            {/* <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}




================================================
FILE: components/layout/header.tsx
================================================
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, User, LogOut, Bookmark, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileMenu } from "./mobile-menu"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: "Practice Tests",
      href: "/practice",
      submenu: [
        { name: "Listening", href: "/practice/listening" },
        { name: "Reading", href: "/practice/reading" },
        { name: "Writing", href: "/practice/writing" },
        { name: "Speaking", href: "/practice/speaking" },
      ],
    },
    { name: "Mock Tests", href: "/mock-tests" },
    { name: "Blog", href: "/blog" },
    { name: "Resources", href: "/resources" },
    {
      name: "Tools",
      href: "/celpip-score-calculator",
      submenu: [
        { name: "Score Calculator", href: "/celpip-score-calculator" },
        { name: "Vocabulary Grader", href: "/vocabulary-level-grader" },
      ],
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between container-padding" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0" aria-label="FreeCELPIPTest Home">
          <img
            src="/assets/logo-bg.png"
            alt="FreeCELPIPTest"
            className="h-8 md:h-10 w-auto logo-max-width"
            loading="eager"
            fetchPriority="high"
            width="140"
            height="40"
            decoding="async"
          />
        </Link>
        
        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => (
              item.submenu ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`text-sm font-medium h-9 px-4 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10 font-semibold"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href} className="cursor-pointer">{subItem.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium h-9 px-4 rounded-lg flex items-center transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/10"
                  }`}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </Link>
              )
            ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ThemeToggle />
          
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img
                    src={session.user.image || "/placeholder-avatar.png"}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[100]">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=saved" className="flex items-center">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved Articles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={(e) => {
              e.stopPropagation()
              setMobileMenuOpen(true)
            }}
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
        session={session}
      />
    </header>
  )
}




================================================
FILE: components/layout/mobile-menu.tsx
================================================
"use client"

import Link from "next/link"
import { signIn, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigation: Array<{
    name: string
    href: string
    submenu?: Array<{ name: string; href: string }>
  }>
  session: any
}

export function MobileMenu({ isOpen, onClose, navigation, session }: MobileMenuProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = "0px"
    } else {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [isOpen])

  // Handle escape key to close menu
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  const menuContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed right-0 top-0 h-screen w-[320px] max-w-[85vw] bg-background z-[9999] shadow-2xl border-l border-border flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <span className="text-lg font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
            type="button"
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                    }
                    className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium hover:bg-accent rounded-md transition-colors text-left"
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform flex-shrink-0 ${
                        openSubmenu === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSubmenu === item.name && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={onClose}
                          className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block py-2.5 px-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-accent"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2 flex-shrink-0">
          {session?.user ? (
            <>
              <Link href="/dashboard" onClick={onClose} className="block">
                <Button variant="outline" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  signOut()
                  onClose()
                }}
                type="button"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                signIn("google")
                onClose()
              }}
              type="button"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </>
  )

  // Render to portal to avoid parent constraints
  return createPortal(menuContent, document.body)
}



================================================
FILE: components/layout/theme-toggle.tsx
================================================
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}




================================================
FILE: components/practice/mock-test-tasks.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { Headphones, BookOpen, PenTool, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { sectionHeader, slideUp } from "@/lib/animations"

interface Task {
  id: string
  taskNumber: number
  name: string
}

interface Section {
  id: string
  name: string
  icon: typeof Headphones
  gradient: string
  tasks: Task[]
}

const sections: Section[] = [
  {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    gradient: "gradient-listening",
    tasks: [
      { id: "listening-1", taskNumber: 1, name: "Problem Solving" },
      { id: "listening-2", taskNumber: 2, name: "Daily Life Conversation" },
      { id: "listening-3", taskNumber: 3, name: "Information" },
      { id: "listening-4", taskNumber: 4, name: "News Item" },
      { id: "listening-5", taskNumber: 5, name: "Discussion" },
      { id: "listening-6", taskNumber: 6, name: "Viewpoints" },
    ],
  },
  {
    id: "reading",
    name: "Reading",
    icon: BookOpen,
    gradient: "gradient-reading",
    tasks: [
      { id: "reading-1", taskNumber: 1, name: "Correspondence" },
      { id: "reading-2", taskNumber: 2, name: "Apply a Diagram" },
      { id: "reading-3", taskNumber: 3, name: "Information" },
      { id: "reading-4", taskNumber: 4, name: "Viewpoints" },
    ],
  },
  {
    id: "writing",
    name: "Writing",
    icon: PenTool,
    gradient: "gradient-writing",
    tasks: [
      { id: "writing-1", taskNumber: 1, name: "Writing an Email" },
      { id: "writing-2", taskNumber: 2, name: "Survey Questions" },
    ],
  },
  {
    id: "speaking",
    name: "Speaking",
    icon: Mic,
    gradient: "gradient-speaking",
    tasks: [
      { id: "speaking-1", taskNumber: 1, name: "Giving Advice" },
      { id: "speaking-2", taskNumber: 2, name: "Personal Experience" },
      { id: "speaking-3", taskNumber: 3, name: "Describing a Scene" },
      { id: "speaking-4", taskNumber: 4, name: "Making Predictions" },
      { id: "speaking-5", taskNumber: 5, name: "Comparing and Persuading" },
      { id: "speaking-6", taskNumber: 6, name: "Difficult Situation" },
      { id: "speaking-7", taskNumber: 7, name: "Expressing Opinions" },
      { id: "speaking-8", taskNumber: 8, name: "Unusual Situation" },
    ],
  },
]

export function MockTestTasks() {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      {/* Page Header */}
      <motion.div
        className="mb-12"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-3 text-gradient-primary">Mock Tests</h1>
        <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
          Select a task to practice individual sections. Choose from Listening, Reading, Writing, and Speaking tasks.
        </p>
      </motion.div>

      {/* Sections Grid - 4 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.id}
              initial={slideUp.initial}
              animate={slideUp.animate}
              transition={{ ...slideUp.transition, delay: sectionIndex * 0.1 }}
              className="flex flex-col gap-4"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("h-10 w-10 rounded-xl", section.gradient, "flex items-center justify-center shadow-sm")}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{section.name}</h2>
                  <p className="text-xs text-muted-foreground">{section.tasks.length} tasks</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-3">
                {section.tasks.map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: sectionIndex * 0.1 + taskIndex * 0.03,
                    }}
                  >
                    <div
                      className={cn(
                        "p-4 bg-card border border-border rounded-lg",
                        "shadow-sm hover:shadow-md",
                        "transition-all duration-200",
                        "group"
                      )}
                    >
                      <div className="space-y-1">
                        {/* Task Number - smaller, muted text */}
                        <p className="text-xs text-muted-foreground font-normal leading-tight">
                          Task {task.taskNumber}
                        </p>
                        {/* Task Name - larger, bold, foreground text */}
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {task.name}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}



================================================
FILE: components/practice/mock-tests-dashboard.tsx
================================================
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, CheckCircle2, AlertCircle, Mail, Play, Pause, ArrowRight } from "lucide-react"

export function MockTestsDashboard() {
  const [timeRemaining, setTimeRemaining] = useState(18000) // 5 hours in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const sections = [
    { id: "listening", name: "Listening", duration: 47, completed: false },
    { id: "reading", name: "Reading", duration: 55, completed: false },
    { id: "writing", name: "Writing", duration: 53, completed: false },
    { id: "speaking", name: "Speaking", duration: 20, completed: false },
  ]

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="card-modern mb-8 card-elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-semibold mb-2 text-gradient-primary">Test Results</CardTitle>
              <CardDescription className="text-sm">Your CELPIP Mock Test Performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sections.map((section) => (
                  <div key={section.id} className="text-center p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">{section.name}</p>
                    <p className="text-xl font-bold text-foreground">--</p>
                    <p className="text-xs text-muted-foreground mt-1">Score</p>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t">
                <p className="text-center text-sm text-muted-foreground mb-5 leading-relaxed">
                  Complete mock tests with scoring are coming soon!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                    Back to Test
                  </Button>
                  <Button size="sm" onClick={() => setShowResults(false)}>
                    Take Another Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Mock Tests</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Practice with sample questions and exercises to help you prepare for the CELPIP test format and timing.
        </p>
      </motion.div>

      {!currentSection ? (
        <div className="space-y-6">
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Start Mock Test</CardTitle>
              <CardDescription className="text-sm">
                Complete all 4 sections: Listening, Reading, Writing, and Speaking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-4 bg-muted/30 rounded-xl flex items-center justify-between hover:bg-muted/50 border border-border transition-all"
                  >
                    <div>
                      <p className="font-semibold text-sm">{section.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{section.duration} minutes</p>
                    </div>
                    {section.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-4">
                  Total test duration: Approximately 3 hours
                </p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setCurrentSection("listening")
                    setIsRunning(true)
                  }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Mock Test
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern border-primary/20 card-elevated">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-gradient-primary">Complete mock tests coming soon</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    We're building practice exercises with sample questions to help you prepare. These are not official CELPIP materials.
                    Sign up to get notified when it's ready!
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="Enter your email" className="flex-1 text-sm" />
                    <Button size="sm">
                      <Mail className="mr-2 h-3.5 w-3.5" />
                      Notify Me
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold mb-1">
                    {sections.find((s) => s.id === currentSection)?.name} Section
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Question 1 of 10
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-lg font-mono font-semibold">{formatTime(timeRemaining)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Time Remaining</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-3.5 w-3.5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-3.5 w-3.5" />
                        Resume
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-2.5">
                  <span className="font-medium text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">1 / 10 questions</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all duration-500 progress-bar-width-10" />
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-5 mb-5 border border-border">
                <p className="text-center text-muted-foreground">
                  Mock test interface preview. Full test experience coming soon!
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentSection(null)}>
                  Exit Test
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">Previous</Button>
                  <Button>Next Question</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Section Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={currentSection === section.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setCurrentSection(section.id)}
                  >
                    {section.name}
                  </Button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => setShowResults(true)}
                >
                  Submit Test
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}




================================================
FILE: components/practice/practice-section-tasks.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Headphones, BookOpen, PenTool, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { sectionHeader, slideUp } from "@/lib/animations"

interface Task {
  id: string
  taskNumber: number
  name: string
}

interface SectionConfig {
  id: string
  name: string
  icon: typeof Headphones
  gradient: string
  description: string
  tasks: Task[]
}

const sectionConfigs: Record<string, SectionConfig> = {
  listening: {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    gradient: "gradient-listening",
    description: "Practice listening comprehension with audio recordings and questions.",
    tasks: [
      { id: "listening-1", taskNumber: 1, name: "Problem Solving" },
      { id: "listening-2", taskNumber: 2, name: "Daily Life Conversation" },
      { id: "listening-3", taskNumber: 3, name: "Information" },
      { id: "listening-4", taskNumber: 4, name: "News Item" },
      { id: "listening-5", taskNumber: 5, name: "Discussion" },
      { id: "listening-6", taskNumber: 6, name: "Viewpoints" },
    ],
  },
  reading: {
    id: "reading",
    name: "Reading",
    icon: BookOpen,
    gradient: "gradient-reading",
    description: "Improve your reading skills with passages and comprehension questions.",
    tasks: [
      { id: "reading-1", taskNumber: 1, name: "Correspondence" },
      { id: "reading-2", taskNumber: 2, name: "Apply a Diagram" },
      { id: "reading-3", taskNumber: 3, name: "Information" },
      { id: "reading-4", taskNumber: 4, name: "Viewpoints" },
    ],
  },
  writing: {
    id: "writing",
    name: "Writing",
    icon: PenTool,
    gradient: "gradient-writing",
    description: "Master email and essay writing with guided practice exercises.",
    tasks: [
      { id: "writing-1", taskNumber: 1, name: "Writing an Email" },
      { id: "writing-2", taskNumber: 2, name: "Survey Questions" },
    ],
  },
  speaking: {
    id: "speaking",
    name: "Speaking",
    icon: Mic,
    gradient: "gradient-speaking",
    description: "Improve your speaking fluency and pronunciation with practice tasks.",
    tasks: [
      { id: "speaking-1", taskNumber: 1, name: "Giving Advice" },
      { id: "speaking-2", taskNumber: 2, name: "Personal Experience" },
      { id: "speaking-3", taskNumber: 3, name: "Describing a Scene" },
      { id: "speaking-4", taskNumber: 4, name: "Making Predictions" },
      { id: "speaking-5", taskNumber: 5, name: "Comparing and Persuading" },
      { id: "speaking-6", taskNumber: 6, name: "Difficult Situation" },
      { id: "speaking-7", taskNumber: 7, name: "Expressing Opinions" },
      { id: "speaking-8", taskNumber: 8, name: "Unusual Situation" },
    ],
  },
}

interface PracticeSectionTasksProps {
  section: string
}

export function PracticeSectionTasks({ section }: PracticeSectionTasksProps) {
  const config = sectionConfigs[section.toLowerCase()]
  
  if (!config) {
    return null
  }

  const Icon = config.icon

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button variant="ghost" asChild className="whitespace-nowrap" size="sm">
          <Link href="/practice" className="flex items-center">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
            <span>Back to Practice Tests</span>
          </Link>
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        className="mb-12"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={cn("h-12 w-12 rounded-xl", config.gradient, "flex items-center justify-center shadow-sm")}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="heading-2 mb-2 text-gradient-primary">{config.name} Practice</h1>
            <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={slideUp.initial}
            animate={slideUp.animate}
            transition={{ ...slideUp.transition, delay: index * 0.05 }}
          >
            <div
              className={cn(
                "p-5 bg-card border border-border rounded-lg",
                "shadow-sm hover:shadow-md hover:border-primary/20",
                "transition-all duration-200",
                "group"
              )}
            >
              <div className="space-y-2">
                {/* Task Number - smaller, muted text */}
                <p className="text-xs text-muted-foreground font-normal">
                  Task {task.taskNumber}
                </p>
                {/* Task Name - larger, bold, foreground text */}
                <p className="text-base font-semibold text-foreground leading-tight">
                  {task.name}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}



================================================
FILE: components/practice/practice-section.tsx
================================================
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Headphones, BookOpen, PenTool, Mic, Clock, Play, Pause, ArrowLeft, Bell } from "lucide-react"
import Link from "next/link"

interface PracticeSectionProps {
  section: string
}

const sectionConfig = {
  listening: {
    name: "Listening",
    icon: Headphones,
    description: "Listen to audio recordings and answer comprehension questions.",
    gradient: "gradient-listening",
  },
  reading: {
    name: "Reading",
    icon: BookOpen,
    description: "Read passages and answer questions to test your comprehension.",
    gradient: "gradient-reading",
  },
  writing: {
    name: "Writing",
    icon: PenTool,
    description: "Practice writing emails and essays with guided exercises.",
    gradient: "gradient-writing",
  },
  speaking: {
    name: "Speaking",
    icon: Mic,
    description: "Practice speaking tasks and improve your fluency.",
    gradient: "gradient-speaking",
  },
}

export function PracticeSection({ section }: PracticeSectionProps) {
  const config = sectionConfig[section as keyof typeof sectionConfig]
  const Icon = config.icon
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [writingText, setWritingText] = useState("")

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isPlaying, timeRemaining])

  // Mock questions
  const mockQuestions = {
    listening: [
      { id: 1, question: "What is the main topic of the conversation?", options: ["A) Weather", "B) Travel plans", "C) Restaurant", "D) Shopping"] },
      { id: 2, question: "Where does the conversation take place?", options: ["A) Airport", "B) Hotel", "C) Restaurant", "D) Office"] },
    ],
    reading: [
      { id: 1, question: "What is the main idea of the passage?", options: ["A) Climate change", "B) Technology", "C) Education", "D) Health"] },
      { id: 2, question: "According to the passage, what is mentioned about...?", options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"] },
    ],
    writing: {
      task: "Write an email to your professor explaining why you missed class yesterday.",
      wordCount: 150,
    },
    speaking: [
      { id: 1, task: "Describe a memorable vacation you took.", time: 60 },
      { id: 2, task: "Give advice to someone planning to visit your country.", time: 90 },
    ],
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const wordCount = writingText.split(/\s+/).filter(word => word.length > 0).length

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <Button variant="ghost" asChild className="mb-6 whitespace-nowrap" size="sm">
        <Link href="/practice" className="flex items-center">
          <ArrowLeft className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
          <span>Back to Practice Tests</span>
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${config.gradient} flex items-center justify-center shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gradient-primary">{config.name} Practice</CardTitle>
                  <CardDescription className="text-sm">{config.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Notification Banner */}
          <Card className="card-modern border-primary/20 card-elevated">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1.5">Full version launching soon</p>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    This is a preview interface. Sign up to get notified when complete practice tests are available.
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="Enter your email" className="flex-1 text-sm" />
                    <Button size="sm">Notify Me</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Interface */}
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold mb-1">Question {currentQuestion}</CardTitle>
                  <CardDescription className="text-xs">
                    {section === "listening" && "Listen to the audio and answer the questions"}
                    {section === "reading" && "Read the passage and answer the questions"}
                    {section === "writing" && "Complete the writing task"}
                    {section === "speaking" && "Record your response"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Listening Interface */}
              {section === "listening" && (
                <>
                  <div className="bg-muted/30 rounded-lg p-5 text-center border border-border">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="mb-4"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Play Audio
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Audio player preview - Full audio will be available in the complete version
                    </p>
                  </div>
                  {mockQuestions.listening.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <p className="font-medium">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option) => (
                          <Button
                            key={option}
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Reading Interface */}
              {section === "reading" && (
                <>
                  <div className="bg-muted/30 rounded-lg p-5 max-h-64 overflow-y-auto border border-border">
                    <p className="text-sm leading-relaxed">
                      This is a sample reading passage. In the full version, you'll see complete passages
                      with multiple paragraphs. Read carefully and answer the questions below.
                    </p>
                    <p className="text-sm leading-relaxed mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                  {mockQuestions.reading.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <p className="font-medium">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option) => (
                          <Button
                            key={option}
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Writing Interface */}
              {section === "writing" && (
                <>
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <p className="font-medium mb-2">Task:</p>
                      <p className="text-sm">{mockQuestions.writing.task}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Word count: {mockQuestions.writing.wordCount} words
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Word count: {wordCount} / {mockQuestions.writing.wordCount}</span>
                        <span>Time remaining: {formatTime(timeRemaining)}</span>
                      </div>
                      <textarea
                        value={writingText}
                        onChange={(e) => setWritingText(e.target.value)}
                        className="w-full h-64 p-4 rounded-lg resize-none border border-input bg-background"
                        placeholder="Start typing your response here..."
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Speaking Interface */}
              {section === "speaking" && (
                <>
                  {mockQuestions.speaking.map((task) => (
                    <div key={task.id} className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <p className="font-medium mb-2">Task {task.id}:</p>
                        <p className="text-sm">{task.task}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Preparation time: 30 seconds | Speaking time: {task.time} seconds
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <Button size="lg" variant="outline" className="w-full">
                          <Mic className="mr-2 h-5 w-5" />
                          Start Recording
                        </Button>
                        <div className="text-sm text-muted-foreground text-center">
                          Recording interface preview - Full recording functionality coming soon
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  disabled={currentQuestion === 1}
                  onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                  Next Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full progress-bar-width-0" />
                </div>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions Completed</span>
                  <span>0 / 10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Spent</span>
                  <span>0 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Save Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in with Google to save your progress and access your practice history.
              </p>
              <Button className="w-full" variant="outline">
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}




================================================
FILE: components/practice/practice-tests-landing.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Headphones, BookOpen, PenTool, Mic, ArrowRight, TrendingUp } from "lucide-react"
import { sectionHeader, cardItem, slideUp } from "@/lib/animations"

const sections = [
  {
    name: "Listening",
    href: "/practice/listening",
    icon: Headphones,
    description: "Practice with audio recordings and improve your listening comprehension skills.",
    gradient: "gradient-listening",
  },
  {
    name: "Reading",
    href: "/practice/reading",
    icon: BookOpen,
    description: "Enhance your reading skills with passages and comprehension questions.",
    gradient: "gradient-reading",
  },
  {
    name: "Writing",
    href: "/practice/writing",
    icon: PenTool,
    description: "Master email and essay writing with guided practice exercises.",
    gradient: "gradient-writing",
  },
  {
    name: "Speaking",
    href: "/practice/speaking",
    icon: Mic,
    description: "Improve your speaking fluency and pronunciation with practice tasks.",
    gradient: "gradient-speaking",
  },
]

export function PracticeTestsLanding() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-10"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Practice Tests</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Practice all four sections of the CELPIP test with sample questions and exercises to help you prepare.
        </p>
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.name}
              initial={cardItem(index).initial}
              animate={isInView ? cardItem(index).animate : cardItem(index).initial}
              transition={cardItem(index).transition}
            >
              <Card className="card-hover h-full card-elevated">
                <CardHeader className="pb-3">
                  <div className={`inline-flex h-12 w-12 rounded-xl ${section.gradient} items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-1.5 text-gradient-primary">{section.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="font-semibold text-foreground">0%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${section.gradient} rounded-full transition-all duration-500 progress-bar-width-0`} />
                    </div>
                  </div>
                  <Button className="w-full whitespace-nowrap" asChild>
                    <Link href={section.href} className="flex items-center justify-center">
                      <span>Start Practice</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={slideUp.initial}
        animate={isInView ? slideUp.animate : slideUp.initial}
        transition={{ ...slideUp.transition, delay: 0.4 }}
        className="card-modern rounded-xl p-5 mb-6 border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gradient-primary">Full version launching soon</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              We're working on the complete practice test experience. Sign up to get notified when full practice tests are available!
            </p>
            <Button variant="outline" size="sm">Sign up for updates</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}




================================================
FILE: components/providers/session-provider.tsx
================================================
"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}




================================================
FILE: components/providers/theme-provider.tsx
================================================
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}




================================================
FILE: components/sections/about-celpip.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Headphones, BookOpen, PenTool, Mic, Clock, Award } from "lucide-react"
import { sectionHeader, slideUp } from "@/lib/animations"

const sections = [
  {
    name: "Listening",
    icon: Headphones,
    duration: "47-55 minutes",
    tasks: "6 parts",
    description: "Listen to audio recordings and answer comprehension questions covering various everyday situations.",
    gradient: "gradient-listening",
  },
  {
    name: "Reading",
    icon: BookOpen,
    duration: "55-60 minutes",
    tasks: "4 parts",
    description: "Read passages and answer questions to test comprehension of various text types.",
    gradient: "gradient-reading",
  },
  {
    name: "Writing",
    icon: PenTool,
    duration: "53-60 minutes",
    tasks: "2 tasks",
    description: "Task 1: Write an email (150-200 words). Task 2: Write an essay (200-300 words) responding to a question.",
    gradient: "gradient-writing",
  },
  {
    name: "Speaking",
    icon: Mic,
    duration: "15-20 minutes",
    tasks: "8 tasks",
    description: "Complete various speaking tasks using a computer, including describing scenes, giving advice, and expressing opinions.",
    gradient: "gradient-speaking",
  },
]

export function AboutCELPIP() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-10"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-3 text-gradient-primary">About the CELPIP Test</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about the Canadian English Language Proficiency Index Program (CELPIP).
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ ...slideUp.transition, delay: 0.2 }}
        className="mb-12"
      >
        <Card className="card-modern border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Important Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This website is NOT affiliated with or endorsed by CELPIP. We are an independent study resource
                  providing free practice materials and study guides to help students prepare for the CELPIP test.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* What is CELPIP */}
      <motion.div
        ref={ref}
        initial={sectionHeader.initial}
        animate={isInView ? sectionHeader.animate : sectionHeader.initial}
        transition={sectionHeader.transition}
        className="mb-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">What is CELPIP?</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The Canadian English Language Proficiency Index Program (CELPIP) is an English language test
              designed for Canadian immigration and citizenship purposes. It assesses your English language skills
              in real-world situations.
            </p>
            <p>
              CELPIP is accepted by Immigration, Refugees and Citizenship Canada (IRCC) for permanent residence
              and citizenship applications. The test is computer-delivered and can be taken at designated test
              centers across Canada and internationally.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Format */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-3 mb-6 text-gradient-primary">Test Format</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.name} className="card-hover card-elevated">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`h-12 w-12 rounded-xl ${section.gradient} flex items-center justify-center shadow-sm`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{section.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold text-foreground">{section.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Award className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="font-semibold text-foreground">{section.tasks}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{section.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Scoring System */}
      <motion.div
        initial={slideUp.initial}
        animate={isInView ? slideUp.animate : slideUp.initial}
        transition={{ ...slideUp.transition, delay: 0.4 }}
        className="mb-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">Scoring System</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              CELPIP uses a scale from 1 to 12 for each section, which corresponds to the Canadian Language
              Benchmark (CLB) levels. Each section is scored independently, and immigration programs typically
              require minimum scores in each section rather than an overall average.
            </p>
            <ul>
              <li><strong>CLB 4-5:</strong> Basic proficiency</li>
              <li><strong>CLB 6-7:</strong> Intermediate proficiency</li>
              <li><strong>CLB 8-9:</strong> Advanced proficiency</li>
              <li><strong>CLB 10-12:</strong> Expert proficiency</li>
            </ul>
            <p>
              Most immigration programs require minimum CLB levels in each section (typically CLB 7 or higher) depending on
              the program and your specific circumstances. It's important to meet the minimum requirement in all four sections,
              as programs typically don't accept an average score.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Day Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ ...slideUp.transition, delay: 0.6 }}
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">Test Day Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Arrive at least 30 minutes before your scheduled test time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Bring valid identification (passport or government-issued ID)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Get a good night's sleep and eat a healthy meal before the test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Familiarize yourself with the test center location beforehand</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Stay calm and manage your time effectively during the test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Read all instructions carefully before starting each section</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}




================================================
FILE: components/sections/about-content.tsx
================================================
export function AboutContent() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto container-padding max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="heading-2 mb-6 text-gradient-primary">Understanding the CELPIP Test</h2>
          
          <div className="space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              The Canadian English Language Proficiency Index Program (CELPIP) is a comprehensive English language assessment test designed specifically for Canadian immigration and citizenship purposes. Developed by Paragon Testing Enterprises, CELPIP evaluates your English language abilities across four essential skills: Listening, Reading, Writing, and Speaking.
            </p>

            <p>
              CELPIP is recognized by Immigration, Refugees and Citizenship Canada (IRCC) as proof of English language proficiency for various immigration programs, including Express Entry, Provincial Nominee Programs, and Canadian citizenship applications. The test is computer-delivered and can be taken at designated test centers across Canada and internationally.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-foreground">Test Structure and Format</h3>
            
            <p>
              The CELPIP test consists of four sections, each designed to assess different aspects of your English language proficiency. The Listening section includes various audio recordings with questions that test your ability to understand spoken English in everyday situations. The Reading section evaluates your comprehension skills through passages covering different topics and question types.
            </p>

            <p>
              The Writing section requires you to complete two tasks: writing an email and responding to survey questions. This section assesses your ability to communicate effectively in written English. The Speaking section includes eight different tasks that evaluate your ability to express yourself clearly and coherently in spoken English, covering scenarios from describing personal experiences to making predictions.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-foreground">Scoring and CLB Levels</h3>
            
            <p>
              CELPIP scores are reported on a scale from 1 to 12 for each section, which directly correspond to Canadian Language Benchmark (CLB) levels. Unlike some other language tests, CELPIP does not average your section scores. Each section is scored independently, and immigration programs typically require minimum scores in each individual section rather than an overall average.
            </p>

            <p>
              Understanding your target CLB level is crucial for effective preparation. Different immigration programs have different language requirements, with most programs requiring CLB 7 or higher in all four sections. Some programs, such as Express Entry, may require CLB 9 or higher for maximum points. Our score calculator can help you understand how your practice scores translate to CLB levels.
            </p>

            <h3 className="text-2xl font-semibold mt-8 mb-4 text-foreground">Preparation Strategies</h3>
            
            <p>
              Effective CELPIP preparation involves understanding the test format, practicing with realistic materials, and developing strategies for each section. Familiarizing yourself with Canadian English accents and contexts is particularly important for the Listening and Speaking sections. Regular practice with sample questions and timed exercises helps build confidence and improves performance.
            </p>

            <p>
              Our platform provides comprehensive practice materials, expert study guides, and proven strategies to help you achieve your target score. Whether you're preparing for Express Entry, a Provincial Nominee Program, or Canadian citizenship, we offer the resources you need to succeed on your CELPIP test.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}




================================================
FILE: components/sections/contact-page.tsx
================================================
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MessageSquare, HelpCircle, Send, CheckCircle2 } from "lucide-react"
import { sectionHeader, slideUp } from "@/lib/animations"

const faqs = [
  {
    question: "Is FreeCELPIPTest really free?",
    answer: "Yes! All our practice tests, study guides, and resources are completely free. We're committed to providing free CELPIP preparation materials forever.",
  },
  {
    question: "Do I need to create an account?",
    answer: "Creating an account is optional but recommended. It allows you to save your progress, bookmark articles, and get notified when new features are available.",
  },
  {
    question: "Are the practice tests similar to the real CELPIP test?",
    answer: "Our practice exercises follow the CELPIP test format to help you prepare. However, we are not affiliated with CELPIP, and these are sample practice materials only, not official test questions.",
  },
  {
    question: "When will full mock tests be available?",
    answer: "We're working on complete mock tests with scoring. Sign up for our newsletter to get notified when they're ready!",
  },
  {
    question: "Can I use this website on mobile?",
    answer: "Yes! Our website is fully responsive and works great on mobile devices, tablets, and desktops.",
  },
  {
    question: "How can I improve my CELPIP score?",
    answer: "Practice regularly with our materials, focus on your weakest sections, read our blog for tips and strategies, and take full-length practice tests to build stamina.",
  },
]

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })

    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-4 text-gradient-primary">Contact Us</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Have questions? We'd love to hear from you. Get in touch and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="card-modern card-elevated">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Send us a Message</CardTitle>
              <CardDescription className="text-sm">
                Fill out the form below and we'll get back to you within 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-base font-semibold mb-1.5 text-gradient-primary">Message Sent!</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We've received your message and will get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium mb-2 block">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium mb-2 block">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full p-4 rounded-lg resize-none border border-input bg-background"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full whitespace-nowrap">
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div>
          <Card className="card-modern card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Email</p>
                  <p className="text-xs text-muted-foreground">contact@freecelpiptest.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Response Time</p>
                  <p className="text-xs text-muted-foreground">24-48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQs Below Contact Form */}
      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ ...slideUp.transition, delay: 0.3 }}
        className="mt-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-sm">
              Find answers to common questions about FreeCELPIPTest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="font-semibold text-sm mb-2">{faq.question}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}




================================================
FILE: components/sections/featured-blog.tsx
================================================
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"

// Placeholder blog posts - will be replaced with actual data from markdown files
const featuredPosts = [
  {
    slug: "top-10-celpip-listening-tips",
    title: "Top 10 CELPIP Listening Tips for Success",
    excerpt: "Master the listening section with these proven strategies and techniques.",
    category: "Listening Tips",
    readingTime: 5,
  },
  {
    slug: "celpip-writing-task-1-guide",
    title: "Complete Guide to CELPIP Writing Task 1",
    excerpt: "Learn how to structure and write effective emails for the CELPIP writing test.",
    category: "Writing Tips",
    readingTime: 8,
  },
  {
    slug: "improve-celpip-speaking-score",
    title: "How to Improve Your CELPIP Speaking Score",
    excerpt: "Practical tips and practice strategies to boost your speaking performance.",
    category: "Speaking Tips",
    readingTime: 6,
  },
]

export function FeaturedBlog() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="heading-2 mb-2 text-gradient-primary">Latest Study Tips</h2>
            <p className="text-base text-muted-foreground">
              Expert advice to help you excel on your CELPIP test.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex whitespace-nowrap" asChild>
            <Link href="/blog" className="flex items-center">
              <span>View All</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredPosts.map((post) => (
            <Card key={post.slug} className="card-hover h-full flex flex-col card-elevated">
              <CardHeader className="pb-3">
                <div className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold gradient-primary text-white mb-2.5 shadow-sm">
                  {post.category}
                </div>
                <CardTitle className="text-base font-semibold mb-1.5 leading-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readingTime} min</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                    <Link href={`/blog/${post.slug}`} className="flex items-center">
                      Read
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}




================================================
FILE: components/sections/getting-started-guide.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Target, TrendingUp, Award } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"

const steps = [
  {
    number: 1,
    title: "Understand the Test Format",
    description: "Learn about the four sections: Listening, Reading, Writing, and Speaking. Each section has specific tasks and time limits.",
    icon: BookOpen,
    link: "/about-celpip",
  },
  {
    number: 2,
    title: "Assess Your Current Level",
    description: "Take a practice test to identify your strengths and areas for improvement.",
    icon: Target,
    link: "/practice",
  },
  {
    number: 3,
    title: "Create a Study Plan",
    description: "Set realistic goals and create a study schedule based on your test date and current level.",
    icon: TrendingUp,
    link: "/resources",
  },
  {
    number: 4,
    title: "Practice Regularly",
    description: "Use our free practice tests and study resources to improve your skills consistently.",
    icon: Award,
    link: "/practice",
  },
]

const timeline = [
  { week: "Week 1-2", task: "Familiarize yourself with test format and take initial practice test" },
  { week: "Week 3-4", task: "Focus on weakest section with targeted practice" },
  { week: "Week 5-6", task: "Practice all sections and review study materials" },
  { week: "Week 7-8", task: "Take full mock tests and refine strategies" },
]

export function GettingStartedGuide() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-4 text-gradient-primary">Getting Started with CELPIP</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your complete guide to CELPIP test preparation. Follow these steps to start your journey.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.number}
              ref={index === 0 ? ref : null}
              initial={cardItem(index).initial}
              animate={isInView ? cardItem(index).animate : cardItem(index).initial}
              transition={cardItem(index).transition}
            >
              <Card className="card-hover h-full card-elevated">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-12 w-12 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-base shadow-md">
                      {step.number}
                    </div>
                    <div className="h-10 w-10 rounded-xl gradient-primary/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-5 leading-relaxed">
                    {step.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                    <Link href={step.link} className="flex items-center">
                      <span>Learn More</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 flex-shrink-0" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">8-Week Study Roadmap</CardTitle>
            <CardDescription className="text-sm">
              Recommended study path for optimal preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center font-semibold text-xs text-white shadow-md">
                      {item.week}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-muted mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-sm leading-relaxed">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="card-hover card-elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Practice Tests</CardTitle>
            <CardDescription className="text-xs">Start practicing all test sections</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className="w-full whitespace-nowrap" size="sm">
              <Link href="/practice" className="flex items-center justify-center">
                <span>Start Practice</span>
                <ArrowRight className="ml-2 h-3.5 w-3.5 flex-shrink-0" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover card-elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Study Resources</CardTitle>
            <CardDescription className="text-xs">Download guides and tips</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" asChild className="w-full" size="sm">
              <Link href="/resources">
                View Resources
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover card-elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Study Tips</CardTitle>
            <CardDescription className="text-xs">Read expert strategies</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" asChild className="w-full" size="sm">
              <Link href="/blog">
                Read Blog
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}




================================================
FILE: components/sections/hero-section.tsx
================================================
import Link from "next/link"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-accent/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03),transparent_50%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Master CELPIP with{" "}
            <span className="text-gradient-primary">
              Free Practice Tests
            </span>{" "}
            & Expert Tips
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Prepare for your CELPIP test with comprehensive practice materials, study guides, and
            expert strategies designed to help you achieve your target score.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-base px-6 py-3 shadow-md whitespace-nowrap" asChild>
              <Link href="/practice" className="flex items-center">
                <span>Start Free Practice</span>
                <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-6 py-3 border whitespace-nowrap" asChild>
              <Link href="/blog" className="flex items-center">
                <span>Read Study Tips</span>
                <Play className="ml-2 h-4 w-4 flex-shrink-0" />
              </Link>
            </Button>
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/15 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span className="font-medium text-foreground">Comprehensive Practice Materials</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-chart-2/15 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-chart-2 flex-shrink-0" />
              <span className="font-medium text-foreground">All 4 Test Sections</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-chart-3/15 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-chart-3 flex-shrink-0" />
              <span className="font-medium text-foreground">Expert Study Guides</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




================================================
FILE: components/sections/how-it-works.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, BookOpen, Target, Award } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign Up Free",
    description: "Create your free account in seconds with Google. No credit card required.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Start Practicing",
    description: "Access practice tests for all 4 sections: Listening, Reading, Writing, and Speaking.",
  },
  {
    number: "03",
    icon: Target,
    title: "Track Progress",
    description: "Monitor your improvement with detailed progress tracking and performance analytics.",
  },
  {
    number: "04",
    icon: Award,
    title: "Achieve Your Goal",
    description: "Use expert tips and strategies to reach your target CELPIP score.",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <motion.div
          className="text-center mb-10"
          initial={sectionHeader.initial}
          animate={isInView ? sectionHeader.animate : sectionHeader.initial}
          transition={sectionHeader.transition}
        >
          <h2 className="heading-2 mb-2 text-gradient-primary">How It Works</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get started in minutes and begin your CELPIP preparation journey today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={cardItem(index).initial}
                animate={isInView ? cardItem(index).animate : cardItem(index).initial}
                transition={cardItem(index).transition}
                className="relative"
              >
                <Card className="card-hover h-full relative card-elevated">
                  <div className="absolute -top-2.5 -left-2.5 h-8 w-8 rounded-lg gradient-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {step.number}
                  </div>
                  <CardHeader className="pt-4 pb-3">
                    <div className="mx-auto mb-3 h-11 w-11 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-base font-semibold text-gradient-primary mb-1.5">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}




================================================
FILE: components/sections/statistics.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Users, TrendingUp, BookOpen, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { sectionHeader, cardItem } from "@/lib/animations"

const stats = [
  {
    number: "10K+",
    label: "Active Students",
    icon: Users,
    color: "gradient-primary",
  },
  {
    number: "95%",
    label: "Success Rate",
    icon: TrendingUp,
    color: "gradient-listening",
  },
  {
    number: "4",
    label: "Test Sections",
    icon: BookOpen,
    color: "gradient-reading",
  },
  {
    number: "4",
    label: "Test Sections",
    icon: Award,
    color: "gradient-writing",
  },
]

export function Statistics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <motion.div
          className="text-center mb-8"
          initial={sectionHeader.initial}
          animate={isInView ? sectionHeader.animate : sectionHeader.initial}
          transition={sectionHeader.transition}
        >
          <h2 className="heading-2 mb-2 text-gradient-primary">Trusted by Thousands</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a growing community of students achieving their CELPIP goals
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={cardItem(index).initial}
                animate={isInView ? cardItem(index).animate : cardItem(index).initial}
                transition={cardItem(index).transition}
              >
                <Card className="stat-card">
                  <CardContent className="p-4">
                    <div className={`mx-auto mb-3 h-9 w-9 rounded-lg ${stat.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="stat-card-number">{stat.number}</div>
                    <div className="stat-card-label">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}




================================================
FILE: components/sections/study-resources.tsx
================================================
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle2, ArrowRight, FileText, Target, Lightbulb, Clock, Award, Hash } from "lucide-react"
import { sectionHeader, slideUp } from "@/lib/animations"

const sidebarItems = [
  { id: "get-started", title: "Get Started", icon: BookOpen },
  { id: "prerequisites", title: "Prerequisites", icon: Target },
  { id: "understanding-celpip", title: "Understanding CELPIP", icon: FileText },
  { id: "test-format", title: "Test Format", icon: FileText },
  { id: "study-guides", title: "Study Guides", icon: BookOpen },
  { id: "quick-tips", title: "Quick Tips", icon: Lightbulb },
  { id: "study-plan", title: "Study Plan", icon: Clock },
]

const getStartedSteps = [
  {
    title: "Understanding CELPIP",
    description: "Learn what the CELPIP test is, its format, and how it's scored.",
    icon: BookOpen,
    href: "#understanding-celpip",
  },
  {
    title: "Test Format Overview",
    description: "Get familiar with all four sections: Listening, Reading, Writing, and Speaking.",
    icon: FileText,
    href: "#test-format",
  },
  {
    title: "Prerequisites",
    description: "What you need to know before starting your CELPIP preparation journey.",
    icon: Target,
    href: "#prerequisites",
  },
  {
    title: "Study Plan",
    description: "Create an effective study schedule based on your test date and current level.",
    icon: Clock,
    href: "#study-plan",
  },
]

const prerequisites = [
  "Basic understanding of English grammar and vocabulary",
  "Ability to read and write in English at an intermediate level",
  "Access to a computer with internet connection for practice tests",
  "Dedication to practice regularly (recommended: 2-3 hours per week minimum)",
  "Understanding of Canadian English accents (for Listening section)",
]

const studyGuides = [
  {
    name: "Complete CELPIP Test Guide",
    icon: FileText,
    description: "Comprehensive guide covering all test sections, scoring, and test day tips",
  },
  {
    name: "Writing Task Templates",
    icon: BookOpen,
    description: "Email and essay templates with examples and scoring criteria",
  },
  {
    name: "Speaking Task Strategies",
    icon: Lightbulb,
    description: "Tips and frameworks for all 8 speaking tasks with practice prompts",
  },
  {
    name: "Time Management Guide",
    icon: Clock,
    description: "Strategies to manage time effectively during each section of the test",
  },
]

const quickTips = [
  "Practice regularly with sample questions and exercises",
  "Focus on your weakest section but don't neglect others",
  "Time yourself during practice to build speed and stamina",
  "Review your mistakes and learn from them systematically",
  "Use authentic Canadian English resources for listening practice",
  "Take full-length mock tests before your actual test date",
]

export function StudyResources() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeSection, setActiveSection] = useState("get-started")

  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarItems.map(item => item.id)
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-64 border-r border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="p-4 space-y-1">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Documentation</h2>
          </div>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.title}</span>
              </a>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl container-padding py-10 md:py-14 scroll-smooth">
          {/* Header */}
          <motion.div
            className="mb-10"
            initial={sectionHeader.initial}
            animate={sectionHeader.animate}
            transition={sectionHeader.transition}
          >
            <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Study Resources</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to prepare for your CELPIP test. Start here and follow the guide.
            </p>
          </motion.div>

          {/* Get Started Section */}
          <section id="get-started" className="mb-12 scroll-mt-20">
            <motion.div
              ref={ref}
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={slideUp.transition}
              className="mb-6"
            >
              <h2 className="heading-3 mb-2 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Get Started
              </h2>
              <p className="text-muted-foreground mb-6">Follow these steps to begin your CELPIP preparation journey.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getStartedSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={slideUp.initial}
                    animate={isInView ? slideUp.animate : slideUp.initial}
                    transition={{ ...slideUp.transition, delay: index * 0.1 }}
                  >
                    <Card className="card-hover h-full card-elevated">
                      <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center mb-3 shadow-md">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-base font-semibold mb-1.5">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm leading-relaxed mb-3">{step.description}</CardDescription>
                        <Button variant="ghost" size="sm" className="w-full whitespace-nowrap" asChild>
                          <Link href={step.href} className="flex items-center justify-center">
                            <span>Learn More</span>
                            <ArrowRight className="ml-2 h-3.5 w-3.5 flex-shrink-0" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </section>

          {/* Prerequisites Section */}
          <section id="prerequisites" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.2 }}
            >
              <h2 className="heading-3 mb-2 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Prerequisites
              </h2>
              <p className="text-muted-foreground mb-4">Before you begin, make sure you meet these basic requirements.</p>
              <Card className="card-modern card-elevated">
                <CardContent className="p-4">
                  <ul className="space-y-2.5">
                    {prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Understanding CELPIP Section */}
          <section id="understanding-celpip" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.3 }}
            >
              <h2 className="heading-3 mb-2 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Understanding CELPIP
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed mb-4">
                  The Canadian English Language Proficiency Index Program (CELPIP) is an English language test designed for Canadian immigration and citizenship purposes. It assesses your English language skills in four areas: Listening, Reading, Writing, and Speaking.
                </p>
                <p className="text-sm leading-relaxed mb-4">
                  CELPIP uses a scale from 1 to 12 for each section, which corresponds to the Canadian Language Benchmark (CLB) levels. Each section is scored independently, and immigration programs typically require minimum scores in each section rather than an overall average.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mt-4 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Important Disclaimer</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This website is NOT affiliated with or endorsed by CELPIP. We are an independent study resource providing free practice materials and study guides.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Test Format Section */}
          <section id="test-format" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.4 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Test Format
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Listening", duration: "47-55 minutes", tasks: "6 parts" },
                  { name: "Reading", duration: "55-60 minutes", tasks: "4 parts" },
                  { name: "Writing", duration: "53-60 minutes", tasks: "2 tasks" },
                  { name: "Speaking", duration: "15-20 minutes", tasks: "8 tasks" },
                ].map((section) => (
                  <Card key={section.name} className="card-hover card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold mb-2">{section.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-semibold">{section.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Award className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="font-semibold">{section.tasks}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Study Guides Section */}
          <section id="study-guides" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.5 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Study Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {studyGuides.map((guide) => {
                  const Icon = guide.icon
                  return (
                    <Card key={guide.name} className="card-hover card-elevated">
                      <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center mb-3 shadow-md">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-sm font-semibold mb-1.5">{guide.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-xs leading-relaxed">{guide.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          </section>

          {/* Quick Tips Section */}
          <section id="quick-tips" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.6 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Quick Tips
              </h2>
              <Card className="card-modern card-elevated">
                <CardContent className="p-4">
                  <ul className="space-y-2.5">
                    {quickTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Study Plan Section */}
          <section id="study-plan" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.7 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Recommended Study Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { week: "Week 1-2", task: "Familiarize yourself with test format and take initial practice test" },
                  { week: "Week 3-4", task: "Focus on weakest section with targeted practice" },
                  { week: "Week 5-6", task: "Practice all sections and review study materials" },
                  { week: "Week 7-8", task: "Take full mock tests and refine strategies" },
                ].map((item) => (
                  <Card key={item.week} className="card-hover card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold mb-1.5">{item.week}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-relaxed">{item.task}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Right Sidebar - Table of Contents (Desktop only) */}
      <aside className="hidden xl:block w-64 border-l border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">On this page</h3>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${
                    activeSection === item.id
                      ? "text-primary font-medium bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}



================================================
FILE: components/sections/testimonials-page.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Sarah Chen",
    location: "Toronto, Canada",
    score: "CLB 9",
    improvement: "+2 points",
    text: "FreeCELPIPTest helped me prepare effectively! The practice exercises and study tips were very helpful for my test preparation.",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Raj Patel",
    location: "Vancouver, Canada",
    score: "CLB 10",
    improvement: "+3 points",
    text: "I couldn't believe all the resources were free. The writing section practice especially helped me improve my score significantly. The email templates were a game-changer!",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Maria Garcia",
    location: "Calgary, Canada",
    score: "CLB 8",
    improvement: "+1 point",
    text: "As an international student, I was worried about the test. This platform gave me the confidence I needed. The speaking practice tips were particularly helpful. Highly recommend!",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Ahmed Hassan",
    location: "Montreal, Canada",
    score: "CLB 9",
    improvement: "+2 points",
    text: "The listening practice tests were spot-on. I felt well-prepared on test day. The free resources here are better than some paid courses I tried before.",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Li Wei",
    location: "Edmonton, Canada",
    score: "CLB 8",
    improvement: "+2 points",
    text: "I used the study guides and practice tests daily for 6 weeks. The improvement was remarkable. The reading comprehension strategies really helped me understand the passages better.",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Priya Sharma",
    location: "Ottawa, Canada",
    score: "CLB 10",
    improvement: "+3 points",
    text: "This is the best free resource I found. The blog posts with tips and strategies were incredibly useful. I achieved my target score and got my PR approved!",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
]

export function TestimonialsPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-4 text-gradient-primary">Success Stories</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          See how students are achieving their CELPIP goals with our free practice materials.
        </p>
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={cardItem(index).initial}
            animate={isInView ? cardItem(index).animate : cardItem(index).initial}
            transition={cardItem(index).transition}
          >
            <Card className="card-hover h-full card-elevated">
              <CardContent className="p-5">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="h-7 w-7 text-primary/60 mb-4" />
                <p className="text-muted-foreground mb-6 italic line-clamp-4 leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-base">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Achieved Score</p>
                      <div className="inline-block px-2.5 py-1 rounded-lg gradient-primary text-white text-xs font-semibold shadow-sm">
                        {testimonial.score}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Improvement</p>
                      <div className="inline-block px-2.5 py-1 rounded-lg gradient-primary text-white text-xs font-semibold shadow-sm">
                        {testimonial.improvement}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="card-modern rounded-xl p-6 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Share Your Success Story</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Did you achieve your CELPIP goal using our resources? We'd love to hear from you!
        </p>
        <Button>Contact Us to Share Your Story</Button>
      </motion.div>
    </div>
  )
}




================================================
FILE: components/sections/testimonials.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"

const testimonials = [
  {
    name: "Sarah Chen",
    location: "Toronto, Canada",
    score: "CLB 9",
    text: "FreeCELPIPTest helped me prepare effectively! The practice exercises and study tips were very helpful for my test preparation.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    location: "Vancouver, Canada",
    score: "CLB 10",
    text: "I couldn't believe all the resources were free. The writing section practice especially helped me improve my score significantly.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    location: "Calgary, Canada",
    score: "CLB 8",
    text: "As an international student, I was worried about the test. This platform gave me the confidence I needed. Highly recommend!",
    rating: 5,
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <motion.div
          className="text-center mb-10"
          initial={sectionHeader.initial}
          animate={isInView ? sectionHeader.animate : sectionHeader.initial}
          transition={sectionHeader.transition}
        >
          <h2 className="heading-2 mb-2 text-gradient-primary">Success Stories</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See how students are achieving their CELPIP goals with our free resources.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={cardItem(index).initial}
              animate={isInView ? cardItem(index).animate : cardItem(index).initial}
              transition={cardItem(index).transition}
            >
              <Card className="card-hover h-full card-elevated">
                <CardContent className="p-5">
                  <div className="flex items-center gap-1 mb-2.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 text-primary/50 mb-2.5" />
                  <p className="text-muted-foreground mb-3.5 italic leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-border/50 pt-3 space-y-1.5">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    <div className="inline-block px-2 py-0.5 rounded-md gradient-primary text-white text-xs font-semibold shadow-sm">
                      {testimonial.score}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}




================================================
FILE: components/sections/value-proposition.tsx
================================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Infinity, BookOpen, Users, TrendingUp } from "lucide-react"

const valueProps = [
  {
    icon: Infinity,
    title: "Comprehensive Resources",
    description: "Access all practice tests, study guides, and expert strategies to help you succeed on your CELPIP test.",
    stat: "Complete",
    color: "gradient-primary",
    iconColor: "text-primary",
  },
  {
    icon: BookOpen,
    title: "All 4 Test Sections",
    description: "Comprehensive practice for Listening, Reading, Writing, and Speaking sections.",
    stat: "4 Sections",
    color: "gradient-reading",
    iconColor: "text-chart-1",
  },
  {
    icon: TrendingUp,
    title: "Expert Study Guides",
    description: "Proven strategies and tips from CELPIP experts to help you achieve your target score.",
    stat: "Expert Tips",
    color: "gradient-writing",
    iconColor: "text-chart-3",
  },
  {
    icon: Users,
    title: "Trusted by Students",
    description: "Join thousands of students preparing for their CELPIP test with our free resources.",
    stat: "10K+ Users",
    color: "gradient-listening",
    iconColor: "text-chart-2",
  },
]

export function ValueProposition() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-10">
          <h2 className="heading-2 mb-2 text-gradient-primary">Why Choose FreeCELPIPTest?</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to succeed on your CELPIP test, completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {valueProps.map((prop) => {
            const Icon = prop.icon
            return (
              <Card key={prop.title} className="card-hover h-full text-center card-elevated">
                <CardHeader className="pb-3">
                  <div className={`mx-auto mb-3 h-12 w-12 rounded-lg ${prop.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gradient-primary mb-1.5">{prop.stat}</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {prop.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">{prop.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}




================================================
FILE: components/seo/organization-schema.tsx
================================================
export function OrganizationSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreeCELPIPTest",
    url: "https://freecelpiptest.com",
    logo: "https://freecelpiptest.com/assets/logo-bg.png",
    description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
    sameAs: [
      // Add social media links if available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: "https://freecelpiptest.com/contact",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://freecelpiptest.com/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}




================================================
FILE: components/seo/website-schema.tsx
================================================
export function WebsiteSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreeCELPIPTest",
    url: "https://freecelpiptest.com",
    description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
    publisher: {
      "@type": "Organization",
      name: "FreeCELPIPTest",
      logo: {
        "@type": "ImageObject",
        url: "https://freecelpiptest.com/assets/logo-bg.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://freecelpiptest.com/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}




================================================
FILE: components/tools/celpip-score-calculator.tsx
================================================
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calculator, TrendingUp, Award, Info } from "lucide-react"
import { sectionHeader } from "@/lib/animations"

const clbLevels = [
  { level: 12, description: "Advanced proficiency - Native-like" },
  { level: 11, description: "Advanced proficiency" },
  { level: 10, description: "Advanced proficiency" },
  { level: 9, description: "Advanced intermediate" },
  { level: 8, description: "Intermediate" },
  { level: 7, description: "Developing proficiency" },
  { level: 6, description: "Basic proficiency" },
  { level: 5, description: "Initial proficiency" },
  { level: 4, description: "Basic proficiency" },
]

export function CELPIPScoreCalculator() {
  const [scores, setScores] = useState({
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
  })

  const calculateMinimum = () => {
    const values = Object.values(scores).map(Number).filter(v => !isNaN(v) && v > 0)
    if (values.length === 0) return null
    return Math.min(...values)
  }

  const minimumScore = calculateMinimum()
  const clbLevel = minimumScore ? Math.min(12, Math.max(4, minimumScore)) : null

  const handleScoreChange = (section: string, value: string) => {
    const numValue = parseInt(value)
    if (value === "" || (!isNaN(numValue) && numValue >= 1 && numValue <= 12)) {
      setScores(prev => ({ ...prev, [section]: value }))
    }
  }

  return (
    <div className="container mx-auto container-padding py-10 md:py-14 max-w-4xl">
      <motion.div
        className="text-center mb-10"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <div className="inline-flex h-12 w-12 rounded-xl gradient-primary items-center justify-center mb-4 shadow-sm">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Score Calculator</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Enter your CELPIP section scores to see your individual section scores and minimum CLB level.
        </p>
      </motion.div>

      <Card className="card-modern card-elevated mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Enter Your Scores
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your CELPIP scores (1-12) for each section
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: "listening", label: "Listening", icon: "🎧" },
              { key: "reading", label: "Reading", icon: "📖" },
              { key: "writing", label: "Writing", icon: "✍️" },
              { key: "speaking", label: "Speaking", icon: "🎤" },
            ].map((section) => (
              <div key={section.key}>
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  {section.icon} {section.label}
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="1-12"
                  value={scores[section.key as keyof typeof scores]}
                  onChange={(e) => handleScoreChange(section.key, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {minimumScore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Minimum Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-4xl font-bold text-gradient-primary mb-2">{minimumScore}</div>
              <p className="text-sm text-muted-foreground">Lowest score across all sections</p>
            </CardContent>
          </Card>

          <Card className="card-modern card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Minimum CLB Level
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-4xl font-bold text-gradient-primary mb-2">CLB {clbLevel}</div>
              <p className="text-sm text-muted-foreground">
                {clbLevels.find(l => l.level === clbLevel)?.description || "Canadian Language Benchmark"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="card-modern card-elevated border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-2">How CELPIP Scoring Works</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• Each section is scored independently from 1 to 12</li>
                <li>• CLB levels correspond directly to CELPIP scores (CLB 4-12)</li>
                <li>• Immigration programs require minimum scores in each section (typically CLB 7 or higher)</li>
                <li>• Your minimum score determines your eligibility, not an average</li>
                <li>• This calculator provides an estimate - official scores come from CELPIP</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




================================================
FILE: components/tools/vocabulary-level-grader.tsx
================================================
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle2, X, ArrowRight, TrendingUp } from "lucide-react"
import { sectionHeader } from "@/lib/animations"

const vocabularyTests = [
  {
    level: "Beginner",
    words: [
      { word: "happy", options: ["sad", "joyful", "angry", "tired"], correct: 1 },
      { word: "big", options: ["small", "large", "tiny", "little"], correct: 1 },
      { word: "fast", options: ["slow", "quick", "lazy", "calm"], correct: 1 },
    ],
  },
  {
    level: "Intermediate",
    words: [
      { word: "comprehensive", options: ["limited", "complete", "partial", "brief"], correct: 1 },
      { word: "significant", options: ["minor", "important", "trivial", "small"], correct: 1 },
      { word: "enhance", options: ["reduce", "improve", "decrease", "weaken"], correct: 1 },
    ],
  },
  {
    level: "Advanced",
    words: [
      { word: "ubiquitous", options: ["rare", "everywhere", "hidden", "unknown"], correct: 1 },
      { word: "meticulous", options: ["careless", "careful", "hasty", "casual"], correct: 1 },
      { word: "elaborate", options: ["simple", "detailed", "basic", "plain"], correct: 1 },
    ],
  },
]

export function VocabularyLevelGrader() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (wordIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [wordIndex]: optionIndex }))
  }

  const calculateScore = () => {
    if (currentLevel === null) return
    const test = vocabularyTests[currentLevel]
    let correct = 0
    test.words.forEach((word, index) => {
      if (answers[index] === word.correct) {
        correct++
      }
    })
    setScore(correct)
    setShowResults(true)
  }

  const resetTest = () => {
    setCurrentLevel(null)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  const getLevelRecommendation = () => {
    if (currentLevel === null) return ""
    const test = vocabularyTests[currentLevel]
    const percentage = (score / test.words.length) * 100
    
    if (percentage >= 80) {
      return currentLevel < vocabularyTests.length - 1 
        ? `Excellent! Try the ${vocabularyTests[currentLevel + 1].level} level.`
        : "Excellent! You have advanced vocabulary skills."
    } else if (percentage >= 60) {
      return "Good! Continue practicing at this level."
    } else {
      return currentLevel > 0
        ? `Consider practicing at the ${vocabularyTests[currentLevel - 1].level} level first.`
        : "Keep practicing! Build your vocabulary foundation."
    }
  }

  return (
    <div className="container mx-auto container-padding py-10 md:py-14 max-w-4xl">
      <motion.div
        className="text-center mb-10"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <div className="inline-flex h-12 w-12 rounded-xl gradient-primary items-center justify-center mb-4 shadow-sm">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h1 className="heading-2 mb-3 text-gradient-primary">Vocabulary Level Grader</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Test your English vocabulary level and see how it compares to CELPIP requirements.
        </p>
      </motion.div>

      {currentLevel === null ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vocabularyTests.map((test, index) => (
            <motion.div
              key={test.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover card-elevated cursor-pointer" onClick={() => setCurrentLevel(index)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">{test.level}</CardTitle>
                  <CardDescription className="text-sm">
                    {test.words.length} vocabulary questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" className="w-full whitespace-nowrap" asChild>
                    <div className="flex items-center justify-center cursor-pointer">
                      <span>Start Test</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="card-modern card-elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {vocabularyTests[currentLevel].level} Level Test
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetTest} className="whitespace-nowrap">
                <span>Change Level</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {vocabularyTests[currentLevel].words.map((word, wordIndex) => (
              <div key={wordIndex} className="p-4 border border-border/50 rounded-lg">
                <p className="font-semibold mb-3 text-sm">
                  {wordIndex + 1}. What is the meaning of "<span className="text-primary">{word.word}</span>"?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {word.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswer(wordIndex, optionIndex)}
                      className={`p-3 rounded-lg text-left text-sm border transition-all ${
                        answers[wordIndex] === optionIndex
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Button 
              onClick={calculateScore} 
              className="w-full whitespace-nowrap"
              disabled={Object.keys(answers).length !== vocabularyTests[currentLevel].words.length}
            >
              <span>Calculate Score</span>
            </Button>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-primary/20 bg-primary/5 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <p className="font-semibold">Your Score: {score}/{vocabularyTests[currentLevel].words.length}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{getLevelRecommendation()}</p>
                <div className="space-y-2">
                  {vocabularyTests[currentLevel].words.map((word, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {answers[index] === word.correct ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                      <span className={answers[index] === word.correct ? "text-foreground" : "text-muted-foreground"}>
                        {word.word}: {word.options[word.correct]}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 whitespace-nowrap" onClick={resetTest}>
                  <span>Try Another Level</span>
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}




================================================
FILE: components/ui/badge.tsx
================================================
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }



================================================
FILE: components/ui/button.tsx
================================================
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "gradient-primary text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-all duration-200",
        outline:
          "border-2 border-primary/30 bg-background text-primary font-semibold shadow-sm hover:bg-primary/5 hover:border-primary transition-all duration-200",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all duration-200",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground transition-colors duration-200",
        link: "text-primary underline-offset-4 hover:underline transition-colors duration-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }




================================================
FILE: components/ui/card.tsx
================================================
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-modern rounded-xl bg-card text-card-foreground", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }




================================================
FILE: components/ui/coming-soon.tsx
================================================
"use client"

import { motion } from "framer-motion"
import { Clock, Mail, TrendingUp, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ComingSoonProps {
  title: string
  description: string
  features?: string[]
  showNewsletter?: boolean
  relatedLinks?: Array<{ name: string; href: string; description: string }>
}

export function ComingSoon({
  title,
  description,
  features = [],
  showNewsletter = true,
  relatedLinks = [],
}: ComingSoonProps) {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="heading-2 mb-4 text-gradient-primary">{title}</h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>

      {features.length > 0 && (
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="card-modern card-elevated">
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                What's Coming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showNewsletter && (
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-modern card-elevated border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold">Get Notified When Available</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Be the first to know when we launch. Sign up for updates and get early access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/contact">Sign Up for Updates</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {relatedLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Explore Our Available Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedLinks.map((link, index) => (
              <Card key={index} className="card-hover card-elevated">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">{link.name}</CardTitle>
                  <CardDescription className="text-sm">{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={link.href}>Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}




================================================
FILE: components/ui/dialog.tsx
================================================
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}




================================================
FILE: components/ui/dropdown-menu.tsx
================================================
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[100] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}




================================================
FILE: components/ui/input.tsx
================================================
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }




================================================
FILE: components/ui/select.tsx
================================================
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}



================================================
FILE: components/ui/skeleton.tsx
================================================
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }




================================================
FILE: components/ui/table.tsx
================================================
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}



================================================
FILE: components/ui/tabs.tsx
================================================
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }




================================================
FILE: content/blog/README.md
================================================
# Blog Content Guide

This directory contains blog posts in either `.md` (Markdown) or `.mdx` (MDX) format.

## File Format

Each blog post should be named using kebab-case (e.g., `my-awesome-post.mdx`).

## Frontmatter

All blog posts must include frontmatter at the top of the file with the following fields:

```yaml
---
title: "Your Blog Post Title"
excerpt: "A brief description of your blog post (150-160 characters for SEO)"
category: "Listening Tips" | "Reading Tips" | "Writing Tips" | "Speaking Tips" | "Test Strategy" | "Success Stories"
tags: ["tag1", "tag2", "tag3"]
publishedAt: "2024-01-15"
coverImage: "/images/blog/your-image.jpg"  # Optional but recommended
keywords: ["keyword1", "keyword2"]  # Optional - will use tags if not provided
author: "Author Name"  # Optional - defaults to "FreeCELPIPTest"
updatedAt: "2024-01-20"  # Optional - for updated posts
---
```

## Required Fields

- `title`: The blog post title
- `excerpt`: Brief description (used for SEO meta description)
- `category`: One of the predefined categories
- `tags`: Array of relevant tags
- `publishedAt`: Publication date in ISO format (YYYY-MM-DD)

## Optional Fields

- `coverImage`: Path to cover image (recommended for SEO and social sharing)
- `keywords`: SEO keywords (if not provided, tags will be used)
- `author`: Author name (defaults to "FreeCELPIPTest")
- `updatedAt`: Last update date (for updated posts)

## Content

After the frontmatter, write your content using Markdown or MDX syntax.

### MDX Features

MDX files support:
- Standard Markdown syntax
- React components
- JSX syntax

### Example

```mdx
---
title: "Top 10 CELPIP Listening Tips"
excerpt: "Master the listening section with these proven strategies."
category: "Listening Tips"
tags: ["listening", "tips", "strategy"]
publishedAt: "2024-01-15"
coverImage: "/images/blog/listening-tips.jpg"
keywords: ["CELPIP listening", "listening tips", "CELPIP preparation"]
author: "FreeCELPIPTest"
---

# Top 10 CELPIP Listening Tips

The CELPIP Listening test can be challenging, but with the right strategies...

## 1. Familiarize Yourself with Canadian Accents

The CELPIP test uses Canadian English accents...
```

## Image Guidelines

- Store images in `/public/images/blog/`
- Recommended cover image size: 1200x630px (for social sharing)
- Use descriptive filenames (e.g., `celpip-listening-tips.jpg`)
- Optimize images before uploading

## SEO Best Practices

1. **Title**: Keep it under 60 characters
2. **Excerpt**: 150-160 characters for optimal meta description
3. **Keywords**: Include 5-10 relevant keywords
4. **Cover Image**: Always include a cover image for social sharing
5. **Content**: Use proper heading hierarchy (H1, H2, H3)
6. **Internal Links**: Link to other blog posts and pages
7. **Tags**: Use 3-5 relevant tags

## Categories

Available categories:
- Listening Tips
- Reading Tips
- Writing Tips
- Speaking Tips
- Test Strategy
- Success Stories

## File Naming

- Use kebab-case: `my-awesome-post.mdx`
- Be descriptive: `top-10-celpip-listening-tips.mdx`
- Match the slug to the filename




================================================
FILE: content/blog/100-celpip-vocabulary-upgrades-clb9.mdx
================================================
---
title: "100 Vocabulary Upgrades to Hit CLB 9+ in CELPIP Speaking & Writing"
publishedAt: "2025-12-20"
excerpt: "Stop repeating the same basic words. We've compiled 100 high-impact vocabulary swaps categorized by CELPIP tasks to help you sound like a native speaker."
coverImage: "/assets/celpip-100-vocabulary-upgrades.jpg"
keywords: ["CELPIP vocabulary list", "advanced English for CELPIP", "CLB 9 speaking vocabulary", "CELPIP writing words"]
category: "Speaking Tips"
tags: ["vocabulary", "speaking", "writing", "CLB 9", "advanced-english"]
---

One of the most frustrating things about the Speaking test is what I call the "Vocabulary Trap." When that timer starts ticking and the red light goes on, our brains go into survival mode. We revert to the easiest words possible: *good, bad, big, happy.*

I noticed this in my own practice recordings. I sounded like I was reading a children’s book, not like a professional applying for Canadian PR. The CELPIP raters are looking for **"Lexical Range and Precision."** This doesn't mean you need to use words that no one understands; it means using the *exact* word for the situation.

### 💡 The "Quick Hit" Summary
If you're heading into your test today, remember these 3 Golden Rules for Vocab:
1. **Precision over Complexity:** Use "arduous" only if you know it means a physically difficult journey or task.
2. **Vary your Adjectives:** Never use the word "very." Replace "very big" with "massive."
3. **Task-Specific Verbs:** Use "envisage" when predicting the future in Speaking Task 4.

---

### 📊 The 100-Word Power List (Categorized by Task)

I’ve broken these down into the most common situations you’ll face in the test.

#### 1. Describing People & Emotions (Tasks 1, 2, & 8)
*Instead of saying someone is "nice" or "happy":*
1. **Amiable** (Friendly)
2. **Gregarious** (Sociable)
3. **Exhilarated** (Very happy/excited)
4. **Ecstatic** (Overjoyed)
5. **Apprehensive** (Worried/nervous)
6. **Agitated** (Annoyed/upset)
7. **Courteous** (Polite)
8. **Empathetic** (Understanding)
9. **Resilient** (Strong in tough times)
10. **Industrious** (Hard-working)

#### 2. Describing Places & Scenes (Task 3: Describing the Picture)
*Instead of saying the park is "green" or the room is "big":*
11. **Picturesque** (Beautiful)
12. **Vibrant** (Full of energy/color)
13. **Lush** (Green/healthy plants)
14. **Cramped** (Small/crowded)
15. **Spacious** (Big/open)
16. **Cluttered** (Messy)
17. **Symmetry** (Balanced/even)
18. **Bustling** (Busy/full of people)
19. **Tranquil** (Quiet/peaceful)
20. **Dilapidated** (Old/broken down)

#### 3. Making Choices & Comparisons (Task 5: Comparing Options)
*Instead of saying something is "better" or "cheaper":*
21. **Superior** (Better)
22. **Economical** (Cheaper/good value)
23. **Exorbitant** (Way too expensive)
24. **Invaluable** (Extremely useful)
25. **Redundant** (Not needed anymore)
26. **Compelling** (Strong/persuasive)
27. **Drawback** (Disadvantage)
28. **Asset** (Advantage/benefit)
29. **Pragmatic** (Practical)
30. **Innovative** (New/original)

#### 4. Expressing Opinions & Advice (Task 1 & Writing)
*Instead of saying "I think" or "I believe":*
31. **Contemplate** (To think about deeply)
32. **Envisage** (To imagine the future)
33. **Advocate** (To support/recommend)
34. **Concur** (To agree)
35. **Dispute** (To disagree)
36. **Speculate** (To guess)
37. **Assert** (To say confidently)
38. **Ascertain** (To find out for sure)
39. **Emphasize** (To highlight)
40. **Evaluate** (To judge/examine)

#### 5. Describing Size & Frequency
*Stop using "A lot" or "Small":*
41. **Plethora** (A large amount)
42. **Multitude** (A large number)
43. **Abundance** (More than enough)
44. **Substantial** (Significant/large)
45. **Negligible** (So small it doesn't matter)
46. **Minute** (Very small - pronounced *my-noot*)
47. **Trivial** (Unimportant)
48. **Occasional** (Sometimes)
49. **Incessant** (Never stopping)
50. **Sparse** (Very little/scattered)

#### 6. Action Verbs for "Hard" Situations (Task 8)
51. **Endeavor** (Try hard)
52. **Navigate** (Find your way)
53. **Ameliorate** (Make something better)
54. **Exacerbate** (Make something worse)
55. **Collaborate** (Work together)
56. **Implement** (Start using a plan)
57. **Facilitate** (Make something easier)
58. **Obtain** (Get)
59. **Utilize** (Use)
60. **Modify** (Change)

#### 7. Connectors & Transition Words (Crucial for Coherence)
61. **Consequently** (As a result)
62. **Furthermore** (Also/in addition)
63. **Conversely** (On the other hand)
64. **Nevertheless** (However)
65. **Simultaneously** (At the same time)
66. **Subsequently** (Afterward)
67. **Primarily** (Mostly)
68. **Particularly** (Especially)
69. **Notwithstanding** (Despite)
70. **Hence** (Therefore)

#### 8. Intensifiers (Stop saying "Very")
71. **Exceedingly**
72. **Remarkably**
73. **Incredibly**
74. **Exceptionally**
75. **Utterly**
76. **Thoroughly**
77. **Extremely**
78. **Slightly**
79. **Notably**
80. **Deeply**

#### 9. Professional Phrases for Writing
81. **With reference to**
82. **In light of**
83. **Taking into account**
84. **For instance**
85. **As a consequence**
86. **Regarding the matter of**
87. **Expressing concern about**
88. **Proposing a solution**
89. **Submitting a request**
90. **Kindly consider**

#### 10. Abstract Nouns for Score Boosting
91. **Prosperity** (Success/wealth)
92. **Adversity** (Hardship)
93. **Infrastructure** (Buildings/roads)
94. **Sustainability** (Long-term health)
95. **Viability** (Ability to work)
96. **Incentive** (Motivation to do something)
97. **Discrepancy** (Difference/error)
98. **Consequences** (Results)
99. **Efficiency** (Speed/productivity)
100. **Innovation** (New ideas)

---

### 🎨 How to Practice These (The "Flashcard" Method)

When I was studying, I didn't try to learn all 100 at once. That’s a recipe for a headache. 



Instead, I picked **5 words a day**. I would write them on a sticky note and stick it to my laptop. During my practice speaking sessions, I forced myself to use those 5 words at least once. By the end of the week, I had 35 new words that felt "natural" to say.

### ❓ FAQ: Is it okay to use "slang"?

**A:** Generally, no. CELPIP is a semi-formal test. While you want to sound like a human, you shouldn't use words like "gonna," "wanna," or "stuff." Use the upgrades in the list above to stay in that professional "sweet spot."

---

### Final Thoughts
Improving your vocabulary is the fastest way to jump from a CLB 8 to a CLB 10. It shows the rater that you aren't just surviving the English language—you are mastering it.

**Coming Soon:** I am working on a "Vocab-Checker" tool for our free mock tests. It will scan your writing and tell you exactly which "basic" words you should swap out for these advanced ones. Stay tuned!


================================================
FILE: content/blog/celpip-vs-ielts-for-international-students-canada.mdx
================================================
---
title: "CELPIP vs. IELTS: Which Test Should International Students Take After Graduation?"
publishedAt: "2025-12-24"
excerpt: "Just finished your studies and planning your Post-Graduation Work Permit (PGWP)? Here’s why your choice of English test matters more than ever during your transition to the workforce."
coverImage: "/assets/celpip-vs-ielts-student-guide.jpg"
keywords: ["CELPIP vs IELTS for students", "language test for international graduates", "CELPIP for PGWP", "IELTS or CELPIP after college"]
category: "Student Life"
tags: ["International Students", "Graduation", "PGWP", "CELPIP", "IELTS"]
---

I know exactly how it feels. You’ve just finished your final exams, your convocation is around the corner, and instead of celebrating, you’re looking at a mountain of paperwork for your Post-Graduation Work Permit (PGWP) and your future Express Entry profile. 

When you’re a student, every dollar counts, and your time is even more precious as you start the job hunt. Picking the wrong English test can mean wasted money and a lower score that might hurt your chances when you're ready to apply for residency later. 

Since I’m also navigating the Canadian education system, I’ve broken down the "CELPIP vs. IELTS" debate specifically for graduates like us.

### 💡 The "Graduation Week" Summary
* **Choose CELPIP if:** You’ve spent the last two years writing essays on a laptop, you're used to Canadian accents from your professors, and you want a built-in spell-checker.
* **Choose IELTS if:** You prefer a face-to-face interview style and don't mind the "British/Australian" accents that sometimes pop up in the listening section.
* **The Student Verdict:** Most graduates find CELPIP more "familiar" because the computer interface feels just like the platforms we use for college exams (like Brightspace or Canvas).

---

### Why the "Student Experience" Favors CELPIP

#### 1. The "Laptop Generation" Advantage
If you’ve spent your entire diploma or degree typing assignments, your "typing speed" is likely faster than your "handwriting speed." 
* **CELPIP:** It is 100% computer-based. You get a timer, a word counter, and the holy grail: **Spell-check.** 
* **IELTS:** While they have a computer version, many students still take the paper one. No spell-check. One typo in "Management" could cost you a point.



#### 2. Speaking to a Screen vs. a Human
As students, we’ve spent years on Zoom calls and recorded video presentations. 
* **CELPIP:** You speak into a headset. It’s private, and there’s no one judging your body language.
* **IELTS:** You sit across from an examiner. For some, this feels like a scary job interview. If you’re already stressed about finding work, you might not want that extra pressure.

#### 3. Accents You Actually Recognize
In college, you’ve heard the Canadian accent every day. 
* **CELPIP:** The listening clips use local context—people talking about a "Double-Double" at Tim’s or taking the "LRT." It feels like your daily life in Canada.
* **IELTS:** You might get a clip of someone with a thick Scottish or Australian accent talking about "The Outback." It’s an extra layer of difficulty we don't need right now.

---

### 📊 Score Comparison: The Goal Post

Even though you’re applying for a work permit now, most of us take these tests to get our **Express Entry** profile ready for the future. You want that **CLB 9** or higher.

| Section | CELPIP (Typical Student Goal) | IELTS (Typical Student Goal) |
| :--- | :--- | :--- |
| **Reading** | 9 | 7.0 |
| **Writing** | 9 | 7.0 |
| **Listening** | 9 | 8.0 |
| **Speaking** | 9 | 7.0 |

*Note:* To hit CLB 9 in IELTS Listening, you need an 8.0. That is a very small margin for error. Most students I know find it much easier to hit a 9 in the CELPIP Listening section because the topics are so "Canadian."

---

### Final Thoughts: My Recommendation
If you’ve just survived a Canadian college or university program, **stick with CELPIP.** You’ve already been trained for it by your professors without even knowing it. The computer format, the local vocabulary, and the "all-in-one-day" schedule make it the perfect choice for a busy new graduate.

**I’m currently building a "Student Practice Suite"** specifically for people who just finished school. It uses the same academic-style writing prompts you’re used to. Join the waitlist below!


================================================
FILE: content/blog/mastering-celpip-writing-task-2.mdx
================================================
---
title: "Mastering CELPIP Survey Responses: Why Your Structure Matters More Than Your Choice"
publishedAt: "2025-12-16"
excerpt: "Struggling with CELPIP Writing Task 2? Learn how to structure your survey response using the 'counter-argument' technique to boost your score to CLB 9+."
coverImage: "/assets/celpip-writing-task-2-survey-tips.png"
keywords: ["CELPIP Writing Task 2", "survey response", "CELPIP templates", "CLB 9 writing"]
category: "Writing Tips"
tags: ["writing", "task-2", "survey", "structure", "CLB 9"]
---

One of the biggest surprises I had when I started practicing for the CELPIP writing test was realizing that the "survey" isn't actually about the survey results. 

Whether the prompt asks you to choose between a new office gym or a transit subsidy, the examiners aren't looking for the "right" answer—there isn't one. They are looking at how you build a logical bridge between your choice and your reasons. 

In my own prep, I’ve found that the difference between a CLB 7 and a CLB 9 often comes down to how "real" your examples feel. 

### 💡 Quick Summary: The CLB 9+ Checklist
If you're studying on your lunch break, here are the non-negotiables:
* **Pick one side:** Don't be neutral. Commit to one option.
* **The "Counter-Argument":** Briefly explain why the other option isn't the best choice right now.
* **Specific Examples:** Mention "neighbors," "colleagues," or "local shops" to make it feel grounded.
* **Word Count:** Aim for 170-190 words to stay safe.

---

### The Logic of the "Other Side"
Most of us are tempted to just list all the good things about our choice. However, to show true language proficiency, you need to acknowledge the other option. This shows you can handle complex social reasoning. 

Think of it like a real conversation: if you're trying to convince a friend to go to a specific restaurant, you don't just say the food is good; you might say, *"I know that other place is closer, but the quality here is worth the extra ten-minute walk."* That contrast is what makes your writing sound natural.



---

### A Real-World Example: The "City Park vs. Parking Lot" Prompt

Imagine a survey asking if the city should build a **green park** or a **multilevel parking garage** in your neighborhood. Here is how you can structure that response to sound like a resident, not a textbook.

#### 1. The Opening (Pick a Side Fast)
Start by stating your preference immediately. Don’t waste words being vague.
> *"I am writing to express my strong support for the construction of a green park in our neighborhood. While I understand the need for better infrastructure, I believe the long-term benefits of a community space far outweigh those of a parking facility."*

#### 2. The Personal "Why" (The Context)
This is where you make it human. Use a realistic scenario. For instance, mentioning the specific lack of safe play areas for children creates a vivid picture for the evaluator.

#### 3. The Economic or Social "Why"
Give a second, different type of reason to show breadth. You might mention how parks increase property values or support local cafes. This shows the examiner you can think about the "big picture."

#### 4. The Counter-Argument (The Contrast)
Briefly explain why the other option isn't the priority right now.
> *"Although a parking garage might slightly reduce street congestion, it wouldn't contribute to the community's well-being in the same way a park would. In fact, it might even encourage more traffic in an already busy residential area."*

---

### ❓ Frequently Asked Questions (FAQ)

**Q: Do I lose points if my opinion is unpopular?** **A:** Absolutely not. I used to worry about this too! You are graded on your *English*, not your political views.

**Q: How many paragraphs should I write?** **A:** Three to four is the sweet spot. One for the intro/choice, two for your reasons/comparison, and a quick one-sentence closing.

---

### A Few Things I've Learned While Studying:
* **Connectors are your friends:** Use words like *"Furthermore"* and *"Consequently"*—they act as signposts for the reader.
* **Be specific:** Don't just say "it's good for people." Say "it's beneficial for elderly residents who need a place to walk." 
* **The "Wait" Rule:** I always try to leave 2 minutes at the end to check for small typos.

I’m currently building out the simulator for this exact task so we can all practice typing these within the 26-minute limit. In the meantime, try using this "comparison" style in your next practice session!


================================================
FILE: lib/admin.ts
================================================
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

// Admin emails are loaded from environment variable for security
// Set ADMIN_EMAIL in .env (local) or Azure Key Vault (production)
// For multiple admins, separate emails with commas: "admin1@gmail.com,admin2@gmail.com"
const ADMIN_EMAILS = process.env.ADMIN_EMAIL
  ? process.env.ADMIN_EMAIL.split(",").map((email) => email.trim())
  : []

export async function requireAdmin() {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
    }

    if (!ADMIN_EMAILS.length) {
        console.error("ADMIN_EMAIL environment variable is not set!")
        redirect("/?error=configuration")
    }

    if (!session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
        redirect("/?error=unauthorized")
    }

    return session
}

export function isAdmin(email: string | null | undefined): boolean {
    return email ? ADMIN_EMAILS.includes(email) : false
}



================================================
FILE: lib/animations.ts
================================================
/**
 * Consistent animation configurations for the entire site
 * Use these to ensure smooth, professional animations throughout
 */

export const animationConfig = {
  // Standard durations
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  
  // Standard easing
  easing: [0.4, 0, 0.2, 1] as [number, number, number, number], // cubic-bezier
  easingOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  
  // Standard delays (in seconds)
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.3,
  },
  
  // Standard distances
  distance: {
    small: 15,
    medium: 20,
    large: 30,
  },
}

/**
 * Standard fade-in animation
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: animationConfig.normal, ease: animationConfig.easing },
}

/**
 * Standard slide-up animation
 */
export const slideUp = {
  initial: { opacity: 0, y: animationConfig.distance.medium },
  animate: { opacity: 1, y: 0 },
  transition: { duration: animationConfig.normal, ease: animationConfig.easing },
}

/**
 * Standard slide-up with delay for staggered animations
 */
export const slideUpWithDelay = (index: number = 0) => ({
  initial: { opacity: 0, y: animationConfig.distance.medium },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: animationConfig.normal,
    delay: index * animationConfig.delay.short,
    ease: animationConfig.easing,
  },
})

/**
 * Standard scale-in animation
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: animationConfig.fast, ease: animationConfig.easing },
}

/**
 * Hero section specific animations
 */
export const heroAnimations = {
  container: {
    initial: { opacity: 0, y: animationConfig.distance.medium },
    animate: { opacity: 1, y: 0 },
    transition: { duration: animationConfig.slow, ease: animationConfig.easing },
  },
  title: {
    initial: { opacity: 0, y: animationConfig.distance.small },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: animationConfig.delay.medium,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
  subtitle: {
    initial: { opacity: 0, y: animationConfig.distance.small },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: animationConfig.delay.medium + animationConfig.delay.short,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
  buttons: {
    initial: { opacity: 0, y: animationConfig.distance.small },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: animationConfig.delay.medium + animationConfig.delay.short * 2,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
  badges: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      delay: animationConfig.delay.medium + animationConfig.delay.short * 3,
      duration: animationConfig.slow,
      ease: animationConfig.easing,
    },
  },
}

/**
 * Section header animations
 */
export const sectionHeader = {
  initial: { opacity: 0, y: animationConfig.distance.medium },
  animate: { opacity: 1, y: 0 },
  transition: { duration: animationConfig.normal, ease: animationConfig.easing },
}

/**
 * Card grid item animations (for staggered effects)
 */
export const cardItem = (index: number = 0) => ({
  initial: { opacity: 0, y: animationConfig.distance.large },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: index * animationConfig.delay.short,
    duration: animationConfig.normal,
    ease: animationConfig.easing,
  },
})




================================================
FILE: lib/appInsights.ts
================================================
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

let appInsights: ApplicationInsights | null = null

export function initAppInsights() {
    if (typeof window === 'undefined') return null

    const connectionString = process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING ||
        process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

    if (!connectionString) {
        console.warn('Application Insights connection string not found')
        return null
    }

    if (!appInsights) {
        appInsights = new ApplicationInsights({
            config: {
                connectionString,
                enableAutoRouteTracking: true,
                enableCorsCorrelation: true,
                enableRequestHeaderTracking: true,
                enableResponseHeaderTracking: true,
                correlationHeaderExcludedDomains: ['*.queue.core.windows.net'],
                disableFetchTracking: false,
                enableAjaxErrorStatusText: true,
            }
        })

        appInsights.loadAppInsights()
        appInsights.trackPageView()
    }

    return appInsights
}

export function trackEvent(name: string, properties?: Record<string, any>) {
    if (appInsights) {
        appInsights.trackEvent({ name }, properties)
    }
}

export function trackException(error: Error, severityLevel?: number) {
    if (appInsights) {
        appInsights.trackException({
            exception: error,
            severityLevel: severityLevel || 3 // Error level
        })
    }
}

export function trackMetric(name: string, average: number, properties?: Record<string, any>) {
    if (appInsights) {
        appInsights.trackMetric({ name, average }, properties)
    }
}

export { appInsights }



================================================
FILE: lib/auth.ts
================================================
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./prisma"

// Helper function to get config (only throws at runtime, not build time)
function getAuthConfig() {
  // Get Google OAuth credentials from environment variables
  const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET

  // Get NextAuth secret (v5 uses AUTH_SECRET, v4 uses NEXTAUTH_SECRET)
  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // Get redirect URI from env or construct from authUrl
  // Priority: REDIRECT_URI > GOOGLE_REDIRECT_URI > auto-generated from authUrl
  const redirectUri = process.env.REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || `${authUrl}/api/auth/callback/google`

  // Only throw errors at runtime (when actually using auth), not during build
  // During build, we'll use placeholder values if env vars are missing
  if (process.env.NODE_ENV === 'production' && (!googleClientId || !googleClientSecret)) {
    console.warn(
      "Warning: Missing Google OAuth credentials. Auth will not work. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables."
    )
  }

  if (process.env.NODE_ENV === 'production' && !authSecret) {
    console.warn(
      "Warning: Missing AUTH_SECRET. Auth will not work. Please set AUTH_SECRET or NEXTAUTH_SECRET in your environment variables."
    )
  }

  // Use placeholder values during build if env vars are missing
  const clientId = googleClientId || "placeholder-client-id"
  const clientSecret = googleClientSecret || "placeholder-client-secret"
  const secret = authSecret || "placeholder-secret-for-build"

  return {
    clientId,
    clientSecret,
    secret,
    authUrl,
    redirectUri,
  }
}

const config = getAuthConfig()

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: config.secret,
  basePath: "/api/auth",
  providers: [
    Google({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authorization: {
        params: {
          redirect_uri: config.redirectUri,
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                googleId: account.providerAccountId,
                image: user.image,
              },
            })
          } else if (!existingUser.googleId) {
            // Update existing user with Google ID
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: account.providerAccountId,
                image: user.image || existingUser.image,
              },
            })
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (dbUser && session.user) {
          session.user.id = dbUser.id
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
})




================================================
FILE: lib/blog.ts
================================================
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readingTime: number
  publishedAt: string
  featuredImage?: string
  coverImage?: string
  keywords?: string[]
  author?: string
  updatedAt?: string
}

export function getBlogPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => 
      (file.endsWith('.md') || file.endsWith('.mdx')) && 
      !file.toLowerCase().includes('readme')
    )
    .map((file) => file.replace(/\.(md|mdx)$/, ''))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Try .mdx first, then .md
  let fullPath = path.join(postsDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`)
  }
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content)
  
  const contentHtml = processedContent.toString()

  // Calculate reading time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  // Extract keywords from tags if keywords not explicitly provided
  const keywords = data.keywords || data.tags || []
  
  // Handle both 'date' and 'publishedAt' for compatibility
  const publishedAt = data.publishedAt || data.date || new Date().toISOString()

  return {
    slug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    content: contentHtml,
    category: data.category || 'General',
    tags: data.tags || [],
    readingTime,
    publishedAt,
    featuredImage: data.featuredImage || data.coverImage,
    coverImage: data.coverImage || data.featuredImage,
    keywords: Array.isArray(keywords) ? keywords : [keywords],
    author: data.author || 'FreeCELPIPTest',
    updatedAt: data.updatedAt,
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const slugs = getBlogPostSlugs()
  const posts = await Promise.all(
    slugs.map((slug) => getBlogPostBySlug(slug))
  )
  
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

export function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then(posts => 
    posts.filter(post => post.category.toLowerCase() === category.toLowerCase())
  )
}

export function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then(posts => 
    posts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
  )
}




================================================
FILE: lib/prisma.ts
================================================
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma




================================================
FILE: lib/utils.ts
================================================
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




================================================
FILE: prisma/schema.prisma
================================================
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  googleId          String?   @unique
  image             String?
  createdAt         DateTime  @default(now())
  savedBlogs        BlogPost[] @relation("SavedBlogs")
  testProgress      TestProgress[]
  notificationPrefs Json?     // { mockTests: boolean, blogUpdates: boolean }
}

model BlogPost {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  content       String    // Markdown content
  excerpt       String
  featuredImage String?
  category      String
  tags          String[]
  readingTime   Int
  publishedAt   DateTime  @default(now())
  authorId      String
  views         Int       @default(0)
  savedBy       User[]    @relation("SavedBlogs")
}

model TestProgress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  testSection String   // "listening" | "reading" | "writing" | "speaking"
  progress    Int      // 0-100
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Newsletter {
  id          String   @id @default(cuid())
  email       String   @unique
  subscribedAt DateTime @default(now())
  active      Boolean  @default(true)
}

model Feedback {
  id          String   @id @default(cuid())
  name        String?
  email       String?
  message     String
  rating      Int?
  category    String   @default("general")
  createdAt   DateTime @default(now())
  status      String   @default("new") // new, reviewed, resolved
}



================================================
FILE: public/llms.txt
================================================
# FreeCELPIPTest - LLM Information

## Site Purpose
FreeCELPIPTest is a comprehensive CELPIP (Canadian English Language Proficiency Index Program) test preparation platform providing free practice tests, study guides, and expert tips for all four test sections: Listening, Reading, Writing, and Speaking.

## About CELPIP
CELPIP is a Canadian English language assessment test recognized by Immigration, Refugees and Citizenship Canada (IRCC) for immigration and citizenship purposes. The test evaluates English language proficiency across four sections, with scores reported on a scale of 1-12 corresponding to Canadian Language Benchmark (CLB) levels.

## Site Content
- Free CELPIP practice tests and sample questions
- Comprehensive study guides and strategies
- Expert tips for each test section
- Score calculator to estimate CLB levels
- Vocabulary level grader
- Blog articles with detailed preparation strategies

## Target Audience
International students, immigrants, and individuals preparing for Canadian immigration or citizenship who need to demonstrate English language proficiency through the CELPIP test.

## Key Features
- Practice tests for Listening, Reading, Writing, and Speaking sections
- Study resources and guides
- Expert strategies and tips
- Score calculation tools
- Free access to all materials

## Contact
For questions or support, visit: https://freecelpiptest.com/contact

## Disclaimer
FreeCELPIPTest is not affiliated with, endorsed by, or connected to CELPIP or Paragon Testing Enterprises. We are an independent educational resource providing practice materials and study guides.




================================================
FILE: types/next-auth.d.ts
================================================
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}




================================================
FILE: .github/workflows/deploy-azure.yml
================================================
name: Azure AKS Deployment

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  workflow_dispatch:

env:
  AZURE_LOCATION: canadacentral
  NODE_VERSION: '20.x'

permissions:
  id-token: write
  contents: read
  packages: write
  security-events: write

jobs:
  # Job 1: Lint and Test
  test:
    name: Lint & Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

  # Job 2: Security Scan
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: test
    permissions:
      contents: read
      security-events: write
      actions: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v4
        if: always()
        continue-on-error: true
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Upload SARIF file as artifact
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: trivy-results
          path: trivy-results.sarif
          retention-days: 30

  # Job 3: Build and Push Docker Image
  build:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.event_name != 'pull_request'
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      acr-login-server: ${{ steps.acr-creds.outputs.ACR_LOGIN_SERVER }}
      acr-name: ${{ steps.acr-creds.outputs.ACR_NAME }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Azure Login
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Get ACR credentials
        id: acr-creds
        run: |
          ACR_NAME=$(az acr list --resource-group ${{ secrets.AZURE_RESOURCE_GROUP }} --query "[0].name" -o tsv)
          echo "ACR_NAME=$ACR_NAME" >> $GITHUB_OUTPUT
          echo "ACR_LOGIN_SERVER=$ACR_NAME.azurecr.io" >> $GITHUB_OUTPUT

      - name: Login to ACR
        run: |
          az acr login --name ${{ steps.acr-creds.outputs.ACR_NAME }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ steps.acr-creds.outputs.ACR_LOGIN_SERVER }}/freecelpip
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./azure/Dockerfile.production
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ steps.acr-creds.outputs.ACR_LOGIN_SERVER }}/freecelpip:buildcache
          cache-to: type=registry,ref=${{ steps.acr-creds.outputs.ACR_LOGIN_SERVER }}/freecelpip:buildcache,mode=max
          platforms: linux/amd64

      - name: Scan Docker image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ steps.acr-creds.outputs.ACR_LOGIN_SERVER }}/freecelpip:latest
          format: 'sarif'
          output: 'trivy-image-results.sarif'

      - name: Upload Docker image scan results to GitHub Security
        uses: github/codeql-action/upload-sarif@v4
        if: always()
        continue-on-error: true
        with:
          sarif_file: 'trivy-image-results.sarif'
          category: 'docker-image'

      - name: Upload Docker scan SARIF as artifact
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: trivy-image-results
          path: trivy-image-results.sarif
          retention-days: 30

  # Job 4: Deploy to Development
  deploy-dev:
    name: Deploy to Development
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: development
      url: https://dev.freecelpiptest.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Get AKS credentials
        run: |
          az aks get-credentials \
            --resource-group ${{ secrets.AZURE_RESOURCE_GROUP }} \
            --name ${{ secrets.AZURE_AKS_CLUSTER_NAME }} \
            --overwrite-existing

      - name: Install Helm
        uses: azure/setup-helm@v3
        with:
          version: 'latest'

      - name: Create namespace
        run: |
          kubectl create namespace freecelpip --dry-run=client -o yaml | kubectl apply -f -

      - name: Deploy with Helm
        run: |
          helm upgrade --install freecelpip ./azure/helm/freecelpip \
            --namespace freecelpip \
            --set image.repository=${{ needs.build.outputs.acr-login-server }}/freecelpip \
            --set image.tag=main-${GITHUB_SHA:0:7} \
            --set autoscaling.enabled=false \
            --set ingress.hosts[0].host=dev.freecelpiptest.com \
            --set keyVault.enabled=true \
            --set-string keyVault.name="${{ secrets.AZURE_KEY_VAULT_NAME }}" \
            --set-string keyVault.tenantId="${{ secrets.AZURE_TENANT_ID }}" \
            --set-string keyVault.clientId="feecb02a-b5a3-4e4b-8e62-1d8d3f1d9cd9" \
            --set-string adminEmail="${{ secrets.ADMIN_EMAIL }}" \
            --history-max 3 \
            --wait --timeout 10m

      - name: Run database migrations
        run: |
          kubectl run prisma-migrate-${{ github.sha }} \
            --image=${{ needs.build.outputs.acr-login-server }}/freecelpip:${{ github.sha }} \
            --namespace=freecelpip \
            --restart=Never \
            --command -- npx prisma migrate deploy

          kubectl wait --for=condition=complete --timeout=300s \
            job/prisma-migrate-${{ github.sha }} \
            --namespace=freecelpip

  # Job 5: Deploy to Production
  deploy-prod:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://freecelpiptest.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Get AKS credentials
        run: |
          az aks get-credentials \
            --resource-group ${{ secrets.AZURE_RESOURCE_GROUP }} \
            --name ${{ secrets.AZURE_AKS_CLUSTER_NAME }} \
            --overwrite-existing

      - name: Install Helm
        uses: azure/setup-helm@v3
        with:
          version: 'latest'

      - name: Create namespace
        run: |
          kubectl create namespace freecelpip --dry-run=client -o yaml | kubectl apply -f -

      - name: Deploy with Helm
        run: |
          helm upgrade --install freecelpip ./azure/helm/freecelpip \
            --namespace freecelpip \
            --set image.repository=${{ needs.build.outputs.acr-login-server }}/freecelpip \
            --set image.tag=main-${GITHUB_SHA:0:7} \
            --set autoscaling.enabled=false \
            --set keyVault.enabled=true \
            --set-string keyVault.name="${{ secrets.AZURE_KEY_VAULT_NAME }}" \
            --set-string keyVault.tenantId="${{ secrets.AZURE_TENANT_ID }}" \
            --set-string keyVault.clientId="feecb02a-b5a3-4e4b-8e62-1d8d3f1d9cd9" \
            --set-string adminEmail="${{ secrets.ADMIN_EMAIL }}" \
            --history-max 3 \
            --wait --timeout 10m

      - name: Run database migrations
        run: |
          kubectl run prisma-migrate-${{ github.sha }} \
            --image=${{ needs.build.outputs.acr-login-server }}/freecelpip:${{ github.sha }} \
            --namespace=freecelpip \
            --restart=Never \
            --command -- npx prisma migrate deploy

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/freecelpip -n freecelpip --timeout=5m
          kubectl get pods -n freecelpip -l app=freecelpip

  # Job 6: Smoke Tests
  smoke-test:
    name: Smoke Tests
    runs-on: ubuntu-latest
    needs: [deploy-prod]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Health check
        run: |
          for i in {1..10}; do
            STATUS=$(curl -s -o /dev/null -w '%{http_code}' https://freecelpiptest.com/api/health)
            if [ $STATUS -eq 200 ]; then
              echo "Health check passed"
              exit 0
            fi
            echo "Attempt $i failed, retrying..."
            sleep 10
          done
          echo "Health check failed after 10 attempts"
          exit 1

      - name: Test homepage
        run: |
          STATUS=$(curl -s -o /dev/null -w '%{http_code}' https://freecelpiptest.com)
          if [ $STATUS -ne 200 ]; then
            echo "Homepage check failed with status $STATUS"
            exit 1
          fi
          echo "Homepage is accessible"
