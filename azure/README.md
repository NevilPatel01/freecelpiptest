# Azure Deployment (AKS + azd)

This folder contains all Azure infrastructure and deployment assets for FreeCELPIPTest. It is designed for production deployment on AKS using Azure Developer CLI (azd).

## What Lives Here

- Infrastructure as code (Bicep)
- Helm chart for AKS
- Deployment scripts for cluster add-ons
- Production Dockerfile
- Legacy Azure deployment notes (for reference)

## Quick Start (azd)

From repo root:

```bash
azd auth login
azd env new dev
azd up
```

Note: `azd` reads the root [azure.yaml](../azure.yaml), which points to the assets in this folder.

## Folder Layout

```
azure/
├── infra/                # Bicep templates and modules
├── helm/freecelpip/      # Helm chart
├── scripts/              # Setup and post-deploy helpers
├── Dockerfile.production # Production image
└── legacy-docs/          # Older Azure guides (archived)
```

## Scripts

- `scripts/azure-init.sh` - Interactive environment setup
- `scripts/setup-k8s-addons.sh` - Installs ingress-nginx + cert-manager
- `scripts/post-deploy.sh` - Post-deployment checks and helpers

## CI/CD

The GitHub Actions workflow remains in `.github/workflows/` at repo root because GitHub only runs workflows from that path.

## Legacy Azure Docs

Older guides have been archived in `azure/legacy-docs/` for reference.
