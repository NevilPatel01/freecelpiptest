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
