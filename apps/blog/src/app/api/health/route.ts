import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - can be extended with database connectivity checks
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'blog-api'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}