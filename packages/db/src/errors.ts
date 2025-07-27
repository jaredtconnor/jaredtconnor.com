/**
 * Custom error types for PayloadCMS API operations
 */

export class PayloadError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'PayloadError'
  }
}

export class PayloadNetworkError extends PayloadError {
  constructor(message: string, originalError?: Error) {
    super(message, 'NETWORK_ERROR', undefined, originalError)
    this.name = 'PayloadNetworkError'
  }
}

export class PayloadTimeoutError extends PayloadError {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR', 408)
    this.name = 'PayloadTimeoutError'
  }
}

export class PayloadNotFoundError extends PayloadError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`
    super(message, 'NOT_FOUND', 404)
    this.name = 'PayloadNotFoundError'
  }
}

export class PayloadAuthError extends PayloadError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'PayloadAuthError'
  }
}

export class PayloadValidationError extends PayloadError {
  constructor(
    message: string,
    public validationErrors?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'PayloadValidationError'
  }
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof PayloadNetworkError) return true
  if (error instanceof PayloadTimeoutError) return true
  
  // Don't retry auth, validation, or not found errors
  if (error instanceof PayloadAuthError) return false
  if (error instanceof PayloadValidationError) return false
  if (error instanceof PayloadNotFoundError) return false
  
  // Retry 5xx server errors
  if (error instanceof PayloadError && error.statusCode) {
    return error.statusCode >= 500
  }
  
  return false
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    attempts: number
    delay: number
    backoff?: 'linear' | 'exponential'
  }
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= options.attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry if error is not retryable or this is the last attempt
      if (!isRetryableError(lastError) || attempt === options.attempts) {
        throw lastError
      }
      
      // Calculate delay for this attempt
      let delay = options.delay
      if (options.backoff === 'exponential') {
        delay = options.delay * Math.pow(2, attempt - 1)
      }
      
      // Add some jitter to prevent thundering herd
      delay += Math.random() * 1000
      
      console.warn(`Attempt ${attempt}/${options.attempts} failed, retrying in ${delay}ms:`, lastError.message)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

/**
 * Add timeout to a promise
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new PayloadTimeoutError(timeoutMs)), timeoutMs)
    })
  ])
}
