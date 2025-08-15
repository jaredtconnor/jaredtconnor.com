import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createBookmarkSyncService } from '../../../../../../services/bookmarkSync'

// This endpoint can be called by cron jobs or scheduled functions
export async function POST(request: NextRequest) {
  try {
    // Verify this is an authorized request (you may want to add authentication)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET || 'your-cron-secret'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await getPayload({ config })
    const syncService = createBookmarkSyncService(payload)

    console.log('Starting scheduled bookmark sync...')

    // Perform incremental sync (not forcing refresh)
    const result = await syncService.syncBookmarks({
      limit: 50, // Smaller limit for scheduled syncs
      forceRefresh: false,
      enrichMetadata: true,
    })

    // Log the results
    console.log(`Scheduled sync completed:`, {
      created: result.created,
      updated: result.updated,
      errors: result.errors,
      success: result.success,
    })

    // Only return detailed error info in development
    const isProduction = process.env.NODE_ENV === 'production'
    
    return NextResponse.json({
      success: result.success,
      summary: {
        created: result.created,
        updated: result.updated,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      ...(isProduction ? {} : { errorDetails: result.errorMessages }),
    })
  } catch (error) {
    console.error('Scheduled bookmark sync failed:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Scheduled sync failed',
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const syncService = createBookmarkSyncService(payload)

    // Get sync status without triggering a sync
    const status = await syncService.getSyncStatus()

    return NextResponse.json({
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      syncStats: status,
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}