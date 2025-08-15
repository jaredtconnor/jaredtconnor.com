import { SSTConfig } from 'sst'
import { NextjsSite, Cron } from 'sst/constructs'

export default {
  config(_input) {
    return {
      name: 'blog-cms-cron',
      region: 'us-east-1',
    }
  },
  stacks(app) {
    app.stack(function Site(ctx) {
      // Get the CMS site URL (you may need to adjust this based on your setup)
      const cmsUrl = process.env.CMS_URL || 'https://your-cms-domain.com'
      const cronSecret = process.env.CRON_SECRET || 'your-secure-cron-secret'

      // Create a scheduled function to sync bookmarks
      const bookmarkSync = new Cron(ctx.stack, 'BookmarkSync', {
        schedule: 'rate(15 minutes)', // Run every 15 minutes
        function: {
          handler: 'src/cron/syncBookmarks.handler',
          timeout: '5 minutes',
          environment: {
            CMS_API_ENDPOINT: cmsUrl,
            CRON_SECRET: cronSecret,
          },
        },
      })

      // Optional: Create a daily full refresh
      const dailyRefresh = new Cron(ctx.stack, 'DailyBookmarkRefresh', {
        schedule: 'cron(0 6 * * ? *)', // Run daily at 6 AM UTC
        function: {
          handler: 'src/cron/syncBookmarks.handler',
          timeout: '10 minutes',
          environment: {
            CMS_API_ENDPOINT: cmsUrl,
            CRON_SECRET: cronSecret,
            FORCE_REFRESH: 'true',
            SYNC_LIMIT: '200',
          },
        },
      })

      // Output the function ARNs for monitoring
      ctx.stack.addOutputs({
        BookmarkSyncFunction: bookmarkSync.function.functionArn,
        DailyRefreshFunction: dailyRefresh.function.functionArn,
      })

      return {
        bookmarkSync,
        dailyRefresh,
      }
    })
  },
} satisfies SSTConfig