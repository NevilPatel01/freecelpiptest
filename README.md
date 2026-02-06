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

