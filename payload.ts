import { getPayload } from 'payload/dist/payload';
import config from './payload.config';

export const getPayloadClient = async () => {
  // Initialize Payload
  const payload = await getPayload({
    config,
    local: process.env.NODE_ENV === 'development',
  });

  return payload;
};
