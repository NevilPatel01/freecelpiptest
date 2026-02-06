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
