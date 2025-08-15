# AWS OIDC Setup for GitHub Actions

This guide explains how to set up AWS OIDC (OpenID Connect) authentication for secure deployments from GitHub Actions without storing AWS access keys.

## Benefits of OIDC over Access Keys
- ✅ No long-term credentials stored in GitHub
- ✅ Temporary credentials with limited scope
- ✅ Better security and audit trail
- ✅ Automatic credential rotation

## Setup Instructions

### Step 1: Create OIDC Identity Provider in AWS

1. Go to the AWS IAM Console
2. Navigate to **Identity providers** → **Add provider**
3. Configure the provider:
   - **Provider type**: OpenID Connect
   - **Provider URL**: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
4. Click **Add provider**

### Step 2: Create IAM Role for GitHub Actions

1. In IAM Console, go to **Roles** → **Create role**
2. Select **Web identity**
3. Configure trust policy:
   - **Identity provider**: token.actions.githubusercontent.com
   - **Audience**: sts.amazonaws.com
   - **GitHub organization**: `jaredtconnor` (your username)
   - **GitHub repository**: `jaredtconnor.com`
4. Add policies for your deployment needs:
   - `PowerUserAccess` (for SST deployments)
   - Or create custom policies with minimal required permissions
5. Name the role: `GitHubActionsDeploymentRole`
6. **Important**: Edit the trust policy to restrict to specific branches:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": [
            "repo:jaredtconnor/jaredtconnor.com:ref:refs/heads/main"
          ]
        }
      }
    }
  ]
}
```

### Step 3: Configure GitHub Repository Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add a new repository secret:
   - **Name**: `AWS_ROLE_ARN`
   - **Value**: `arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsDeploymentRole`

Replace `YOUR_ACCOUNT_ID` with your actual AWS account ID.

### Step 4: Set up Environment-Specific Secrets (Optional)

If you need environment-specific configurations, you can create GitHub environments:

1. Go to **Settings** → **Environments**
2. Create environments: `development`, `staging`, `production`
3. Add environment-specific secrets if needed:
   - Database URLs
   - API keys
   - Other environment variables

## Testing the Setup

1. Push a commit to the main branch
2. The GitHub Actions workflow should now authenticate successfully with AWS
3. Check the workflow logs for successful AWS credential configuration

## Troubleshooting

### Common Issues:

1. **"Role cannot be assumed"**
   - Check that the trust policy includes your repository path
   - Verify the branch name matches exactly (`refs/heads/main`)

2. **"Invalid identity token"**
   - Ensure the OIDC provider is configured correctly
   - Check that the audience is `sts.amazonaws.com`

3. **"Access denied during deployment"**
   - Verify the IAM role has sufficient permissions for SST operations
   - Check CloudFormation, S3, Lambda, and other service permissions

### Required AWS Permissions for SST

Your IAM role should have permissions for:
- CloudFormation (full access)
- S3 (for deployment artifacts)
- Lambda (for serverless functions)
- API Gateway (for APIs)
- IAM (for creating resources)
- CloudWatch (for logging)

## Security Best Practices

1. **Principle of Least Privilege**: Only grant permissions needed for deployment
2. **Branch Restrictions**: Limit OIDC trust to specific branches
3. **Environment Separation**: Use different roles for different environments
4. **Regular Audits**: Monitor CloudTrail for deployment activities
5. **Time Limits**: Consider adding time-based conditions to trust policy

## Alternative: Using AWS Access Keys (Less Secure)

If you prefer to use access keys instead of OIDC, you would need to:

1. Create an IAM user with deployment permissions
2. Generate access keys for that user
3. Add these secrets to GitHub:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
4. Revert the workflow files to use access keys

However, OIDC is the recommended approach for better security.