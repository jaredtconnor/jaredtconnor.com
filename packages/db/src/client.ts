import { type Payload } from 'payload'
import type { ClientConfig, PayloadConfig } from './config.js'
import { createConfig, getEnvironmentConfig } from './config.js'
import { MemoryCache, defaultCache } from './cache.js'
import { withRetry, withTimeout, PayloadError, PayloadNetworkError } from './errors.js'

/**
 * PayloadCMS client instance
 * This should be initialized with the actual Payload instance from the CMS app
 */
let payload: Payload | null = null
let clientConfig: ClientConfig | null = null
let cache: MemoryCache = defaultCache

/**
 * Initialize the Payload client with configuration
 * This is typically called from the CMS app during startup
 */
export function initializePayload(instance: Payload, config?: Partial<ClientConfig>): void {
  payload = instance
  
  // Create client configuration
  const envConfig = getEnvironmentConfig()
  clientConfig = {
    mode: 'local',
    ...createConfig({
      apiUrl: envConfig.apiUrl || 'http://localhost:3002',
      environment: envConfig.environment || 'development',
      ...envConfig,
      ...config
    })
  }
  
  // Initialize cache if enabled
  if (clientConfig.cache?.enabled) {
    cache = new MemoryCache(clientConfig.cache.maxSize)
  }
}

/**
 * Initialize REST API client (without local Payload instance)
 */
export function initializeRestClient(config: Partial<PayloadConfig> & Pick<PayloadConfig, 'apiUrl' | 'environment'>): void {
  const envConfig = getEnvironmentConfig()
  clientConfig = {
    mode: 'rest',
    ...createConfig({
      ...envConfig,
      ...config
    })
  }
  
  // Initialize cache if enabled
  if (clientConfig.cache?.enabled) {
    cache = new MemoryCache(clientConfig.cache.maxSize)
  }
}

/**
 * Get the Payload client instance
 * Throws an error if not initialized
 */
export function getPayload(): Payload {
  if (!payload) {
    throw new Error('Payload client not initialized. Call initializePayload() first.')
  }
  return payload
}

/**
 * Get the client configuration
 */
export function getClientConfig(): ClientConfig {
  if (!clientConfig) {
    throw new Error('Client not initialized. Call initializePayload() or initializeRestClient() first.')
  }
  return clientConfig
}

/**
 * Get the cache instance
 */
export function getCache(): MemoryCache {
  return cache
}

/**
 * Check if Payload client is initialized
 */
export function isPayloadInitialized(): boolean {
  return payload !== null
}

/**
 * Check if client is initialized (local or REST)
 */
export function isClientInitialized(): boolean {
  return clientConfig !== null
}

/**
 * Execute a function with retry and timeout logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  options?: {
    timeout?: number
    retry?: ClientConfig['retry']
  }
): Promise<T> {
  const config = getClientConfig()
  const timeout = options?.timeout || config.timeout || 10000
  const retry = options?.retry || config.retry || { attempts: 1, delay: 1000 }
  
  return withRetry(
    () => withTimeout(fn(), timeout),
    retry
  )
}

/**
 * REST API request helper
 */
export async function restRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const config = getClientConfig()
  
  if (config.mode !== 'rest') {
    throw new Error('REST API calls require REST client mode. Use initializeRestClient().')
  }
  
  const url = `${config.apiUrl}/api${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }
  
  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      throw new PayloadError(
        `API request failed: ${response.statusText}`,
        'API_ERROR',
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof PayloadError) {
      throw error
    }
    
    throw new PayloadNetworkError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    )
  }
}
