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
