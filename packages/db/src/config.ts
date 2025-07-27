/**
 * PayloadCMS API Configuration
 * Environment-specific configuration for connecting to PayloadCMS instances
 */

export interface PayloadConfig {
  /**
   * Base URL for the PayloadCMS API
   * @example "http://localhost:3002" or "https://cms.example.com"
   */
  apiUrl: string
  
  /**
   * API key for authenticated requests (if using REST API)
   */
  apiKey?: string
  
  /**
   * Environment type
   */
  environment: 'development' | 'production' | 'staging'
  
  /**
   * Timeout for API requests in milliseconds
   * @default 10000
   */
  timeout?: number
  
  /**
   * Retry configuration
   */
  retry?: {
    attempts: number
    delay: number
    backoff?: 'linear' | 'exponential'
  }
  
  /**
   * Cache configuration
   */
  cache?: {
    enabled: boolean
    ttl: number // Time to live in milliseconds
    maxSize?: number // Maximum number of cached entries
  }
}

export interface ClientConfig extends PayloadConfig {
  /**
   * Whether to use the local Payload instance or REST API
   */
  mode: 'local' | 'rest'
}

/**
 * Default configuration values
 */
export const defaultConfig: Partial<PayloadConfig> = {
  timeout: 10000,
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 'exponential'
  },
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  }
}

/**
 * Create a PayloadConfig with defaults
 */
export function createConfig(config: Partial<PayloadConfig> & Pick<PayloadConfig, 'apiUrl' | 'environment'>): PayloadConfig {
  return {
    ...defaultConfig,
    ...config,
    retry: {
      ...defaultConfig.retry,
      ...config.retry
    },
    cache: {
      ...defaultConfig.cache,
      ...config.cache
    }
  } as PayloadConfig
}

/**
 * Environment-specific configurations
 */
export function getEnvironmentConfig(): Partial<PayloadConfig> {
  const env = process.env.NODE_ENV as PayloadConfig['environment'] || 'development'
  
  switch (env) {
    case 'development':
      return {
        environment: 'development',
        apiUrl: process.env.PAYLOAD_API_URL || 'http://localhost:3002',
        timeout: 30000, // Longer timeout for dev
        cache: {
          enabled: false, // Disable cache in development
          ttl: 0
        }
      }
    
    case 'production':
      return {
        environment: 'production',
        apiUrl: process.env.PAYLOAD_API_URL || '',
        apiKey: process.env.PAYLOAD_API_KEY,
        timeout: 10000,
        retry: {
          attempts: 5,
          delay: 1000,
          backoff: 'exponential'
        },
        cache: {
          enabled: true,
          ttl: 10 * 60 * 1000, // 10 minutes in production
          maxSize: 500
        }
      }
    
    case 'staging':
      return {
        environment: 'staging',
        apiUrl: process.env.PAYLOAD_API_URL || '',
        apiKey: process.env.PAYLOAD_API_KEY,
        timeout: 15000,
        retry: {
          attempts: 3,
          delay: 1000,
          backoff: 'exponential'
        },
        cache: {
          enabled: true,
          ttl: 5 * 60 * 1000, // 5 minutes
          maxSize: 200
        }
      }
    
    default:
      return {
        environment: 'development',
        apiUrl: 'http://localhost:3002'
      }
  }
}
