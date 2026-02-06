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
