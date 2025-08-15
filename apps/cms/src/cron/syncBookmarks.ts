import { APIGatewayProxyHandler } from 'aws-lambda'

/**
 * AWS Lambda function for scheduled bookmark syncing
 * This can be triggered by AWS EventBridge (CloudWatch Events) on a schedule
 */
export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    console.log('Scheduled bookmark sync lambda triggered', { event, context })

    // Get the API endpoint from environment variables
    const apiEndpoint = process.env.CMS_API_ENDPOINT || 'http://localhost:3003'
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret'

    // Call the sync endpoint
    const response = await fetch(`${apiEndpoint}/api/instapaper/sync/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Sync failed: ${JSON.stringify(result)}`)
    }

    console.log('Bookmark sync completed successfully:', result)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Bookmark sync completed successfully',
        result,
        timestamp: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error('Scheduled bookmark sync failed:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Bookmark sync failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
    }
  }
}

/**
 * Alternative implementation for direct sync (without HTTP call)
 * Use this if you want to run the sync logic directly in the Lambda
 */
export const directSyncHandler: APIGatewayProxyHandler = async (event, context) => {
  try {
    // This would require importing Payload and sync service directly
    // and configuring the database connection
    
    // Note: This approach requires all Payload dependencies to be available
    // in the Lambda environment, which may increase bundle size significantly
    
    console.log('Direct sync not implemented - use HTTP endpoint approach instead')
    
    return {
      statusCode: 501,
      body: JSON.stringify({
        message: 'Direct sync not implemented',
        suggestion: 'Use the HTTP endpoint approach instead',
      }),
    }
  } catch (error) {
    console.error('Direct sync error:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Direct sync failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}