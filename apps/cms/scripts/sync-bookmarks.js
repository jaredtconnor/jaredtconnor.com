#!/usr/bin/env node

/**
 * Local development script for bookmark syncing
 * Can be run manually or via cron job
 * 
 * Usage:
 *   node scripts/sync-bookmarks.js
 *   node scripts/sync-bookmarks.js --force-refresh
 *   node scripts/sync-bookmarks.js --limit=50
 */

const fetch = require('node-fetch')

async function syncBookmarks() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2)
    const forceRefresh = args.includes('--force-refresh')
    const limitArg = args.find(arg => arg.startsWith('--limit='))
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 100

    // Configuration
    const apiEndpoint = process.env.CMS_API_ENDPOINT || 'http://localhost:3003'
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret'

    console.log('🔄 Starting bookmark sync...')
    console.log(`📍 Endpoint: ${apiEndpoint}`)
    console.log(`⚙️  Force refresh: ${forceRefresh}`)
    console.log(`📊 Limit: ${limit}`)

    const startTime = Date.now()

    // Make the sync request
    const response = await fetch(`${apiEndpoint}/api/instapaper/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({
        limit,
        forceRefresh,
        enrichMetadata: true,
      }),
    })

    const result = await response.json()
    const duration = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`)
    }

    // Log results
    console.log('\n✅ Sync completed successfully!')
    console.log(`⏱️  Duration: ${duration}ms`)
    console.log(`📝 Created: ${result.summary?.created || 0}`)
    console.log(`🔄 Updated: ${result.summary?.updated || 0}`)
    console.log(`❌ Errors: ${result.summary?.errors || 0}`)

    if (result.errors && result.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:')
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Bookmark sync failed:')
    console.error(error.message)
    
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Sync interrupted by user')
  process.exit(1)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Sync terminated')
  process.exit(1)
})

// Run the sync
syncBookmarks()