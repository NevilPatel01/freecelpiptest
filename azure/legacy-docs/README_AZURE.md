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
