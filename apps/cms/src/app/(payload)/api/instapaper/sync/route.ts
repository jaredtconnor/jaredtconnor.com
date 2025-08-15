import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createBookmarkSyncService } from '../../../../../services/bookmarkSync'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const syncService = createBookmarkSyncService(payload)

    // Parse options from request body
    const body = await request.json().catch(() => ({}))
    const {
      limit = 100,
      forceRefresh = false,
      enrichMetadata = true,
    } = body

    console.log('Starting manual bookmark sync...')

    // Perform the sync
    const result = await syncService.syncBookmarks({
      limit,
      forceRefresh,
      enrichMetadata,
    })

    return NextResponse.json({
      success: result.success,
      summary: {
        created: result.created,
        updated: result.updated,
        errors: result.errors,
      },
      errors: result.errorMessages,
      message: result.success 
        ? `Sync completed: ${result.created} created, ${result.updated} updated`
        : 'Sync completed with errors',
    })
  } catch (error) {
    console.error('Bookmark sync failed:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const syncService = createBookmarkSyncService(payload)

    // Get sync status
    const status = await syncService.getSyncStatus()

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error('Failed to get sync status:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get sync status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}