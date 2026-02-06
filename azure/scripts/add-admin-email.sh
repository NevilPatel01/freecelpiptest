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
