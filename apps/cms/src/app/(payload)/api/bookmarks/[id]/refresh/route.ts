import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createBookmarkSyncService } from '../../../../../../services/bookmarkSync'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayload({ config })
    const syncService = createBookmarkSyncService(payload)
    const bookmarkId = params.id

    if (!bookmarkId) {
      return NextResponse.json(
        { error: 'Bookmark ID is required' },
        { status: 400 }
      )
    }

    console.log(`Refreshing bookmark: ${bookmarkId}`)

    // Refresh the specific bookmark
    await syncService.refreshBookmark(bookmarkId)

    return NextResponse.json({
      success: true,
      message: 'Bookmark refreshed successfully',
    })
  } catch (error) {
    console.error('Bookmark refresh failed:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}