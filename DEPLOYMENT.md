# SST Deployment Guide

This guide covers the complete deployment setup for the Turborepo monorepo using SST (Serverless Stack) and AWS.

## Architecture Overview

- **Landing Page**: Astro.js static site → S3 + CloudFront
- **Blog Application**: Next.js SSR/SSG → Lambda + CloudFront  
- **CMS Application**: PayloadCMS Next.js → Lambda + CloudFront
- **Backend API**: Express.js + tRPC → Lambda + API Gateway
- **Database**: Neon PostgreSQL (external service)
- **Media Storage**: S3 bucket
- **CI/CD**: GitHub Actions

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Neon PostgreSQL** database setup
3. **Node.js** v18+ and **pnpm** v9+
4. **SST CLI** (included in dependencies)

## Initial Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your actual values:

#### Neon Database Setup
1. Create account at [Neon](https://neon.tech)
2. Create a new database
3. Copy connection string to `DATABASE_URL`

#### AWS Credentials
Set up AWS credentials using one of these methods:

**Option A: AWS CLI**
```bash
aws configure
```

**Option B: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
```

### 2. SST Secrets Management

SST uses encrypted secrets for sensitive data. Set them up:

```bash
# Database URL (Neon connection string)
pnpm sst secret set DatabaseUrl "postgresql://username:password@hostname/database?sslmode=require"

# NextAuth secret for blog authentication
pnpm sst secret set NextAuthSecret "your-random-secret-key"

# PayloadCMS secret
pnpm sst secret set PayloadSecret "your-payload-secret-key"
```

Generate secrets:
```bash
# Generate random secrets
openssl rand -base64 32  # For NextAuth
openssl rand -base64 32  # For Payload
```

## Development Workflow

### Local Development

Start all applications locally:
```bash
# All apps at once
pnpm dev

# Individual apps
pnpm dev:landing    # Astro on :4321
pnpm dev:blog      # Next.js on :3001
pnpm dev:cms       # PayloadCMS on :3000
pnpm dev:backend   # Express API on :3002
```

### SST Development Mode

For cloud development with live AWS resources:
```bash pnpm sst:dev
```

This creates a development stack in AWS that you can test against.

## Deployment Stages

### Development (dev)
- Triggered: Pull requests
- Purpose: Feature testing
- URL Pattern: `{app-name}-{stage}-{resource}.aws.sst.run`

```bash
pnpm sst:deploy:dev
```

### Staging (staging)
- Triggered: Push to main branch
- Purpose: Pre-production testing
- URL Pattern: `{app-name}-staging-{resource}.aws.sst.run`

```bash
pnpm sst:deploy:staging
```

### Production (production)
- Triggered: Manual approval after staging
- Purpose: Live site
- Custom domains: `jaredconnor.dev`, `blog.jaredconnor.dev`, `cms.jaredconnor.dev`

```bash
pnpm sst:deploy:prod
```

## Domain Configuration

### Custom Domains (Production Only)

The production deployment uses custom domains:
- Landing: `jaredconnor.dev`
- Blog: `blog.jaredconnor.dev`
- CMS: `cms.jaredconnor.dev`
- API: `api.jaredconnor.dev`

#### DNS Setup
1. Configure your domain's nameservers to point to AWS Route 53
2. SST will automatically create SSL certificates via AWS Certificate Manager
3. CloudFront distributions will be configured with your domains

## GitHub Actions CI/CD

The repository includes automated deployment workflows:

### Workflow Triggers
- **Pull Request**: Deploy to dev environment
- **Push to Main**: Deploy to staging, then production (with approval)

### Required GitHub Secrets

Set these in your GitHub repository settings:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Environment-specific database URLs
DEV_DATABASE_URL
STAGING_DATABASE_URL
PROD_DATABASE_URL

# Environment-specific secrets
DEV_NEXTAUTH_SECRET
STAGING_NEXTAUTH_SECRET
PROD_NEXTAUTH_SECRET

DEV_PAYLOAD_SECRET
STAGING_PAYLOAD_SECRET
PROD_PAYLOAD_SECRET
```

### GitHub Environments

Create these environments in your GitHub repository:
- `development`
- `staging` 
- `production` (with protection rules and approvals)

## Cost Optimization

The architecture is designed for cost efficiency:

- **Serverless Functions**: Pay per request
- **Static Sites**: Cached on CloudFront
- **S3 Storage**: Pay for what you use
- **Neon Database**: Generous free tier with scale-to-zero

Estimated monthly cost for low-traffic sites: **$5-15/month**

## Monitoring and Debugging

### SST Console
```bash
pnpm sst:console
```

Access the SST Console for:
- Function logs
- Resource monitoring
- Environment variables
- Live function testing

### AWS CloudWatch
- Lambda function logs
- CloudFront metrics
- Application performance monitoring

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear builds and reinstall
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

#### 2. Database Connection Issues
- Verify `DATABASE_URL` format
- Check Neon database status
- Confirm SSL mode is enabled

#### 3. SST Deployment Failures
- Check AWS credentials
- Verify region configuration
- Review CloudFormation stack events

#### 4. Domain Issues
- Confirm DNS propagation (can take 24-48 hours)
- Check certificate validation in AWS Certificate Manager
- Verify Route 53 hosted zone configuration

### Getting Help

1. Check SST documentation: https://sst.dev
2. Review CloudFormation stack events in AWS Console
3. Check function logs in SST Console or CloudWatch

## Environment Variables Reference

### Required for All Environments
- `DATABASE_URL`: Neon PostgreSQL connection string
- `NODE_ENV`: "development", "staging", or "production"

### App-Specific
- **Blog**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `API_URL`
- **CMS**: `PAYLOAD_SECRET`, `MEDIA_BUCKET_NAME`
- **Landing**: `PUBLIC_API_URL`, `SITE_URL`

### AWS Resources (Auto-generated)
- `MEDIA_BUCKET_NAME`: S3 bucket for uploads
- Function URLs and domains are auto-configured by SST

## Security Best Practices

1. **Secrets Management**: Use SST secrets, never commit credentials
2. **CORS Configuration**: Restrict origins in production
3. **Authentication**: Implement proper auth for admin interfaces
4. **SSL/TLS**: All traffic uses HTTPS (enforced by CloudFront)
5. **IAM Permissions**: Least-privilege access for AWS resources

## Scaling Considerations

The serverless architecture scales automatically, but consider:

1. **Database Connections**: Neon handles connection pooling
2. **Function Concurrency**: AWS Lambda auto-scales
3. **CDN**: CloudFront provides global distribution
4. **Monitoring**: Set up alerts for errors and performance

This setup provides a production-ready, scalable infrastructure that grows with your needs while maintaining cost efficiency.