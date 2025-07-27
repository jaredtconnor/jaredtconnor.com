import { type Payload } from 'payload'

/**
 * PayloadCMS client instance
 * This should be initialized with the actual Payload instance from the CMS app
 */
let payload: Payload | null = null

/**
 * Initialize the Payload client
 * This is typically called from the CMS app during startup
 */
export function initializePayload(instance: Payload): void {
  payload = instance
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
 * Check if Payload client is initialized
 */
export function isPayloadInitialized(): boolean {
  return payload !== null
}
