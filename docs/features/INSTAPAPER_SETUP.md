# Instapaper Integration Setup Guide

This guide walks you through setting up the Instapaper integration for automatic bookmark syncing.

## Prerequisites

1. **Instapaper Account**: You need an active Instapaper account
2. **Instapaper Developer Access**: You need to register for Instapaper API access
3. **Environment Variables**: Properly configured environment variables

## Step 1: Register for Instapaper API Access

1. Go to [Instapaper Developer](https://www.instapaper.com/api)
2. Register for an API account
3. Create a new application to get your consumer key and secret
4. Note down your `Consumer Key` and `Consumer Secret`

## Step 2: Configure Environment Variables

Add the following environment variables to your CMS app:

```bash
# In apps/cms/.env
INSTAPAPER_CONSUMER_KEY="your-consumer-key-here"
INSTAPAPER_CONSUMER_SECRET="your-consumer-secret-here"
```

## Step 3: Authenticate with Instapaper

Since Instapaper uses xAuth (no web-based OAuth flow), you need to authenticate using your Instapaper username and password:

### Option A: Using the Admin API

1. Start your CMS development server:
   ```bash
   cd apps/cms
   pnpm dev
   ```

2. Make a POST request to authenticate:
   ```bash
   curl -X POST http://localhost:3003/api/instapaper/auth \
     -H "Content-Type: application/json" \
     -d '{
       "username": "your-instapaper-username",
       "password": "your-instapaper-password"
     }'
   ```

### Option B: Using the Admin Interface (Future Enhancement)

Once implemented, you'll be able to authenticate directly through the Payload CMS admin interface.

## Step 4: Sync Bookmarks

### Manual Sync

Trigger a manual sync via API:

```bash
curl -X POST http://localhost:3003/api/instapaper/sync \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 100,
    "forceRefresh": false,
    "enrichMetadata": true
  }'
```

### Check Sync Status

Get current sync status:

```bash
curl http://localhost:3003/api/instapaper/sync
```

## Step 5: Verify Integration

1. **Check the Admin Interface**: 
   - Go to `http://localhost:3003/admin`
   - Navigate to the "Bookmarks" collection
   - You should see your synced bookmarks

2. **Check the Frontend**:
   - Go to `http://localhost:3000/bookmarks`
   - Published bookmarks should appear in the list

## Features

### Automatic Metadata Extraction

The integration automatically extracts metadata from bookmarked URLs:

- Page title and description
- Author information
- Publication date
- Reading time estimation
- Keywords and language
- Favicon URL
- Site host information

### Bidirectional Sync

- **Instapaper → CMS**: Automatically pulls new bookmarks from Instapaper
- **CMS → Instapaper**: Manually created bookmarks can be pushed to Instapaper

### Content Management

- **Selective Publishing**: Choose which bookmarks to make public
- **Personal Notes**: Add your commentary to bookmarks
- **Categorization**: Automatic categorization based on content
- **Tags**: Support for both Instapaper and custom tags
- **Featured Bookmarks**: Highlight important bookmarks

## API Endpoints

### Authentication
- `POST /api/instapaper/auth` - Authenticate with Instapaper
- `GET /api/instapaper/auth` - Check authentication status

### Sync Management
- `POST /api/instapaper/sync` - Trigger manual sync
- `GET /api/instapaper/sync` - Get sync status

### Bookmark Management
- `POST /api/bookmarks/{id}/refresh` - Refresh single bookmark

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify your consumer key and secret
   - Check your Instapaper username and password
   - Ensure your Instapaper account has API access

2. **No Bookmarks Syncing**
   - Check that you have bookmarks in your Instapaper account
   - Verify the sync status via the API
   - Check the server logs for error messages

3. **Metadata Not Extracting**
   - Some websites block automated requests
   - Check if the URLs are publicly accessible
   - Review the server logs for extraction errors

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=instapaper:*
```

### Rate Limits

Instapaper has rate limits on API requests:
- Respect the rate limit headers in responses
- The integration includes automatic retry logic
- Sync intervals are set to 15 minutes by default

## Security Notes

1. **Never commit API credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Secure your admin interface** with strong authentication
4. **Regularly rotate API keys** if possible

## Production Deployment

For production deployment:

1. **Set environment variables** in your hosting platform
2. **Configure periodic sync** using cron jobs or scheduled functions
3. **Monitor sync status** and set up alerts for failures
4. **Backup bookmark data** regularly

## Next Steps

After successful setup, consider:

1. **Setting up periodic sync** automation
2. **Customizing bookmark categories** and tags
3. **Adding search functionality** to bookmarks
4. **Creating RSS feeds** for public bookmarks
5. **Implementing bookmark analytics** and insights

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify your Instapaper API quota and status
3. Test individual API endpoints to isolate issues
4. Review the Instapaper API documentation for updates

## API Reference

For detailed API documentation, refer to:
- [Instapaper API Documentation](https://www.instapaper.com/api)
- This project's API endpoints (documented above)