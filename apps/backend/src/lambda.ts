import serverlessExpress from '@codegenie/serverless-express';
import { createApp } from './app.js';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';

/* eslint-disable @typescript-eslint/no-explicit-any */
let serverlessExpressInstance: any = null;

async function setup(event: APIGatewayProxyEvent, context: Context): Promise<any> {
  const app = createApp();
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context, () => {});
}

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<any> => {
  if (serverlessExpressInstance) {
    return serverlessExpressInstance(event, context, () => {});
  }

  return setup(event, context);
};
/* eslint-enable @typescript-eslint/no-explicit-any */