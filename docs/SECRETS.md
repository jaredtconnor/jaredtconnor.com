# Secrets Management Guide

This guide covers how to manage secrets and environment variables across all deployment environments using SST.

## Overview

The project uses SST's built-in secrets management system, which encrypts and stores secrets securely in AWS. This is more secure than storing secrets in GitHub repository secrets or environment files.

## Environment Structure

We use three deployment environments:

- **development**: For feature development and testing
- **staging**: For pre-production testing
- **production**: For live production deployment

## Required Secrets

Each environment needs these secrets configured:

### DatabaseUrl
PostgreSQL connection string for your Neon database.

```bash
# Format
postgresql://username:password@hostname:5432/database_name?sslmode=require

# Example
postgresql://myuser:mypass@ep-example-123.us-west-2.aws.neon.tech:5432/mydb?sslmode=require
```

### NextAuthSecret
Secret key for NextAuth.js authentication (minimum 32 characters).

```bash
# Generate a secure secret
openssl rand -base64 32
```

### PayloadSecret  
Secret key for PayloadCMS (minimum 32 characters).

```bash
# Generate a secure secret
openssl rand -base64 32
```

## Setting Up Secrets

### Development Environment

```bash
# Set development secrets
pnpm sst secret set DatabaseUrl "your-dev-database-url" --stage development
pnpm sst secret set NextAuthSecret "$(openssl rand -base64 32)" --stage development
pnpm sst secret set PayloadSecret "$(openssl rand -base64 32)" --stage development
```

### Staging Environment

```bash
# Set staging secrets (use different database)
pnpm sst secret set DatabaseUrl "your-staging-database-url" --stage staging
pnpm sst secret set NextAuthSecret "$(openssl rand -base64 32)" --stage staging
pnpm sst secret set PayloadSecret "$(openssl rand -base64 32)" --stage staging
```

### Production Environment

```bash
# Set production secrets (use production database)
pnpm sst secret set DatabaseUrl "your-prod-database-url" --stage production
pnpm sst secret set NextAuthSecret "$(openssl rand -base64 32)" --stage production
pnpm sst secret set PayloadSecret "$(openssl rand -base64 32)" --stage production
```

## Managing Secrets

### List All Secrets

```bash
# List secrets for a specific stage
pnpm sst secret list --stage development
pnpm sst secret list --stage staging
pnpm sst secret list --stage production
```

### Update a Secret

```bash
# Update an existing secret
pnpm sst secret set DatabaseUrl "new-database-url" --stage production
```

### Remove a Secret

```bash
# Remove a secret (be careful!)
pnpm sst secret remove SecretName --stage development
```

### View Secret Values

```bash
# SST secrets are encrypted, but you can view them in the console
pnpm sst console
```

## Database Setup

### Creating Neon Databases

You should create separate databases for each environment:

1. **Production Database**
   - Create a new Neon project for production
   - Use a strong password
   - Enable connection pooling
   - Configure backups

2. **Staging Database**
   - Create a separate database or branch
   - Can share the same Neon project as production
   - Use production-like data (anonymized)

3. **Development Database**
   - Create a development branch in Neon
   - Can use test/seed data
   - Faster reset/restore capabilities

### Database URLs

Ensure your database URLs include the required parameters:

```bash
# Required format
postgresql://username:password@hostname:5432/database_name?sslmode=require

# With connection pooling (recommended for production)
postgresql://username:password@hostname:5432/database_name?sslmode=require&pgbouncer=true
```

## GitHub Actions Integration

The CI/CD workflows automatically use the SST secrets. No additional configuration needed in GitHub repository secrets for application secrets.

### Required GitHub Secrets

Only these AWS credentials are needed in GitHub repository settings:

```bash
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

## Local Development

For local development, use `.env.local` file:

```bash
# Copy the example
cp .env.example .env.local

# Edit with your local values
DATABASE_URL="your-local-database-url"
NEXTAUTH_SECRET="local-dev-secret"
PAYLOAD_SECRET="local-dev-secret"
```

## Security Best Practices

### 1. Secret Rotation

Rotate secrets regularly, especially for production:

```bash
# Generate new secret and update
NEW_SECRET=$(openssl rand -base64 32)
pnpm sst secret set NextAuthSecret "$NEW_SECRET" --stage production
```

### 2. Environment Isolation

- Use completely separate databases for each environment
- Never use production secrets in development/staging
- Use different AWS accounts for production vs non-production (recommended)

### 3. Access Control

- Limit who has access to production secrets
- Use AWS IAM roles with least privilege
- Enable MFA for AWS accounts with production access
- Regularly audit access logs

### 4. Backup and Recovery

```bash
# Export secrets for backup (store securely)
pnpm sst secret list --stage production > production-secrets-backup.txt

# Restore from backup
pnpm sst secret set DatabaseUrl "backup-database-url" --stage production
```

## Troubleshooting

### Common Issues

1. **Secret Not Found**
   ```bash
   # Check if secret exists
   pnpm sst secret list --stage development
   
   # Set the secret if missing
   pnpm sst secret set SecretName "value" --stage development
   ```

2. **Database Connection Errors**
   ```bash
   # Test database connection
   psql "your-database-url"
   
   # Check SSL requirements
   # Ensure URL includes ?sslmode=require
   ```

3. **Deployment Failures**
   ```bash
   # Check SST console for errors
   pnpm sst console
   
   # Verify all required secrets are set
   pnpm sst secret list --stage production
   ```

### Getting Help

- Check SST documentation: https://sst.dev/docs/
- View deployment logs in SST console
- Check AWS CloudFormation events for infrastructure issues
- Review GitHub Actions logs for CI/CD problems

## Migration from Old Environment

If you have an existing "jaredconnor" environment to migrate:

```bash
# 1. List existing secrets
pnpm sst secret list --stage jaredconnor

# 2. Copy secrets to new environment
# (manually copy the values to new stage)

# 3. Remove old environment
pnpm cleanup:jaredconnor
```