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
