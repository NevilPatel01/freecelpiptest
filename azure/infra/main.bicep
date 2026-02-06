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
