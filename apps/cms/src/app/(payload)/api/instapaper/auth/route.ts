import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getInstapaperService } from '../../../../../services/instapaper'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get Instapaper service
    const instapaperService = getInstapaperService()

    // Authenticate with Instapaper
    const tokens = await instapaperService.authenticate(username, password)

    // Store tokens securely in site settings or user preferences
    // For now, we'll return them (in production, store in encrypted format)
    console.log('Instapaper authentication successful')

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      // Don't return actual tokens in response for security
    })
  } catch (error) {
    console.error('Instapaper authentication failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 401 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const instapaperService = getInstapaperService()
    const isAuthenticated = await instapaperService.verifyCredentials()

    return NextResponse.json({
      authenticated: isAuthenticated,
    })
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}