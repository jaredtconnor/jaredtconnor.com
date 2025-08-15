import OAuth from 'oauth-1.0a'
import crypto from 'crypto'

// Types for Instapaper API responses
export interface InstapaperBookmark {
  bookmark_id: number
  url: string
  title: string
  description: string
  folder_id: number
  starred: '0' | '1'
  time: number
  progress: number
  progress_timestamp: number
}

export interface InstapaperApiResponse {
  type: string
  bookmarks?: InstapaperBookmark[]
  bookmark?: InstapaperBookmark
  error?: string
  error_code?: number
}

export interface InstapaperCredentials {
  consumerKey: string
  consumerSecret: string
  token?: string
  tokenSecret?: string
}

export interface InstapaperAuthTokens {
  token: string
  tokenSecret: string
}

export class InstapaperService {
  private oauth: OAuth
  private credentials: InstapaperCredentials
  private baseUrl = 'https://www.instapaper.com'

  constructor(credentials: InstapaperCredentials) {
    this.credentials = credentials
    
    this.oauth = new OAuth({
      consumer: {
        key: credentials.consumerKey,
        secret: credentials.consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64')
      },
    })
  }

  /**
   * Authenticate with Instapaper using xAuth (username/password)
   * This is the only way to get access tokens for Instapaper
   */
  async authenticate(username: string, password: string): Promise<InstapaperAuthTokens> {
    const requestData = {
      url: `${this.baseUrl}/api/1/oauth/access_token`,
      method: 'POST',
      data: {
        x_auth_username: username,
        x_auth_password: password,
        x_auth_mode: 'client_auth',
      },
    }

    try {
      const authHeader = this.oauth.toHeader(this.oauth.authorize(requestData))
      
      const response = await fetch(requestData.url, {
        method: 'POST',
        headers: {
          'Authorization': authHeader.Authorization,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(requestData.data).toString(),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Authentication failed: ${response.status} ${error}`)
      }

      const responseBody = await response.text()
      const params = new URLSearchParams(responseBody)
      
      const token = params.get('oauth_token')
      const tokenSecret = params.get('oauth_token_secret')

      if (!token || !tokenSecret) {
        throw new Error('Invalid authentication response: missing tokens')
      }

      // Store tokens for future requests
      this.credentials.token = token
      this.credentials.tokenSecret = tokenSecret

      return { token, tokenSecret }
    } catch (error) {
      console.error('Instapaper authentication error:', error)
      throw error
    }
  }

  /**
   * Set existing access tokens (if already authenticated)
   */
  setTokens(token: string, tokenSecret: string): void {
    this.credentials.token = token
    this.credentials.tokenSecret = tokenSecret
  }

  /**
   * Make authenticated request to Instapaper API
   */
  private async makeAuthenticatedRequest(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    data?: Record<string, string>
  ): Promise<InstapaperApiResponse> {
    if (!this.credentials.token || !this.credentials.tokenSecret) {
      throw new Error('Not authenticated. Call authenticate() first.')
    }

    const requestData = {
      url: `${this.baseUrl}/api/1${endpoint}`,
      method,
      data: data || {},
    }

    const token = {
      key: this.credentials.token,
      secret: this.credentials.tokenSecret,
    }

    try {
      const authHeader = this.oauth.toHeader(this.oauth.authorize(requestData, token))
      
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Authorization': authHeader.Authorization,
        },
      }

      if (method === 'POST' && data) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
        fetchOptions.body = new URLSearchParams(data).toString()
      } else if (method === 'GET' && data) {
        const params = new URLSearchParams(data)
        requestData.url += `?${params.toString()}`
      }

      const response = await fetch(requestData.url, fetchOptions)

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`API request failed: ${response.status} ${error}`)
      }

      const result = await response.json()
      
      // Check for API errors
      if (result.type === 'error') {
        throw new Error(`Instapaper API error: ${result.error} (${result.error_code})`)
      }

      return result
    } catch (error) {
      console.error('Instapaper API request error:', error)
      throw error
    }
  }

  /**
   * List bookmarks from Instapaper
   */
  async listBookmarks(options: {
    limit?: number
    folder_id?: string
    have?: string
  } = {}): Promise<InstapaperBookmark[]> {
    const params: Record<string, string> = {}
    
    if (options.limit) params.limit = options.limit.toString()
    if (options.folder_id) params.folder_id = options.folder_id
    if (options.have) params.have = options.have

    const response = await this.makeAuthenticatedRequest('/bookmarks/list', 'GET', params)
    
    return response.bookmarks || []
  }

  /**
   * Add a bookmark to Instapaper
   */
  async addBookmark(
    url: string,
    options: {
      title?: string
      description?: string
      folder_id?: string
    } = {}
  ): Promise<InstapaperBookmark> {
    const data: Record<string, string> = { url }
    
    if (options.title) data.title = options.title
    if (options.description) data.description = options.description
    if (options.folder_id) data.folder_id = options.folder_id

    const response = await this.makeAuthenticatedRequest('/bookmarks/add', 'POST', data)
    
    if (!response.bookmark) {
      throw new Error('Failed to add bookmark: no bookmark in response')
    }

    return response.bookmark
  }

  /**
   * Star a bookmark
   */
  async starBookmark(bookmarkId: number): Promise<InstapaperBookmark> {
    const response = await this.makeAuthenticatedRequest('/bookmarks/star', 'POST', {
      bookmark_id: bookmarkId.toString(),
    })
    
    if (!response.bookmark) {
      throw new Error('Failed to star bookmark: no bookmark in response')
    }

    return response.bookmark
  }

  /**
   * Unstar a bookmark
   */
  async unstarBookmark(bookmarkId: number): Promise<InstapaperBookmark> {
    const response = await this.makeAuthenticatedRequest('/bookmarks/unstar', 'POST', {
      bookmark_id: bookmarkId.toString(),
    })
    
    if (!response.bookmark) {
      throw new Error('Failed to unstar bookmark: no bookmark in response')
    }

    return response.bookmark
  }

  /**
   * Archive a bookmark
   */
  async archiveBookmark(bookmarkId: number): Promise<InstapaperBookmark> {
    const response = await this.makeAuthenticatedRequest('/bookmarks/archive', 'POST', {
      bookmark_id: bookmarkId.toString(),
    })
    
    if (!response.bookmark) {
      throw new Error('Failed to archive bookmark: no bookmark in response')
    }

    return response.bookmark
  }

  /**
   * Delete a bookmark
   */
  async deleteBookmark(bookmarkId: number): Promise<void> {
    await this.makeAuthenticatedRequest('/bookmarks/delete', 'POST', {
      bookmark_id: bookmarkId.toString(),
    })
  }

  /**
   * Move a bookmark to a folder
   */
  async moveBookmark(bookmarkId: number, folderId: number): Promise<InstapaperBookmark> {
    const response = await this.makeAuthenticatedRequest('/bookmarks/move', 'POST', {
      bookmark_id: bookmarkId.toString(),
      folder_id: folderId.toString(),
    })
    
    if (!response.bookmark) {
      throw new Error('Failed to move bookmark: no bookmark in response')
    }

    return response.bookmark
  }

  /**
   * Test if the current authentication is valid
   */
  async verifyCredentials(): Promise<boolean> {
    try {
      await this.listBookmarks({ limit: 1 })
      return true
    } catch (error) {
      console.error('Credential verification failed:', error)
      return false
    }
  }
}

/**
 * Factory function to create InstapaperService instance
 */
export function createInstapaperService(): InstapaperService {
  const credentials: InstapaperCredentials = {
    consumerKey: process.env.INSTAPAPER_CONSUMER_KEY || '',
    consumerSecret: process.env.INSTAPAPER_CONSUMER_SECRET || '',
  }

  if (!credentials.consumerKey || !credentials.consumerSecret) {
    throw new Error('Instapaper consumer key and secret must be provided via environment variables')
  }

  return new InstapaperService(credentials)
}

/**
 * Global instance for use throughout the application
 */
let instapaperServiceInstance: InstapaperService | null = null

export function getInstapaperService(): InstapaperService {
  if (!instapaperServiceInstance) {
    instapaperServiceInstance = createInstapaperService()
  }
  return instapaperServiceInstance
}