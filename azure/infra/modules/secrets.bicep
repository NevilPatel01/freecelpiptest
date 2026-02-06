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
